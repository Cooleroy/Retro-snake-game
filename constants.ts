import { Direction } from './types';

export const GRID_SIZE = 20; // 20x20 grid
export const INITIAL_SPEED = 150; // ms per tick
export const MIN_SPEED = 60; // Max speed cap (lower ms = faster)
export const SPEED_DECREMENT = 2; // Speed increase per food
export const SCORE_INCREMENT = 10;

export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];

export const INITIAL_DIRECTION = Direction.UP;

// Keyboard mappings
export const KEY_MAP = {
  ArrowUp: Direction.UP,
  w: Direction.UP,
  ArrowDown: Direction.DOWN,
  s: Direction.DOWN,
  ArrowLeft: Direction.LEFT,
  a: Direction.LEFT,
  ArrowRight: Direction.RIGHT,
  d: Direction.RIGHT,
};