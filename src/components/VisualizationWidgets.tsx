import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function IncidentTrendsChart() {
  const data = [
    { month: 'Jan', critical: 12, high: 28, medium: 45, low: 32 },
    { month: 'Feb', critical: 8, high: 32, medium: 38, low: 28 },
    { month: 'Mar', critical: 15, high: 35, medium: 42, low: 35 },
    { month: 'Apr', critical: 10, high: 25, medium: 40, low: 30 },
    { month: 'May', critical: 6, high: 22, medium: 35, low: 25 },
    { month: 'Jun', critical: 9, high: 28, medium: 38, low: 28 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incident Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={2} />
            <Line type="monotone" dataKey="high" stroke="#f97316" strokeWidth={2} />
            <Line type="monotone" dataKey="medium" stroke="#eab308" strokeWidth={2} />
            <Line type="monotone" dataKey="low" stroke="#22c55e" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ErrorFrequencyChart() {
  const data = [
    { errorCode: 'ERR-001', frequency: 45 },
    { errorCode: 'ERR-042', frequency: 38 },
    { errorCode: 'ERR-117', frequency: 32 },
    { errorCode: 'ERR-203', frequency: 28 },
    { errorCode: 'ERR-315', frequency: 25 },
    { errorCode: 'ERR-422', frequency: 22 },
    { errorCode: 'ERR-501', frequency: 18 },
    { errorCode: 'ERR-608', frequency: 15 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Error Codes by Frequency</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="errorCode" type="category" width={80} />
            <Tooltip />
            <Bar dataKey="frequency" fill="#3b82f6" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function DocumentLifecycleChart() {
  const data = [
    { type: 'BRD', draft: 12, approved: 45, archived: 23 },
    { type: 'PCR', draft: 8, approved: 52, archived: 18 },
    { type: 'FSD', draft: 15, approved: 38, archived: 15 },
    { type: 'TSD', draft: 10, approved: 42, archived: 12 },
    { type: 'Test', draft: 6, approved: 35, archived: 8 },
    { type: 'Deploy', draft: 3, approved: 28, archived: 5 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Lifecycle Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="draft" fill="#94a3b8" stackId="a" radius={[0, 0, 0, 0]} />
            <Bar dataKey="approved" fill="#22c55e" stackId="a" radius={[0, 0, 0, 0]} />
            <Bar dataKey="archived" fill="#64748b" stackId="a" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ErrorHeatmap() {
  const modules = ['Auth', 'Payment', 'Inventory', 'Reporting', 'Notification'];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Generate random data for heatmap
  const heatmapData = modules.map((module) => ({
    module,
    data: days.map((day) => ({
      day,
      count: Math.floor(Math.random() * 30),
    })),
  }));

  const getColor = (count: number) => {
    if (count === 0) return '#f1f5f9';
    if (count < 5) return '#bfdbfe';
    if (count < 10) return '#60a5fa';
    if (count < 20) return '#3b82f6';
    return '#1e40af';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Error Frequency Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Legend */}
          <div className="flex items-center justify-end gap-2 mb-4 text-xs text-slate-600">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f1f5f9' }} />
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#bfdbfe' }} />
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#60a5fa' }} />
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }} />
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#1e40af' }} />
            </div>
            <span>More</span>
          </div>

          {/* Heatmap Grid */}
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Day labels */}
              <div className="flex mb-2">
                <div className="w-24" />
                {days.map((day) => (
                  <div key={day} className="w-12 text-center text-xs text-slate-600">
                    {day}
                  </div>
                ))}
              </div>

              {/* Module rows */}
              {heatmapData.map((moduleData) => (
                <div key={moduleData.module} className="flex items-center mb-1">
                  <div className="w-24 text-sm text-slate-600 pr-2">{moduleData.module}</div>
                  <div className="flex gap-1">
                    {moduleData.data.map((dayData) => (
                      <div
                        key={dayData.day}
                        className="w-12 h-12 rounded border border-slate-200 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                        style={{ backgroundColor: getColor(dayData.count) }}
                        title={`${moduleData.module} - ${dayData.day}: ${dayData.count} errors`}
                      >
                        <span className="text-xs">{dayData.count > 0 ? dayData.count : ''}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
