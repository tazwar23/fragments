#Invalid url
GET http://localhost:8080/no-such-route

HTTP/1.1 404

[Asserts]
# We expect to get back a JSON response with { "status": "ok", ... }
jsonpath "$.status" == "error"

jsonpath "$.error.message" == "not found"

jsonpath "$.error.code" == 404
