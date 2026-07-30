import { createFileRoute, redirect } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import { getLocale, localizeUrl } from '@/paraglide/runtime.js';

export const Route = createFileRoute('/game')({
  beforeLoad: () => {
    const locale = getLocale();
    const href = localizeUrl(`${envConfigs.app_url}/`, { locale }).href;
    throw redirect({ href, statusCode: 301 });
  },
  component: () => null,
});
