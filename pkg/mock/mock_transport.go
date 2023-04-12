package mock

import (
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"strings"

	"github.com/grafana/grafana-plugin-sdk-go/experimental/mock"
)

const defaultFolder = "./testdata/"
const ext = ".json"

// NewMockTransport creates a new mockTransport
func NewMockTransport(routes map[string]string, dataFolder string) http.RoundTripper {
	return &mock.RoundTripper{
		GetFileName: func(req *http.Request) string {
			name := routes[req.URL.Path]
			if name == "" {
				// by convention, the last 2 parts of the path can match the mock data file name: eg meta/incident = meta-incident.json
				path := req.URL.Path
				parts := strings.Split(path, "/")
				name = parts[len(parts)-2] + "-" + parts[len(parts)-1]
			}
			return filepath.Join(basePath(), defaultFolder, name+ext)
		},
	}
}

func basePath() string {
	mockSource, present := os.LookupEnv("GRAFANA_ZENDESK_MOCK_SOURCE")
	if present && mockSource == "local_mock" {
		return filepath.Dir("/mock/grafana-zendesk-datasource/")
	}
	_, b, _, _ := runtime.Caller(0)
	return filepath.Dir(b)
}
