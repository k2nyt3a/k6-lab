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

## Part A results

| Step | Test type | Users | Req/s | p(95) | Max | Failed | Checks |
|---|---|---|---|---|---|---|---|
| A1 | Smoke | 1 | 0.54 | 345.81 ms | 355.85 ms | 0% | 100% |
| A2 | Average load | 3 | 1.30 | 372.17 ms | 408.46 ms | 0% | 100% |
| A3 | Stress | 5 | 2.16 | 377.84 ms | 1,200 ms | 0% | 100% |
| A4 | Spike | 5 | 1.01 | 361.20 ms | 1,870 ms | 0% | 100% |
| A5 | Soak | 2 | 0.97 | 379.09 ms | 1,410 ms | 0% | 100% |

### A2 observations
- The average load test ran for 3 minutes with up to 3 virtual users.
- All configured performance thresholds passed.
- The overall p(95) response time was 372.17 ms.
- The homepage p(95) was 303.64 ms, below the 1000 ms threshold.
- The recommendation p(95) was 389.99 ms, below the 1500 ms threshold.
- The HTTP failure rate was 0%, and all checks passed.
- Earlier attempts encountered an intermittent TypeError in the quotes check. The successful run completed without modifying the original journey code.

### A3 — Stress Test Observations

Use 5 virtual users for a total duration of 3 minutes. All configured thresholds passed, with 0% HTTP failures and 100% successful checks.

Compared with A2:
- throughput increased from 1.30 to 2.16 requests/sec
- p(95) response time increased  from 372.17 ms to 377.84 ms.

The maximum response time reached approximately 1.2 seconds, indicating occasional slower requests. However, the system remained within the configured p(95) performance thresholds at this tested load.

### A4 — Spike Test Observations

The spike test ran for 2 minutes and 20 seconds, with a sudden increase from 1 to 5 virtual users.
- p(95) response time was 361.20 ms
- HTTP failure rate was 0%
- all 240 checks passed.

The maximum response time reached 1.87 seconds, showing that some requests experienced higher latency. However, the overall p(95) remained low.

The aggregate results indicate that the application handled the tested spike without HTTP failures. To confirm recovery after the spike, the response-time trend before, during, and after the spike should be compared in the k6 dashboard.

### A5 — Soak Test Observations

The soak test ran for 11 minutes, including a 10-minute hold at 2 virtual users.

All four performance thresholds passed. The test completed 642 HTTP requests and 214 iterations, with a 0% HTTP failure rate and 100% successful checks (1,070/1,070).

The overall p(95) response time was 379.09 ms, while the homepage and recommendation p(95) values were 318.27 ms and 394.53 ms, respectively.

The results show that the application handled the sustained 2-VU workload without recorded HTTP failures. However, confirming whether response times degraded over the test requires examining the time-series trend in the HTML dashboard.

### Part A — Overall Summary

All five performance tests completed successfully under their configured workloads. The application passed the configured thresholds, with no HTTP request failures and 100% successful checks in every test.

- The stress test achieved the highest throughput at 2.16 requests/sec with 5 VUs. 
- The spike test recorded the highest individual response time at 1.87 seconds. 
- The soak test completed 11 minutes without HTTP failures.

These results demonstrate acceptable performance within the tested workloads, but they do not establish the application's maximum capacity or long-term stability beyond the test durations.