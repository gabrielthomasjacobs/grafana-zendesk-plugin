package models

type UserObject struct {
	Url          string `json:"url"`
	Name         string `json:"name"`
	Sandbox      bool   `json:"sandbox"`
	Subdomain    string `json:"subdomain"`
	TimeFormat   int    `json:"time_format"`
	TimeZone     string `json:"time_zone"`
	OwnerID      int    `json:"owner_id"`
	Multiproduct bool   `json:"multiproduct"`
}

type UserAccountResponse struct {
	Account UserObject `json:"account"`
}
