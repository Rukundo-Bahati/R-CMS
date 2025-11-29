import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Clock, Heart, CheckCircle2, AlertCircle } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// Mock data
const totalMembers = 28;
const upcomingFridaySchedule = 5;
const prayerRequests = 42;
const completedPrayers = 38;

// Mock data for prayer requests by category
const prayerRequestData = [
  { name: "Healing", count: 15 },
  { name: "Guidance", count: 12 },
  { name: "Thanksgiving", count: 8 },
  { name: "Protection", count: 7 },
];

// Mock data for recent activities
const recentActivities = [
  { id: 1, title: "Friday Prayer Session", time: "2 days ago", status: "completed" },
  { id: 2, title: "Special Prayer Request - Healing", time: "3 days ago", status: "completed" },
  { id: 3, title: "Morning Prayer Meeting", time: "5 days ago", status: "completed" },
  { id: 4, title: "New Prayer Request Added", time: "1 week ago", status: "info" },
];

// Mock data for upcoming prayer sessions
const upcomingPrayerSessions = [
  { id: 1, title: "Friday Prayer Session", date: "2025-12-06", time: "06:00 AM", location: "Prayer Room" },
  { id: 2, title: "Special Intercession", date: "2025-12-08", time: "05:00 AM", location: "Main Hall" },
  { id: 3, title: "Friday Prayer Session", date: "2025-12-13", time: "06:00 AM", location: "Prayer Room" },
  { id: 4, title: "Monthly Fasting Prayer", date: "2025-12-15", time: "12:00 PM", location: "Prayer Room" },
];

const StatCard = ({
  icon,
  title,
  value,
  variant = "default",
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  variant?: "default" | "primary";
}) => {
  const bg = variant === "primary" ? "bg-primary text-white" : "bg-white text-gray-900";
  const border = variant === "primary" ? "border-primary" : "border border-gray-200";
  const iconBg = variant === "primary" ? "bg-white/20" : "bg-primary/10";
  const iconColor = variant === "primary" ? "text-white" : "text-primary";

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

export default function IntercessorDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Intercessor Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage prayer sessions, members, and schedules</p>
        </div>
        <Button onClick={() => navigate("/dashboard/intercessors/schedule")}>
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
          icon={<Calendar className="w-5 h-5" />}
          title="Friday Schedule"
          value={upcomingFridaySchedule}
        />
        <StatCard
          icon={<Heart className="w-5 h-5" />}
          title="Prayer Requests"
          value={prayerRequests}
          variant="primary"
        />
        <StatCard
          icon={<CheckCircle2 className="w-5 h-5" />}
          title="Completed Prayers"
          value={completedPrayers}
        />
      </div>

      {/* Charts and Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prayer Requests by Category */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Prayer Requests by Category</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prayerRequestData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Bar dataKey="count" name="Requests" fill="#180e42" radius={[4, 4, 0, 0]} />
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
                <div
                  className={`p-2 rounded-full ${
                    activity.status === "completed"
                      ? "bg-green-100 text-green-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {activity.status === "completed" ? (
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
        {/* Upcoming Prayer Sessions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Upcoming Prayer Sessions</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/dashboard/intercessors/schedule")}
            >
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {upcomingPrayerSessions.map((session) => (
              <div key={session.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{session.title}</p>
                  <p className="text-sm text-gray-500">
                    {session.date} • {session.time}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Location: {session.location}</p>
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
              onClick={() => navigate("/dashboard/intercessors/schedule")}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Manage Schedule
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => navigate("/dashboard/intercessors/members")}
            >
              <Users className="w-4 h-4 mr-2" />
              View Members
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => navigate("/dashboard/intercessors/notes")}
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              View Notes & Plans
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Heart className="w-4 h-4 mr-2" />
              Prayer Requests
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
