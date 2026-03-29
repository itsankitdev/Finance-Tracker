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

  expenses.forEach((e) => {
    const date = new Date(e.date);
    if (isNaN(date)) return;
    const day = date.getDate();
    if (!dayMap[day]) dayMap[day] = 0;
    dayMap[day] += e.amount;
  });

  const data = Object.keys(dayMap)
    .sort((a, b) => a - b)
    .map((d) => ({ day: d, total: dayMap[d] }));

  if (data.length < 1) {
    return (
      <div
        className="rounded-2xl p-6 flex flex-col items-center justify-center min-h-[220px] text-center"
        style={{
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.75)",
          boxShadow: "0 8px 32px rgba(109,40,217,0.07)",
        }}
      >
        <span className="text-4xl mb-3">📈</span>
        <p className="text-violet-400 font-medium text-sm">No trend data yet</p>
        <p className="text-violet-300 text-xs mt-1">Add more expenses to see daily trends</p>
      </div>
    );
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
        Daily Trend (This Month)
      </h2>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.10)" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12, fill: "#a78bfa" }}
            axisLine={{ stroke: "rgba(139,92,246,0.15)" }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#a78bfa" }}
            axisLine={{ stroke: "rgba(139,92,246,0.15)" }}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(255,255,255,0.90)",
              border: "1px solid rgba(139,92,246,0.20)",
              borderRadius: "12px",
              fontSize: "13px",
            }}
            formatter={(value) => [`₹${value}`, "Spent"]}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#7c3aed"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#7c3aed", strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#6d28d9" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}