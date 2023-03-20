package plugin

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/grafana/grafana-plugin-sdk-go/backend/httpclient"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/instancemgmt"
	"github.com/grafana/grafana-plugin-sdk-go/data"

	"github.com/gabrielthomasjacobs/zendeskplugin/pkg/models"
)

// Make sure Datasource implements required interfaces. This is important to do
// since otherwise we will only get a not implemented error response from plugin in
// runtime. In this example datasource instance implements backend.QueryDataHandler,
// backend.CheckHealthHandler interfaces. Plugin should not implement all these
// interfaces- only those which are required for a particular task.
var (
	_ backend.QueryDataHandler      = (*Datasource)(nil)
	_ backend.CheckHealthHandler    = (*Datasource)(nil)
	_ instancemgmt.InstanceDisposer = (*Datasource)(nil)
)

var (
	errRemoteRequest  = errors.New("remote request error")
	errRemoteResponse = errors.New("remote response error")
)

// NewDatasource creates a new datasource instance.
func NewDatasource(settings backend.DataSourceInstanceSettings) (instancemgmt.Instance, error) {
	opts, err := settings.HTTPClientOptions()
	if err != nil {
		return nil, fmt.Errorf("http client options: %w", err)
	}
	cl, err := httpclient.New(opts)
	if err != nil {
		return nil, fmt.Errorf("httpclient new: %w", err)
	}
	return &Datasource{
		settings:   settings,
		httpClient: cl,
	}, nil
}

// Datasource is an example datasource which can respond to data queries, reports
// its health and has streaming skills.
type Datasource struct {
	settings backend.DataSourceInstanceSettings

	httpClient *http.Client
}

// Dispose here tells plugin SDK that plugin wants to clean up resources when a new instance
// created. As soon as datasource settings change detected by SDK old datasource instance will
// be disposed and a new one will be created using NewSampleDatasource factory function.
func (d *Datasource) Dispose() {
	// Clean up datasource instance resources.
	d.httpClient.CloseIdleConnections()
}

// QueryData handles multiple queries and returns multiple responses.
// req contains the queries []DataQuery (where each query contains RefID as a unique identifier).
// The QueryDataResponse contains a map of RefID to the response for each query, and each response
// contains Frames ([]*Frame).
func (d *Datasource) QueryData(ctx context.Context, req *backend.QueryDataRequest) (*backend.QueryDataResponse, error) {
	// create response struct
	response := backend.NewQueryDataResponse()

	// loop over queries and execute them individually.
	for _, q := range req.Queries {
		// if i%2 != 0 {
		// 	// Just to demonstrate how to return an error with a custom status code.
		// 	response.Responses[q.RefID] = backend.ErrDataResponse(
		// 		backend.StatusBadRequest,
		// 		fmt.Sprintf("user friendly error for query number %v, excluding any sensitive information", i+1),
		// 	)
		// 	continue
		// }

		res, err := d.query(ctx, req.PluginContext, q)
		switch {
		case err == nil:
			break
		case errors.Is(err, context.DeadlineExceeded):
			res = backend.ErrDataResponse(backend.StatusTimeout, "gateway timeout")
		case errors.Is(err, errRemoteRequest):
			res = backend.ErrDataResponse(backend.StatusBadGateway, "bad gateway request")
		case errors.Is(err, errRemoteResponse):
			res = backend.ErrDataResponse(backend.StatusValidationFailed, "bad gateway response: "+err.Error())
		default:
			res = backend.ErrDataResponse(backend.StatusInternal, err.Error())
		}
		// save the response in a hashmap
		// based on with RefID as identifier
		response.Responses[q.RefID] = res
	}

	return response, nil
}

