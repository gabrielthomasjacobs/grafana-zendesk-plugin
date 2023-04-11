package plugin

import (
	"context"
	"fmt"
	"testing"

	"github.com/gabrielthomasjacobs/zendeskplugin/pkg/mock"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/httpclient"
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
	cl, err := httpclient.New(opts)
	if err != nil {
		t.Fail()
		return
	}
	cl.Transport = mock.NewMockTransport(routes, "./testdata")
	a := api{
		client: cl,
	}

	query := backend.DataQuery{
		JSON: []byte("{}"),
	}
	resp, err := a.FetchTickets(context.Background(), query)
	if err != nil {
		t.Fail()
		return
	}
	tickets := resp

	frame, err := framestruct.ToDataFrame("tickets", tickets)
	// framestruct.WithConverterFor("collaborator_ids", func(input interface{}) (interface{}, error) {
	// 	return nil, nil
	// }),
	// framestruct.WithConverterFor("follower_ids", func(input interface{}) (interface{}, error) {
	// 	return nil, nil
	// }),
	// framestruct.WithConverterFor("tags", func(input interface{}) (interface{}, error) {
	// 	return nil, nil
	// }),
	// framestruct.WithConverterFor("custom_fields", func(input interface{}) (interface{}, error) {
	// 	return nil, nil
	// }),
	// framestruct.WithConverterFor("sharing_agreement_ids", func(input interface{}) (interface{}, error) {
	// 	return nil, nil
	// }),
	// framestruct.WithConverterFor("followup_ids", func(input interface{}) (interface{}, error) {
	// 	return nil, nil
	// }),
	// framestruct.WithConverterFor("fields", func(input interface{}) (interface{}, error) {
	// 	return nil, nil
	// }),
	// framestruct.WithConverterFor("via", func(input interface{}) (interface{}, error) {
	// 	return nil, nil
	// }),
	// framestruct.WithConverterFor("email_cc_ids", func(input interface{}) (interface{}, error) {
	// 	return nil, nil
	// }))

	if err != nil {
		fmt.Println(err)
		t.Fail()
		return
	}
	res := backend.DataResponse{
		Frames: []*data.Frame{frame},
	}

	experimental.CheckGoldenJSONResponse(t, "./testdata", "ticket-frame", &res, true)
	fmt.Println(res)
}
