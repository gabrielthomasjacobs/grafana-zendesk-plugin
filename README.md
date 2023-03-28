# Zendesk Plugin

Adds Zendesk Integration

## Features
- Visualize ticket count by status
- Query on status, priority, and tags

## Getting Started

First, you will need to generate an API token from the zendesk admin panel.
>https://support.zendesk.com/hc/en-us/articles/4408889192858-Generating-a-new-API-token

Next, add the plugin to your Grafana instance.

In the datasource configuration page, add the API endpoint as the URL:
>https://yoursubdomain.zendesk.com/api/v2/

Enable "Basic auth" and set the username to your email address followed by "/token" and the password to the API token you generated.
e.g.:
>username: Gabriel.Thomas.Jacobs@gmail.com/token
>password: footoken12345

## Recommended Visualization Options:
- style: step-after
- min: 0
- decimals: 0