import { httpClient, HttpMethod, QueryParams } from '@activepieces/pieces-common';

type FigraniumRequest = {
  baseUrl: string;
  apiKey: string;
  method: HttpMethod;
  resourceUri: string;
  body?: Record<string, unknown>;
  queryParams?: QueryParams;
};

export async function figraniumClient<T>({
  baseUrl,
  apiKey,
  method,
  resourceUri,
  body,
  queryParams,
}: FigraniumRequest): Promise<T> {
  const response = await httpClient.sendRequest<T>({
    method,
    url: `${baseUrl.replace(/\/+$/, '')}${resourceUri}`,
    headers: {
      'x-api-key': apiKey,
    },
    // Never forward a scoped API key through an HTTP redirect.
    followRedirects: false,
    body,
    queryParams,
  });
  if (response.status >= 300 && response.status < 400) {
    throw new Error('Figranium authenticated API requests do not follow redirects');
  }
  return response.body;
}

/** Validate a custom API target before adding the connection's scoped API key. */
export function assertSafeFigraniumApiUrl(baseUrl: string, target: unknown): void {
  if (typeof target !== 'string' || !target || target.trim() !== target) {
    throw new Error('A Figranium API URL is required');
  }
  const base = new URL(baseUrl);
  if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password || base.search || base.hash) {
    throw new Error('The Figranium base URL must be an HTTP(S) server URL without credentials or query parameters');
  }
  if (target.startsWith('//') || target.includes('\\') || /%2f|%5c/i.test(target)) {
    throw new Error('Ambiguous Figranium API URLs are not allowed');
  }
  const absolute = /^[a-z][a-z0-9+.-]*:/i.test(target);
  const fullUrl = absolute
    ? target
    : `${baseUrl.replace(/\/+$/, '')}/${target.replace(/^\/+/, '')}`;
  const destination = new URL(fullUrl);
  const apiPrefix = `${base.pathname.replace(/\/+$/, '')}/api/`;
  if (destination.origin !== base.origin || destination.username || destination.password || !destination.pathname.startsWith(apiPrefix)) {
    throw new Error('Custom API calls must target the configured Figranium server under /api/');
  }
}


export type FigraniumTask = {
  id: string;
  name?: string;
  description?: string;
};

export type FigraniumTaskListResponse = {
  tasks: FigraniumTask[];
};
