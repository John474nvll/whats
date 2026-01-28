
package main

import (
    "fmt"
    "log"
    "net/http"
    "os"

    "github.com/gorilla/mux"
    "github.com/twilio/twilio-go"
    twilioApi "github.com/twilio/twilio-go/rest/api/v2010"
)

func main() {
    r := mux.NewRouter()

    r.HandleFunc("/voice", func(w http.ResponseWriter, r *http.Request) {
        // Create a new TwiML response
        resp := twilio.NewTwimlResponse()
        resp.Say("Hello from the Go server!", &twilio.SayOpts{
            Voice: "alice",
        })

        // Render the TwiML
        w.Header().Set("Content-Type", "application/xml")
        if err := resp.Render(w); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
        }
    }).Methods("POST")

    // Get the port from the environment, defaulting to 8080
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    // Start the server
    log.Printf("Starting server on port %s...", port)
    if err := http.ListenAndServe(":"+port, r); err != nil {
        log.Fatalf("could not start server: %v", err)
    }
}
