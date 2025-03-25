
import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header 
      className={cn(
        "w-full py-6 px-8 backdrop-blur-md bg-white/50 border-b border-slate-200/50 fixed top-0 z-10",
        className
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2 animate-fade-in">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-white"></div>
          </div>
          <h1 className="text-xl font-medium tracking-tight">Prime Distance Plotter</h1>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Visualizing the distances between consecutive primes
        </div>
      </div>
    </header>
  );
};

export default Header;
