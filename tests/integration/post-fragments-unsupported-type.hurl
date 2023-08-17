# tests/integration/post-fragments-unsupported-type.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments

# Headers
Content-Type: something/plain

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# Body of the request
`This is a fragment!`

HTTP/1.1 415

[Asserts]
# We expect to get back a JSON response indicating an error
jsonpath "$.status" == "error"

