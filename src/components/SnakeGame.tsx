import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Square, Trophy, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 150;

interface SnakeGameProps {
  score: number;
  highScore: number;
  onScoreChange: (score: number) => void;
  onHighScoreChange: (highScore: number) => void;
}

export default function SnakeGame({ score, highScore, onScoreChange, onHighScoreChange }: SnakeGameProps) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [dir, setDir] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: {x: number, y: number}[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const newHead = {
        x: (prevSnake[0].x + dir.x + GRID_SIZE) % GRID_SIZE,
        y: (prevSnake[0].y + dir.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        setIsPaused(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        onScoreChange(score + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [dir, food, isGameOver, isPaused, generateFood, score, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W': if (dir.y === 0) setDir({ x: 0, y: -1 }); break;
        case 'ArrowDown':
        case 's':
        case 'S': if (dir.y === 0) setDir({ x: 0, y: 1 }); break;
        case 'ArrowLeft':
        case 'a':
        case 'A': if (dir.x === 0) setDir({ x: -1, y: 0 }); break;
        case 'ArrowRight':
        case 'd':
        case 'D': if (dir.x === 0) setDir({ x: 1, y: 0 }); break;
        case ' ': e.preventDefault(); setIsPaused(p => !p); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dir]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = window.setInterval(moveSnake, SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPaused, isGameOver, moveSnake]);

  useEffect(() => {
    if (score > highScore) onHighScoreChange(score);
  }, [score, highScore, onHighScoreChange]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDir(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    onScoreChange(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  return (
    <div className="relative group w-full flex-1 flex flex-col items-center justify-center">
      <div className="absolute -inset-1 bg-gradient-to-tr from-neon-cyan to-neon-pink rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
      
      <div 
        className="relative h-full w-full bg-panel-bg border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center p-4 min-h-[400px]"
      >
        <div 
          className="relative grid bg-black/40 rounded-lg overflow-hidden"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: 'min(75vw, 440px)',
            height: 'min(75vw, 440px)'
          }}
        >
          {/* Grid Lines Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ 
              backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
              backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
            }} 
          />

          {/* Render Snake */}
          {snake.map((segment, i) => (
            <motion.div
              key={`${i}-${segment.x}-${segment.y}`}
              initial={false}
              className={`absolute rounded-sm ${i === 0 ? 'bg-neon-cyan z-10 scale-110 shadow-[0_0_15px_rgba(34,211,238,0.8)]' : 'bg-neon-cyan/40'}`}
              style={{
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                left: `${(segment.x / GRID_SIZE) * 100}%`,
                top: `${(segment.y / GRID_SIZE) * 100}%`,
                margin: '1px'
              }}
            />
          ))}

          {/* Render Food */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute bg-neon-pink rounded-full shadow-[0_0_15px_rgba(217,70,239,0.8)] z-20 animate-bounce"
            style={{
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              left: `${(food.x / GRID_SIZE) * 100}%`,
              top: `${(food.y / GRID_SIZE) * 100}%`,
              margin: '1px'
            }}
          />

          <AnimatePresence>
            {(isPaused || isGameOver) && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md"
              >
                {isGameOver ? (
                  <div className="flex flex-col items-center gap-6">
                    <div className="text-center">
                      <p className="text-[10px] tracking-[0.4em] uppercase text-neon-pink mb-2">Simulation Terminated</p>
                      <h2 className="text-4xl font-black italic tracking-tighter neon-text-pink">GAME OVER</h2>
                    </div>
                    <button 
                      onClick={resetGame}
                      className="flex items-center gap-2 px-8 py-3 bg-neon-pink text-white rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(217,70,239,0.4)]"
                    >
                      <RefreshCcw className="w-5 h-5" />
                      REINITIALIZE
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="w-20 h-20 flex items-center justify-center bg-white text-black rounded-full hover:scale-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] group-active:shadow-inner"
                  >
                    <Play className="w-10 h-10 fill-current ml-1" />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls Overlay */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-[10px] tracking-[0.2em] uppercase text-white/40 whitespace-nowrap">
          <span>[W][A][S][D] Move</span>
          <span className="text-white/10">|</span>
          <span>[Space] Pause</span>
        </div>
      </div>
    </div>
  );
}
