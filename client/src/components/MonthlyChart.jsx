import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function MonthlyChart({ expenses }) {
  const monthMap = {};

  expenses.forEach((e) => {
    const date = new Date(e.id);
    const month = date.toLocaleString("default", { month: "short" });

    if (!monthMap[month]) monthMap[month] = 0;
    monthMap[month] += e.amount;
  });

  const data = Object.keys(monthMap).map((m) => ({
    month: m,
    total: monthMap[m],
  }));

  // 🔴 Important check
 if (data.length < 2) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <p className="text-gray-500">
        Add more data to see monthly trends
      </p>
    </div>
  );
}


  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h2 className="text-lg font-bold mb-3">
        Monthly Trend
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="total"
            stroke="#16a34a"
            strokeWidth={3}
            dot={{ r: 5, fill: "#22c55e" }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
