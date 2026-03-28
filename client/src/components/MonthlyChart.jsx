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
  const dayMap = {};

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // ✅ filter only current month data
  expenses.forEach((e) => {
  const date = new Date(e.date); // ✅ correct field

  if (isNaN(date)) return;

  const day = date.getDate();

  if (!dayMap[day]) dayMap[day] = 0;
  dayMap[day] += e.amount;
});


  const data = Object.keys(dayMap)
    .sort((a, b) => a - b) // ✅ important for correct order
    .map((d) => ({
      day: d,
      total: dayMap[d],
    }));

  // 🔴 if not enough data
  if (data.length < 1) {
    return (
      <div className="bg-white p-4 rounded-2xl shadow">
        <p className="text-gray-500">
          Add more data to see daily trends
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h2 className="text-lg font-bold mb-3">
        Daily Trend (This Month)
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="total"
            stroke="#16a34a"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
