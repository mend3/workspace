import { check, sleep } from 'k6'
import http from 'k6/http'
//Soak Testing: Sustaining a moderate load over a long duration to identify potential memory leaks or performance degradation.

export const options = {
  stages: [
    { duration: '10m', target: 100 }, // 100 VUs for 10 minutes
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], // less than 1% of requests failed
    http_req_duration: ['p(95)<500'], // adjust as necessary
  },
  tags: {
    type: __ENV.K6_TEST_MODE,
    uri: __ENV.K6_TEST_URI,
  },
}

export default function () {
  const response = http.get(__ENV.K6_TEST_URI, {})
  check(response, { 'status is 200': r => r.status === 200 })
  sleep(1)
}
