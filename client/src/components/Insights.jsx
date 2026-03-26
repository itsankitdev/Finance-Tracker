export default function Insights({ expenses }) {
  if (expenses.length === 0) {
    return <p className="text-gray-500 mt-6">No insights yet</p>;
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

  // 🔹 Find highest spending category
  let maxCategory = "";
  let maxValue = 0;

  for (let cat in categoryMap) {
    if (categoryMap[cat] > maxValue) {
      maxValue = categoryMap[cat];
      maxCategory = cat;
    }
  }

  const percentage = ((maxValue / total) * 100).toFixed(1);

  // 🔹 Monthly comparison logic
  const monthMap = {};

  expenses.forEach((e) => {
    const date = new Date(e.id);
    const key = `${date.getFullYear()}-${date.getMonth()}`;

    if (!monthMap[key]) monthMap[key] = 0;
    monthMap[key] += e.amount;
  });

  const months = Object.keys(monthMap).sort();

  let trendMessage = "";

  if (months.length >= 2) {
    const last = monthMap[months[months.length - 1]];
    const prev = monthMap[months[months.length - 2]];

    if (last > prev) {
      trendMessage = `Your spending increased compared to last month`;
    } else if (last < prev) {
      trendMessage = `Good job! You reduced spending this month`;
    } else {
      trendMessage = `Your spending is consistent`;
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-lg font-bold mb-3 text-green-700">
        Smart Insights
      </h2>

      <ul className="space-y-2">
        <li>
          You spent <b>{percentage}%</b> on{" "}
          <b>{maxCategory}</b>
        </li>

        {trendMessage && <li>{trendMessage}</li>}
      </ul>
    </div>
  );
}
