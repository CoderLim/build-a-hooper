import { createFileRoute } from '@tanstack/react-router';

import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { HooperProfilePage } from '@/components/hooper-leaderboard/profile-page';

function ProfileRoutePage() {
  const { userId } = Route.useParams();
  return <HooperProfilePage userId={userId} />;
}

export const Route = createFileRoute('/profile/$userId')({
  loader: () => {
    const locale = getLocale();
    return {
      title: m['profile.meta.title']({}, { locale }),
    };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: loaderData.title }] : [],
  }),
  component: ProfileRoutePage,
});
