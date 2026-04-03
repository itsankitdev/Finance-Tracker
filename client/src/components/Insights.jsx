import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function Insights({ expenses }) {
  if (expenses.length === 0) {
    return (
      <div className="rounded-2xl p-5" style={{
        background: "rgba(255,255,255,0.55)", backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.75)",
        boxShadow: "0 8px 32px rgba(109,40,217,0.07)",
      }}>
        <h2 className="text-base font-bold mb-2 tracking-wide" style={{ color: "#4c1d95" }}>Smart Insights</h2>
        <p className="text-sm font-medium" style={{ color: "#6d28d9" }}>No insights yet — add some expenses!</p>
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

  let maxCategory = "", maxValue = 0;
  for (let cat in categoryMap) {
    if (categoryMap[cat] > maxValue) { maxValue = categoryMap[cat]; maxCategory = cat; }
  }
  const percentage = ((maxValue / total) * 100).toFixed(1);

  const monthMap = {};
  expenses.forEach((e) => {
    const date = new Date(e.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!monthMap[key]) monthMap[key] = 0;
    monthMap[key] += e.amount;
  });

  const months = Object.keys(monthMap).sort();
  let trendMessage = "", TrendIcon = Minus, trendColor = "#6d28d9";

  if (months.length >= 2) {
    const last = monthMap[months[months.length - 1]];
    const prev = monthMap[months[months.length - 2]];
    if (last > prev) { trendMessage = "Spending increased compared to last month"; TrendIcon = TrendingUp; trendColor = "#b91c1c"; }
    else if (last < prev) { trendMessage = "Great job! You reduced spending this month"; TrendIcon = TrendingDown; trendColor = "#047857"; }
    else { trendMessage = "Your spending is consistent this month"; }
  }

  return (
    <div className="rounded-2xl p-5" style={{
      background: "rgba(255,255,255,0.55)", backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.75)",
      boxShadow: "0 8px 32px rgba(109,40,217,0.07)",
    }}>
      <h2 className="text-base font-bold mb-4 tracking-wide" style={{ color: "#4c1d95" }}>Smart Insights</h2>

      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-xl"
          style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)" }}>
          <span className="text-xl">💡</span>
          {/* ✅ dark insight text */}
          <p className="text-sm font-medium" style={{ color: "#1f2937" }}>
            You spent <span className="font-bold" style={{ color: "#5b21b6" }}>{percentage}%</span> on{" "}
            <span className="font-bold" style={{ color: "#5b21b6" }}>{maxCategory}</span>
          </p>
        </div>

        {trendMessage && (
          <div className="flex items-center gap-3 p-3 rounded-xl"
            style={{ background: `${trendColor}14`, border: `1px solid ${trendColor}30` }}>
            <TrendIcon size={18} style={{ color: trendColor, flexShrink: 0 }} />
            {/* ✅ dark trend text */}
            <p className="text-sm font-medium" style={{ color: "#1f2937" }}>{trendMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}