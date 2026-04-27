import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music as MusicIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface Track {
  id: number;
  title: string;
  artist: string;
  cover: string;
  url: string;
  color: string;
  bpm?: number;
  genre?: string;
}

export const DUMMY_TRACKS: Track[] = [
  {
    id: 1,
    title: "Cyber Drift",
    artist: "NEON ARCHITECT",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=300&h=300",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "neon-cyan",
    bpm: 128,
    genre: "Synthwave"
  },
  {
    id: 2,
    title: "Midnight Neon",
    artist: "CYBER ECHO",
    cover: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=300&h=300",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "neon-pink",
    bpm: 94,
    genre: "Downtempo"
  },
  {
    id: 3,
    title: "Digital Ghost",
    artist: "RETRO DRIVER",
    cover: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&q=80&w=300&h=300",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "neon-purple",
    bpm: 140,
    genre: "Glitch Hop"
  }
];

interface MusicPlayerProps {
  currentTrackIndex: number;
  setCurrentTrackIndex: (index: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export default function MusicPlayer({ currentTrackIndex, setCurrentTrackIndex, isPlaying, setIsPlaying }: MusicPlayerProps) {
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [duration, setDuration] = useState("00:00");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex, setIsPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
      setCurrentTime(formatTime(audioRef.current.currentTime));
      setDuration(formatTime(audioRef.current.duration));
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((currentTrackIndex + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((currentTrackIndex - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  return (
    <footer className="h-24 bg-white/5 border-t border-white/10 rounded-t-[40px] px-12 flex items-center gap-12 z-10 w-full">
      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />

      <div className="flex items-center gap-4 w-64">
        <motion.div 
          key={currentTrack.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-12 h-12 bg-gradient-to-br from-neon-pink to-neon-purple rounded-lg flex items-center justify-center font-black text-xl italic shadow-lg shrink-0 overflow-hidden"
        >
          <img src={currentTrack.cover} alt="" className="w-full h-full object-cover opacity-50" />
        </motion.div>
        <div className="overflow-hidden">
          <p className="text-sm font-bold truncate uppercase tracking-tight">{currentTrack.title}</p>
          <p className="text-[10px] text-white/40 truncate uppercase tracking-widest">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center gap-2">
        <div className="flex items-center gap-8">
          <button onClick={handlePrev} className="text-white/40 hover:text-white transition-colors">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
          </button>
          <button onClick={handleNext} className="text-white/40 hover:text-white transition-colors">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>
        
        <div className="w-full flex items-center gap-4">
          <span className="text-[10px] font-mono text-white/40">{currentTime}</span>
          <div className="flex-1 h-1 bg-white/10 rounded-full relative overflow-hidden group cursor-pointer">
            <motion.div 
              className="absolute left-0 top-0 h-full bg-neon-cyan shadow-[0_0_10px_rgba(34,211,238,0.5)]"
              animate={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-white/40">{duration}</span>
        </div>
      </div>

      <div className="w-64 flex justify-end items-center gap-4">
        <Volume2 className="w-4 h-4 text-white/40" />
        <div className="w-24 h-1 bg-white/10 rounded-full relative">
          <div className="h-full w-[80%] bg-white/60 rounded-full"></div>
        </div>
        <MusicIcon className="w-4 h-4 text-white/20 ml-2" />
      </div>
    </footer>
  );
}
