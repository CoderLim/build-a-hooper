import { forwardRef } from 'react';

import { ATTRIBUTE_KEYS } from '@/lib/hooper-game/constants';
import type {
  BuildSlot,
  Position,
  SeasonStats,
  TeamSeason,
} from '@/lib/hooper-game/types';
import { m } from '@/paraglide/messages.js';

interface ShareCardPreviewProps {
  buildSlots: BuildSlot[];
  position: Position | null;
  showPosition: boolean;
  careerTeam: TeamSeason | null;
  seasonStats: SeasonStats;
  overall: number;
}

function gradeColor(grade?: string): string {
  if (!grade) return '#ffffff4d';
  if (grade.startsWith('A')) return '#34d399';
  if (grade.startsWith('B')) return '#fdba74';
  if (grade.startsWith('C')) return '#facc15';
  return '#f87171';
}

export const ShareCardPreview = forwardRef<
  HTMLDivElement,
  ShareCardPreviewProps
>(function ShareCardPreview(
  { buildSlots, position, showPosition, careerTeam, seasonStats, overall },
  ref
) {
  const lockedSlots = buildSlots.filter((slot) => slot.locked);
  const posLabel = showPosition && position ? position : '??';

  return (
    <div
      ref={ref}
      style={{
        width: 1080,
        height: 1350,
        boxSizing: 'border-box',
        padding: 72,
        background:
          'linear-gradient(135deg, rgba(253, 186, 116, 0.12) 0%, rgba(255,255,255,0.03) 45%, rgba(10,10,10,1) 100%)',
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <p
          style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(253, 186, 116, 0.9)',
          }}
        >
          {m['game.card.eyebrow']()}
        </p>
        <h2
          style={{
            margin: '16px 0 0',
            fontSize: 52,
            fontWeight: 900,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
          }}
        >
          {m['game.card.title']()}
        </h2>
      </div>

      <div
        style={{
          marginTop: 48,
          borderRadius: 32,
          border: '1px solid rgba(253, 186, 116, 0.3)',
          padding: 48,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 24,
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 18,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              {careerTeam?.name ?? m['game.card.free_agent']()}
            </p>
            <p
              style={{
                margin: '8px 0 0',
                fontSize: 88,
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              {posLabel}
            </p>
            <p
              style={{
                margin: '8px 0 0',
                fontSize: 34,
                fontWeight: 800,
                color: '#fdba74',
              }}
            >
              OVR {overall}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p
              style={{
                margin: 0,
                fontSize: 64,
                fontWeight: 900,
                color: '#34d399',
                lineHeight: 1,
              }}
            >
              {seasonStats.wins}-{seasonStats.losses}
            </p>
            <p
              style={{
                margin: '8px 0 0',
                fontSize: 16,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              {m['game.card.record']()}
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: 40,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
          }}
        >
          {[
            [seasonStats.ppg, 'PPG'],
            [seasonStats.apg, 'APG'],
            [seasonStats.rpg, 'RPG'],
          ].map(([val, label]) => (
            <div
              key={String(label)}
              style={{
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(0,0,0,0.2)',
                padding: '20px 12px',
                textAlign: 'center',
              }}
            >
              <p style={{ margin: 0, fontSize: 34, fontWeight: 900 }}>{val}</p>
              <p
                style={{
                  margin: '6px 0 0',
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.4)',
                }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32, fontSize: 24, lineHeight: 1.5 }}>
          <p style={{ margin: 0 }}>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>
              {m['game.card.playoffs']()}:{' '}
            </span>
            <span style={{ fontWeight: 700 }}>{seasonStats.playoffResult}</span>
          </p>
          {seasonStats.awards.length > 0 && (
            <p style={{ margin: '12px 0 0' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>
                {m['game.card.awards']()}:{' '}
              </span>
              <span style={{ fontWeight: 700 }}>
                {seasonStats.awards.join(', ')}
              </span>
            </p>
          )}
          {seasonStats.fmvp && (
            <p
              style={{
                margin: '12px 0 0',
                fontWeight: 800,
                color: '#fdba74',
              }}
            >
              {m['game.card.fmvp']()}
            </p>
          )}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 32 }}>
          <p
            style={{
              margin: '0 0 16px',
              fontSize: 16,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            Build
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12,
            }}
          >
            {ATTRIBUTE_KEYS.map((attr) => {
              const slot =
                lockedSlots.find((item) => item.attribute === attr) ??
                buildSlots.find((item) => item.attribute === attr);
              const locked = Boolean(slot?.locked);
              return (
                <div
                  key={attr}
                  style={{
                    borderRadius: 14,
                    border: locked
                      ? '1px solid rgba(253, 186, 116, 0.3)'
                      : '1px solid rgba(255,255,255,0.1)',
                    background: locked
                      ? 'rgba(253, 186, 116, 0.08)'
                      : 'rgba(0,0,0,0.2)',
                    padding: '12px 14px',
                    minHeight: 72,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: 'rgba(255,255,255,0.7)',
                      }}
                    >
                      {attr}
                    </span>
                    <span
                      style={{
                        fontSize: 18,
                        fontWeight: 900,
                        color: locked ? gradeColor(slot?.grade) : '#ffffff4d',
                      }}
                    >
                      {locked ? slot?.grade : '—'}
                    </span>
                  </div>
                  {locked && slot?.playerName && (
                    <p
                      style={{
                        margin: '8px 0 0',
                        fontSize: 13,
                        color: 'rgba(255,255,255,0.55)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      R{slot.round} · {slot.playerName}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <p
        style={{
          margin: '32px 0 0',
          textAlign: 'center',
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(253, 186, 116, 0.85)',
        }}
      >
        buildahooper.org
      </p>
    </div>
  );
});
