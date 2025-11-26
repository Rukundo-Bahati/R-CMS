import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  Cell,
} from "recharts";
import { Users, User, Calendar, Clock, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { initialFamilies } from "@/data/families";

// Process family data to get member counts
const getFamilyMemberCounts = () => {
  return initialFamilies.map(family => {
    // Count parents (pere and mere) and other members
    const parents = [family.pere, family.mere].filter(Boolean);
    const parentCount = parents.length;
    const memberCount = family.members.length;
    const totalMembers = parentCount + memberCount;
    
    // Combine parents and members for full member list
    const allMembers = [
      ...parents,
      ...family.members
    ];
    
    return {
      id: family.id,
      name: family.name,
      value: totalMembers,
      color: getFamilyColor(family.id),
      generation: family.generation,
      parentCount,
      memberCount,
      members: allMembers // Include the full member list
    };
  });
};

// Assign consistent colors to families based on ID
const getFamilyColor = (id: string) => {
  const colors = ["#4f46e5", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6"];
  return colors[parseInt(id) % colors.length];
};

const familyData = getFamilyMemberCounts();
const totalMembers = familyData.reduce((sum, family) => sum + family.value, 0);

// Format family data with both count and percentage for display
const getFormattedFamilyData = () => {
  return familyData.map(family => ({
    ...family,
    percentage: Math.round((family.value / totalMembers) * 100),
    displayName: `${family.name} (${family.generation})`
  }));
};

// Prepare family data for the bar chart
const getFamilyGrowthData = () => {
  return getFormattedFamilyData().map(family => ({
    name: family.name,
    totalMembers: family.value,
    generation: family.generation,
    color: family.color
  }));
};

const familyGrowthData = getFamilyGrowthData();

const recentActivities = [
  { id: 1, title: "New member registered", time: "2 hours ago", type: "info" },
  { id: 2, title: "Upcoming event: Family Gathering", time: "1 day ago", type: "event" },
  { id: 3, title: "New family group created", time: "2 days ago", type: "info" },
  { id: 4, title: "Monthly report generated", time: "1 week ago", type: "report" },
];

const upcomingEvents = [
  { id: 1, title: "Family Reunion", date: "2025-12-15", location: "Main Hall" },
  { id: 2, title: "Y1 Orientation", date: "2026-01-10", location: "Classroom 1" },
  { id: 3, title: "Annual Meeting", date: "2026-01-25", location: "Conference Room" },
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
    bg: 'bg-secondary',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    text: 'text-gray-900',
    border: 'border-secondary',
  },
  accent: {
    bg: 'bg-accent',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    text: 'text-gray-900',
    border: 'border-accent',
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
  const colors = cardVariants[variant];
  
  return (
    <Card className={`p-6 h-full transition-all duration-300 hover:shadow-md ${colors.bg} ${colors.border} ${colors.text}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 ${colors.iconBg} ${colors.iconColor} rounded-lg`}>
              {icon}
            </div>
            <p className={`text-sm font-medium ${variant === 'primary' ? 'text-white/90' : 'text-gray-600'}`}>
              {title}
            </p>
          </div>
          <p className="text-3xl font-bold mb-2">{value}</p>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend >= 0 ? (
              <TrendingUp className="w-5 h-5 mr-1" />
            ) : (
              <TrendingDown className="w-5 h-5 mr-1" />
            )}
            <span className="text-sm font-medium">
              {Math.abs(trend)}% {trendLabel}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

const ActivityItem = ({ title, time, type }: { title: string; time: string; type: string }) => {
  const getIcon = () => {
    switch (type) {
      case 'event':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'report':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="flex items-start gap-3 py-2">
      <div className="mt-1">
        {getIcon()}
      </div>
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{time}</p>
      </div>
    </div>
  );
};

export default function GrandPereMereDashboard() {
  const [timeRange, setTimeRange] = useState('month');
  
  // Get family data with members included
  const familyData = getFormattedFamilyData();
  
  // Calculate total members
  const totalMembers = familyData.reduce((sum, family) => sum + family.value, 0);
  
  // Calculate gender and class statistics
  let totalMale = 0;
  let totalFemale = 0;
  let totalY1 = 0;
  let totalY2 = 0;
  let totalY3 = 0;

  familyData.forEach(family => {
    if (family.members && Array.isArray(family.members)) {
      family.members.forEach(member => {
        if (member.gender === 'M') totalMale++;
        if (member.gender === 'F') totalFemale++;
        
        if (member.class === 'Y1') totalY1++;
        if (member.class === 'Y2') totalY2++;
        if (member.class === 'Y3') totalY3++;
      });
    }
  });
  
  const totalFamilies = familyData.length;
  const activeEvents = 3;

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your community.</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          icon={<Users className="w-6 h-6" />} 
          title="Total Members" 
          value={totalMembers}
          variant="primary"
        />
        <StatCard 
          icon={<User className="w-6 h-6" />} 
          title="Total Boys" 
          value={totalMale}
          variant="secondary"
        />
        <StatCard 
          icon={<User className="w-6 h-6" />} 
          title="Total Girls" 
          value={totalFemale}
          variant="primary"
        />
        <StatCard 
          icon={<Users className="w-6 h-6" />} 
          title="Total Families" 
          value={totalFamilies}
          variant="secondary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Family Distribution */}
        <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Families Distribution</h3>
              <p className="text-sm text-gray-500">Member count by family</p>
            </div>
            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">
              View All
            </Button>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getFormattedFamilyData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => [`${value} members`, 'Members']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#180e42"
                  strokeWidth={3}
                  dot={{ fill: '#180e42', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Members Growth */}
        <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Members Growth</h3>
              <p className="text-sm text-gray-500">Monthly member count by family</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-gray-300">
                <span className="mr-2">Export</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </Button>
            </div>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={familyGrowthData}
                margin={{
                  top: 5,
                  right: 20,
                  left: 0,
                  bottom: 5,
                }}
                barCategoryGap="15%"
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#180e42' }}
                  height={50}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#180e42' }}
                />
                <Tooltip 
                  formatter={(value, name, props) => {
                    const { payload } = props;
                    return [
                      `${payload.name} (${payload.generation} generation)`,
                      `${value} members`
                    ];
                  }}
                  contentStyle={{
                    background: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                />
                <Bar
                  dataKey="totalMembers"
                  name="Members"
                  radius={[4, 4, 0, 0]}
                >
                  {familyGrowthData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill="#180e42"
                      className="hover:opacity-90 transition-opacity"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
              <p className="text-sm text-gray-500">Latest updates and actions</p>
            </div>
            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">
              View All
            </Button>
          </div>
          <div className="space-y-4">
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
        <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
              <p className="text-sm text-gray-500">Scheduled activities and meetings</p>
            </div>
            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div 
                key={event.id} 
                className="flex items-center p-4 bg-white rounded-lg border border-gray-100 hover:border-primary/20 hover:shadow-sm transition-all"
              >
                <div className="bg-primary/10 p-2.5 rounded-lg mr-4">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{event.title}</h4>
                  <div className="flex items-center text-sm text-gray-500 mt-1 flex-wrap gap-x-2">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="ml-4 whitespace-nowrap">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Student Distribution */}
      <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Student Distribution</h3>
            <p className="text-sm text-gray-500">Breakdown by year level</p>
          </div>
          <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">
            View Details
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { title: 'Y1 Students', value: totalY1, color: 'bg-primary/20', progressColor: 'bg-primary/80', textColor: 'text-primary' },
            { title: 'Y2 Students', value: totalY2, color: 'bg-primary/10', progressColor: 'bg-primary/60', textColor: 'text-primary/90' },
            { title: 'Y3 Students', value: totalY3, color: 'bg-primary/5', progressColor: 'bg-primary/40', textColor: 'text-primary/80' },
          ].map((item, index) => (
            <div key={index} className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-medium ${item.textColor}`}>{item.title}</span>
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-gray-900">{item.value}</span>
                <span className="ml-2 text-sm text-gray-500">students</span>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full ${item.progressColor}`} 
                    style={{ width: `${(item.value / Math.max(totalY1, totalY2, totalY3, 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
