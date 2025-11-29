import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, Cell, PieChart, Pie } from "recharts";
import { Users, User, Calendar, Clock, AlertCircle, TrendingUp, TrendingDown, Wallet, CheckCircle2, XCircle, Music } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock data
const totalChoirMembers = 45;
const currentTotalContribution = 125000; // RWF or currency
const thisWeekAttendance = 38;
const totalInactive = 5;

// Mock data for attendance trend
const attendanceData = [
    { name: "Week 1", present: 40, absent: 5 },
    { name: "Week 2", present: 38, absent: 7 },
    { name: "Week 3", present: 42, absent: 3 },
    { name: "Week 4", present: 35, absent: 10 },
    { name: "Week 5", present: 38, absent: 7 },
];

// Mock data for voice distribution
const voiceData = [
    { name: "Soprano", value: 15, color: "#0ea5e9" },
    { name: "Alto", value: 12, color: "#f59e0b" },
    { name: "Tenor", value: 10, color: "#180e42" },
    { name: "Bass", value: 8, color: "#10b981" },
];

const recentActivities = [
    { id: 1, title: "Sunday Service Performance", time: "2 days ago", type: "event" },
    { id: 2, title: "Rehearsal Attendance Marked", time: "3 days ago", type: "info" },
    { id: 3, title: "New Robes Contribution Collected", time: "1 week ago", type: "finance" },
];

const upcomingEvents = [
    { id: 1, title: "Christmas Carol Rehearsal", date: "2025-12-10", location: "Main Hall" },
    { id: 2, title: "Regional Choir Competition", date: "2025-12-20", location: "City Center" },
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

export default function ChoirDashboard() {
    const navigate = useNavigate();

    return (
        <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Choir Dashboard</h1>
                    <p className="text-gray-500 mt-1">Overview of choir activities, attendance, and finances.</p>
                </div>
                <Button onClick={() => navigate('/dashboard/choir/attendance')}>
                    Take Attendance
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={<Users className="w-5 h-5" />}
                    title="Total Choir Members"
                    value={totalChoirMembers}
                    variant="primary"
                />
                <StatCard
                    icon={<Wallet className="w-5 h-5" />}
                    title="Total Contributions"
                    value={`RWF ${currentTotalContribution.toLocaleString()}`}
                    variant="default"
                />
                <StatCard
                    icon={<CheckCircle2 className="w-5 h-5" />}
                    title="This Week Attendance"
                    value={thisWeekAttendance}
                    variant="primary"
                />
                <StatCard
                    icon={<XCircle className="w-5 h-5" />}
                    title="Inactive Members"
                    value={totalInactive}
                    variant="default"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Attendance Trend */}
                <Card className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Attendance Trend</h3>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={attendanceData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Legend />
                                <Bar dataKey="present" name="Present" fill="#180e42" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="absent" name="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Voice Distribution */}
                <Card className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Voice Distribution</h3>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={voiceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {voiceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activities */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Recent Activities</h3>
                    </div>
                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                                <div className={`p-2 rounded-full ${activity.type === 'event' ? 'bg-blue-100 text-blue-600' :
                                    activity.type === 'finance' ? 'bg-green-100 text-green-600' :
                                        'bg-gray-100 text-gray-600'
                                    }`}>
                                    {activity.type === 'event' ? <Calendar className="w-4 h-4" /> :
                                        activity.type === 'finance' ? <Wallet className="w-4 h-4" /> :
                                            <Clock className="w-4 h-4" />}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{activity.title}</p>
                                    <p className="text-sm text-gray-500">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Upcoming Events */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Upcoming Events</h3>
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
            </div>
        </div>
    );
}
