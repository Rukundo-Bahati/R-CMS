import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, DoorOpen, Users, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Schedule {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  team: string;
  members: string[];
}

const initialScheduleData: Schedule[] = [
  {
    id: 1,
    title: "Sunday Service - Main Entrance",
    date: "2025-12-01",
    time: "08:00 AM - 12:00 PM",
    location: "Main Entrance",
    team: "Team A",
    members: ["John Doe", "Jane Smith"],
  },
  {
    id: 2,
    title: "Sunday Service - Side Entrance",
    date: "2025-12-01",
    time: "08:00 AM - 12:00 PM",
    location: "Side Entrance",
    team: "Team B",
    members: ["Mike Johnson", "Sarah Williams"],
  },
  {
    id: 3,
    title: "Midweek Service",
    date: "2025-12-04",
    time: "06:00 PM - 08:00 PM",
    location: "Main Hall",
    team: "Team C",
    members: ["David Brown", "Emily Davis"],
  },
  {
    id: 4,
    title: "Youth Service",
    date: "2025-12-07",
    time: "03:00 PM - 05:00 PM",
    location: "Youth Hall",
    team: "Team A",
    members: ["John Doe", "Jane Smith"],
  },
  {
    id: 5,
    title: "Sunday Service - Main Entrance",
    date: "2025-12-08",
    time: "08:00 AM - 12:00 PM",
    location: "Main Entrance",
    team: "Team B",
    members: ["Mike Johnson", "Sarah Williams"],
  },
];

export default function UsherSchedule() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scheduleData, setScheduleData] = useState<Schedule[]>(initialScheduleData);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [formData, setFormData] = useState<Omit<Schedule, "id">>({
    title: "",
    date: "",
    time: "",
    location: "",
    team: "Team A",
    members: [],
  });
  const [memberInput, setMemberInput] = useState("");

  const filteredSchedule = selectedDate
    ? scheduleData.filter((item) => item.date === selectedDate)
    : scheduleData;

  const handleOpenDialog = (schedule?: Schedule) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        title: schedule.title,
        date: schedule.date,
        time: schedule.time,
        location: schedule.location,
        team: schedule.team,
        members: schedule.members,
      });
    } else {
      setEditingSchedule(null);
      setFormData({
        title: "",
        date: "",
        time: "",
        location: "",
        team: "Team A",
        members: [],
      });
    }
    setMemberInput("");
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSchedule(null);
    setFormData({
      title: "",
      date: "",
      time: "",
      location: "",
      team: "Team A",
      members: [],
    });
    setMemberInput("");
  };

  const handleAddMember = () => {
    if (memberInput.trim()) {
      setFormData({ ...formData, members: [...formData.members, memberInput.trim()] });
      setMemberInput("");
    }
  };

  const handleRemoveMember = (index: number) => {
    setFormData({
      ...formData,
      members: formData.members.filter((_, i) => i !== index),
    });
  };

  const handleSave = () => {
    if (!formData.title || !formData.date || !formData.time || !formData.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (editingSchedule) {
      setScheduleData(
        scheduleData.map((s) =>
          s.id === editingSchedule.id ? { ...formData, id: editingSchedule.id } : s
        )
      );
      toast({
        title: "Success",
        description: "Schedule updated successfully",
      });
    } else {
      const newSchedule: Schedule = {
        ...formData,
        id: Math.max(...scheduleData.map((s) => s.id)) + 1,
      };
      setScheduleData([...scheduleData, newSchedule]);
      toast({
        title: "Success",
        description: "Schedule added successfully",
      });
    }
    handleCloseDialog();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Usher Schedule</h1>
          <p className="text-gray-500 mt-1">View and manage usher duty schedules</p>
        </div>
        <Button onClick={() => navigate("/dashboard/ushers")}>Back to Dashboard</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-primary text-white">
          <p className="text-sm font-medium opacity-90">Total Schedules</p>
          <p className="text-2xl font-bold mt-1">{scheduleData.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-gray-600">This Week</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-gray-600">Active Teams</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
        </Card>
      </div>

      {/* Schedule List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Upcoming Duties</h2>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Schedule
          </Button>
        </div>

        <div className="space-y-4">
          {filteredSchedule.map((schedule) => (
            <Card key={schedule.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <DoorOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{schedule.title}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{schedule.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{schedule.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DoorOpen className="w-4 h-4" />
                        <span>{schedule.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{schedule.team}: {schedule.members.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleOpenDialog(schedule)}>
                  Edit
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSchedule ? "Edit Schedule" : "Add New Schedule"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Sunday Service - Main Entrance"
              />
            </div>
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="e.g., 08:00 AM - 12:00 PM"
              />
            </div>
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Main Entrance"
              />
            </div>
            <div>
              <Label htmlFor="team">Team</Label>
              <select
                id="team"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={formData.team}
                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
              >
                <option value="Team A">Team A</option>
                <option value="Team B">Team B</option>
                <option value="Team C">Team C</option>
              </select>
            </div>
            <div>
              <Label>Assigned Members</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                  placeholder="Enter member name"
                  onKeyPress={(e) => e.key === "Enter" && handleAddMember()}
                />
                <Button type="button" onClick={handleAddMember}>
                  Add
                </Button>
              </div>
              <div className="mt-2 space-y-1">
                {formData.members.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded"
                  >
                    <span className="text-sm">{member}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingSchedule ? "Update" : "Add"} Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
