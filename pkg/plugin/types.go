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
	ID                   int       `json:"id"`
	Url                  string    `json:"url"`
	ExternalID           string    `json:"external_id"`
	Type                 string    `json:"type"`
	Subject              string    `json:"subject"`
	RawSubject           string    `json:"raw_subject"`
	Description          string    `json:"description"`
	Priority             string    `json:"priority"`
	Status               string    `json:"status"`
	Recipient            string    `json:"recipient"`
	RequesterID          int       `json:"requester_id"`
	SubmitterID          int       `json:"submitter_id"`
	AssigneeID           int       `json:"assignee_id"`
	OrganizationID       int       `json:"organization_id"`
	GroupID              int       `json:"group_id"`
	CollaboratorIDs      []int     `json:"collaborator_ids"`
	FollowerIds          []any     `json:"follower_ids"`
	EmailCcIds           []any     `json:"email_cc_ids"`
	SharingAgreementIds  []any     `json:"sharing_agreement_ids"`
	CustomStatusID       int64     `json:"custom_status_id"`
	Fields               []any     `json:"fields"`
	FollowupIds          []any     `json:"followup_ids"`
	TicketFormID         int64     `json:"ticket_form_id"`
	BrandID              int64     `json:"brand_id"`
	AllowChannelback     bool      `json:"allow_channelback"`
	AllowAttachments     bool      `json:"allow_attachments"`
	FromMessagingChannel bool      `json:"from_messaging_channel"`
	ResultType           string    `json:"result_type"`
	ForumTopicID         int       `json:"forum_topic_id"`
	ProblemID            int       `json:"problem_id"`
	HasIncidents         bool      `json:"has_incidents"`
	IsPublic             bool      `json:"is_public"`
	DueAt                time.Time `json:"due_at"`
	Tags                 []string  `json:"tags"`
	CustomFields         []struct {
		ID    int    `json:"id"`
		Value string `json:"value"`
	} `json:"custom_fields"`
	SatisfactionRating struct {
		ID      int    `json:"id"`
		Score   string `json:"score"`
		Comment string `json:"comment"`
	} `json:"satisfaction_rating"`
	SharingAgreementIDs []int `json:"sharing_agreement_ids"`
	FollowupIDs         []int `json:"followup_ids"`
	Via                 struct {
		Channel string `json:"channel"`
		Source  struct {
			From struct {
			} `json:"from"`
			To struct {
			} `json:"to"`
			Rel any `json:"rel"`
		} `json:"source"`
	} `json:"via"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// type SelectableQueryRow struct {
// 	selectedKeyword   string
// 	availableKeywords []string
// 	operator          string
// 	terms             []string
// 	availableTerms    []string
// 	uniqueId          string
// 	querystring       string
// }

type apiQuery struct {
	QueryString string `json:"querystring"`
	// Filters     []SelectableQueryRow `json:"filters"`
}
