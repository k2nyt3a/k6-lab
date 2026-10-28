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

- Step 0.7:
  - Virtual users: 3
  - Duration: 30 seconds
  - Original requirements:
    - p(95) < 1000 ms
    - p(99) < 1500 ms
    - HTTP request failure rate < 1%
  - Original test results:
    - p(95): 374.12 ms
    - p(99): 381.45 ms
    - HTTP request failure rate: 0%
    - All thresholds passed (PASS)
  - Modified requirement: Changed p(95) threshold from 1000 ms to 100 ms.
  - Modified test results:
    - p(95): 367.14 ms
    - p(99): 636.68 ms
    - HTTP request failure rate: 0%
    - Result: FAIL because p(95) exceeded 100 ms.
    - Exit code: 99

- Step 0.8:
  - Test configuration: 5 VUs for 20 seconds.
  - Initial test:
    - HTTP requests: 75
    - Passed checks: 192/225 (85.33%)
    - Failed checks: 33/225 (14.66%)
    - No Pepperoni ingredient: 11 failures
    - No Knife tool: 22 failures
    - HTTP request failure rate: 0%
  - Investigation:
    - Used `/api/ingredients/topping` and `/api/tools` to inspect the API's valid names.
    - The API returned "Pepperoni" and "Knife".
  - Root cause:
    - The original request used lowercase values ("pepperoni" and "knife"), which did not match the API's names.
  - Fix:
    - Changed `["pepperoni"]` to `["Pepperoni"]`.
    - Changed `["knife"]` to `["Knife"]`.
  - Final test:
    - HTTP requests: 75
    - Passed checks: 225/225 (100%)
    - Failed checks: 0
    - HTTP request failure rate: 0%
    - p(95): 383.46 ms
    - Result: PASS
  - Explanation:
    - Repeated requests helped expose that the original exclusions were not being respected consistently. After correcting the names, all checks passed. This also demonstrates why HTTP status checks alone are insufficient to validate API behavior.