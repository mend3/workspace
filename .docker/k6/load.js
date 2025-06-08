import { check, sleep } from 'k6'
import http from 'k6/http'

export const options = {
  tlsAuth: [
    {
      cert: open(__ENV.K6_TLS_CERT),
      key: open(__ENV.K6_TLS_KEY),
    },
  ],
  tlsVersion: {
    min: http.TLS_1_0,
    max: http.TLS_1_3,
  },
  stages: [
    { duration: '1m', target: 20 }, // ramp-up from 0 to 20 VUs in 1 minute
    // { duration: '4m', target: 20 }, // stay at 20 VUs for 4 minutes
    { duration: '1m', target: 50 }, // ramp-up to 50 VUs in 1 minute
    // { duration: '4m', target: 50 }, // stay at 50 VUs for 4 minutes
    { duration: '1m', target: 100 }, // ramp-up to 100 VUs in 1 minute
    { duration: '1m', target: 100 }, // ramp-up to 100 VUs in 1 minute
    // { duration: '4m', target: 100 }, // stay at 100 VUs for 4 minutes
    { duration: '1m', target: 0 }, // ramp-down to 0 VUs in 1 minute
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], // less than 1% of requests failed
    http_req_duration: [
      'p(90)<400', // 90% of requests must complete below 400ms
      'p(95)<500', // 95% of requests must complete below 500ms
      'p(99)<800', // 99% of requests must complete below 800ms
    ],
    http_reqs: ['rate>30'], // more than 20 RPS, adjust as necessary
  },
  vus: 1, // Start with 1 VU to warm up the system
  setupTimeout: '1m', // Allow extra time for setup tasks
  // discardResponseBodies: true, // Save resources by discarding response bodies (if not needed)
  noConnectionReuse: true, // Simulate new connections for each request
  tags: {
    type: __ENV.K6_TEST_MODE,
    uri: __ENV.K6_TEST_URI,
  },
}

export default function () {
  const res = http.get(__ENV.K6_TEST_URI)
  check(res, { 'status is 200 or 301': r => r.status === 200 || r.status === 301 })
  sleep(Math.random() * 1) // Introduce some randomness to simulate real user behavior
}
