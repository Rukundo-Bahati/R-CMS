import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Search, UserCheck, X } from "lucide-react";

// Mock data
const mockMembers = [
  { id: 1, name: "John Doe", team: "Team A", status: "present" },
  { id: 2, name: "Jane Smith", team: "Team A", status: "present" },
  { id: 3, name: "Mike Johnson", team: "Team B", status: "absent" },
  { id: 4, name: "Sarah Williams", team: "Team B", status: "present" },
  { id: 5, name: "David Brown", team: "Team C", status: "present" },
];

export default function UsherAttendance() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [attendance, setAttendance] = useState(mockMembers);

  const toggleAttendance = (id: number) => {
    setAttendance(
      attendance.map((member) =>
        member.id === id
          ? { ...member, status: member.status === "present" ? "absent" : "present" }
          : member
      )
    );
  };

  const filteredMembers = attendance.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const presentCount = attendance.filter((m) => m.status === "present").length;
  const absentCount = attendance.filter((m) => m.status === "absent").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Usher Attendance</h1>
          <p className="text-gray-500 mt-1">Mark and track usher attendance</p>
        </div>
        <Button onClick={() => navigate("/dashboard/ushers")}>Back to Dashboard</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <p className="text-sm font-medium text-gray-600">Total Ushers</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{attendance.length}</p>
        </Card>
        <Card className="p-5 bg-green-50 border-green-200">
          <p className="text-sm font-medium text-green-700">Present</p>
          <p className="text-2xl font-bold text-green-900 mt-1">{presentCount}</p>
        </Card>
        <Card className="p-5 bg-red-50 border-red-200">
          <p className="text-sm font-medium text-red-700">Absent</p>
          <p className="text-2xl font-bold text-red-900 mt-1">{absentCount}</p>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search ushers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Attendance List */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Today's Attendance</h2>
        </div>
        <div className="space-y-2">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    member.status === "present"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {member.status === "present" ? (
                    <UserCheck className="w-5 h-5" />
                  ) : (
                    <X className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.team}</p>
                </div>
              </div>
              <Button
                variant={member.status === "present" ? "outline" : "default"}
                size="sm"
                onClick={() => toggleAttendance(member.id)}
              >
                {member.status === "present" ? "Mark Absent" : "Mark Present"}
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
