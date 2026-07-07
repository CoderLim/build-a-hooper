import type { AttributeKey, GameMode, Position } from './types';

export const ATTRIBUTE_KEYS: AttributeKey[] = [
  '3PT',
  'MID',
  'FIN',
  'DNK',
  'HAN',
  'PAS',
  'PDEF',
  'IDEF',
  'BLK',
  'REB',
  'ATH',
  'STR',
  'CLU',
];

export const POSITIONS: Position[] = ['PG', 'SG', 'SF', 'PF', 'C'];

export const REROLLS_BY_MODE: Record<GameMode, number> = {
  classic: 3,
  blind: 1,
  chaos: 1,
};

export const GRADE_VALUES: Record<string, number> = {
  'A+': 97,
  A: 93,
  'A-': 90,
  'B+': 87,
  B: 83,
  'B-': 80,
  'C+': 77,
  C: 73,
  'C-': 70,
  'D+': 67,
  D: 63,
  'D-': 60,
  F: 50,
};

export const GRADES = Object.keys(GRADE_VALUES) as (keyof typeof GRADE_VALUES)[];
