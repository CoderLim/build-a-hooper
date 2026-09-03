// Paraglide continues to compile every configured locale so translations can
// be re-enabled without rebuilding the localization layer. Public surfaces use
// this allowlist to decide which locales may be selected, indexed, or listed.
export const publicLocales = ['en'] as const;

// Requests using these old public prefixes permanently redirect to English.
// Move a locale from this list to publicLocales when its translations are ready.
export const retiredLocalePrefixes = ['zh', 'ja', 'ko'] as const;

// Locale display names for the language switcher UI.
export const localeNames: Record<string, string> = {
  en: 'English',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
};
