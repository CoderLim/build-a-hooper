import { createFileRoute } from '@tanstack/react-router';

import { staticPageRouteOptions } from '../-static-page';

export const Route = createFileRoute('/(pages)/best-builds/shooting-guard')(
  staticPageRouteOptions('best-builds-shooting-guard')
);
