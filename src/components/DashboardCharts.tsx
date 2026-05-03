"use client"

import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts"

interface CreatorProps {
  role: "creator"
  viewsData: Record<string, string | number>[]
  earningsData: Record<string, string | number>[]
  topVideos: { name: string; Views: number; Earnings: number }[]
}

interface BrandProps {
  role: "brand"
  spendData: Record<string, string | number>[]
  categoryData: { name: string; Licenses: number }[]
}

type Props = CreatorProps | BrandProps

export default function DashboardCharts(props: Props) {
  if (props.role === "creator") {
    return <CreatorCharts {...props} />
  }
  return <BrandCharts {...props} />
}

function CreatorCharts({ viewsData, earningsData, topVideos }: Omit<CreatorProps, "role">) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-2">
      <ChartCard title="Views this week" subtitle="Daily video views">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={viewsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 13 }} />
            <Line type="monotone" dataKey="Views" stroke="#7c3aed" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Earnings this week" subtitle="Daily revenue (USD)">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={earningsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 13 }} formatter={(v) => [`$${v}`, "Earnings"]} />
            <Bar dataKey="Earnings" fill="#7c3aed" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {topVideos.length > 0 && (
        <div className="lg:col-span-2">
          <ChartCard title="Top Videos" subtitle="Views & earnings by video">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topVideos} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Legend />
                <Bar dataKey="Views" fill="#7c3aed" radius={[0, 4, 4, 0]} />
                <Bar dataKey="Earnings" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}
    </div>
  )
}

function BrandCharts({ spendData, categoryData }: Omit<BrandProps, "role">) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-2">
      <ChartCard title="Spend this week" subtitle="Daily licensing spend (USD)">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={spendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 13 }} formatter={(v) => [`$${v}`, "Spent"]} />
            <Line type="monotone" dataKey="Spent" stroke="#7c3aed" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {categoryData.length > 0 ? (
        <ChartCard title="Licenses by Category" subtitle="Content categories you've licensed">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 13 }} />
              <Bar dataKey="Licenses" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      ) : (
        <ChartCard title="Licenses by Category" subtitle="Start licensing videos to see data">
          <div className="h-[200px] flex items-center justify-center text-slate-300 text-sm">No data yet</div>
        </ChartCard>
      )}
    </div>
  )
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <h3 className="font-bold text-slate-800 text-base mb-0.5">{title}</h3>
      <p className="text-xs text-slate-400 mb-4">{subtitle}</p>
      {children}
    </div>
  )
}
