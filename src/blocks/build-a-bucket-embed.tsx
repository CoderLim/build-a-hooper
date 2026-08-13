const OFFICIAL_GAME_URL = 'https://build-a-player.com/bucket';

export function BuildABucketEmbed() {
  return (
    <section
      aria-label="Build a Bucket NBA Game"
      className="border-border bg-background border-b pt-20 sm:pt-24"
    >
      <div className="mx-auto w-full max-w-[1600px] px-2 sm:px-4">
        <div className="border-border bg-muted/20 overflow-hidden rounded-2xl border shadow-sm">
          <iframe
            src={OFFICIAL_GAME_URL}
            title="Build a Bucket NBA Game"
            className="h-[calc(100vh-7rem)] min-h-[680px] w-full bg-white"
            allow="fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <p className="text-muted-foreground py-3 text-center text-xs sm:text-sm">
          Embedded from the official Build-A-Bucket page. If the game does not
          load inside the frame,{' '}
          <a
            href={OFFICIAL_GAME_URL}
            target="_blank"
            rel="noreferrer"
            className="text-primary font-semibold underline underline-offset-4"
          >
            open the official game
          </a>
          .
        </p>
      </div>
    </section>
  );
}
