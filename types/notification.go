package types

type Notification struct {
	Type     string   `json:"type"`
	Title    Language `json:"title"`
	Message  Language `json:"message"`
	Link     *string  `json:"link,omitempty"`
	Navigate *string  `json:"navigate,omitempty"`
}
