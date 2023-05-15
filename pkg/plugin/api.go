package plugin

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
)

type api struct {
	Client   http.Client
	Settings backend.DataSourceInstanceSettings
	Query    backend.DataQuery
	Target   string
	Filters  map[string]string
}

func (a api) getAuthHeaderValue() (string, error) {
	httpOptions, err := a.Settings.HTTPClientOptions()
	if err != nil {
		return "", fmt.Errorf("error getting http client options: %w", err)
	}

	user := httpOptions.BasicAuth.User
	password := httpOptions.BasicAuth.Password
	combined := []byte(user + ":" + password)
	encoded := base64.StdEncoding.EncodeToString([]byte(combined))
	return "Basic " + encoded, nil
}

func (a api) buildRequest(ctx context.Context, method string, url string) (*http.Request, error) {
	req, err := http.NewRequestWithContext(ctx, method, url, nil)
	if err != nil {
		return nil, fmt.Errorf("new request: %w", err)
	}
	encoded, err := a.getAuthHeaderValue()
	if err != nil {
		return nil, fmt.Errorf("error encoding auth: %w", err)
	}
	req.Header.Set("Accept", "application/json")
	req.Header.Add("Authorization", encoded)

	return req, nil
}

func (a api) FetchTickets(ctx context.Context, query backend.DataQuery) ([]apiTicket, error) {

	if len(query.JSON) == 0 {
		return []apiTicket{}, errors.New("invalid request")
	}

	q := apiQuery{}
	err := json.Unmarshal(query.JSON, &q)
	if err != nil {
		return []apiTicket{}, fmt.Errorf("unmarshal: %w", err)
	}

	p := url.Values{}
	p.Add("query", q.QueryString)
	p.Add("sort_by", "updated_at")

	return a.query(ctx, q, p)
}

func (a api) query(ctx context.Context, query apiQuery, params url.Values) ([]apiTicket, error) {
	req, err := a.buildRequest(ctx, http.MethodGet, a.Settings.URL+"search")
	if err != nil {
		return []apiTicket{}, fmt.Errorf("err building req: %w", err)
	}

	req.URL.RawQuery = params.Encode()
	resp, err := a.Client.Do(req)
	if err != nil {
		return []apiTicket{}, fmt.Errorf("error doing client request: %w", err)
	}

	var body apiSearchResults
	if err := json.NewDecoder(resp.Body).Decode(&body); err != nil {
		return []apiTicket{}, fmt.Errorf("%w: decode: %s", errRemoteRequest, err)
	}

	return body.TicketResults, nil
}

func (a api) FetchTicketFields(ctx context.Context) ([]byte, error) {
	url := a.Settings.URL + "ticket_fields"
	req, err := a.buildRequest(ctx, http.MethodGet, url)
	if err != nil {
		return []byte{}, fmt.Errorf("err building req: %w", err)
	}

	res, err := a.Client.Do(req)
	if err != nil {
		return []byte{}, fmt.Errorf("error running client request: %w", err)
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return []byte{}, fmt.Errorf("error reading client request: %w", err)
	}

	return body, nil
}

func (a api) GetUserAccount(ctx context.Context) (UserAccountResponse, error) {
	req, err := a.buildRequest(ctx, http.MethodGet, a.Settings.URL+"account")
	if err != nil {
		return UserAccountResponse{}, fmt.Errorf("err building req: %w", err)
	}

	resp, err := a.Client.Do(req)
	if err != nil {
		return UserAccountResponse{}, fmt.Errorf("error doing client request: %w", err)
	}

	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return UserAccountResponse{}, fmt.Errorf("got response code %d", resp.StatusCode)
	}

	var accountResponse UserAccountResponse
	err = json.NewDecoder(resp.Body).Decode(&accountResponse)
	if err != nil {
		return UserAccountResponse{}, fmt.Errorf("error decoding client request: %w", err)
	}

	return accountResponse, nil
}
