
import React, { useState } from 'react';
import Header from '@/components/Header';
import PrimeCalculator from '@/components/PrimeCalculator';
import PrimeChart from '@/components/PrimeChart';
import TopDistances from '@/components/TopDistances';
import { getPrimeStats, getDistanceDistribution } from '@/utils/primeUtils';

const Index = () => {
  const [primeData, setPrimeData] = useState<[number, number][]>([]);
  const [distanceDistribution, setDistanceDistribution] = useState<[number, number][]>([]);
  
  const handlePrimesCalculated = (data: [number, number][]) => {
    setPrimeData(data);
    setDistanceDistribution(getDistanceDistribution(data));
  };
  
  const stats = getPrimeStats(primeData);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30" />
      <div className="absolute top-1/2 -left-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-20" />
      
      <Header />
      
      <main className="container mx-auto pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center animate-slide-up">
            <h1 className="text-4xl font-medium tracking-tight mb-3">Prime Distance Plotter</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the fascinating patterns in the distribution of prime numbers and 
              the distances between consecutive primes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <PrimeCalculator 
              onCalculated={handlePrimesCalculated}
              className="lg:col-span-1"
            />
            
            <div className="lg:col-span-2 space-y-6">
              <PrimeChart data={primeData} />
              
              {primeData.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatCard 
                    title="Total Primes" 
                    value={stats.count.toString()} 
                    description="Number of primes found"
                  />
                  <StatCard 
                    title="Max Distance" 
                    value={stats.maxDistance.toString()} 
                    description="Largest gap between primes"
                  />
                  <StatCard 
                    title="Average Distance" 
                    value={stats.avgDistance.toFixed(2)} 
                    description="Mean distance between primes"
                  />
                </div>
              )}
              
              {distanceDistribution.length > 0 && (
                <TopDistances data={distanceDistribution} />
              )}
            </div>
          </div>
          
          <div className="glass-card rounded-2xl p-6 animate-scale-in">
            <h2 className="text-lg font-medium mb-4">About Prime Numbers</h2>
            <p className="text-muted-foreground mb-3">
              Prime numbers are natural numbers greater than 1 that cannot be formed by multiplying 
              two smaller natural numbers. A prime number is divisible only by 1 and itself.
            </p>
            <p className="text-muted-foreground">
              The distribution of prime numbers among the natural numbers is not regular. However, 
              there are interesting patterns in how they are distributed and in the distances between 
              consecutive primes, which this visualization aims to explore.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description }) => {
  return (
    <div className="glass-card rounded-xl p-4 animate-scale-in border border-slate-200/50">
      <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
      <p className="text-2xl font-medium mb-1">{value}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
};

export default Index;
