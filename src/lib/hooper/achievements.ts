import type { HooperRunView } from '@/modules/hooper/types';
import { ATTRIBUTE_KEYS, GRADE_VALUES } from '@/lib/hooper-game/constants';
import { NEVER_WON_TITLE_ABBRS } from '@/lib/hooper-game/data';
import type {
  AttributeKey,
  GameMode,
  Grade,
  Position,
} from '@/lib/hooper-game/types';

export type AchievementCategory =
  | 'modes'
  | 'competitive_titles'
  | 'positions'
  | 'rookies'
  | 'underdog'
  | 'builds'
  | 'awards'
  | 'legacy';

export type AchievementRarity =
  | 'common'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'special'
  | 'goat';

export interface AchievementProgress {
  current: number;
  target: number;
}

export interface AchievementDefinition {
  id: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  points: number;
  nameKey: string;
  descKey: string;
  check: (ctx: AchievementContext) => boolean;
  progress?: (ctx: AchievementContext) => AchievementProgress | null;
}

export interface AchievementContext {
  runs: HooperRunView[];
  modesPlayed: Set<GameMode>;
  championshipsByMode: Record<GameMode, number>;
  championshipsByPosition: Record<Position, number>;
  chaosBlindChampionships: number;
  careerTripleDoubles: number;
  maxSeasonTripleDoubles: number;
  maxWins: number;
}

export interface AchievementCatalogItem {
  id: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  points: number;
  nameKey: string;
  descKey: string;
  unlocked: boolean;
  unlockedAt: string | null;
  progress: AchievementProgress | null;
}

export interface AchievementStats {
  unlocked: number;
  total: number;
  points: number;
  maxPoints: number;
  progressPercent: number;
  remaining: number;
}

export interface AchievementsResult {
  loggedIn: boolean;
  stats: AchievementStats;
  items: AchievementCatalogItem[];
}

const GRADE_ORDER: Grade[] = [
  'F',
  'D-',
  'D',
  'D+',
  'C-',
  'C',
  'C+',
  'B-',
  'B',
  'B+',
  'A-',
  'A',
  'A+',
];

const POSITIONS: Position[] = ['PG', 'SG', 'SF', 'PF', 'C'];
const MODES: GameMode[] = ['classic', 'blind', 'chaos'];

function gradeAtLeast(grade: Grade, min: Grade) {
  return GRADE_ORDER.indexOf(grade) >= GRADE_ORDER.indexOf(min);
}

function overallAtLeast(overall: number, min: number) {
  return overall >= min;
}

function hasAward(run: HooperRunView, award: string) {
  return run.awards.includes(award);
}

function isChaosOrBlind(mode: string) {
  return mode === 'chaos' || mode === 'blind';
}

function buildGrade(run: HooperRunView, attribute: AttributeKey): Grade | null {
  const item = run.buildSummary.find((entry) => entry.attribute === attribute);
  return item?.grade ?? null;
}

function allBuildGrades(run: HooperRunView): Grade[] {
  return run.buildSummary
    .map((entry) => entry.grade)
    .filter((grade): grade is Grade => Boolean(grade));
}

function countAPlusAttributes(run: HooperRunView) {
  return allBuildGrades(run).filter((grade) => grade === 'A+').length;
}

function hasBuildWith(
  runs: HooperRunView[],
  predicate: (run: HooperRunView) => boolean
) {
  return runs.some(predicate);
}

function championshipCount(
  runs: HooperRunView[],
  filter?: (run: HooperRunView) => boolean
) {
  return runs.filter((run) => run.champion && (!filter || filter(run))).length;
}

function allRookieBuild(run: HooperRunView) {
  return run.rookieCount >= ATTRIBUTE_KEYS.length;
}

