
/**
 * Checks if a number is prime
 */
export const isPrime = (num: number): boolean => {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  
  let i = 5;
  while (i * i <= num) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
    i += 6;
  }
  return true;
};

/**
 * Finds all prime numbers up to max and calculates their distances
 * Returns an array of [prime, distance] tuples
 */
export const calculatePrimesWithDistances = (max: number): [number, number][] => {
  const result: [number, number][] = [];
  let lastPrime = 0;
  
  for (let i = 2; i <= max; i++) {
    if (isPrime(i)) {
      const distance = lastPrime === 0 ? 0 : i - lastPrime;
      result.push([i, distance]);
      lastPrime = i;
    }
  }
  
  return result;
};

/**
 * Calculates prime numbers and their distances in chunks
 * to avoid blocking the main thread for large ranges
 */
export const calculatePrimesAsync = async (
  max: number, 
  onProgress?: (progress: number) => void
): Promise<[number, number][]> => {
  return new Promise((resolve) => {
    const result: [number, number][] = [];
    let lastPrime = 0;
    let current = 2;
    const chunkSize = 1000;
    
    const processChunk = () => {
      const end = Math.min(current + chunkSize, max + 1);
      
      for (let i = current; i < end; i++) {
        if (isPrime(i)) {
          const distance = lastPrime === 0 ? 0 : i - lastPrime;
          result.push([i, distance]);
          lastPrime = i;
        }
      }
      
      const progress = Math.min(100, Math.floor((end / (max + 1)) * 100));
      onProgress?.(progress);
      
      current = end;
      
      if (current <= max) {
        setTimeout(processChunk, 0);
      } else {
        resolve(result);
      }
    };
    
    processChunk();
  });
};

/**
 * Gets statistics about the prime numbers
 */
export const getPrimeStats = (primes: [number, number][]): {
  count: number;
  maxDistance: number;
  avgDistance: number;
} => {
  if (primes.length === 0) {
    return { count: 0, maxDistance: 0, avgDistance: 0 };
  }
  
  // First prime has a distance of 0, so exclude it from calculations
  const distances = primes.slice(1).map(([_, distance]) => distance);
  const sum = distances.reduce((acc, val) => acc + val, 0);
  const max = Math.max(...distances);
  
  return {
    count: primes.length,
    maxDistance: max,
    avgDistance: distances.length > 0 ? sum / distances.length : 0
  };
};
