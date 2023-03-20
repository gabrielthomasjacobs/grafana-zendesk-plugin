package models

import (
	"encoding/json"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
)

// "github.com/grafana/grafana-plugin-sdk-go/backend"

type PluginBasicConfig struct {
	// Config    backend.DataSourceInstanceSettings
	Email     string `json:"email"`
	Subdomain string `json:"subdomain"`
}

type PluginSecureConfig struct {
	ApiKey string `json:"apiKey"`
}

func GetBasicSettings(config *backend.DataSourceInstanceSettings) (data PluginBasicConfig, err error) {
	err = json.Unmarshal(config.JSONData, &data)

	if err != nil {
		backend.Logger.Error("Error getting account", err)
		return PluginBasicConfig{}, err
	}
	return data, err
}