function buildContext(runs: HooperRunView[]): AchievementContext {
  const modesPlayed = new Set<GameMode>();
  const championshipsByMode: Record<GameMode, number> = {
    classic: 0,
    blind: 0,
    chaos: 0,
  };
  const championshipsByPosition: Record<Position, number> = {
    PG: 0,
    SG: 0,
    SF: 0,
    PF: 0,
    C: 0,
  };

  for (const run of runs) {
    if (MODES.includes(run.mode as GameMode)) {
      modesPlayed.add(run.mode as GameMode);
    }
    if (run.champion) {
      if (MODES.includes(run.mode as GameMode)) {
        championshipsByMode[run.mode as GameMode] += 1;
      }
      if (run.position && POSITIONS.includes(run.position as Position)) {
        championshipsByPosition[run.position as Position] += 1;
      }
    }
  }

  return {
    runs,
    modesPlayed,
    championshipsByMode,
    championshipsByPosition,
    chaosBlindChampionships: championshipCount(runs, (run) =>
      isChaosOrBlind(run.mode)
    ),
    careerTripleDoubles: runs.reduce((sum, run) => sum + run.tripleDoubles, 0),
    maxSeasonTripleDoubles: runs.reduce(
      (max, run) => Math.max(max, run.tripleDoubles),
      0
    ),
    maxWins: runs.reduce((max, run) => Math.max(max, run.wins), 0),
  };
}

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  {
    id: 'first-blind',
    category: 'modes',
    rarity: 'common',
    points: 10,
    nameKey: 'achievements.items.first_blind.name',
    descKey: 'achievements.items.first_blind.desc',
    check: (ctx) => ctx.modesPlayed.has('blind'),
  },
  {
    id: 'first-chaos',
    category: 'modes',
    rarity: 'common',
    points: 10,
    nameKey: 'achievements.items.first_chaos.name',
    descKey: 'achievements.items.first_chaos.desc',
    check: (ctx) => ctx.modesPlayed.has('chaos'),
  },
  {
    id: 'first-classic',
    category: 'modes',
    rarity: 'common',
    points: 10,
    nameKey: 'achievements.items.first_classic.name',
    descKey: 'achievements.items.first_classic.desc',
    check: (ctx) => ctx.modesPlayed.has('classic'),
  },
  {
    id: 'blind-ring',
    category: 'modes',
    rarity: 'rare',
    points: 30,
    nameKey: 'achievements.items.blind_ring.name',
    descKey: 'achievements.items.blind_ring.desc',
    check: (ctx) => ctx.championshipsByMode.blind > 0,
  },
  {
    id: 'chaos-ring',
    category: 'modes',
    rarity: 'rare',
    points: 30,
    nameKey: 'achievements.items.chaos_ring.name',
    descKey: 'achievements.items.chaos_ring.desc',
    check: (ctx) => ctx.championshipsByMode.chaos > 0,
  },
  {
    id: 'classic-ring',
    category: 'modes',
    rarity: 'rare',
    points: 30,
    nameKey: 'achievements.items.classic_ring.name',
    descKey: 'achievements.items.classic_ring.desc',
    check: (ctx) => ctx.championshipsByMode.classic > 0,
  },
  {
    id: 'ring-collector',
    category: 'competitive_titles',
    rarity: 'rare',
    points: 30,
    nameKey: 'achievements.items.ring_collector.name',
    descKey: 'achievements.items.ring_collector.desc',
    check: (ctx) => ctx.chaosBlindChampionships >= 5,
    progress: (ctx) => ({
      current: Math.min(ctx.chaosBlindChampionships, 5),
      target: 5,
    }),
  },
  {
    id: 'eleven-rings',
    category: 'competitive_titles',
    rarity: 'epic',
    points: 60,
    nameKey: 'achievements.items.eleven_rings.name',
    descKey: 'achievements.items.eleven_rings.desc',
    check: (ctx) => ctx.chaosBlindChampionships >= 11,
    progress: (ctx) => ({
      current: Math.min(ctx.chaosBlindChampionships, 11),
      target: 11,
    }),
  },
  {
    id: 'dynasty-builder',
    category: 'competitive_titles',
    rarity: 'legendary',
    points: 120,
    nameKey: 'achievements.items.dynasty_builder.name',
    descKey: 'achievements.items.dynasty_builder.desc',
    check: (ctx) => ctx.chaosBlindChampionships >= 25,
    progress: (ctx) => ({
      current: Math.min(ctx.chaosBlindChampionships, 25),
      target: 25,
    }),
  },
  {
    id: 'immortal-legacy',
    category: 'competitive_titles',
    rarity: 'legendary',
    points: 120,
    nameKey: 'achievements.items.immortal_legacy.name',
    descKey: 'achievements.items.immortal_legacy.desc',
    check: (ctx) => ctx.chaosBlindChampionships >= 50,
    progress: (ctx) => ({
      current: Math.min(ctx.chaosBlindChampionships, 50),
      target: 50,
    }),
  },
  {
    id: 'paint-monster',
    category: 'positions',
    rarity: 'rare',
    points: 30,
    nameKey: 'achievements.items.paint_monster.name',
    descKey: 'achievements.items.paint_monster.desc',
    check: (ctx) => ctx.championshipsByPosition.C > 0,
  },
  {
    id: 'point-god',
    category: 'positions',
    rarity: 'rare',
    points: 30,
    nameKey: 'achievements.items.point_god.name',
    descKey: 'achievements.items.point_god.desc',
    check: (ctx) => ctx.championshipsByPosition.PG > 0,
  },
  {
    id: 'power-house',
    category: 'positions',
    rarity: 'rare',
    points: 30,
    nameKey: 'achievements.items.power_house.name',
    descKey: 'achievements.items.power_house.desc',
    check: (ctx) => ctx.championshipsByPosition.PF > 0,
  },
  {
    id: 'shooting-star',
    category: 'positions',
    rarity: 'rare',
    points: 30,
    nameKey: 'achievements.items.shooting_star.name',
    descKey: 'achievements.items.shooting_star.desc',
    check: (ctx) => ctx.championshipsByPosition.SG > 0,
  },
  {
    id: 'wing-king',
    category: 'positions',
    rarity: 'rare',
    points: 30,
    nameKey: 'achievements.items.wing_king.name',
    descKey: 'achievements.items.wing_king.desc',
    check: (ctx) => ctx.championshipsByPosition.SF > 0,
  },
  {
    id: 'complete-hooper',
    category: 'positions',
    rarity: 'legendary',
    points: 120,
    nameKey: 'achievements.items.complete_hooper.name',
    descKey: 'achievements.items.complete_hooper.desc',
    check: (ctx) =>
      POSITIONS.every((position) =>
        ctx.runs.some(
          (run) =>
            run.champion &&
            run.position === position &&
            isChaosOrBlind(run.mode)
        )
      ),
    progress: (ctx) => ({
      current: POSITIONS.filter((position) =>
        ctx.runs.some(
          (run) =>
            run.champion &&
            run.position === position &&
            isChaosOrBlind(run.mode)
        )
      ).length,
      target: POSITIONS.length,
    }),
  },
  {
    id: 'rookie-ring',
    category: 'rookies',
    rarity: 'rare',
    points: 30,
    nameKey: 'achievements.items.rookie_ring.name',
    descKey: 'achievements.items.rookie_ring.desc',
    check: (ctx) =>
      ctx.runs.some((run) => run.champion && run.rookieCount >= 1),
  },
  {
    id: 'trust-the-kid',
    category: 'rookies',
    rarity: 'rare',
    points: 30,
    nameKey: 'achievements.items.trust_the_kid.name',
    descKey: 'achievements.items.trust_the_kid.desc',
    check: (ctx) => ctx.runs.some((run) => run.rookieCount >= 1),
  },
  {
    id: 'future-core',
    category: 'rookies',
    rarity: 'epic',
    points: 60,
    nameKey: 'achievements.items.future_core.name',
    descKey: 'achievements.items.future_core.desc',
    check: (ctx) => ctx.runs.some((run) => run.rookieCount >= 5),
  },
  {
    id: 'all-rookie-build',
    category: 'rookies',
    rarity: 'legendary',
    points: 120,
    nameKey: 'achievements.items.all_rookie_build.name',
    descKey: 'achievements.items.all_rookie_build.desc',
    check: (ctx) => ctx.runs.some(allRookieBuild),
  },
  {
    id: 'future-goats',
    category: 'rookies',
    rarity: 'special',
    points: 200,
    nameKey: 'achievements.items.future_goats.name',
    descKey: 'achievements.items.future_goats.desc',
    check: (ctx) =>
      ctx.runs.some(
        (run) => run.champion && isChaosOrBlind(run.mode) && allRookieBuild(run)
      ),
  },
  {
    id: 'underdog-run',
    category: 'underdog',
    rarity: 'epic',
    points: 60,
    nameKey: 'achievements.items.underdog_run.name',
    descKey: 'achievements.items.underdog_run.desc',
    check: (ctx) =>
      ctx.runs.some(
        (run) => isChaosOrBlind(run.mode) && run.overall <= GRADE_VALUES['A-']
      ),
  },
  {
    id: 'underdog-miracle',
    category: 'underdog',
    rarity: 'legendary',
    points: 120,
    nameKey: 'achievements.items.underdog_miracle.name',
    descKey: 'achievements.items.underdog_miracle.desc',
    check: (ctx) =>
      ctx.runs.some(
        (run) =>
          run.champion &&
          isChaosOrBlind(run.mode) &&
          run.overall <= GRADE_VALUES['A-']
      ),
  },
  {
    id: 'clutch-gene',
    category: 'builds',
    rarity: 'rare',
    points: 30,
    nameKey: 'achievements.items.clutch_gene.name',
    descKey: 'achievements.items.clutch_gene.desc',
    check: (ctx) =>
      hasBuildWith(ctx.runs, (run) => {
        const grade = buildGrade(run, 'CLU');
        return grade === 'A+';
      }),
  },
  {
    id: 'elite-build',
    category: 'builds',
    rarity: 'rare',
    points: 30,
    nameKey: 'achievements.items.elite_build.name',
    descKey: 'achievements.items.elite_build.desc',
    check: (ctx) =>
      hasBuildWith(ctx.runs, (run) => run.overall >= GRADE_VALUES['A-']),
  },
  {
    id: 'floor-general',
    category: 'builds',
    rarity: 'rare',
    points: 30,
    nameKey: 'achievements.items.floor_general.name',
    descKey: 'achievements.items.floor_general.desc',
    check: (ctx) =>
      hasBuildWith(ctx.runs, (run) => {
        const pas = buildGrade(run, 'PAS');
        const han = buildGrade(run, 'HAN');
        return Boolean(
          pas && han && gradeAtLeast(pas, 'A') && gradeAtLeast(han, 'A')
        );
      }),
  },
  {
    id: 'sniper-build',
    category: 'builds',
    rarity: 'rare',
    points: 30,
    nameKey: 'achievements.items.sniper_build.name',
    descKey: 'achievements.items.sniper_build.desc',
    check: (ctx) =>
      hasBuildWith(ctx.runs, (run) => {
        const three = buildGrade(run, '3PT');
        const mid = buildGrade(run, 'MID');
        return Boolean(
          three && mid && gradeAtLeast(three, 'A') && gradeAtLeast(mid, 'A')
        );
      }),
  },
  {
    id: 'athletic-freak',
    category: 'builds',
    rarity: 'epic',
    points: 60,
    nameKey: 'achievements.items.athletic_freak.name',
    descKey: 'achievements.items.athletic_freak.desc',
    check: (ctx) =>
      hasBuildWith(ctx.runs, (run) => {
        const ath = buildGrade(run, 'ATH');
        const dnk = buildGrade(run, 'DNK');
        const str = buildGrade(run, 'STR');
        return Boolean(
          ath &&
          dnk &&
          str &&
          gradeAtLeast(ath, 'A') &&
          gradeAtLeast(dnk, 'A') &&
          gradeAtLeast(str, 'A')
        );
      }),
  },
  {
    id: 'balanced-monster',
    category: 'builds',
    rarity: 'epic',
    points: 60,
    nameKey: 'achievements.items.balanced_monster.name',
    descKey: 'achievements.items.balanced_monster.desc',
    check: (ctx) =>
      hasBuildWith(ctx.runs, (run) => {
        const grades = allBuildGrades(run);
        return (
          grades.length > 0 && grades.every((grade) => gradeAtLeast(grade, 'B'))
        );
      }),
  },
  {
    id: 'defensive-wall',
    category: 'builds',
    rarity: 'epic',
    points: 60,
    nameKey: 'achievements.items.defensive_wall.name',
    descKey: 'achievements.items.defensive_wall.desc',
    check: (ctx) =>
      hasBuildWith(ctx.runs, (run) => {
        const attrs: AttributeKey[] = ['PDEF', 'IDEF', 'BLK', 'REB'];
        return attrs.every((attr) => {
          const grade = buildGrade(run, attr);
          return grade ? gradeAtLeast(grade, 'B+') : false;
        });
      }),
  },
  {
    id: 'specialist',
    category: 'builds',
    rarity: 'epic',
    points: 60,
    nameKey: 'achievements.items.specialist.name',
    descKey: 'achievements.items.specialist.desc',
    check: (ctx) =>
      hasBuildWith(ctx.runs, (run) => countAPlusAttributes(run) >= 3),
  },
  {
    id: 'superstar-build',
    category: 'builds',
    rarity: 'epic',
    points: 60,
    nameKey: 'achievements.items.superstar_build.name',
    descKey: 'achievements.items.superstar_build.desc',
    check: (ctx) =>
      hasBuildWith(ctx.runs, (run) => run.overall >= GRADE_VALUES.A),
  },
  {
    id: 'goat-blueprint',
    category: 'builds',
    rarity: 'legendary',
    points: 120,
    nameKey: 'achievements.items.goat_blueprint.name',
    descKey: 'achievements.items.goat_blueprint.desc',
    check: (ctx) =>
      hasBuildWith(ctx.runs, (run) => run.overall >= GRADE_VALUES['A+']),
  },
  {
    id: 'perfect-balance',
    category: 'builds',
    rarity: 'legendary',
    points: 120,
    nameKey: 'achievements.items.perfect_balance.name',
    descKey: 'achievements.items.perfect_balance.desc',
    check: (ctx) =>
      hasBuildWith(ctx.runs, (run) => {
        const grades = allBuildGrades(run);
        return (
          grades.length > 0 && grades.every((grade) => gradeAtLeast(grade, 'A'))
        );
      }),
  },
  {
    id: 'scoring-king',
    category: 'awards',
    rarity: 'rare',
    points: 30,
    nameKey: 'achievements.items.scoring_king.name',
    descKey: 'achievements.items.scoring_king.desc',
    check: (ctx) => ctx.runs.some((run) => hasAward(run, 'Scoring Title')),
  },
  {
    id: 'defensive-anchor',
    category: 'awards',
    rarity: 'epic',
    points: 60,
    nameKey: 'achievements.items.defensive_anchor.name',
    descKey: 'achievements.items.defensive_anchor.desc',
    check: (ctx) => ctx.runs.some((run) => hasAward(run, 'DPOY')),
  },
  {
    id: 'finals-mvp',
    category: 'awards',
    rarity: 'epic',
    points: 60,
    nameKey: 'achievements.items.finals_mvp.name',
    descKey: 'achievements.items.finals_mvp.desc',
    check: (ctx) => ctx.runs.some((run) => hasAward(run, 'Finals MVP')),
  },
  {
    id: 'season-mvp',
    category: 'awards',
    rarity: 'epic',
    points: 60,
    nameKey: 'achievements.items.season_mvp.name',
    descKey: 'achievements.items.season_mvp.desc',
    check: (ctx) => ctx.runs.some((run) => hasAward(run, 'MVP')),
  },
  {
    id: 'complete-superstar',
    category: 'awards',
    rarity: 'legendary',
    points: 120,
    nameKey: 'achievements.items.complete_superstar.name',
    descKey: 'achievements.items.complete_superstar.desc',
    check: (ctx) =>
      ctx.runs.some(
        (run) => hasAward(run, 'MVP') && hasAward(run, 'Finals MVP')
      ),
  },
  {
    id: 'offensive-takeover',
    category: 'awards',
    rarity: 'legendary',
    points: 120,
    nameKey: 'achievements.items.offensive_takeover.name',
    descKey: 'achievements.items.offensive_takeover.desc',
    check: (ctx) =>
      ctx.runs.some(
        (run) => hasAward(run, 'MVP') && hasAward(run, 'Scoring Title')
      ),
  },
  {
    id: 'two-way-monster',
    category: 'awards',
    rarity: 'legendary',
    points: 120,
    nameKey: 'achievements.items.two_way_monster.name',
    descKey: 'achievements.items.two_way_monster.desc',
    check: (ctx) =>
      ctx.runs.some((run) => hasAward(run, 'MVP') && hasAward(run, 'DPOY')),
  },
  {
    id: 'perfect-resume',
    category: 'awards',
    rarity: 'special',
    points: 200,
    nameKey: 'achievements.items.perfect_resume.name',
    descKey: 'achievements.items.perfect_resume.desc',
    check: (ctx) =>
      ctx.runs.some(
        (run) =>
          hasAward(run, 'MVP') &&
          hasAward(run, 'DPOY') &&
          hasAward(run, 'Scoring Title') &&
          hasAward(run, 'Finals MVP')
      ),
  },
  {
    id: 'triple-double-machine',
    category: 'legacy',
    rarity: 'rare',
    points: 30,
    nameKey: 'achievements.items.triple_double_machine.name',
    descKey: 'achievements.items.triple_double_machine.desc',
    check: (ctx) => ctx.runs.some((run) => run.tripleDoubles >= 1),
  },
  {
    id: 'sixty-win-team',
    category: 'legacy',
    rarity: 'epic',
    points: 60,
    nameKey: 'achievements.items.sixty_win_team.name',
    descKey: 'achievements.items.sixty_win_team.desc',
    check: (ctx) => ctx.maxWins >= 60,
    progress: (ctx) => ({
      current: Math.min(ctx.maxWins, 60),
      target: 60,
    }),
  },
  {
    id: 'walking-stat-sheet',
    category: 'legacy',
    rarity: 'epic',
    points: 60,
    nameKey: 'achievements.items.walking_stat_sheet.name',
    descKey: 'achievements.items.walking_stat_sheet.desc',
    check: (ctx) => ctx.careerTripleDoubles >= 5,
    progress: (ctx) => ({
      current: Math.min(ctx.careerTripleDoubles, 5),
      target: 5,
    }),
  },
  {
    id: 'seventy-win-team',
    category: 'legacy',
    rarity: 'legendary',
    points: 120,
    nameKey: 'achievements.items.seventy_win_team.name',
    descKey: 'achievements.items.seventy_win_team.desc',
    check: (ctx) => ctx.maxWins >= 70,
    progress: (ctx) => ({
      current: Math.min(ctx.maxWins, 70),
      target: 70,
    }),
  },
  {
    id: 'brooklyn-guy',
    category: 'legacy',
    rarity: 'legendary',
    points: 120,
    nameKey: 'achievements.items.brooklyn_guy.name',
    descKey: 'achievements.items.brooklyn_guy.desc',
    check: (ctx) =>
      ctx.runs.some((run) => run.champion && run.careerTeamAbbr === 'BKN'),
  },
  {
    id: 'first-banner',
    category: 'legacy',
    rarity: 'legendary',
    points: 120,
    nameKey: 'achievements.items.first_banner.name',
    descKey: 'achievements.items.first_banner.desc',
    check: (ctx) =>
      ctx.runs.some(
        (run) =>
          run.champion &&
          run.careerTeamAbbr &&
          NEVER_WON_TITLE_ABBRS.has(run.careerTeamAbbr)
      ),
  },
  {
    id: 'play-in-miracle',
    category: 'legacy',
    rarity: 'legendary',
    points: 120,
    nameKey: 'achievements.items.play_in_miracle.name',
    descKey: 'achievements.items.play_in_miracle.desc',
    check: (ctx) =>
      ctx.runs.some((run) => run.champion && run.madeThroughPlayIn),
  },
  {
    id: 'triple-double-king',
    category: 'legacy',
    rarity: 'special',
    points: 200,
    nameKey: 'achievements.items.triple_double_king.name',
    descKey: 'achievements.items.triple_double_king.desc',
    check: (ctx) => ctx.maxSeasonTripleDoubles >= 10,
    progress: (ctx) => ({
      current: Math.min(ctx.maxSeasonTripleDoubles, 10),
      target: 10,
    }),
  },
  {
    id: 'finals-comeback',
    category: 'legacy',
    rarity: 'goat',
    points: 300,
    nameKey: 'achievements.items.finals_comeback.name',
    descKey: 'achievements.items.finals_comeback.desc',
    check: (ctx) => ctx.runs.some((run) => run.finalsComeback),
  },
  {
    id: 'seventy-three-nine-club',
    category: 'legacy',
    rarity: 'goat',
    points: 300,
    nameKey: 'achievements.items.seventy_three_nine_club.name',
    descKey: 'achievements.items.seventy_three_nine_club.desc',
    check: (ctx) => ctx.maxWins >= 73,
    progress: (ctx) => ({
      current: Math.min(ctx.maxWins, 73),
      target: 73,
    }),
  },
];

