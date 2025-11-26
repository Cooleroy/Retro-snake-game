import React from 'react';
import { Direction } from '../types';

interface ControlsProps {
  onDirectionChange: (dir: Direction) => void;
}

const Controls: React.FC<ControlsProps> = ({ onDirectionChange }) => {
  const btnClass = "w-16 h-16 bg-zinc-800 rounded-xl flex items-center justify-center text-2xl text-green-400 border border-zinc-700 active:bg-zinc-700 active:border-green-500 transition-colors touch-manipulation shadow-lg";

  return (
    <div className="grid grid-cols-3 gap-2 mt-6 select-none">
      <div className="col-start-2">
        <button 
          className={btnClass} 
          onPointerDown={(e) => { e.preventDefault(); onDirectionChange(Direction.UP); }}
          aria-label="Up"
        >
          ▲
        </button>
      </div>
      <div className="col-start-1 row-start-2">
        <button 
          className={btnClass} 
          onPointerDown={(e) => { e.preventDefault(); onDirectionChange(Direction.LEFT); }}
          aria-label="Left"
        >
          ◀
        </button>
      </div>
      <div className="col-start-2 row-start-2">
        <button 
          className={btnClass} 
          onPointerDown={(e) => { e.preventDefault(); onDirectionChange(Direction.DOWN); }}
          aria-label="Down"
        >
          ▼
        </button>
      </div>
      <div className="col-start-3 row-start-2">
        <button 
          className={btnClass} 
          onPointerDown={(e) => { e.preventDefault(); onDirectionChange(Direction.RIGHT); }}
          aria-label="Right"
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default Controls;