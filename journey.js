
import http from 'k6/http';
import { check, group, sleep } from 'k6';

const BASE_URL = 'https://quickpizza.grafana.com';

export default function journey() {
  // Step 1: Visit homepage
  group('home', function () {
    const res = http.get(`${BASE_URL}/`);

    check(res, {
      'home status is 200': (r) => r.status === 200,
    });

    sleep(1 + Math.random() * 2);
  });

  // Step 2: View quotes
  group('quotes', function () {
    const res = http.get(`${BASE_URL}/api/quotes`);

    check(res, {
      'quotes status is 200': (r) => r.status === 200,
      'quotes are not empty': (r) =>
        r.json('quotes').length > 0,
    });

    sleep(1);
  });

  // Step 3: Get pizza recommendation
  group('recommendation', function () {
    const body = JSON.stringify({
      mustBeVegetarian: true,
    });

    const res = http.post(
      `${BASE_URL}/api/pizza`,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'token abcdef0123456789',
        },
      }
    );

    check(res, {
      'pizza status is 200': (r) => r.status === 200,
      'pizza has a name': (r) =>
        r.json('pizza.name') !== undefined,
    });

    sleep(1 + Math.random() * 2);
  });
}
