
import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { calculatePrimesAsync, getPrimeStats } from '@/utils/primeUtils';
import Button from './Button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

interface PrimeCalculatorProps {
  onCalculated: (data: [number, number][]) => void;
  className?: string;
}

const PrimeCalculator: React.FC<PrimeCalculatorProps> = ({ onCalculated, className }) => {
  const [max, setMax] = useState<number>(1000);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [primes, setPrimes] = useState<[number, number][]>([]);
  
  // Calculate primes when component mounts with a default value
  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleCalculate = useCallback(async () => {
    if (isCalculating) return;
    
    if (max > 100000) {
      toast.warning("Large calculations may take some time", {
        description: "Be patient while we crunch the numbers"
      });
    }
    
    setIsCalculating(true);
    setProgress(0);
    
    try {
      const result = await calculatePrimesAsync(max, setProgress);
      setPrimes(result);
      onCalculated(result);
      
      // Show stats in a toast
      const stats = getPrimeStats(result);
      toast.success("Calculation complete", {
        description: `Found ${stats.count} primes with max distance ${stats.maxDistance}`
      });
    } catch (error) {
      console.error("Error calculating primes:", error);
      toast.error("Calculation failed", {
        description: "An error occurred while calculating prime numbers"
      });
    } finally {
      setIsCalculating(false);
    }
  }, [max, isCalculating, onCalculated]);
  
  const handleSliderChange = useCallback((value: number[]) => {
    setMax(value[0]);
  }, []);
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setMax(value);
    }
  }, []);
  
  return (
    <div className={`glass-card rounded-2xl p-6 shadow-sm border border-slate-200/50 animate-scale-in ${className}`}>
      <h2 className="text-lg font-medium mb-4">Prime Number Calculator</h2>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label htmlFor="max-range" className="text-sm font-medium">
              Maximum Number:
            </label>
            
            {isCalculating && (
              <span className="text-xs text-muted-foreground">
                {progress}% complete
              </span>
            )}
          </div>
          
          <div className="flex space-x-4 items-center">
            <div className="flex-1">
              <Slider
                id="max-range"
                value={[max]}
                min={100}
                max={1000000}
                step={100}
                onValueChange={handleSliderChange}
                disabled={isCalculating}
              />
            </div>
            
            <div className="w-28">
              <Input
                type="number"
                value={max}
                onChange={handleInputChange}
                min="1"
                disabled={isCalculating}
                className="text-right"
              />
            </div>
          </div>
          
          <div className="flex text-xs justify-between text-muted-foreground">
            <span>100</span>
            <span>1,000,000</span>
          </div>
        </div>
        
        {isCalculating && (
          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        
        <Button 
          onClick={handleCalculate}
          loading={isCalculating}
          disabled={isCalculating}
          className="w-full"
        >
          {isCalculating ? "Calculating..." : "Calculate Primes"}
        </Button>
        
        {primes.length > 0 && !isCalculating && (
          <div className="text-sm text-muted-foreground">
            Found {primes.length.toLocaleString()} prime numbers
          </div>
        )}
      </div>
    </div>
  );
};

export default PrimeCalculator;
