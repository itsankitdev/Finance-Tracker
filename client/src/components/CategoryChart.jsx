import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#7c3aed", "#4f46e5", "#0891b2", "#f59e0b", "#ef4444"];

export default function CategoryChart({ expenses }) {
  const dataMap = {};
  expenses.forEach((e) => {
    if (!dataMap[e.category]) dataMap[e.category] = 0;
    dataMap[e.category] += e.amount;
  });

  const data = Object.keys(dataMap).map((key) => ({
    name: key,
    value: dataMap[key],
  }));

  if (data.length === 0) {
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
        <span className="text-4xl mb-3">🥧</span>
        <p className="text-violet-400 font-medium text-sm">No spending data yet</p>
        <p className="text-violet-300 text-xs mt-1">Add expenses to see breakdown</p>
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
        Spending Breakdown
      </h2>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={85}
            innerRadius={35}
            paddingAngle={3}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            labelLine={false}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `₹${value}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}