export const TOTAL_ACHIEVEMENT_COUNT = ACHIEVEMENT_DEFINITIONS.length;
export const TOTAL_ACHIEVEMENT_POINTS = ACHIEVEMENT_DEFINITIONS.reduce(
  (sum, item) => sum + item.points,
  0
);

function computeUnlockMap(runs: HooperRunView[]) {
  const sorted = [...runs].sort((a, b) =>
    a.completedAt.localeCompare(b.completedAt)
  );
  const unlockMap = new Map<
    string,
    {
      unlocked: boolean;
      unlockedAt: string | null;
      progress: AchievementProgress | null;
    }
  >();

  for (const def of ACHIEVEMENT_DEFINITIONS) {
    unlockMap.set(def.id, {
      unlocked: false,
      unlockedAt: null,
      progress: def.progress?.(buildContext([])) ?? null,
    });
  }

  for (let index = 0; index < sorted.length; index += 1) {
    const subset = sorted.slice(0, index + 1);
    const ctx = buildContext(subset);
    const latestRun = subset[subset.length - 1]!;

    for (const def of ACHIEVEMENT_DEFINITIONS) {
      const current = unlockMap.get(def.id)!;
      if (current.unlocked) continue;

      const progress = def.progress?.(ctx) ?? null;
      if (def.check(ctx)) {
        unlockMap.set(def.id, {
          unlocked: true,
          unlockedAt: latestRun.completedAt,
          progress,
        });
      } else {
        unlockMap.set(def.id, {
          unlocked: false,
          unlockedAt: null,
          progress,
        });
      }
    }
  }

  const finalCtx = buildContext(sorted);
  for (const def of ACHIEVEMENT_DEFINITIONS) {
    const current = unlockMap.get(def.id)!;
    if (!current.unlocked) {
      unlockMap.set(def.id, {
        ...current,
        progress: def.progress?.(finalCtx) ?? null,
      });
    }
  }

  return unlockMap;
}

