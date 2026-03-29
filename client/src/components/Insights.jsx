import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function Insights({ expenses }) {
  if (expenses.length === 0) {
    return (
      <div
        className="rounded-2xl p-5"
        style={{
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.75)",
          boxShadow: "0 8px 32px rgba(109,40,217,0.07)",
        }}
      >
        <h2 className="text-base font-bold text-violet-700 mb-2 tracking-wide">
          Smart Insights
        </h2>
        <p className="text-violet-300 text-sm">No insights yet — add some expenses!</p>
      </div>
    );
  }

  let total = 0;
  const categoryMap = {};

  expenses.forEach((e) => {
    total += e.amount;
    if (!categoryMap[e.category]) categoryMap[e.category] = 0;
    categoryMap[e.category] += e.amount;
  });

  let maxCategory = "";
  let maxValue = 0;
  for (let cat in categoryMap) {
    if (categoryMap[cat] > maxValue) {
      maxValue = categoryMap[cat];
      maxCategory = cat;
    }
  }

  const percentage = ((maxValue / total) * 100).toFixed(1);

  // Monthly trend
  const monthMap = {};
  expenses.forEach((e) => {
    const date = new Date(e.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!monthMap[key]) monthMap[key] = 0;
    monthMap[key] += e.amount;
  });

  const months = Object.keys(monthMap).sort();
  let trendMessage = "";
  let TrendIcon = Minus;
  let trendColor = "#a78bfa";

  if (months.length >= 2) {
    const last = monthMap[months[months.length - 1]];
    const prev = monthMap[months[months.length - 2]];
    if (last > prev) {
      trendMessage = "Spending increased compared to last month";
      TrendIcon = TrendingUp;
      trendColor = "#ef4444";
    } else if (last < prev) {
      trendMessage = "Great job! You reduced spending this month";
      TrendIcon = TrendingDown;
      trendColor = "#10b981";
    } else {
      trendMessage = "Your spending is consistent this month";
      TrendIcon = Minus;
      trendColor = "#a78bfa";
    }
  }

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.75)",
        boxShadow: "0 8px 32px rgba(109,40,217,0.07)",
      }}
    >
      <h2 className="text-base font-bold text-violet-700 mb-4 tracking-wide">
        Smart Insights
      </h2>

      <div className="space-y-3">
        {/* Top category insight */}
        <div
          className="flex items-center gap-3 p-3 rounded-xl"
          style={{ background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.12)" }}
        >
          <span className="text-xl">💡</span>
          <p className="text-sm text-gray-700">
            You spent{" "}
            <span className="font-bold text-violet-600">{percentage}%</span> on{" "}
            <span className="font-bold text-violet-600">{maxCategory}</span>
          </p>
        </div>

        {/* Trend insight */}
        {trendMessage && (
          <div
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{
              background: `${trendColor}12`,
              border: `1px solid ${trendColor}25`,
            }}
          >
            <TrendIcon size={18} style={{ color: trendColor, flexShrink: 0 }} />
            <p className="text-sm text-gray-700">{trendMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}