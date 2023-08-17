# tests/integration/post-fragments-unauthenticated.hurl
# Unauthenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: text/plain
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password12
# Body of the request goes in ```...``` when it's a string
`This is a fragment!`

HTTP/1.1 401

[Asserts]
# Assert that the status is "error"
jsonpath "$.status" == "error"

# Assert that the error code is 401
jsonpath "$.error.code" == 401

# Assert that the error message is "Unauthorized"
jsonpath "$.error.message" == "Unauthorized"
