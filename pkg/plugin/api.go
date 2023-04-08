package plugin

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"strings"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
)

type api struct {
	client   *http.Client
	settings backend.DataSourceInstanceSettings
	query    backend.DataQuery
	target   string
	filters  map[string]string
}

type MapList map[string][]map[string]any

func (a api) FetchTickets(ctx context.Context, query backend.DataQuery) (MapList, error) {

	if len(query.JSON) == 0 {
		return nil, errors.New("invalid request")
	}

	q := apiQuery{}
	err := json.Unmarshal(query.JSON, &q)
	if err != nil {
		return nil, fmt.Errorf("unmarshal: %w", err)
	}

	qp := getQueryParam(q)

	p := url.Values{}
	p.Add("query", qp)
	p.Add("sort_by", "updated_at")

	return a.fetch(ctx, q, "search", p)
}

func (a api) fetch(ctx context.Context, quety apiQuery, target string, params url.Values) (MapList, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, a.settings.URL+target, nil)
	if err != nil {
		return nil, fmt.Errorf("new request with context: %w", err)
	}

	req.URL.RawQuery = params.Encode()
	req.Header.Set("Accept", "application/json")

	resp, err := a.client.Do(req)

	var body MapList
	if err := json.NewDecoder(resp.Body).Decode(&body); err != nil {
		return nil, fmt.Errorf("%w: decode: %s", errRemoteRequest, err)
	}

	return body, nil
}

func getQueryParam(input apiQuery) string {
	outstrings := make([]string, 0)

	for key, status := range input.Status {
		if status == true {
			outstrings = append(outstrings, "status:"+key)
		}
	}

	for key, priority := range input.Priority {
		if priority == true {
			outstrings = append(outstrings, "priority:"+key)
		}
	}

	for _, tag := range input.Tags {
		outstrings = append(outstrings, "tags:"+tag)
	}

	out := strings.Join(outstrings, ` `)
	return out
}
