import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const MOCK_STATS = {
  average: 4.5,
  total: 128,
  distribution: [
    { rating: 5, count: 75 },
    { rating: 4, count: 28 },
    { rating: 3, count: 15 },
    { rating: 2, count: 6 },
    { rating: 1, count: 4 },
  ],
};

export function ReviewStats() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="text-4xl font-bold">{MOCK_STATS.average}</div>
        <div>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(MOCK_STATS.average)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Based on {MOCK_STATS.total} reviews
          </p>
        </div>
      </div>
      <div className="space-y-2">
        {MOCK_STATS.distribution.map(({ rating, count }) => (
          <div key={rating} className="flex items-center gap-2">
            <span className="w-12 text-sm">{rating} stars</span>
            <Progress
              value={(count / MOCK_STATS.total) * 100}
              className="h-2"
            />
            <span className="w-12 text-sm text-muted-foreground">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}