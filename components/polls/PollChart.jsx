'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useState } from 'react';

// Blue theme colors matching your dashboard
const COLORS = ['#3B82F6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6B7280'];

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-4 rounded-xl shadow-lg border border-blue-100">
        <p className="font-semibold text-gray-800 mb-2">{data.payload.name}</p>
        <p className="text-blue-600">
          <span className="font-medium">Votes:</span> {data.value}
        </p>
        <p className="text-gray-600 text-sm">
          <span className="font-medium">Percentage:</span> {((data.value / payload[0].payload.total) * 100).toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

// Custom Legend Component
const CustomLegend = ({ payload }) => (
  <div className="flex flex-wrap justify-center gap-4 mt-6">
    {payload.map((entry, index) => (
      <div key={index} className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: entry.color }}
        ></div>
        <span className="text-sm font-medium text-gray-700">{entry.value}</span>
      </div>
    ))}
  </div>
);

// Chart View Toggle Buttons
const ViewToggle = ({ currentView, onViewChange }) => (
  <div className="flex bg-blue-50 rounded-xl p-1 mb-6 max-w-fit mx-auto">
    <button
      onClick={() => onViewChange('pie')}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        currentView === 'pie'
          ? 'bg-blue-500 text-white shadow-md'
          : 'text-blue-600 hover:bg-blue-100'
      }`}
    >
      <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2a8 8 0 018 8 8 8 0 01-16 0 8 8 0 018-8zM2 10a8 8 0 008 8V10H2z"/>
      </svg>
      Pie Chart
    </button>
    <button
      onClick={() => onViewChange('bar')}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        currentView === 'bar'
          ? 'bg-blue-500 text-white shadow-md'
          : 'text-blue-600 hover:bg-blue-100'
      }`}
    >
      <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
      </svg>
      Bar Chart
    </button>
  </div>
);

// Loading Skeleton
const ChartSkeleton = () => (
  <div className="animate-pulse">
    <div className="w-full h-96 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
      <div className="text-blue-300">
        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a8 8 0 018 8 8 8 0 01-16 0 8 8 0 018-8z"/>
        </svg>
      </div>
    </div>
    <div className="flex justify-center gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-6 bg-blue-100 rounded w-20"></div>
      ))}
    </div>
  </div>
);

export default function PollChart({ data, title = "Poll Results", loading = false }) {
  const [viewType, setViewType] = useState('pie');

  // Add total count to data for percentage calculation
  const totalVotes = data?.reduce((sum, item) => sum + item.votes, 0) || 0;
  const enrichedData = data?.map(item => ({
    ...item,
    total: totalVotes
  })) || [];

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
        <ChartSkeleton />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-12 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
        <p className="text-gray-500">No votes have been cast yet for this poll</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">
          Total Votes: <span className="font-semibold text-blue-600">{totalVotes.toLocaleString()}</span>
        </p>
      </div>

      {/* View Toggle */}
      <ViewToggle currentView={viewType} onViewChange={setViewType} />

      {/* Chart Container */}
      <div className="bg-gradient-to-br from-blue-25 to-blue-50 rounded-2xl p-6">
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            {viewType === 'pie' ? (
              <PieChart>
                <Pie
                  data={enrichedData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => 
                    `${name}: ${(percent * 100).toFixed(1)}%`
                  }
                  outerRadius={140}
                  fill="#8884d8"
                  dataKey="votes"
                  nameKey="name"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {enrichedData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
              </PieChart>
            ) : (
              <BarChart data={enrichedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="votes" 
                  radius={[4, 4, 0, 0]}
                  animationBegin={0}
                  animationDuration={800}
                >
                  {enrichedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-xl text-center">
          <p className="text-2xl font-bold text-blue-600">{data.length}</p>
          <p className="text-sm text-blue-800 font-medium">Options</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl text-center">
          <p className="text-2xl font-bold text-green-600">{totalVotes}</p>
          <p className="text-sm text-green-800 font-medium">Total Votes</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-xl text-center">
          <p className="text-2xl font-bold text-amber-600">
            {data.length > 0 ? Math.round(totalVotes / data.length) : 0}
          </p>
          <p className="text-sm text-amber-800 font-medium">Avg per Option</p>
        </div>
      </div>
    </div>
  );
}
