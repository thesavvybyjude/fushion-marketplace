import http from 'k6/http';
import { check, sleep } from 'k6';

// Test configuration: 100 concurrent users for 1 minute
export const options = {
  stages: [
    { duration: '15s', target: 50 },  // Ramp up to 50 users
    { duration: '30s', target: 100 }, // Peak 100 users
    { duration: '15s', target: 0 },   // Ramp down to 0
  ],
  thresholds: {
    // 95% of requests must complete within 2000ms
    http_req_duration: ['p(95)<2000'],
    // Less than 1% of requests should fail
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3001/api/v1';
const WEB_URL = __ENV.WEB_URL || 'http://localhost:3000';

export default function () {
  // Simulate buyer workflow

  // 1. Visit Storefront Home (SSR)
  const homeRes = http.get(WEB_URL);
  check(homeRes, {
    'home status is 200': (r) => r.status === 200,
  });
  sleep(1);

  // 2. Poll API Health (Load Balancer check)
  const healthRes = http.get(`${BASE_URL}/health`);
  check(healthRes, {
    'health status is 200': (r) => r.status === 200,
  });

  // 3. View Category Page
  const categoryRes = http.get(`${WEB_URL}/category/fashion`);
  check(categoryRes, {
    'category status is 200': (r) => r.status === 200,
  });
  sleep(2);

  // 4. Hit search API directly (simulating autocomplete)
  const searchRes = http.get(`${BASE_URL}/search?q=dress`);
  // Note: search route might be stubbed if Typesense isn't up, but we check availability
  check(searchRes, {
    'search status is 200 or 404': (r) => r.status === 200 || r.status === 404, 
  });
  sleep(1);
}
