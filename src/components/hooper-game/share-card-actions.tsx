import { useRef, useState, type RefObject } from 'react';
import { Copy, Download, Loader2, Share2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  buildShareFilename,
  buildShareText,
  buildShareUrl,
  canShareImageFile,
  downloadShareImage,
  exportShareCardImage,
  isShareAbortError,
  openWhatsAppIntent,
  openXIntent,
  shareViaWebShare,
  type ShareCardContext,
} from '@/lib/hooper-game/share-card';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';

interface ShareCardActionsProps extends ShareCardContext {
  previewRef: RefObject<HTMLDivElement | null>;
  disabled?: boolean;
}

function SharePlatformButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex min-w-[72px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-white/4 px-3 py-3 text-[10px] font-bold tracking-[0.12em] text-white uppercase transition',
        'hover:border-orange-300/60 hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-40'
      )}
    >
      {children}
      <span>{label}</span>
    </button>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39a9.86 9.86 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C22 6.45 17.55 2 12.04 2zm0 18.04h-.01a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.14.82.84-3.06-.2-.31a8.08 8.08 0 0 1-1.24-4.32c0-4.46 3.63-8.09 8.1-8.09 2.16 0 4.19.84 5.72 2.37a8.01 8.01 0 0 1 2.36 5.71c0 4.47-3.63 8.1-8.1 8.1zm4.46-6.05c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.01-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.09 3.62.57.25 1.02.4 1.37.51.58.18 1.11.15 1.53.09.47-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" />
    </svg>
  );
}

export function ShareCardActions({
  previewRef,
  disabled,
  ...context
}: ShareCardActionsProps) {
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const copiedTimerRef = useRef<number | null>(null);

  const getSharePayload = () => {
    const text = buildShareText(context);
    const url = buildShareUrl();
    const title = m['game.card.share_text_title']();
    const filename = buildShareFilename(
      context.careerTeam?.name,
      context.overall
    );
    return { text, url, title, filename };
  };

  const exportImage = async () => {
    const node = previewRef.current;
    if (!node) {
      throw new Error('Share card preview is not ready');
    }
    setExporting(true);
    try {
      return await exportShareCardImage(node);
    } finally {
      setExporting(false);
    }
  };

  const handleError = (error: unknown) => {
    if (isShareAbortError(error)) return;
    toast.error(m['game.card.share_error']());
  };

  const handleX = () => {
    try {
      const { text, url } = getSharePayload();
      openXIntent(text, url);
    } catch (error) {
      handleError(error);
    }
  };

  const handleWhatsApp = () => {
    try {
      const { text, url } = getSharePayload();
      openWhatsAppIntent(text, url);
    } catch (error) {
      handleError(error);
    }
  };

  const handleMore = async () => {
    try {
      const { text, url, title, filename } = getSharePayload();
      const blob = await exportImage();
      const file = new File([blob], filename, { type: 'image/png' });
      if (canShareImageFile(file)) {
        await shareViaWebShare({ title, text, url, file });
        return;
      }
      if (navigator.share) {
        await shareViaWebShare({ title, text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text}\n${url}`);
      toast.success(m['game.card.copied']());
    } catch (error) {
      handleError(error);
    }
  };

  const handleCopy = async () => {
    try {
      const { text, url } = getSharePayload();
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      if (copiedTimerRef.current) {
        window.clearTimeout(copiedTimerRef.current);
      }
      copiedTimerRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(m['game.card.share_error']());
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await exportImage();
      const { filename } = getSharePayload();
      downloadShareImage(blob, filename);
    } catch (error) {
      handleError(error);
    }
  };

  const isDisabled = disabled || exporting;

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-[11px] font-bold tracking-[0.22em] text-white/50 uppercase">
        {exporting ? m['game.card.share_preparing']() : m['game.card.share']()}
      </p>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        <SharePlatformButton label="X" onClick={handleX} disabled={isDisabled}>
          <XIcon />
        </SharePlatformButton>
        <SharePlatformButton
          label={m['game.card.share_whatsapp']()}
          onClick={handleWhatsApp}
          disabled={isDisabled}
        >
          <WhatsAppIcon />
        </SharePlatformButton>
        <SharePlatformButton
          label={m['game.card.share_more']()}
          onClick={handleMore}
          disabled={isDisabled}
        >
          <Share2 className="size-5" />
        </SharePlatformButton>
        <SharePlatformButton
          label={copied ? m['game.card.copied']() : m['game.card.share_copy']()}
          onClick={handleCopy}
          disabled={isDisabled}
        >
          <Copy className="size-5" />
        </SharePlatformButton>
        <SharePlatformButton
          label={m['game.card.share_download']()}
          onClick={handleDownload}
          disabled={isDisabled}
        >
          {exporting ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Download className="size-5" />
          )}
        </SharePlatformButton>
      </div>
    </div>
  );
}
