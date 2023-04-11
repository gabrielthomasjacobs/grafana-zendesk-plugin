package plugin

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
)

type api struct {
	Client   *http.Client
	Settings backend.DataSourceInstanceSettings
	Query    backend.DataQuery
	Target   string
	Filters  map[string]string
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

	return a.fetch(ctx, q, "search", p)
}

func (a api) fetch(ctx context.Context, query apiQuery, target string, params url.Values) ([]apiTicket, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, a.Settings.URL+target, nil)
	if err != nil {
		return []apiTicket{}, fmt.Errorf("new request with context: %w", err)
	}

	req.URL.RawQuery = params.Encode()
	req.Header.Set("Accept", "application/json")

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
