export default function SmartTips({ expenses }) {
  if (expenses.length === 0) {
    return null;
  }

  let total = 0;
  const categoryMap = {};

  expenses.forEach((e) => {
    total += e.amount;

    if (!categoryMap[e.category]) {
      categoryMap[e.category] = 0;
    }

    categoryMap[e.category] += e.amount;
  });

  const tips = [];

  // 🔹 Rule 1: High category spending
  for (let cat in categoryMap) {
    const percent = (categoryMap[cat] / total) * 100;

    if (percent > 50) {
      tips.push(`You are spending too much on ${cat}. Try reducing it.`);
    } else if (percent > 30) {
      tips.push(`Your ${cat} spending is quite high. Consider setting a budget.`);
    }
  }

  // 🔹 Rule 2: High total spending alert
  if (total > 10000) {
    tips.push("Your total expenses are high this month. Review your spending habits.");
  }

  // 🔹 Rule 3: Frequent small expenses
  const smallExpenses = expenses.filter((e) => e.amount < 200);

  if (smallExpenses.length > 5) {
    tips.push("Multiple small expenses detected. These can add up quickly.");
  }

  // 🔹 Rule 4: Spending spike detection
  const monthMap = {};

  expenses.forEach((e) => {
    const date = new Date(e.id);
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
    <div className="bg-white p-4 rounded-2xl shadow mt-6 border-l-4 border-green-600">
      <h2 className="text-lg font-bold mb-3 text-green-700">
        Smart Tips
      </h2>

      {tips.length === 0 ? (
        <p className="text-gray-500">You're managing your expenses well 👍</p>
      ) : (
        <ul className="space-y-2">
          {tips.map((tip, index) => (
            <li key={index} className="text-gray-700">
              • {tip}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
