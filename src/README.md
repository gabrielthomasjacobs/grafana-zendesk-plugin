<!-- This README file is going to be the one displayed on the Grafana.com website for your plugin -->

# Zendesk Plugin

Adds Zendesk Integration

## Getting Started

First, you will need to generate an API token from the zendesk admin panel.
>https://yoursubdomain.zendesk.com/admin/apps-integrations/apis/zendesk-api/settings

Next, add the plugin to your Grafana instance.

In the datasource configuration page, add the API endpoint as the URL:
>https://yoursubdomain.zendesk.com/api/v2/

Enable "Basic auth" and set the username to your email address followed by "/token" and the password to the API token you generated.
e.g.:
>username: Gabriel.Thomas.Jacobs@gmail.com/token
>password: footoken12345