import { createFileRoute } from '@tanstack/react-router';

import { staticPageRouteOptions } from '../-static-page';

export const Route = createFileRoute('/(pages)/best-builds/small-forward')(
  staticPageRouteOptions('best-builds-small-forward')
);
