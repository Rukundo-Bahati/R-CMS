import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, BookOpen, Clock, UserCheck, AlertCircle, CheckCircle2, Mic } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from "recharts";

// Mock data for Pastor portal
const totalPreachers = 25;
const totalMembers = 450;
const upcomingSermons = 6;
const plannedEvents = 12;

// Mock data for preaching schedule
const preachingData = [
    { name: "Week 1", scheduled: 8, completed: 7 },
    { name: "Week 2", scheduled: 6, completed: 6 },
    { name: "Week 3", scheduled: 9, completed: 8 },
    { name: "Week 4", scheduled: 7, completed: 6 },
];

// Mock data for recent activities
const recentActivities = [
    { id: 1, title: "Sunday Service Sermon Assigned", time: "2 hours ago", status: "info" },
    { id: 2, title: "Midweek Service Completed", time: "2 days ago", status: "completed" },
    { id: 3, title: "Youth Service Planning", time: "3 days ago", status: "info" },
    { id: 4, title: "Preacher Training Session", time: "1 week ago", status: "completed" },
];

// Mock data for upcoming sermons
const upcomingSermonsData = [
    { id: 1, title: "Sunday Morning Service", date: "2025-12-01", time: "10:00 AM", preacher: "Rev. John Smith", topic: "Faith and Hope" },
    { id: 2, title: "Sunday Evening Service", date: "2025-12-01", time: "06:00 PM", preacher: "Pastor Mary Johnson", topic: "Love in Action" },
    { id: 3, title: "Midweek Service", date: "2025-12-04", time: "07:00 PM", preacher: "Elder David Brown", topic: "Prayer Life" },
    { id: 4, title: "Youth Service", date: "2025-12-07", time: "04:00 PM", preacher: "Pastor Sarah Wilson", topic: "Purpose Driven Life" },
];

const StatCard = ({ 
    icon, 
    title, 
    value, 
    variant = 'default' 
}: { 
    icon: React.ReactNode; 
    title: string; 
    value: string | number; 
    variant?: 'default' | 'primary' 
}) => {
    const bg = variant === 'primary' ? 'bg-primary text-white' : 'bg-white text-gray-900';
    const border = variant === 'primary' ? 'border-primary' : 'border border-gray-200';
    const iconBg = variant === 'primary' ? 'bg-white/20' : 'bg-primary/10';
    const iconColor = variant === 'primary' ? 'text-white' : 'text-primary';
    
    return (
        <Card className={`p-5 ${bg} ${border} shadow-sm`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium opacity-80">{title}</p>
                    <p className="text-2xl font-semibold mt-1">{value}</p>
                </div>
                <div className={`p-3 rounded-lg ${iconBg}`}>
                    <div className={iconColor}>{icon}</div>
                </div>
            </div>
        </Card>
    );
};

export default function PastorDashboard() {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Pastor Dashboard</h1>
                    <p className="text-gray-500 mt-1">Manage preachers, sermons, and pastoral activities</p>
                </div>
                <Button onClick={() => navigate('/dashboard/pastor/schedule')}>
                    View Preaching Schedule
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    icon={<Mic className="w-5 h-5" />} 
                    title="Total Preachers" 
                    value={totalPreachers} 
                    variant="primary" 
                />
                <StatCard 
                    icon={<Users className="w-5 h-5" />} 
                    title="Total Members" 
                    value={totalMembers} 
                />
                <StatCard 
                    icon={<Calendar className="w-5 h-5" />} 
                    title="Upcoming Sermons" 
                    value={upcomingSermons} 
                    variant="primary"
                />
                <StatCard 
                    icon={<BookOpen className="w-5 h-5" />} 
                    title="Planned Events" 
                    value={plannedEvents} 
                />
            </div>

            {/* Charts and Content Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Preaching Schedule Trend */}
                <Card className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Weekly Preaching Schedule</h3>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={preachingData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Legend />
                                <Bar dataKey="scheduled" name="Scheduled" fill="#180e42" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Recent Activities */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Recent Activities</h3>
                    </div>
                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                                <div className={`p-2 rounded-full ${
                                    activity.status === 'completed' 
                                        ? 'bg-green-100 text-green-600' 
                                        : 'bg-blue-100 text-blue-600'
                                }`}>
                                    {activity.status === 'completed' ? (
                                        <CheckCircle2 className="w-4 h-4" />
                                    ) : (
                                        <Clock className="w-4 h-4" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{activity.title}</p>
                                    <p className="text-sm text-gray-500">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Sermons */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Upcoming Sermons</h3>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate('/dashboard/pastor/schedule')}
                        >
                            View All
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {upcomingSermonsData.map((sermon) => (
                            <div key={sermon.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="bg-primary/10 p-2 rounded-lg">
                                    <Mic className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{sermon.title}</p>
                                    <p className="text-sm text-gray-500">{sermon.date} • {sermon.time}</p>
                                    <p className="text-xs text-gray-400 mt-1">Preacher: {sermon.preacher}</p>
                                    <p className="text-xs text-blue-600 mt-1">Topic: {sermon.topic}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Quick Actions */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Quick Actions</h3>
                    </div>
                    <div className="space-y-3">
                        <Button 
                            className="w-full justify-start" 
                            variant="outline"
                            onClick={() => navigate('/dashboard/pastor/preachers')}
                        >
                            <Mic className="w-4 h-4 mr-2" />
                            Manage Preachers
                        </Button>
                        <Button 
                            className="w-full justify-start" 
                            variant="outline"
                            onClick={() => navigate('/dashboard/pastor/members')}
                        >
                            <Users className="w-4 h-4 mr-2" />
                            View Members
                        </Button>
                        <Button 
                            className="w-full justify-start" 
                            variant="outline"
                            onClick={() => navigate('/dashboard/pastor/schedule')}
                        >
                            <Calendar className="w-4 h-4 mr-2" />
                            Preaching Schedule
                        </Button>
                        <Button 
                            className="w-full justify-start" 
                            variant="outline"
                            onClick={() => navigate('/dashboard/pastor/events')}
                        >
                            <BookOpen className="w-4 h-4 mr-2" />
                            Plan Events
                        </Button>
                        <Button 
                            className="w-full justify-start" 
                            variant="outline"
                            onClick={() => navigate('/dashboard/pastor/notes')}
                        >
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Notes & Plans
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}