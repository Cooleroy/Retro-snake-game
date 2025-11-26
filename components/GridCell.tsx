import React, { memo } from 'react';

interface GridCellProps {
  isSnake: boolean;
  isHead: boolean;
  isFood: boolean;
}

const GridCell: React.FC<GridCellProps> = ({ isSnake, isHead, isFood }) => {
  let baseClass = "w-full h-full border border-zinc-900/50 rounded-sm transition-all duration-75";
  
  if (isHead) {
    return <div className={`${baseClass} bg-green-400 neon-box-shadow scale-105 z-10 relative`}></div>;
  }
  
  if (isSnake) {
    return <div className={`${baseClass} bg-green-600/80 shadow-[0_0_5px_rgba(34,197,94,0.3)]`}></div>;
  }
  
  if (isFood) {
    return (
      <div className={`${baseClass} relative flex items-center justify-center`}>
        <div className="w-3/4 h-3/4 bg-pink-500 rounded-full neon-food-shadow animate-pulse"></div>
      </div>
    );
  }

  return <div className={`${baseClass} bg-zinc-900/30`}></div>;
};

export default memo(GridCell);