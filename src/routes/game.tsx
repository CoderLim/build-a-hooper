import { createFileRoute } from '@tanstack/react-router';

import { buildPageHead } from '@/lib/seo/metadata';
import { m } from '@/paraglide/messages.js';
import { getLocale, locales } from '@/paraglide/runtime.js';
import { GameGuide } from '@/blocks/game-guide';
import { Header } from '@/blocks/header';
import { HooperGame } from '@/components/hooper-game/hooper-game';

function GamePage() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col">
        <HooperGame />
        <GameGuide />
      </main>
    </div>
  );
}

export const Route = createFileRoute('/game')({
  loader: () => {
    const locale = getLocale();
    return {
      locale,
      title: m['game.meta.title']({}, { locale }),
      description: m['game.meta.description']({}, { locale }),
    };
  },
  head: ({ loaderData }) =>
    loaderData
      ? buildPageHead({
          title: loaderData.title,
          description: loaderData.description,
          path: '/game',
          locale: loaderData.locale,
          alternateLocales: locales,
        })
      : {},
  component: GamePage,
});
