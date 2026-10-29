import { createPiece } from '@activepieces/pieces-framework';
import { PieceCategory } from '@activepieces/shared';
import { createCustomApiCallAction } from '@activepieces/pieces-common';
import { figraniumAuth } from './lib/auth';
import { executeTaskAction } from './lib/actions/execute-task';
import { listTasksAction } from './lib/actions/list-tasks';
import { listExecutionsAction } from './lib/actions/list-executions';

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
    createCustomApiCallAction({
      auth: figraniumAuth,
      baseUrl: (auth) => (auth ? auth.props.baseUrl : ''),
      authMapping: async (auth) => ({
        'x-api-key': auth.props.apiKey,
      }),
    }),
  ],
  triggers: [],
});
