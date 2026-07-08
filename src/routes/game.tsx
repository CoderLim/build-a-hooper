import { createFileRoute } from '@tanstack/react-router';

import { HooperGame } from '@/components/hooper-game/hooper-game';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';

function GamePage() {
  return <HooperGame />;
}

export const Route = createFileRoute('/game')({
  loader: () => {
    const locale = getLocale();
    return {
      title: m['game.meta.title']({}, { locale }),
      description: m['game.meta.description']({}, { locale }),
    };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: loaderData.title },
          { name: 'description', content: loaderData.description },
        ]
      : [],
  }),
  component: GamePage,
});
