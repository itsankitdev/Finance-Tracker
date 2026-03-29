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

  // Rule 1: High category spending
  for (let cat in categoryMap) {
    const percent = (categoryMap[cat] / total) * 100;
    if (percent > 50) {
      tips.push(`You're spending too much on ${cat}. Try reducing it.`);
    } else if (percent > 30) {
      tips.push(`Your ${cat} spending is quite high. Consider setting a limit.`);
    }
  }

  // Rule 2: High total
  if (total > 10000) {
    tips.push("Your total expenses are high this month. Review your habits.");
  }

  // Rule 3: Frequent small expenses
  const smallExpenses = expenses.filter((e) => e.amount < 200);
  if (smallExpenses.length > 5) {
    tips.push("Multiple small expenses detected — these can add up quickly!");
  }

  // Rule 4: Spending spike — ✅ fixed e.date (was e.id)
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
    if (last > prev * 1.3) {
      tips.push("Spending increased significantly compared to last month.");
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
      <div className="flex items-center gap-2 mb-4">
        <div
          className="p-1.5 rounded-lg"
          style={{ background: "rgba(139,92,246,0.10)" }}
        >
          <Lightbulb size={16} className="text-violet-500" />
        </div>
        <h2 className="text-base font-bold text-violet-700 tracking-wide">
          Smart Tips
        </h2>
      </div>

      {tips.length === 0 ? (
        <div
          className="flex items-center gap-3 p-3 rounded-xl"
          style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}
        >
          <span className="text-lg">👍</span>
          <p className="text-sm text-emerald-700 font-medium">
            You're managing your expenses well!
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {tips.map((tip, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-xl"
              style={{
                background: "rgba(139,92,246,0.06)",
                border: "1px solid rgba(139,92,246,0.12)",
              }}
            >
              <span className="text-violet-400 mt-0.5 text-sm font-bold shrink-0">
                {index + 1}.
              </span>
              <p className="text-sm text-gray-700">{tip}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}