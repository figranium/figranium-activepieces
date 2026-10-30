const test = require('node:test');
const assert = require('node:assert/strict');
const { HttpMethod, httpClient } = require('@activepieces/pieces-common');
const { figraniumClient, assertSafeFigraniumApiUrl } = require('../dist/lib/common/client.js');

test('custom API calls only allow configured same-origin API paths', () => {
  const base = 'https://figranium.example/proxy';
  for (const target of ['/api/tasks/list', 'api/tasks/list', 'https://figranium.example/proxy/api/tasks/list']) {
    assert.doesNotThrow(() => assertSafeFigraniumApiUrl(base, target));
  }
  for (const target of [
    'https://attacker.example/api/tasks/list',
    'https://figranium.example.evil/api/tasks/list',
    'http://figranium.example/proxy/api/tasks/list',
    'https://user@figranium.example/proxy/api/tasks/list',
    '/api/../admin',
    '/api%2ftasks/list',
    '//attacker.example/api/tasks/list',
    '/api/tasks/list\\evil',
    '/api/tasks/list ',
    '/api/tasks/list#x',
    '/api/tasks/list?x=1'
  ]) {
    // Fragments and queries are safe if they remain on the same server.
    if (target === '/api/tasks/list#x' || target === '/api/tasks/list?x=1') {
      assert.doesNotThrow(() => assertSafeFigraniumApiUrl('https://figranium.example', target));
    } else {
      assert.throws(() => assertSafeFigraniumApiUrl(base, target), /API|URL|Ambiguous/);
    }
  }
  assert.throws(() => assertSafeFigraniumApiUrl(base, undefined));
  assert.throws(() => assertSafeFigraniumApiUrl('ftp://figranium.example', '/api/tasks/list'));
});

test('built-in API calls disable redirects and return normal results', async () => {
  const original = httpClient.sendRequest;
  let request;
  httpClient.sendRequest = async (options) => {
    request = options;
    return { status: 200, body: { tasks: [] } };
  };
  try {
    const result = await figraniumClient({
      baseUrl: 'https://figranium.example/',
      apiKey: 'test-secret',
      method: HttpMethod.GET,
      resourceUri: '/api/tasks/list',
    });
    assert.deepEqual(result, { tasks: [] });
    assert.equal(request.followRedirects, false);
    assert.equal(request.headers['x-api-key'], 'test-secret');
  } finally {
    httpClient.sendRequest = original;
  }
});

test('built-in API calls reject a 302 without making another request', async () => {
  const original = httpClient.sendRequest;
  let count = 0;
  httpClient.sendRequest = async (options) => {
    count++;
    assert.equal(options.followRedirects, false);
    return { status: 302, body: '', headers: { location: 'https://attacker.example/' } };
  };
  try {
    await assert.rejects(
      figraniumClient({
        baseUrl: 'https://figranium.example',
        apiKey: 'test-secret',
        method: HttpMethod.GET,
        resourceUri: '/api/tasks/list',
      }),
      /do not follow redirects/
    );
    assert.equal(count, 1);
  } finally {
    httpClient.sendRequest = original;
  }
});
