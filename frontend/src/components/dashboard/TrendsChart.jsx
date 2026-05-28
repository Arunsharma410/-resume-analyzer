// frontend/src/components/dashboard/TrendsChart.jsx
// 📈 7-day trends line chart

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import Card from '@components/ui/Card';
import { TrendingUp } from 'lucide-react';

const TrendsChart = ({ data = [], loading = false }) => {
  // 📅 Format date for display (Mon, Tue, etc.)
  const formattedData = data.map(item => ({
    ...item,
    day: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
  }));

  return (
    <Card variant="glass" className="h-full">
      <Card.Header>
        <div className="flex justify-between items-center">
          <div>
            <Card.Title>
              <span className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-500" />
                Analysis Trends
              </span>
            </Card.Title>
            <Card.Description>Last 7 days activity</Card.Description>
          </div>
        </div>
      </Card.Header>

      <div className="h-72">
        {loading ? (
          <div className="h-full bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              {/* 🎨 Gradient definitions */}
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366F1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#8B5CF6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-white/10" />
              <XAxis
                dataKey="day"
                className="text-xs"
                tick={{ fill: 'currentColor', opacity: 0.6 }}
              />
              <YAxis
                domain={[0, 100]}
                className="text-xs"
                tick={{ fill: 'currentColor', opacity: 0.6 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(19, 19, 26, 0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                }}
                labelStyle={{ color: '#94a3b8' }}
              />

              <Area
                type="monotone"
                dataKey="avgScore"
                stroke="#6366F1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorScore)"
                name="Match Score"
              />
              <Area
                type="monotone"
                dataKey="avgAts"
                stroke="#8B5CF6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAts)"
                name="ATS Score"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* 🔖 Legend */}
      {!loading && (
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary-500" />
            <span className="text-slate-600 dark:text-slate-400">Match Score</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-secondary-500" />
            <span className="text-slate-600 dark:text-slate-400">ATS Score</span>
          </span>
        </div>
      )}
    </Card>
  );
};

export default TrendsChart;