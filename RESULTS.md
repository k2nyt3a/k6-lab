## Part 0

- Step 0.1, http_req_duration: 301.91 ms

- Step 0.2:
  - Total requests: 80
  - Request rate: 3.79257 requests/second
  - p(95): 295.45 ms
  - Explanation: The request rate is below 5 requests per second because each virtual user need to wait for 1 second after making an HTTP request. The HTTP request also takes time to complete. Therefore, each user cannot send exactly 1 request per second.

- Step 0.3:
  - Total requests: 20
  - Request rate: 2.936727 requests/second
  - p(95): 1 s

- Step 0.4:
  - Total requests: 3
  - Request rate: 1.602246 requests/second
  - p(95): 298.76 ms

- Step 0.5:
  - Total requests: 1
  - Request rate: 0.543606 requests/second
  - p(95): 265.57 ms
  - checks_failed......: 0.00%   0 out of 1
  - API return 401 without an authorization to token.

- Step 0.6:
  - Normal run (P95 = 1500 ms):
    - Measured p(95): 371.86 ms
    - Checks succeeded: 100%
    - HTTP request failure rate: 0%
    - Result: PASS
  - Strict run (P95 = 300 ms):
    - Measured p(95): 655.42 ms
    - Checks succeeded: 100%
    - HTTP request failure rate: 0%
    - Result: FAIL (response time exceeded the threshold)
    - Exit code: 99