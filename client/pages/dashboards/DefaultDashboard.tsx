import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Users, TrendingUp, Wallet, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

const memberData = [
  { month: "Jan", members: 250, active: 200 },
  { month: "Feb", members: 280, active: 220 },
  { month: "Mar", members: 310, active: 250 },
  { month: "Apr", members: 320, active: 260 },
  { month: "May", members: 340, active: 280 },
  { month: "Jun", members: 360, active: 300 },
];

const attendanceData = [
  { name: "Present", value: 285, color: "#10b981" },
  { name: "Absent", value: 35, color: "#ef4444" },
  { name: "Excused", value: 40, color: "#f59e0b" },
];

const StatCard = ({
  icon,
  title,
  value,
  change,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
}) => (
  <Card className="p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-primary/10 rounded-lg text-primary">{icon}</div>
      <span className="text-sm font-medium text-green-600">{change}</span>
    </div>
    <p className="text-gray-600 text-sm mb-1">{title}</p>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </Card>
);

export default function DefaultDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          title="Total Members"
          value="360"
          change="+5.4%"
        />
        <StatCard
          icon={<Calendar className="w-6 h-6" />}
          title="This Week Attendance"
          value="285"
          change="+12.3%"
        />
        <StatCard
          icon={<Wallet className="w-6 h-6" />}
          title="Monthly Offerings"
          value="$4,250"
          change="+8.2%"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          title="Active Departments"
          value="12"
          change="Stable"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Member Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={memberData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="members"
                stroke="#30324a"
                strokeWidth={2}
                dot={{ fill: "#30324a", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="active"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Last Sunday Attendance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={attendanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name} (${entry.value})`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {attendanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Can keep Recent Members and Upcoming Events here or separate common component */}
        {/* Recent Members */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Members
          </h3>
          <div className="space-y-4">
            {[
              {
                name: "John Smith",
                date: "2024-01-15",
                dept: "Choir",
              },
              {
                name: "Mary Johnson",
                date: "2024-01-12",
                dept: "Finance",
              },
              {
                name: "Peter Brown",
                date: "2024-01-10",
                dept: "Ushers",
              },
            ].map((member) => (
              <div key={member.name} className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-600">{member.dept}</p>
                </div>
                <p className="text-sm text-gray-500">{member.date}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Events */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Upcoming Events
          </h3>
          <div className="space-y-4">
            {[
              {
                title: "Sunday Service",
                date: "Jan 28, 10:00 AM",
                status: "Confirmed",
              },
              {
                title: "Choir Practice",
                date: "Jan 25, 6:00 PM",
                status: "Scheduled",
              },
              {
                title: "Finance Meeting",
                date: "Jan 26, 2:00 PM",
                status: "Pending",
              },
            ].map((event) => (
              <div key={event.title} className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">{event.title}</p>
                  <p className="text-sm text-gray-600">{event.date}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  event.status === "Confirmed"
                    ? "bg-green-100 text-green-700"
                    : event.status === "Scheduled"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                }`}>
                  {event.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
