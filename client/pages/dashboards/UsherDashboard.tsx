import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Package, UserCheck, Calendar, Clock, DoorOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// Mock data for Usher portal
const totalMembers = 120;
const totalAssets = 35;
const weeklyAttendance = 95;
const upcomingDuties = 8;

// Mock data for weekly attendance
const attendanceData = [
    { name: "Week 1", present: 98, absent: 22 },
    { name: "Week 2", present: 105, absent: 15 },
    { name: "Week 3", present: 92, absent: 28 },
    { name: "Week 4", present: 95, absent: 25 },
];

// Mock data for recent activities
const recentActivities = [
    { id: 1, title: "Sunday Service - Main Hall", time: "2 days ago", status: "completed" },
    { id: 2, title: "Midweek Service Duty", time: "4 days ago", status: "completed" },
    { id: 3, title: "Equipment Check Completed", time: "1 week ago", status: "completed" },
    { id: 4, title: "New Usher Orientation", time: "1 week ago", status: "info" },
];

// Mock data for upcoming duties
const upcomingDutiesData = [
    { id: 1, title: "Sunday Service - Main Entrance", date: "2025-12-01", time: "08:00 AM", assignedTo: "Team A" },
    { id: 2, title: "Sunday Service - Side Entrance", date: "2025-12-01", time: "08:00 AM", assignedTo: "Team B" },
    { id: 3, title: "Midweek Service", date: "2025-12-04", time: "06:00 PM", assignedTo: "Team C" },
    { id: 4, title: "Youth Service", date: "2025-12-07", time: "03:00 PM", assignedTo: "Team A" },
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

export default function UsherDashboard() {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Usher Dashboard</h1>
                    <p className="text-gray-500 mt-1">Manage attendance, duties, and church assets</p>
                </div>
                <Button onClick={() => navigate('/dashboard/ushers/schedule')}>
                    View Schedule
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    icon={<Users className="w-5 h-5" />} 
                    title="Total Members" 
                    value={totalMembers} 
                    variant="primary" 
                />
                <StatCard 
                    icon={<Package className="w-5 h-5" />} 
                    title="Total Assets" 
                    value={totalAssets} 
                />
                <StatCard 
                    icon={<UserCheck className="w-5 h-5" />} 
                    title="Weekly Attendance" 
                    value={weeklyAttendance} 
                    variant="primary"
                />
                <StatCard 
                    icon={<Calendar className="w-5 h-5" />} 
                    title="Upcoming Duties" 
                    value={upcomingDuties} 
                />
            </div>

            {/* Charts and Content Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Attendance Trend */}
                <Card className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Weekly Attendance Trend</h3>
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
                {/* Upcoming Duties */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Upcoming Duties</h3>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate('/dashboard/ushers/schedule')}
                        >
                            View All
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {upcomingDutiesData.map((duty) => (
                            <div key={duty.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="bg-primary/10 p-2 rounded-lg">
                                    <DoorOpen className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{duty.title}</p>
                                    <p className="text-sm text-gray-500">{duty.date} • {duty.time}</p>
                                    <p className="text-xs text-gray-400 mt-1">Assigned: {duty.assignedTo}</p>
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
                            onClick={() => navigate('/dashboard/ushers/attendance')}
                        >
                            <UserCheck className="w-4 h-4 mr-2" />
                            Mark Attendance
                        </Button>
                        <Button 
                            className="w-full justify-start" 
                            variant="outline"
                            onClick={() => navigate('/dashboard/ushers/members')}
                        >
                            <Users className="w-4 h-4 mr-2" />
                            View Members
                        </Button>
                        <Button 
                            className="w-full justify-start" 
                            variant="outline"
                            onClick={() => navigate('/dashboard/ushers/schedule')}
                        >
                            <Calendar className="w-4 h-4 mr-2" />
                            Manage Schedule
                        </Button>
                        <Button 
                            className="w-full justify-start" 
                            variant="outline"
                            onClick={() => navigate('/dashboard/ushers/notes')}
                        >
                            <AlertCircle className="w-4 h-4 mr-2" />
                            View Notes & Plans
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
