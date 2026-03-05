import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, Cell } from "recharts";
import { Users, User, Calendar, Clock, AlertCircle, TrendingUp, TrendingDown, Building2, Users2, HandCoins, FileText, Shield, Mail } from "lucide-react";
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

const committeeMembers = [
    { id: 1, name: "John Doe", role: "Chairperson", department: "Leadership" },
    { id: 2, name: "Jane Smith", role: "Vice Chair", department: "Leadership" },
    { id: 3, name: "Robert Johnson", role: "Secretary", department: "Administration" },
    { id: 4, name: "Emily Davis", role: "Treasurer", department: "Finance" },
];

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

const cardVariants = {
    default: {
        bg: 'bg-card',
        iconBg: 'bg-primary/10',
        iconColor: 'text-primary',
        text: 'text-card-foreground',
        border: 'border border-border',
    },
    primary: {
        bg: 'bg-primary',
        iconBg: 'bg-white/20',
        iconColor: 'text-white',
        text: 'text-primary-foreground',
        border: 'border-primary',
    },
    secondary: {
        bg: 'bg-secondary',
        iconBg: 'bg-primary/10',
        iconColor: 'text-primary',
        text: 'text-secondary-foreground',
        border: 'border border-border',
    },
    accent: {
        bg: 'bg-accent',
        iconBg: 'bg-primary/10',
        iconColor: 'text-primary',
        text: 'text-accent-foreground',
        border: 'border border-border',
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
                return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
        }
    };

    return (
        <div className="flex items-start gap-3 py-2 border-b border-border last:border-0">
            <div className="mt-0.5">{getIcon()}</div>
            <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">{time}</p>
            </div>
        </div>
    );
};

export default function AdminDashboard() {
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                        <Shield className="w-8 h-8 text-indigo-600" />
                        System Administrator Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-1">Full system overview and management control.</p>
                </div>
                <div className="flex items-center bg-card p-1.5 rounded-lg shadow-sm border border-border">
                    <Button
                        variant={timeRange === 'week' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setTimeRange('week')}
                    >
                        Week
                    </Button>
                    <Button
                        variant={timeRange === 'month' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setTimeRange('month')}
                    >
                        Month
                    </Button>
                    <Button
                        variant={timeRange === 'year' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setTimeRange('year')}
                    >
                        Year
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={<Users className="w-5 h-5" />}
                    title="Total Members"
                    value={totalMembers.toLocaleString()}
                    variant="primary"
                />
                <StatCard
                    icon={<Building2 className="w-5 h-5" />}
                    title="Departments"
                    value={totalDepartments}
                    variant="secondary"
                />
                <StatCard
                    icon={<Users2 className="w-5 h-5" />}
                    title="Admins"
                    value={2}
                    variant="primary"
                />
                <StatCard
                    icon={<HandCoins className="w-5 h-5" />}
                    title="Financial Summary"
                    value={`$${totalOfferings.toLocaleString()}`}
                    variant="default"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 text-card-foreground">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Department Growth</h3>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={departmentData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                                />
                                <Line type="monotone" dataKey="members" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-foreground">Revenue Overview</h3>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={offeringData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="term" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                                />
                                <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-6 overflow-hidden">
                    <h3 className="text-lg font-semibold mb-4">System Alerts</h3>
                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <ActivityItem key={activity.id} {...activity} />
                        ))}
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Upcoming Schedule</h3>
                    <div className="space-y-4">
                        {upcomingEvents.map((event) => (
                            <div key={event.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                <Calendar className="w-5 h-5 text-primary" />
                                <div>
                                    <p className="font-medium">{event.title}</p>
                                    <p className="text-sm text-muted-foreground">{event.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Quick Shortcuts</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => navigate('/dashboard/admin/members')}>
                            <Users className="w-5 h-5" />
                            <span>Members</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => navigate('/dashboard/admin/messages')}>
                            <Mail className="w-5 h-5" />
                            <span>Messages</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => navigate('/dashboard/admin/departments')}>
                            <Building2 className="w-5 h-5" />
                            <span>Departments</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => navigate('/dashboard/admin/finance')}>
                            <HandCoins className="w-5 h-5" />
                            <span>Finance</span>
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
