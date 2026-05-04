package event

import (
	"bufio"
	"encoding/json"
	"fmt"
	"log"
	"react-go/core/dto"
	"react-go/core/function"
	"react-go/core/sse"
	"react-go/core/variable"
	"sync"
	"time"

	notification "react-go/core/modules/notification/model"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func Stream(c *fiber.Ctx) error {
	token := c.Query("token")
	if token == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "token is required",
		})
	}

	claims, err := function.JwtValidateToken(token)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "invalid token",
		})
	}

	connectedUserID := claims.ID

	client := &sse.Client{
		ID:   connectedUserID,
		Chan: make(chan string, 100),
	}

	sse.AppHub.Mutex.Lock()
	sse.AppHub.Clients[connectedUserID] = client
	sse.AppHub.Mutex.Unlock()

	log.Printf("✅ SSE: User %s connected", connectedUserID)

	// Send recent notifications upon connection
	go func(uid string, ch chan string) {
		notifs := make([]notification.Notification, 0)
		variable.Db.Where("user_id = ? AND deleted_at IS NULL", uid).
			Order("id DESC").Limit(10).Find(&notifs)

		notifMaps := make([]map[string]any, 0)
		for _, n := range notifs {
			notifMaps = append(notifMaps, n.Map())
		}

		payload, _ := json.Marshal(map[string]any{
			"event": "notification",
			"data":  notifMaps,
		})
		ch <- string(payload)
	}(connectedUserID, client.Chan)

	c.Set("Content-Type", "text/event-stream")
	c.Set("Cache-Control", "no-cache")
	c.Set("Connection", "keep-alive")
	c.Set("Transfer-Encoding", "chunked")

	c.Context().SetBodyStreamWriter(func(w *bufio.Writer) {
		defer func() {
			sse.AppHub.Mutex.Lock()
			delete(sse.AppHub.Clients, connectedUserID)
			sse.AppHub.Mutex.Unlock()
			log.Printf("🛸 SSE: User %s disconnected", connectedUserID)
		}()

		for {
			select {
			case msg, ok := <-client.Chan:
				if !ok {
					return
				}
				fmt.Fprintf(w, "data: %s\n\n", msg)
				if err := w.Flush(); err != nil {
					return
				}

			case <-time.After(30 * time.Second):
				fmt.Fprintf(w, ": ping\n\n")
				if err := w.Flush(); err != nil {
					return
				}
			}
		}
	})

	return nil
}

func Dashboard(c *fiber.Ctx) error {
	existing, err := function.JwtGetUser(c)
	if err != nil {
		return dto.Unauthorized(c, "Unauthorized", nil)
	}

	connectedUserID := existing.ID
	clientChan := make(chan string, 100)

	// Since a user might have multiple dashboard tabs, use a unique ID for the client
	clientID := uuid.New().String()

	dashboardHub.Mutex.Lock()
	dashboardHub.Clients[clientID] = clientChan
	dashboardHub.Mutex.Unlock()

	log.Printf("✅ SSE: User %s connected to Dashboard", connectedUserID)

	c.Set("Content-Type", "text/event-stream")
	c.Set("Cache-Control", "no-cache")
	c.Set("Connection", "keep-alive")
	c.Set("Transfer-Encoding", "chunked")

	c.Context().SetBodyStreamWriter(func(w *bufio.Writer) {
		defer func() {
			dashboardHub.Mutex.Lock()
			delete(dashboardHub.Clients, clientID)
			dashboardHub.Mutex.Unlock()
			log.Printf("🛸 SSE: User %s disconnected from Dashboard", connectedUserID)
		}()

		for {
			select {
			case msg, ok := <-clientChan:
				if !ok {
					return
				}
				fmt.Fprintf(w, "data: %s\n\n", msg)
				if err := w.Flush(); err != nil {
					return
				}

			case <-time.After(30 * time.Second):
				fmt.Fprintf(w, ": ping\n\n")
				if err := w.Flush(); err != nil {
					return
				}
			}
		}
	})

	return nil
}

// Dashboard Hub
var dashboardHub = struct {
	Clients map[string]chan string
	Mutex   sync.RWMutex
}{
	Clients: make(map[string]chan string),
}

func init() {
	go func() {
		ticker := time.NewTicker(1 * time.Second)
		defer ticker.Stop()
		for range ticker.C {
			stats := fetchLiveStats()
			payloadBytes, _ := json.Marshal(map[string]any{
				"event": "live_data",
				"data":  stats,
			})
			msg := string(payloadBytes)

			dashboardHub.Mutex.RLock()
			for _, ch := range dashboardHub.Clients {
				select {
				case ch <- msg:
				default:
				}
			}
			dashboardHub.Mutex.RUnlock()
		}
	}()
}

type liveStats struct {
	TotalQueues    int64          `json:"total_queues"`
	TotalMessages  int64          `json:"total_messages"`
	TotalCompleted int64          `json:"total_completed"`
	TotalFailed    int64          `json:"total_failed"`
	TotalTiming    int64          `json:"total_timing"`
	TotalPending   int64          `json:"total_pending"`
	Queue          map[string]int `json:"queue"`
}

func fetchLiveStats() liveStats {
	var s liveStats
	return s
}
