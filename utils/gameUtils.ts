import { Point, Direction } from '../types';
import { GRID_SIZE } from '../constants';

export const getRandomPosition = (snake: Point[]): Point => {
  let position: Point;
  let isOnSnake = true;

  while (isOnSnake) {
    position = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    isOnSnake = snake.some((segment) => segment.x === position.x && segment.y === position.y);
  }
  return position!;
};

export const getOppositeDirection = (dir: Direction): Direction => {
  switch (dir) {
    case Direction.UP: return Direction.DOWN;
    case Direction.DOWN: return Direction.UP;
    case Direction.LEFT: return Direction.RIGHT;
    case Direction.RIGHT: return Direction.LEFT;
  }
};