import { createFileRoute } from '@tanstack/react-router';

import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { Header } from '@/blocks/header';
import { HooperGame } from '@/components/hooper-game/hooper-game';

function GamePage() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header />
      <HooperGame />
    </div>
  );
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
