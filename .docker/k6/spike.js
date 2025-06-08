import { check, sleep } from 'k6'
import http from 'k6/http'
//Spike Testing: Rapidly increasing the load on the system to observe its behavior under sudden surges in traffic.

export const options = {
  stages: [
    { duration: '5s', target: 50 }, // ramp-up from 1 to 50 VUs in 5s
    { duration: '30s', target: 50 }, // stay at rest on 50 VUs for 30s
    { duration: '5s', target: 0 }, // ramp-down from 50 to 0 VUs in 5s
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
