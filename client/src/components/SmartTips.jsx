import { Lightbulb } from "lucide-react";

export default function SmartTips({ expenses }) {
  if (expenses.length === 0) return null;

  let total = 0;
  const categoryMap = {};
  expenses.forEach((e) => {
    total += e.amount;
    if (!categoryMap[e.category]) categoryMap[e.category] = 0;
    categoryMap[e.category] += e.amount;
  });

  const tips = [];

  for (let cat in categoryMap) {
    const percent = (categoryMap[cat] / total) * 100;
    if (percent > 50) tips.push(`You're spending too much on ${cat}. Try reducing it.`);
    else if (percent > 30) tips.push(`Your ${cat} spending is quite high. Consider setting a limit.`);
  }

  if (total > 10000) tips.push("Your total expenses are high this month. Review your habits.");

  const smallExpenses = expenses.filter((e) => e.amount < 200);
  if (smallExpenses.length > 5) tips.push("Multiple small expenses detected — these can add up quickly!");

  const monthMap = {};
  expenses.forEach((e) => {
    const date = new Date(e.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!monthMap[key]) monthMap[key] = 0;
    monthMap[key] += e.amount;
  });

  const months = Object.keys(monthMap).sort();
  if (months.length >= 2) {
    const last = monthMap[months[months.length - 1]];
    const prev = monthMap[months[months.length - 2]];
    if (last > prev * 1.3) tips.push("Spending increased significantly compared to last month.");
  }

  return (
    <div className="rounded-2xl p-5" style={{
      background: "rgba(255,255,255,0.55)", backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.75)",
      boxShadow: "0 8px 32px rgba(109,40,217,0.07)",
    }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg" style={{ background: "rgba(139,92,246,0.12)" }}>
          <Lightbulb size={16} style={{ color: "#6d28d9" }} />
        </div>
        <h2 className="text-base font-bold tracking-wide" style={{ color: "#4c1d95" }}>Smart Tips</h2>
      </div>

      {tips.length === 0 ? (
        <div className="flex items-center gap-3 p-3 rounded-xl"
          style={{ background: "rgba(16,185,129,0.09)", border: "1px solid rgba(16,185,129,0.20)" }}>
          <span className="text-lg">👍</span>
          {/* ✅ dark success text */}
          <p className="text-sm font-semibold" style={{ color: "#065f46" }}>
            You're managing your expenses well!
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-xl"
              style={{ background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.14)" }}>
              <span className="font-bold shrink-0 text-sm" style={{ color: "#6d28d9", marginTop: "1px" }}>
                {index + 1}.
              </span>
              {/* ✅ dark tip text */}
              <p className="text-sm font-medium" style={{ color: "#1f2937" }}>{tip}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}