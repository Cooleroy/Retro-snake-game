import React from 'react';
import GameBoard from './components/GameBoard';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black">
      {/* Decorative background grid lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20" 
           style={{ 
             backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }}
      ></div>
      
      <div className="z-10 w-full">
        <GameBoard />
      </div>

      <footer className="absolute bottom-4 text-zinc-700 text-xs font-mono">
        NEON SYSTEM v1.0
      </footer>
    </div>
  );
};

export default App;