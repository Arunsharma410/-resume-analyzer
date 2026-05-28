// frontend/src/components/dashboard/ScoreDistribution.jsx
// 🥧 Score distribution pie chart

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Card from '@components/ui/Card';
import { PieChart as PieIcon } from 'lucide-react';

const ScoreDistribution = ({ data = {}, loading = false }) => {
  // 🎨 Convert object to array for chart
  const chartData = [
    { name: 'Excellent (80+)',   value: data.excellent || 0, color: '#10B981' },
    { name: 'Good (60-79)',      value: data.good      || 0, color: '#6366F1' },
    { name: 'Average (40-59)',   value: data.average   || 0, color: '#F59E0B' },
    { name: 'Needs work (<40)',  value: data.poor      || 0, color: '#EF4444' },
  ];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card variant="glass" className="h-full">
      <Card.Header>
        <Card.Title>
          <span className="flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-primary-500" />
            Score Distribution
          </span>
        </Card.Title>
        <Card.Description>Quality of your analyses</Card.Description>
      </Card.Header>

      {loading ? (
        <div className="h-72 bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse" />
      ) : total === 0 ? (
        <div className="h-72 flex flex-col items-center justify-center text-center">
          <PieIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
          <p className="text-slate-500 dark:text-slate-400">No data yet</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Analyze your first resume to see results
          </p>
        </div>
      ) : (
        <>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(19, 19, 26, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 🔖 Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 dark:text-slate-400 truncate">
                  {item.name}
                </span>
                <span className="font-semibold text-slate-900 dark:text-white ml-auto">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
};

export default ScoreDistribution;