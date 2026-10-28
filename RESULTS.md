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
