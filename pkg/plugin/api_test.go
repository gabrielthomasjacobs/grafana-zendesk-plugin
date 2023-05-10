package plugin

import (
	"context"
	"fmt"
	"net/http"
	"testing"

	"github.com/gabrielthomasjacobs/zendeskplugin/pkg/mock"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/data"
	"github.com/grafana/grafana-plugin-sdk-go/data/framestruct"
	"github.com/grafana/grafana-plugin-sdk-go/experimental"
)

func TestFetchTickets(t *testing.T) {
	settings := backend.DataSourceInstanceSettings{}
	opts, err := settings.HTTPClientOptions()
	if err != nil {
		t.Fail()
		return
	}

	routes := map[string]string{
		"search": "schema",
	}
	cl := http.Client{
		Transport: http.DefaultTransport,
		Timeout:   opts.Timeouts.Timeout,
	}
	if err != nil {
		fmt.Println(err)
		t.Fail()
		return
	}
	cl.Transport = mock.NewMockTransport(routes, "./testdata")
	a := api{
		Client: cl,
	}

	query := backend.DataQuery{
		JSON: []byte(`{"querystring": "status:open"}`),
	}
	resp, err := a.FetchTickets(context.Background(), query)
	if err != nil {
		fmt.Println(err)
		t.Fail()
	}

	tickets := resp

	frame, err := framestruct.ToDataFrame("tickets", tickets)

	if err != nil {
		fmt.Println(err)
		t.Fail()
	}
	res := backend.DataResponse{
		Frames: []*data.Frame{frame},
	}

	experimental.CheckGoldenJSONResponse(t, "../mock/testdata", "ticket-frame", &res, true)
	fmt.Println("result: ")
	fmt.Println(res)
}
