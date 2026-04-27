import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer, { DUMMY_TRACKS } from './components/MusicPlayer';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="w-screen h-screen bg-dark-bg text-[#f0f0f0] font-sans flex flex-col p-8 overflow-hidden relative">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-cyan-900/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Top Header */}
      <header className="flex justify-between items-end mb-8 z-10 shrink-0">
        <div className="flex flex-col">
          <span className="text-[10px] tracking-[0.4em] uppercase text-neon-cyan font-bold mb-1 opacity-80">System Protocol v.8.4</span>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
            Neon<span className="text-transparent border-t border-b border-neon-cyan px-2 ml-1">Strike</span>
          </h1>
        </div>
        <div className="flex gap-12 text-right">
          <motion.div key={score} initial={{ y: -5, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Current Score</p>
            <p className="text-4xl font-mono text-neon-pink font-bold tracking-tight">
              {score.toLocaleString('en-US', { minimumIntegerDigits: 6, useGrouping: true })}
            </p>
          </motion.div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">System Record</p>
            <p className="text-4xl font-mono text-neon-cyan font-bold opacity-30 tracking-tight">
              {highScore.toLocaleString('en-US', { minimumIntegerDigits: 6, useGrouping: true })}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex gap-12 z-10 min-h-0">
        {/* Left Side: Neural Audio Stream */}
        <aside className="w-64 flex flex-col shrink-0">
          <div className="mb-6">
            <h2 className="text-[11px] uppercase tracking-[0.2em] font-bold text-neon-pink mb-6 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-neon-pink shadow-[0_0_8px_rgba(217,70,239,1)]"></span>
              Neural Audio Stream
            </h2>
            <ul className="space-y-6">
              {DUMMY_TRACKS.map((track, index) => (
                <li 
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(index);
                    setIsPlaying(true);
                  }}
                  className={`group cursor-pointer border-l-2 pl-5 py-1 transition-all ${
                    index === currentTrackIndex ? 'border-neon-pink' : 'border-transparent hover:border-white/20'
                  }`}
                >
                  <p className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                    index === currentTrackIndex ? 'text-neon-pink' : 'text-white/60 group-hover:text-white'
                  }`}>
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}. {track.title}
                  </p>
                  <p className="text-[10px] text-white/30 uppercase mt-1 tracking-tight">
                    {track.genre} • {track.bpm} BPM
                  </p>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Visualizer Simulation */}
          <div className="mt-auto bg-black/40 border border-white/5 p-5 rounded-2xl flex items-end justify-between h-32 gap-1.5 overflow-hidden group">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                animate={isPlaying ? { height: [`${20+Math.random()*60}%`, `${30+Math.random()*60}%`, `${10+Math.random()*80}%`] } : { height: '10%' }}
                transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5, delay: i * 0.05 }}
                className={`w-full rounded-t-sm transition-colors duration-500 ${
                  isPlaying ? 'bg-neon-cyan/60' : 'bg-neon-cyan/20'
                }`}
              />
            ))}
          </div>
        </aside>

        {/* Center: Snake Game Viewport */}
        <section className="flex-1 flex flex-col">
          <SnakeGame 
            score={score} 
            highScore={highScore}
            onScoreChange={setScore}
            onHighScoreChange={setHighScore}
          />
        </section>
      </main>

      {/* Bottom Bar: Music Controls */}
      <div className="mt-8 shrink-0">
        <MusicPlayer 
          currentTrackIndex={currentTrackIndex}
          setCurrentTrackIndex={setCurrentTrackIndex}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />
      </div>
    </div>
  );
}
