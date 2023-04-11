package plugin

import "time"

// apiSearchResults is a struct containing a slice of dataPoint
type apiSearchResults struct {
	TicketResults []apiTicket `json:"results"`
}

// apiTicket is a single data point with a timestamp and a float value
type apiTicket struct {
	ID             float64 `json:"id"`
	Url            string  `json:"url"`
	ExternalID     string  `json:"external_id"`
	Type           string  `json:"type"`
	Subject        string  `json:"subject"`
	RawSubject     string  `json:"raw_subject"`
	Description    string  `json:"description"`
	Priority       string  `json:"priority"`
	Status         string  `json:"status"`
	Recipient      string  `json:"recipient"`
	RequesterID    float64 `json:"requester_id"`
	SubmitterID    float64 `json:"submitter_id"`
	AssigneeID     float64 `json:"assignee_id"`
	OrganizationID float64 `json:"organization_id"`
	GroupID        float64 `json:"group_id"`
	// CollaboratorIDs []int     `json:"collaborator_ids"`
	ForumTopicID float64   `json:"forum_topic_id"`
	ProblemID    float64   `json:"problem_id"`
	HasIncidents bool      `json:"has_incidents"`
	IsPublic     bool      `json:"is_public"`
	DueAt        time.Time `json:"due_at"`
	// Tags            []string  `json:"tags"`
	// CustomFields    []struct {
	// 	ID    int    `json:"id"`
	// 	Value string `json:"value"`
	// } `json:"custom_fields"`
	SatisfactionRating struct {
		ID      float64 `json:"id"`
		Score   string  `json:"score"`
		Comment string  `json:"comment"`
	} `json:"satisfaction_rating"`
	// SharingAgreementIDs []int `json:"sharing_agreement_ids"`
	// FollowupIDs         []int `json:"followup_ids"`
	Via struct {
		Channel string `json:"channel"`
	} `json:"via"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type toggleGroup struct {
}

type apiQuery struct {
	TicketType string          `json:"type"`
	Status     map[string]bool `json:"status"`
	Priority   map[string]bool `json:"priority"`
	Tags       []string        `json:"tags"`
	Created    string          `json:"created_at"`
}
