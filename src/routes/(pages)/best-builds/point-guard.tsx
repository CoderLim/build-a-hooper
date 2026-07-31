import { createFileRoute } from '@tanstack/react-router';

import { staticPageRouteOptions } from '../-static-page';

export const Route = createFileRoute('/(pages)/best-builds/point-guard')(
  staticPageRouteOptions('best-builds-point-guard', '/best-builds/point-guard')
);
