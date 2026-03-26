import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#16a34a", // green
  "#3b82f6", // blue
  "#f59e0b", // yellow
  "#ef4444", // red
  "#8b5cf6", // purple
  ];

export default function CategoryChart({ expenses }) {
  // 🔹 Convert expenses into category totals
  const dataMap = {};

  expenses.forEach((e) => {
    if (!dataMap[e.category]) {
      dataMap[e.category] = 0;
    }
    dataMap[e.category] += e.amount;
  });

  const data = Object.keys(dataMap).map((key) => ({
    name: key,
    value: dataMap[key],
  }));

  if (data.length === 0) {
    return <p className="text-gray-500">No data for chart</p>;
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-3">Spending Breakdown</h2>

      <PieChart width={350} height={300}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={90}
          label
        >
          {data.map((_, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
