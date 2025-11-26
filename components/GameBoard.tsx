import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameStatus, Direction, Point } from '../types';
import { GRID_SIZE, INITIAL_SPEED, SPEED_DECREMENT, MIN_SPEED, INITIAL_SNAKE, INITIAL_DIRECTION, SCORE_INCREMENT, KEY_MAP } from '../constants';
import { useInterval } from '../hooks/useInterval';
import { getRandomPosition, getOppositeDirection } from '../utils/gameUtils';
import { initAudio, playEatSound, playGameOverSound } from '../utils/audio';
import GridCell from './GridCell';
import Controls from './Controls';

const GameBoard: React.FC = () => {
  // Game State
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  // Refs for state that changes frequently to avoid dependency loops in callbacks
  const directionRef = useRef(INITIAL_DIRECTION);
  const lastProcessedDirectionRef = useRef(INITIAL_DIRECTION);

  // Initialize High Score
  useEffect(() => {
    const stored = localStorage.getItem('neonSnakeHighScore');
    if (stored) setHighScore(parseInt(stored, 10));
    // Set initial random food that isn't on snake
    setFood(getRandomPosition(INITIAL_SNAKE));
  }, []);

  // Update high score when score changes
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('neonSnakeHighScore', score.toString());
    }
  }, [score, highScore]);

  // Handle Game Over
  const gameOver = useCallback(() => {
    playGameOverSound();
    setStatus(GameStatus.GAME_OVER);
  }, []);

  // Reset Game
  const resetGame = () => {
    initAudio(); // Initialize audio context on user interaction
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    lastProcessedDirectionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setStatus(GameStatus.PLAYING);
    setFood(getRandomPosition(INITIAL_SNAKE));
  };

  // Main Game Loop
  const gameLoop = useCallback(() => {
    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const currentDir = directionRef.current;
      lastProcessedDirectionRef.current = currentDir;

      const newHead = { ...head };

      // Move Head
      switch (currentDir) {
        case Direction.UP:
          newHead.y -= 1;
          break;
        case Direction.DOWN:
          newHead.y += 1;
          break;
        case Direction.LEFT:
          newHead.x -= 1;
          break;
        case Direction.RIGHT:
          newHead.x += 1;
          break;
      }

      // 1. Check Wall Collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        gameOver();
        return prevSnake;
      }

      // 2. Check Self Collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        gameOver();
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // 3. Check Food
      if (newHead.x === food.x && newHead.y === food.y) {
        playEatSound();
        setScore((s) => s + SCORE_INCREMENT);
        setSpeed((s) => Math.max(MIN_SPEED, s - SPEED_DECREMENT));
        setFood(getRandomPosition(newSnake));
        // Don't pop the tail, so it grows
      } else {
        newSnake.pop(); // Remove tail
      }

      return newSnake;
    });
  }, [food, gameOver]);

  // Tick Driver
  useInterval(
    gameLoop,
    status === GameStatus.PLAYING ? speed : null
  );

  // Input Handling
  const changeDirection = useCallback((newDir: Direction) => {
    // Prevent 180 degree turns on the current axis based on the LAST PROCESSED frame
    // This prevents the "suicide" bug where you press two keys quickly before a tick
    const opposite = getOppositeDirection(lastProcessedDirectionRef.current);
    if (newDir !== opposite) {
      directionRef.current = newDir;
      setDirection(newDir);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (status === GameStatus.IDLE || status === GameStatus.GAME_OVER) {
        if (e.key === 'Enter' || e.key === ' ') {
          resetGame();
        }
        return;
      }

      if (e.key === ' ' || e.key === 'Escape') {
         setStatus(prev => prev === GameStatus.PLAYING ? GameStatus.PAUSED : GameStatus.PLAYING);
         return;
      }

      if (status === GameStatus.PLAYING) {
        const mappedDir = KEY_MAP[e.key as keyof typeof KEY_MAP];
        if (mappedDir) {
          changeDirection(mappedDir);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, changeDirection]);


  // Rendering Helpers
  const renderGrid = () => {
    const cells = [];
    // We iterate rows then columns (y then x)
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        let isSnake = false;
        let isHead = false;
        let isFood = (food.x === x && food.y === y);

        const snakeIndex = snake.findIndex(s => s.x === x && s.y === y);
        if (snakeIndex !== -1) {
          isSnake = true;
          if (snakeIndex === 0) isHead = true;
        }

        cells.push(
          <GridCell 
            key={`${x}-${y}`} 
            isSnake={isSnake} 
            isHead={isHead} 
            isFood={isFood} 
          />
        );
      }
    }
    return cells;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-4">
      {/* HUD */}
      <div className="flex justify-between w-full mb-4 px-2 font-mono text-green-400">
        <div className="flex flex-col">
          <span className="text-xs text-zinc-500 uppercase tracking-widest">Score</span>
          <span className="text-2xl font-bold neon-text-shadow">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-zinc-500 uppercase tracking-widest">High Score</span>
          <span className="text-2xl font-bold text-pink-500 neon-text-shadow">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      {/* Game Board Container */}
      <div className="relative p-1 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-2xl border border-zinc-700">
        
        {/* The Grid */}
        <div 
          className="grid gap-px bg-zinc-950/80 p-2 rounded-lg"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(90vw, 400px)',
            height: 'min(90vw, 400px)'
          }}
        >
          {renderGrid()}
        </div>

        {/* Overlays */}
        {status === GameStatus.IDLE && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-sm rounded-lg z-20">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-4 neon-text-shadow tracking-tighter">
              NEON SNAKE
            </h1>
            <button 
              onClick={resetGame}
              className="px-8 py-3 bg-green-500 text-black font-bold rounded hover:bg-green-400 transition-all neon-box-shadow animate-pulse"
            >
              START GAME
            </button>
            <p className="mt-4 text-xs text-zinc-500">Arrows / WASD to move</p>
          </div>
        )}

        {status === GameStatus.PAUSED && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/60 backdrop-blur-sm rounded-lg z-20">
            <h2 className="text-3xl font-bold text-white mb-4 tracking-widest">PAUSED</h2>
            <button 
              onClick={() => setStatus(GameStatus.PLAYING)}
              className="px-6 py-2 border border-green-500 text-green-500 font-mono hover:bg-green-500 hover:text-black transition-colors"
            >
              RESUME
            </button>
          </div>
        )}

        {status === GameStatus.GAME_OVER && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 backdrop-blur-md rounded-lg z-20">
            <h2 className="text-4xl font-bold text-pink-500 mb-2 neon-text-shadow">GAME OVER</h2>
            <p className="text-zinc-300 mb-6 font-mono">Final Score: {score}</p>
            <button 
              onClick={resetGame}
              className="px-8 py-3 bg-white text-black font-bold rounded hover:bg-zinc-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            >
              TRY AGAIN
            </button>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <div className="md:hidden">
        <Controls onDirectionChange={changeDirection} />
      </div>

      {/* Instructions */}
      <div className="hidden md:block mt-8 text-center text-zinc-600 text-sm font-mono">
        <p>Use <span className="text-zinc-400">Arrow Keys</span> or <span className="text-zinc-400">WASD</span> to move</p>
        <p>Press <span className="text-zinc-400">Space</span> to pause</p>
      </div>
    </div>
  );
};

export default GameBoard;