package plugin

import "time"

// apiSearchResults is a struct containing a slice of dataPoint
type apiSearchResults struct {
	TicketResults []apiTicket `json:"results"`
	Facets        any         `json:"facets"`
	NextPage      any         `json:"next_page"`
	PreviousPage  any         `json:"previous_page"`
	Count         int         `json:"count"`
}

// apiTicket is a single data point with a timestamp and a float value
type apiTicket struct {
	ID  float64 `json:"id"`
	Url string  `json:"url,omitempty"`
	// ExternalID     string  `json:"external_id,omitempty"`
	Type           string  `json:"type,omitempty"`
	Subject        string  `json:"subject,omitempty"`
	RawSubject     string  `json:"raw_subject,omitempty"`
	Description    string  `json:"description,omitempty"`
	Priority       string  `json:"priority,omitempty"`
	Status         string  `json:"status,omitempty"`
	Recipient      string  `json:"recipient,omitempty"`
	RequesterID    float64 `json:"requester_id,omitempty"`
	SubmitterID    float64 `json:"submitter_id,omitempty"`
	AssigneeID     float64 `json:"assignee_id,omitempty"`
	OrganizationID float64 `json:"organization_id,omitempty"`
	GroupID        float64 `json:"group_id,omitempty"`
	// CollaboratorIDs      []int     `json:"collaborator_ids,omitempty"`
	// FollowerIds          []any     `json:"follower_ids,omitempty"`
	// EmailCcIds           []any     `json:"email_cc_ids,omitempty"`
	// SharingAgreementIds  []any     `json:"sharing_agreement_ids,omitempty"`
	CustomStatusID float64 `json:"custom_status_id,omitempty"`
	// Fields               []any     `json:"fields,omitempty"`
	// FollowupIds          []any     `json:"followup_ids,omitempty"`
	TicketFormID         float64   `json:"ticket_form_id,omitempty"`
	BrandID              float64   `json:"brand_id,omitempty"`
	AllowChannelback     bool      `json:"allow_channelback,omitempty"`
	AllowAttachments     bool      `json:"allow_attachments,omitempty"`
	FromMessagingChannel bool      `json:"from_messaging_channel,omitempty"`
	ResultType           string    `json:"result_type,omitempty"`
	ForumTopicID         float64   `json:"forum_topic_id,omitempty"`
	ProblemID            float64   `json:"problem_id,omitempty"`
	HasIncidents         bool      `json:"has_incidents,omitempty"`
	IsPublic             bool      `json:"is_public,omitempty"`
	DueAt                time.Time `json:"due_at,omitempty"`
	// Tags                 []string  `json:"tags,omitempty"`
	// CustomFields         []struct {
	// 	Value string `json:"value"`
	// } `json:"custom_fields"`
	// SatisfactionRating struct {
	// 	Score   string `json:"score"`
	// 	Comment string `json:"comment"`
	// } `json:"satisfaction_rating"`
	// SharingAgreementIDs []float64 `json:"sharing_agreement_ids"`
	// FollowupIDs         []float64 `json:"followup_ids"`
	// Via                 struct {
	// 	Channel string `json:"channel"`
	// 	Source  struct {
	// 		From struct {
	// 		} `json:"from"`
	// 		To struct {
	// 		} `json:"to"`
	// 		Rel any `json:"rel"`
	// 	} `json:"source"`
	// } `json:"via"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at,omitempty"`
}

type apiQuery struct {
	QueryString string `json:"querystring"`
}
