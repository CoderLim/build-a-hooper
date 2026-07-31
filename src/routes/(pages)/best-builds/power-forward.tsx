import { createFileRoute } from '@tanstack/react-router';

import { staticPageRouteOptions } from '../-static-page';

export const Route = createFileRoute('/(pages)/best-builds/power-forward')(
  staticPageRouteOptions(
    'best-builds-power-forward',
    '/best-builds/power-forward'
  )
);