export function evaluateAchievements(
  runs: HooperRunView[]
): AchievementsResult {
  const unlockMap = computeUnlockMap(runs);
  const items: AchievementCatalogItem[] = ACHIEVEMENT_DEFINITIONS.map((def) => {
    const state = unlockMap.get(def.id)!;
    return {
      id: def.id,
      category: def.category,
      rarity: def.rarity,
      points: def.points,
      nameKey: def.nameKey,
      descKey: def.descKey,
      unlocked: state.unlocked,
      unlockedAt: state.unlockedAt,
      progress: state.progress,
    };
  });

  const unlockedItems = items.filter((item) => item.unlocked);
  const points = unlockedItems.reduce((sum, item) => sum + item.points, 0);

  return {
    loggedIn: true,
    stats: {
      unlocked: unlockedItems.length,
      total: TOTAL_ACHIEVEMENT_COUNT,
      points,
      maxPoints: TOTAL_ACHIEVEMENT_POINTS,
      progressPercent: Math.round(
        (unlockedItems.length / TOTAL_ACHIEVEMENT_COUNT) * 100
      ),
      remaining: TOTAL_ACHIEVEMENT_COUNT - unlockedItems.length,
    },
    items,
  };
}

export function lockedAchievementCatalog(): AchievementsResult {
  const items: AchievementCatalogItem[] = ACHIEVEMENT_DEFINITIONS.map(
    (def) => ({
      id: def.id,
      category: def.category,
      rarity: def.rarity,
      points: def.points,
      nameKey: def.nameKey,
      descKey: def.descKey,
      unlocked: false,
      unlockedAt: null,
      progress: def.progress?.(buildContext([])) ?? null,
    })
  );

  return {
    loggedIn: false,
    stats: {
      unlocked: 0,
      total: TOTAL_ACHIEVEMENT_COUNT,
      points: 0,
      maxPoints: TOTAL_ACHIEVEMENT_POINTS,
      progressPercent: 0,
      remaining: TOTAL_ACHIEVEMENT_COUNT,
    },
    items,
  };
}
