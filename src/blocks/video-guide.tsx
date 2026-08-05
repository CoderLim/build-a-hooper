import { getLocale } from '@/paraglide/runtime.js';

const COPY: Record<
  string,
  { eyebrow: string; title: string; description: string; iframeTitle: string }
> = {
  en: {
    eyebrow: 'Video guide',
    title: 'Watch Build a Hooper in action',
    description:
      'See the draft, attribute choices, final reveal, and season flow in one complete Build a Hooper video.',
    iframeTitle: 'Build a Hooper gameplay and guide video',
  },
  zh: {
    eyebrow: '视频指南',
    title: '观看 Build a Hooper 完整流程',
    description:
      '通过视频了解球队抽取、属性选择、最终揭晓与赛季模拟的完整过程。',
    iframeTitle: 'Build a Hooper 玩法与流程视频',
  },
  ja: {
    eyebrow: '動画ガイド',
    title: 'Build a Hooper の流れを動画で見る',
    description:
      'チーム抽選、能力選択、最終公開、シーズンシミュレーションまでの流れを動画で確認できます。',
    iframeTitle: 'Build a Hooper のゲームプレイとガイド動画',
  },
  ko: {
    eyebrow: '동영상 가이드',
    title: 'Build a Hooper 플레이 과정 보기',
    description:
      '팀 추첨, 능력치 선택, 최종 공개와 시즌 시뮬레이션까지 전체 흐름을 영상으로 확인하세요.',
    iframeTitle: 'Build a Hooper 게임 플레이 및 가이드 영상',
  },
};

export function VideoGuide() {
  const locale = getLocale();
  const copy = COPY[locale] ?? COPY.en!;

  return (
    <section className="px-4 pb-20 sm:pb-24" aria-labelledby="video-guide-title">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 text-center">
          <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase">
            {copy.eyebrow}
          </p>
          <h2
            id="video-guide-title"
            className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            {copy.title}
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-base leading-8">
            {copy.description}
          </p>
        </div>

        <div className="border-border bg-card overflow-hidden rounded-3xl border shadow-sm">
          <div className="aspect-video w-full">
            <iframe
              className="size-full"
              src="https://www.youtube-nocookie.com/embed/Nn2TMYg6SYc?rel=0"
              title={copy.iframeTitle}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
