"use client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart, Legend
} from "recharts";

const monthlyData = [
  { month: "Mar W1", fit: 30, ace: 20, tie: 15, self: 22, manager: 38 },
  { month: "Mar W3", fit: 45, ace: 32, tie: 25, self: 34, manager: 52 },
  { month: "Apr",    fit: 58, ace: 42, tie: 35, self: 45, manager: 61 },
  { month: "May",    fit: 65, ace: 55, tie: 45, self: 55, manager: 66 },
  { month: "Jun",    fit: 70, ace: 62, tie: 55, self: 62, manager: 70 },
  { month: "Jul",    fit: 74, ace: 68, tie: 63, self: 68, manager: 73 },
  { month: "Aug",    fit: 77, ace: 72, tie: 70, self: 73, manager: 76 },
  { month: "Sep",    fit: 80, ace: 76, tie: 74, self: 76, manager: 79 },
  { month: "Oct",    fit: 82, ace: 78, tie: 77, self: 79, manager: 81 },
  { month: "Nov",    fit: 84, ace: 80, tie: 80, self: 81, manager: 82 },
  { month: "Dec",    fit: 86, ace: 82, tie: 82, self: 83, manager: 84 },
  { month: "Feb 27", fit: 88, ace: 84, tie: 85, self: 85, manager: 86 },
];

const currentData = monthlyData.slice(0, 3);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#FFFFFF", border: "1px solid #E2E0DA", borderRadius: 10, padding: "10px 14px", fontSize: 12 }}>
        <p style={{ fontWeight: 700, color: "#0A0A0A", marginBottom: 6 }}>{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <div style={{ width: 8, height: 8, borderRadius: 99, background: p.color }} />
            <span style={{ color: "#6B6B6B" }}>{p.name}:</span>
            <span style={{ fontWeight: 600, color: "#0A0A0A" }}>{p.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function BucketLineChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={currentData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
        <CartesianGrid stroke="#F5F4F0" strokeDasharray="0" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#AEABA3" }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#AEABA3" }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={70} stroke="#E2E0DA" strokeDasharray="4 4" label={{ value: "Target", position: "right", fontSize: 10, fill: "#AEABA3" }} />
        <Line type="monotone" dataKey="fit" name="FIT" stroke="#1A1A2E" strokeWidth={2.5} dot={{ fill: "#1A1A2E", r: 4 }} activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="ace" name="ACE" stroke="#2D6A4F" strokeWidth={2.5} dot={{ fill: "#2D6A4F", r: 4 }} activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="tie" name="TIE" stroke="#9B2335" strokeWidth={2.5} dot={{ fill: "#9B2335", r: 4 }} activeDot={{ r: 6 }} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ProjectedAreaChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={monthlyData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
        <defs>
          <linearGradient id="fitGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1A1A2E" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#1A1A2E" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="tieGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#9B2335" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#9B2335" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#F5F4F0" strokeDasharray="0" />
        <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#AEABA3" }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#AEABA3" }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine x="Mar W3" stroke="#E2E0DA" strokeDasharray="4 4" label={{ value: "Today", position: "top", fontSize: 9, fill: "#AEABA3" }} />
        <ReferenceLine y={70} stroke="#E2E0DA" strokeDasharray="4 4" />
        <Area type="monotone" dataKey="fit" name="FIT" stroke="#1A1A2E" strokeWidth={2} fill="url(#fitGrad)" />
        <Area type="monotone" dataKey="tie" name="TIE" stroke="#9B2335" strokeWidth={2} fill="url(#tieGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function DivergenceChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={currentData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
        <defs>
          <linearGradient id="gapGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#B7791F" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#B7791F" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#F5F4F0" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#AEABA3" }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#AEABA3" }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="manager" name="Manager view" stroke="#1A1A2E" strokeWidth={2.5} fill="transparent" />
        <Area type="monotone" dataKey="self" name="Self view" stroke="#B7791F" strokeWidth={2.5} fill="url(#gapGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export { currentData, monthlyData };
