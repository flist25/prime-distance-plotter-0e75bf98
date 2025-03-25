
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, ArrowDownRight } from 'lucide-react';

interface TopDistancesProps {
  data: [number, number][];
  className?: string;
  limit?: number;
}

const TopDistances: React.FC<TopDistancesProps> = ({ 
  data, 
  className,
  limit = 10
}) => {
  // Limit to top N results
  const topDistances = data.slice(0, limit);
  
  // Calculate total count for percentages
  const totalCount = data.reduce((sum, [_, count]) => sum + count, 0);
  
  if (topDistances.length === 0) {
    return (
      <Card className={cn("animate-scale-in", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <BarChart className="h-4 w-4 mr-2 text-muted-foreground" />
            Top Distance Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm py-8 text-center">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={cn("animate-scale-in", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <BarChart className="h-4 w-4 mr-2 text-muted-foreground" />
          Top {limit} Distance Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Distance</TableHead>
              <TableHead>Count</TableHead>
              <TableHead>Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topDistances.map(([distance, count]) => {
              const percentage = ((count / totalCount) * 100).toFixed(1);
              
              return (
                <TableRow key={distance}>
                  <TableCell className="font-medium">{distance}</TableCell>
                  <TableCell>{count.toLocaleString()}</TableCell>
                  <TableCell className="flex items-center">
                    <div className="w-full bg-secondary h-2 rounded-full mr-2">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    {percentage}%
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        <div className="text-xs text-muted-foreground mt-4">
          <div className="flex items-center mb-1">
            <ArrowDownRight className="h-3 w-3 mr-1" />
            <span>Distribution of distances between consecutive prime numbers</span>
          </div>
          <div>
            Showing top {Math.min(limit, topDistances.length)} of {data.length} different distances
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopDistances;
