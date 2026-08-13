import { Link } from '@/core/i18n/navigation';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';

const SECTIONS = [
  ['landing.guide.attributes_title', 'landing.guide.attributes_body'],
  ['landing.guide.modes_title', 'landing.guide.modes_body'],
  ['landing.guide.season_title', 'landing.guide.season_body'],
  ['landing.guide.beginner_title', 'landing.guide.beginner_body'],
  ['landing.guide.search_title', 'landing.guide.search_body'],
] as const;

const CREATE_A_HOOPER_PHRASE = 'Create a Hooper';
const CREATE_A_HOOPER_HREF = '/create-a-hooper';
const BUILD_A_BUCKET_HREF = '/build-a-bucket-nba-game';
const MAX_OVR_HREF = '/blog/build-a-hooper-99-overall';

const linkClass =
  'text-primary font-semibold underline decoration-primary/30 underline-offset-4 transition hover:decoration-primary';

function TextWithCreateAHooperLink({ text }: { text: string }) {
  const idx = text.indexOf(CREATE_A_HOOPER_PHRASE);
  if (idx === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, idx)}
      <Link href={CREATE_A_HOOPER_HREF} className={linkClass}>
        {CREATE_A_HOOPER_PHRASE}
      </Link>
      {text.slice(idx + CREATE_A_HOOPER_PHRASE.length)}
    </>
  );
}

export function Guide() {
  const locale = getLocale();

  return (
    <section id="guide" className="px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12">
          <h2 className="font-serif text-4xl tracking-tight sm:text-5xl">
            {m['landing.guide.title']()}
          </h2>
          <p className="text-muted-foreground mt-6 text-base leading-8 sm:text-lg">
            {m['landing.guide.intro']()}
          </p>
        </div>

        <div className="space-y-10">
          {SECTIONS.map(([titleKey, bodyKey]) => (
            <article key={titleKey} className="space-y-4">
              <h3 className="text-2xl font-semibold tracking-tight">
                {m[titleKey]()}
              </h3>
              <p className="text-muted-foreground text-base leading-8">
                {bodyKey === 'landing.guide.search_body' ? (
                  <>
                    <TextWithCreateAHooperLink text={m[bodyKey]()} />
                    {locale === 'en' && (
                      <>
                        {' '}Players comparing related NBA player-builder formats
                        can also read our{' '}
                        <Link href={BUILD_A_BUCKET_HREF} className={linkClass}>
                          Build a Bucket NBA Game guide
                        </Link>{' '}
                        for a verified overview of Build-A-Bucket&apos;s Guard/Big
                        paths, NBA player spins, and season simulation. If your
                        goal is the rating ceiling, read our{' '}
                        <Link href={MAX_OVR_HREF} className={linkClass}>
                          Build a Hooper 99 Overall guide
                        </Link>{' '}
                        to see why individual 99 ratings still lead to a verified
                        97 OVR maximum.
                      </>
                    )}
                  </>
                ) : (
                  m[bodyKey]()
                )}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
