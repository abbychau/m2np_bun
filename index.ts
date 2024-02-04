import app from "./app"

Bun.serve(
    {
    fetch: app.fetch,
    port: process.env.PORT || 3000
    }
)

console.log("Listening on port 3000")