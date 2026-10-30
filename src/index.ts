import { createPiece, createAction } from '@activepieces/pieces-framework';
import { PieceCategory } from '@activepieces/shared';
import { createCustomApiCallAction } from '@activepieces/pieces-common';
import { figraniumAuth } from './lib/auth';
import { executeTaskAction } from './lib/actions/execute-task';
import { listTasksAction } from './lib/actions/list-tasks';
import { listExecutionsAction } from './lib/actions/list-executions';
import { assertSafeFigraniumApiUrl } from './lib/common/client';

const baseCustomApiCallAction = createCustomApiCallAction({
  auth: figraniumAuth,
  baseUrl: (auth) => (auth ? auth.props.baseUrl : ''),
  authMapping: async (auth, propsValue) => {
    assertSafeFigraniumApiUrl(auth.props.baseUrl, propsValue['url']?.['url']);
    if (propsValue['followRedirects'] === true) {
      throw new Error('Authenticated Figranium API calls cannot follow redirects');
    }
    return { 'x-api-key': auth.props.apiKey };
  },
});

// The generic action can receive undefined for an older flow's redirect setting.
// Explicitly default to false rather than inheriting the HTTP client's true default.
const safeCustomApiCallAction = createAction({
  auth: figraniumAuth,
  name: 'custom_api_call',
  displayName: 'Custom API Call',
  description: 'Call a same-origin Figranium /api/ endpoint without forwarding API keys on redirects',
  props: baseCustomApiCallAction.props,
  requireAuth: baseCustomApiCallAction.requireAuth,
  errorHandlingOptions: baseCustomApiCallAction.errorHandlingOptions,
  audience: 'human',
  classification: 'WRITE',
  run: async (context) => baseCustomApiCallAction.run({
    ...context,
    propsValue: { ...context.propsValue, followRedirects: context.propsValue.followRedirects ?? false },
  }),
});

export const figranium = createPiece({
  displayName: 'Figranium',
  description: 'Run Figranium Tasks and inspect permitted executions with a scoped API key.',
  auth: figraniumAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl:
    'https://raw.githubusercontent.com/figranium/figranium/0bde46ef4c05ff97a1304313145bdab4138b6a88/public/figranium_icon.svg',
  categories: [PieceCategory.PRODUCTIVITY],
  authors: ['activepieces'],
  actions: [
    executeTaskAction,
    listTasksAction,
    listExecutionsAction,
    safeCustomApiCallAction,
  ],
  triggers: [],
});
