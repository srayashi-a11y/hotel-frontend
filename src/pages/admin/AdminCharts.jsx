import { useEffect, useState } from "react";
import API from "../../services/api";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, CartesianGrid, ResponsiveContainer
} from "recharts";

function AdminCharts() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get("/bookings/stats/dashboard").then(res => {
      setData(res.data);
    });
  }, []);

  if (!data) return <p className="loading">Loading charts...</p>;

  const pieData = [
    { name: "Active", value: data.active },
    { name: "Completed", value: data.completed },
    { name: "Cancelled", value: data.cancelled }
  ];

  const COLORS = ["#22c55e", "#3b82f6", "#ef4444"];

  const total = data.total || 0;
  const revenue = data.revenue || 0;
  const cancelRate = total ? ((data.cancelled / total) * 100).toFixed(1) : 0;
  const activeRate = total ? ((data.active / total) * 100).toFixed(1) : 0;

  return (
    <div className="dash-bg">

      {/* HEADER */}
      <div className="dash-header">
        <h2>📊 Live Analytics Dashboard</h2>
        <p>Bookings • Revenue • Performance insights</p>
      </div>

      {/* KPI CARDS */}
      <div className="kpi-grid">

        <div className="kpi-card blue">
          <h4>Total Bookings</h4>
          <h2>{total}</h2>
          <span>All time bookings</span>
        </div>

        <div className="kpi-card purple">
          <h4>Revenue</h4>
          <h2>₹{revenue.toFixed(2)}</h2>
          <span>Paid earnings</span>
        </div>

        <div className="kpi-card green">
          <h4>Active Rate</h4>
          <h2>{activeRate}%</h2>
          <span>Currently active</span>
        </div>

        <div className="kpi-card red">
          <h4>Cancel Rate</h4>
          <h2>{cancelRate}%</h2>
          <span>Cancelled bookings</span>
        </div>

      </div>

      {/* CHART LAYOUT */}
      <div className="chart-grid">

        <div className="chart-card glass">
          <h3>Booking Status</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={110}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card glass">
          <h3>Room Usage</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={pieData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* BIG FEATURE CHART */}
        <div className="chart-card wide glass">
  <h3>📈 Booking Comparison</h3>

  <ResponsiveContainer width="100%" height={340}>
    <LineChart data={pieData}>

      {/* GRID */}
      <CartesianGrid strokeDasharray="3 3" />

      {/* X AXIS LABEL */}
      <XAxis 
        dataKey="name" 
        label={{ value: "Booking Status", position: "insideBottom", offset: -5 }}
      />

      {/* Y AXIS LABEL */}
      <YAxis 
        label={{ value: "Number of Bookings", angle: -90, position: "insideLeft" }}
      />

      {/* TOOLTIP */}
      <Tooltip />

      {/* LINE */}
      <Line
        type="monotone"
        dataKey="value"
        stroke="#8b5cf6"
        strokeWidth={3}
        dot={{ r: 6 }}   // 👈 shows dots
        activeDot={{ r: 8 }}
      />

    </LineChart>
  </ResponsiveContainer>
</div>

      </div>
    </div>
  );
}

export default AdminCharts;