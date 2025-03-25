
import React, { useState, useMemo } from 'react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ZAxis, Cell
} from 'recharts';
import { cn } from '@/lib/utils';

interface PrimeChartProps {
  data: [number, number][];
  className?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const prime = payload[0].payload[0];
    const distance = payload[0].payload[1];
    
    return (
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-lg shadow-lg border border-slate-200/50 text-sm">
        <p className="font-medium">Prime: {prime}</p>
        <p className="text-muted-foreground">Distance from previous: {distance}</p>
      </div>
    );
  }
  
  return null;
};

const PrimeChart: React.FC<PrimeChartProps> = ({ data, className }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  // Format the data for the chart
  const chartData = useMemo(() => {
    return data.map(([prime, distance]) => [prime, distance]);
  }, [data]);
  
  // Calculate the domain for better visualization
  const maxX = data.length > 0 ? data[data.length - 1][0] : 100;
  const maxY = data.length > 0 ? Math.max(...data.map(([_, distance]) => distance)) : 10;
  
  // Generate color based on distance (higher distance = more intense color)
  const getColor = (distance: number) => {
    const normalizedDistance = Math.min(distance / maxY, 1);
    return `rgba(37, 99, 235, ${0.3 + normalizedDistance * 0.7})`;
  };
  
  // Handle mouse events for interactive highlighting
  const handleMouseEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  const handleMouseLeave = () => {
    setActiveIndex(null);
  };
  
  // Empty state
  if (data.length === 0) {
    return (
      <div className={cn(
        "rounded-2xl bg-white/50 border border-slate-200/50 shadow-sm p-8 flex flex-col items-center justify-center min-h-[400px]",
        className
      )}>
        <div className="text-muted-foreground">No data to display</div>
      </div>
    );
  }
  
  return (
    <div className={cn(
      "prime-chart-container rounded-2xl bg-white/50 border border-slate-200/50 shadow-sm p-4 chart-appear",
      className
    )}>
      <h2 className="text-lg font-medium px-4 mb-4">Prime Distance Distribution</h2>
      
      <div className="bg-white/30 rounded-xl p-4">
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart
            margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
            <XAxis 
              type="number" 
              dataKey="0" 
              name="Prime" 
              domain={[0, maxX]} 
              label={{ value: 'Prime Number', position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              type="number" 
              dataKey="1" 
              name="Distance" 
              domain={[0, maxY + 2]}
              label={{ value: 'Distance', angle: -90, position: 'insideLeft' }}
            />
            <ZAxis range={[50, 400]} />
            <Tooltip content={<CustomTooltip />} />
            <Scatter 
              data={chartData} 
              fill="#8884d8"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getColor(entry[1])}
                  fillOpacity={activeIndex === index ? 1 : 0.6}
                  r={activeIndex === index ? 6 : 4}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      <div className="text-xs text-muted-foreground mt-4 px-4">
        Each point represents a prime number. The y-axis shows the distance from the previous prime.
      </div>
    </div>
  );
};

export default PrimeChart;
