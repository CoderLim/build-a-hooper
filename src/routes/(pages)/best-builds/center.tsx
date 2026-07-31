import { createFileRoute } from '@tanstack/react-router';

import { staticPageRouteOptions } from '../-static-page';

export const Route = createFileRoute('/(pages)/best-builds/center')(
  staticPageRouteOptions('best-builds-center', '/best-builds/center')
);
