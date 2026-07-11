import { toBlob } from 'html-to-image';

import { envConfigs } from '@/config/index';
import type {
  GameMode,
  Position,
  SeasonStats,
  TeamSeason,
} from '@/lib/hooper-game/types';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1350;

export interface ShareCardContext {
  mode: GameMode | null;
  position: Position | null;
  showPosition: boolean;
  careerTeam: TeamSeason | null;
  seasonStats: SeasonStats;
  overall: number;
}

export function buildShareUrl(): string {
  const base = (
    envConfigs.app_url ||
    (typeof window !== 'undefined' ? window.location.origin : '')
  ).replace(/\/$/, '');
  const prefix = getLocale() === 'zh' ? '/zh' : '';
  return `${base}${prefix}/game`;
}

function modeLabel(mode: GameMode | null): string {
  if (!mode) return '';
  if (mode === 'classic') return m['game.mode.classic']();
  if (mode === 'blind') return m['game.mode.blind']();
  return m['game.mode.chaos']();
}

export function buildShareText(context: ShareCardContext): string {
  const { position, showPosition, careerTeam, seasonStats, overall, mode } =
    context;
  const pos = showPosition && position ? position : '??';
  const team = careerTeam?.name ?? m['game.card.free_agent']();
  const record = `${seasonStats.wins}-${seasonStats.losses}`;
  const url = buildShareUrl();
  const modeText = modeLabel(mode);

  return [
    m['game.card.share_text_title'](),
    modeText ? m['game.card.share_text_mode']({ mode: modeText }) : '',
    m['game.card.share_text_line']({
      team,
      position: pos,
      overall: String(overall),
      record,
    }),
    m['game.card.share_text_stats']({
      ppg: String(seasonStats.ppg),
      apg: String(seasonStats.apg),
      rpg: String(seasonStats.rpg),
    }),
    m['game.card.share_text_playoffs']({ result: seasonStats.playoffResult }),
    seasonStats.awards.length > 0
      ? m['game.card.share_text_awards']({
          awards: seasonStats.awards.join(', '),
        })
      : '',
    seasonStats.fmvp ? m['game.card.fmvp']() : '',
    m['game.card.share_text_cta']({ url }),
  ]
    .filter(Boolean)
    .join('\n');
}

export function buildShareFilename(
  team: string | undefined,
  overall: number
): string {
  const slug = (team ?? 'free-agent')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `build-a-hooper-card-${slug || 'card'}-${overall}.png`;
}

export async function exportShareCardImage(node: HTMLElement): Promise<Blob> {
  const blob = await toBlob(node, {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    pixelRatio: 1,
    cacheBust: true,
    backgroundColor: '#0a0a0a',
  });
  if (!blob) {
    throw new Error('Failed to export share card image');
  }
  return blob;
}

export function downloadShareImage(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function canShareImageFile(file: File): boolean {
  if (
    typeof navigator === 'undefined' ||
    !navigator.share ||
    !navigator.canShare
  ) {
    return false;
  }
  try {
    return navigator.canShare({ files: [file] });
  } catch {
    return false;
  }
}

export async function shareViaWebShare(input: {
  title: string;
  text: string;
  url: string;
  file?: File;
}): Promise<void> {
  const payload: ShareData = {
    title: input.title,
    text: input.text,
    url: input.url,
  };
  if (input.file) {
    payload.files = [input.file];
  }
  await navigator.share(payload);
}

export function openXIntent(text: string, url: string): void {
  const shareText = `${text}\n${url}`;
  const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const anchor = document.createElement('a');
  anchor.href = intentUrl;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  anchor.click();
}

export function openWhatsAppIntent(text: string, url: string): void {
  const shareText = `${text}\n${url}`;
  const intentUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const anchor = document.createElement('a');
  anchor.href = intentUrl;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  anchor.click();
}

export function isShareAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}
