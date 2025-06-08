import { check, sleep } from 'k6'
import http from 'k6/http'
//Stress Testing: Increasing the load on the system beyond normal operational capacity.

export const options = {
  stages: [
    { duration: '1m', target: 100 }, // ramp-up to 100 VUs over 1 minute
    { duration: '2m', target: 200 }, // stay at 200 VUs for 2 minute
    { duration: '1m', target: 0 }, // ramp-down to 0 VUs over 1 minute
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
