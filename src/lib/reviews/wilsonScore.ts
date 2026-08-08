/**
 * Calculates the lower bound of Wilson score confidence interval for a Bernoulli parameter
 * Used for ranking items with upvotes and downvotes (e.g., Reddit, Hacker News style sorting)
 * @param upvotes - The number of upvotes
 * @param downvotes - The number of downvotes
 * @param confidence - Statistical confidence level (default 0.95 -> z=1.96)
 * @returns A score between 0 and 1 representing the lower bound of the confidence interval
 */
export function wilsonScore(upvotes: number, downvotes: number): number {
  if (upvotes === 0 && downvotes === 0) return 0;
  
  const n = upvotes + downvotes;
  const p = upvotes / n;
  
  // z for 95% confidence interval
  const z = 1.96;
  const z2 = z * z;
  
  const left = p + z2 / (2 * n);
  const right = z * Math.sqrt((p * (1 - p) + z2 / (4 * n)) / n);
  const under = 1 + z2 / n;
  
  return (left - right) / under;
}
