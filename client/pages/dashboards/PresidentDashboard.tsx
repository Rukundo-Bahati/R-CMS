import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Users, User, Calendar, Clock, AlertCircle, TrendingUp, TrendingDown, Building2, Users2, HandCoins, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock data - Replace with actual API calls in production
const totalMembers = 256;
const totalDepartments = 8;
const totalCommitteeMembers = 15;
const totalOfferings = 12500;

// Mock data for departments
const departmentData = [
  { name: "Worship", members: 25, color: "#4f46e5" },
  { name: "Youth", members: 32, color: "#10b981" },
  { name: "Women's Ministry", members: 28, color: "#f59e0b" },
  { name: "Men's Ministry", members: 22, color: "#8b5cf6" },
  { name: "Children's Ministry", members: 18, color: "#ec4899" },
  { name: "Evangelism", members: 20, color: "#14b8a6" },
];

// Mock data for offerings by terms (semesters)
const offeringData = [
  { 
    term: "Term 1", 
    period: "Jan-Apr 2025",
    amount: 8500,
    year: 2025,
    color: "#4f46e5"
  },
  { 
    term: "Term 2",
    period: "May-Aug 2025",
    amount: 9200,
    year: 2025,
    color: "#8b5cf6"
  },
  { 
    term: "Term 3",
    period: "Sep-Dec 2024",
    amount: 7800,
    year: 2024,
    color: "#a78bfa"
  },
  { 
    term: "Term 1",
    period: "Jan-Apr 2024",
    amount: 8200,
    year: 2024,
    color: "#4f46e5"
  },
  { 
    term: "Term 2",
    period: "May-Aug 2024",
    amount: 9100,
    year: 2024,
    color: "#8b5cf6"
  },
  { 
    term: "Term 3",
    period: "Sep-Dec 2023",
    amount: 8000,
    year: 2023,
    color: "#a78bfa"
  },
];

// Mock data for committee members
const committeeMembers = [
  { id: 1, name: "John Doe", role: "Chairperson", department: "Leadership" },
  { id: 2, name: "Jane Smith", role: "Vice Chair", department: "Leadership" },
  { id: 3, name: "Robert Johnson", role: "Secretary", department: "Administration" },
  { id: 4, name: "Emily Davis", role: "Treasurer", department: "Finance" },
];

// Mock data for equipment
const equipmentData = [
  { id: 1, name: "PA System", category: "Audio", status: "In Use", location: "Main Hall" },
  { id: 2, name: "Projector", category: "AV", status: "Maintenance", location: "Main Hall" },
  { id: 3, name: "Drum Set", category: "Musical", status: "In Use", location: "Worship Room" },
];

const recentActivities = [
  { id: 1, title: "New member registered", time: "2 hours ago", type: "info" },
  { id: 2, title: "Upcoming event: Leadership Meeting", time: "1 day ago", type: "event" },
  { id: 3, title: "New equipment purchased", time: "2 days ago", type: "info" },
  { id: 4, title: "Monthly financial report generated", time: "1 week ago", type: "report" },
];

const upcomingEvents = [
  { id: 1, title: "Leadership Meeting", date: "2025-12-15", location: "Conference Room" },
  { id: 2, title: "Church Anniversary", date: "2026-01-10", location: "Main Hall" },
  { id: 3, title: "Annual General Meeting", date: "2026-01-25", location: "Main Hall" },
];

// Define color variants for different card types
const cardVariants = {
  default: {
    bg: 'bg-white',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    text: 'text-gray-900',
    border: 'border border-gray-200',
  },
  primary: {
    bg: 'bg-primary',
    iconBg: 'bg-white/20',
    iconColor: 'text-white',
    text: 'text-white',
    border: 'border-primary',
  },
  secondary: {
    bg: 'bg-white',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    text: 'text-gray-900',
    border: 'border border-gray-200',
  },
  accent: {
    bg: 'bg-white',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    text: 'text-gray-900',
    border: 'border border-gray-200',
  },
} as const;

type CardVariant = keyof typeof cardVariants;

const StatCard = ({
  icon,
  title,
  value,
  variant = 'default',
  trend,
  trendLabel,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  variant?: CardVariant;
  trend?: number;
  trendLabel?: string;
}) => {
  const variantStyles = cardVariants[variant] || cardVariants.default;
  
  return (
    <Card className={`p-5 ${variantStyles.bg} ${variantStyles.border} shadow-sm`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium ${variantStyles.text} opacity-80`}>{title}</p>
          <p className={`text-2xl font-semibold mt-1 ${variantStyles.text}`}>
            {value}
          </p>
          {trend !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              <span>{Math.abs(trend)}% {trendLabel}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${variantStyles.iconBg}`}>
          <div className={variantStyles.iconColor}>{icon}</div>
        </div>
      </div>
    </Card>
  );
};