func (d *Datasource) query(ctx context.Context, pCtx backend.PluginContext, query backend.DataQuery) (backend.DataResponse, error) {
	// Do HTTP request
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, d.settings.URL+"search", nil)
	if err != nil {
		return backend.DataResponse{}, fmt.Errorf("new request with context: %w", err)
	}
	if len(query.JSON) > 0 {
		input := &apiQuery{}
		err = json.Unmarshal(query.JSON, input)
		if err != nil {
			return backend.DataResponse{}, fmt.Errorf("unmarshal: %w", err)
		}
		q := req.URL.Query()

		outstrings := make([]string, 0)
		for _, status := range input.Status {
			outstrings = append(outstrings, "status:"+status)
		}

		for _, priority := range input.Priority {
			outstrings = append(outstrings, "priority:"+priority)
		}

		for _, tag := range input.Tags {
			outstrings = append(outstrings, "tag:"+tag)
		}

		out := strings.Join(outstrings, ` `)

		q.Add("query", out)
		q.Add("sort_by", "created_at")
		req.URL.RawQuery = q.Encode()
	}
	resp, err := d.httpClient.Do(req)
	switch {
	case err == nil:
		break
	case errors.Is(err, context.DeadlineExceeded):
		return backend.DataResponse{}, err
	default:
		return backend.DataResponse{}, fmt.Errorf("http client do: %w: %s", errRemoteRequest, err)
	}
	defer func() {
		if err := resp.Body.Close(); err != nil {
			log.DefaultLogger.Error("query: failed to close response body", "err", err)
		}
	}()

	// Make sure the response was successful
	if resp.StatusCode != http.StatusOK {
		return backend.DataResponse{}, fmt.Errorf("%w: expected 200 response, got %d", errRemoteResponse, resp.StatusCode)
	}

	// Decode response
	var body apiSearchResults
	if err := json.NewDecoder(resp.Body).Decode(&body); err != nil {
		return backend.DataResponse{}, fmt.Errorf("%w: decode: %s", errRemoteRequest, err)
	}

	// Create slice of values for time and values.
	times := make([]time.Time, len(body.TicketResults))
	values := make([]float64, len(body.TicketResults))
	for i, p := range body.TicketResults {
		times[i] = p.CreatedAt
		if i == 0 {
			if p.Status != "solved" {
				values[i] = 1
			} else {
				values[i] = 0
			}
		} else {
			if p.Status == "solved" {
				values[i] = values[i-1] - 1
			} else {
				values[i] = values[i-1] + 1
			}

		}
	}

	// Create frame and add it to the response
	return backend.DataResponse{
		Frames: []*data.Frame{
			data.NewFrame(
				"response",
				data.NewField("time", nil, times),
				data.NewField("Tickets", nil, values),
			),
		},
	}, nil
}

// CheckHealth performs a request to the specified data source and returns an error if the HTTP handler did not return
// a 200 OK response.
func (d *Datasource) CheckHealth(ctx context.Context, _ *backend.CheckHealthRequest) (*backend.CheckHealthResult, error) {
	r, err := http.NewRequestWithContext(ctx, http.MethodGet, d.settings.URL+"account", nil)
	if err != nil {
		return newHealthCheckErrorf("could not create request"), nil
	}
	r.Header.Set("Accept", "application/json")
	resp, err := d.httpClient.Do(r)
	if err != nil {
		return newHealthCheckErrorf("request error"), nil
	}
	defer func() {
		if err := resp.Body.Close(); err != nil {
			log.DefaultLogger.Error("check health: failed to close response body", "err", err.Error())
		}
	}()
	if resp.StatusCode != http.StatusOK {
		return newHealthCheckErrorf("got response code %d", resp.StatusCode), nil
	}
	var accountResponse models.UserAccountResponse
	json.NewDecoder(resp.Body).Decode(&accountResponse)

	return &backend.CheckHealthResult{
		Status:  backend.HealthStatusOk,
		Message: "Data source is working, signed in as: " + accountResponse.Account.Name,
	}, nil
}

// newHealthCheckErrorf returns a new *backend.CheckHealthResult with its status set to backend.HealthStatusError
// and the specified message, which is formatted with Sprintf.
func newHealthCheckErrorf(format string, args ...interface{}) *backend.CheckHealthResult {
	return &backend.CheckHealthResult{Status: backend.HealthStatusError, Message: fmt.Sprintf(format, args...)}
}