const ActivityItem = ({ title, time, type }: { title: string; time: string; type: string }) => {
  const getIcon = () => {
    switch (type) {
      case 'event':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'report':
        return <FileText className="w-4 h-4 text-green-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex items-start gap-3 py-2">
      <div className="mt-0.5">{getIcon()}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
};

export default function PresidentDashboard() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // Calculate total offerings from the last 6 months
  const totalLast6Months = offeringData.reduce((sum, month) => sum + month.amount, 0);
  const avgMonthlyOffering = Math.round(totalLast6Months / 6);

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">President's Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's an overview of the church.</p>
        </div>
        <div className="flex items-center bg-white p-1.5 rounded-lg shadow-sm border border-gray-100">
          <Button 
            variant={timeRange === 'week' ? 'default' : 'ghost'} 
            size="sm"
            className="px-3"
            onClick={() => setTimeRange('week')}
          >
            Week
          </Button>
          <Button 
            variant={timeRange === 'month' ? 'default' : 'ghost'} 
            size="sm"
            className="px-3"
            onClick={() => setTimeRange('month')}
          >
            Month
          </Button>
          <Button 
            variant={timeRange === 'year' ? 'default' : 'ghost'} 
            size="sm"
            className="px-3"
            onClick={() => setTimeRange('year')}
          >
            Year
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="w-5 h-5" />}
          title="Total Church Members"
          value={totalMembers.toLocaleString()}
          variant="primary"
        
        />
        <StatCard
          icon={<Building2 className="w-5 h-5" />}
          title="Total Departments"
          value={totalDepartments}
          variant="secondary"
        />
        <StatCard
          icon={<Users2 className="w-5 h-5" />}
          title="Committee Members"
          value={totalCommitteeMembers}
          variant="default"
        />
        <StatCard
          icon={<HandCoins className="w-5 h-5" />}
          title="Total Offerings"
          value={`$${totalOfferings.toLocaleString()}`}
          variant="default"
          trendLabel=""
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Department Distribution</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="text-xs">View All</Button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="members"
                  label={false}
                  labelLine={false}
                >
                  {departmentData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => {
                    const total = departmentData.reduce((sum, dept) => sum + dept.members, 0);
                    const percentage = ((props.payload.members / total) * 100).toFixed(1);
                    return [
                      `${props.payload.members} members (${percentage}%)`,
                      props.payload.name
                    ];
                  }}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend 
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  formatter={(value) => {
                    const entry = departmentData.find(d => d.name === value);
                    return (
                      <span className="text-sm text-gray-600">
                        {value} ({entry?.members} members)
                      </span>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {departmentData.map((dept, index) => {
              const total = departmentData.reduce((sum, d) => sum + d.members, 0);
              const percentage = ((dept.members / total) * 100).toFixed(0);
              return (
                <div key={index} className="flex items-center bg-white/50 px-2 py-1 rounded-md">
                  <div 
                    className="w-3 h-3 rounded-full mr-1.5" 
                    style={{ backgroundColor: dept.color }}
                  />
                  <span className="text-xs font-medium text-gray-700">{dept.name}</span>
                  <span className="ml-1 text-xs text-gray-500">• {dept.members}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Offerings by Term */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Offerings by Term</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="text-xs">View All</Button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={[...offeringData].sort((a, b) => b.year - a.year || a.term.localeCompare(b.term))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="period" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tickFormatter={(value) => `$${value}`}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                  labelFormatter={(label, payload) => {
                    if (!payload.length) return label;
                    const data = payload[0].payload;
                    return `${data.term} (${data.period})`;
                  }}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="amount" 
                  name="Offerings"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={60}
                >
                  {offeringData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
                <Legend 
                  content={() => (
                    <div className="flex justify-center space-x-4 mt-2">
                      {[
                        { name: 'Term 1', color: '#4f46e5' },
                        { name: 'Term 2', color: '#8b5cf6' },
                        { name: 'Term 3', color: '#a78bfa' },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-sm mr-1" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-xs text-gray-600">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Activities</h3>
            <Button variant="ghost" size="sm" className="text-primary">
              View All
            </Button>
          </div>
          <div className="space-y-2">
            {recentActivities.map((activity) => (
              <ActivityItem
                key={activity.id}
                title={activity.title}
                time={activity.time}
                type={activity.type}
              />
            ))}
          </div>
        </Card>

        {/* Upcoming Events */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Upcoming Events</h3>
            <Button variant="ghost" size="sm" className="text-primary">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{event.title}</p>
                  <p className="text-sm text-gray-500">{event.date} • {event.location}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card className="p-6 bg-primary text-white">
            <h3 className="text-lg font-semibold mb-4">Committee Members</h3>
            <div className="space-y-3">
              {committeeMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{member.name}</p>
                    <p className="text-sm text-white/80">{member.role}</p>
                  </div>
                </div>
              ))}
              <Button variant="secondary" className="w-full mt-2 bg-white text-primary hover:bg-white/90">
                View All Committee
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Equipment Status</h3>
            <div className="space-y-3">
              {equipmentData.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.status === 'In Use' 
                      ? 'bg-green-100 text-green-800' 
                      : item.status === 'Maintenance' 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2">
                View All Equipment
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
