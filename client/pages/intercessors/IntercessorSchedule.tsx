import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Heart, Users, Plus } from "lucide-react";
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
  type: string;
  leader: string;
  participants: string[];
}

const initialScheduleData: Schedule[] = [
  {
    id: 1,
    title: "Friday Morning Prayer",
    date: "2025-12-06",
    time: "06:00 AM - 08:00 AM",
    location: "Prayer Room",
    type: "Regular",
    leader: "Grace Uwase",
    participants: ["Emmanuel Nkusi", "Esther Mukamana"],
  },
  {
    id: 2,
    title: "Special Intercession",
    date: "2025-12-08",
    time: "05:00 AM - 07:00 AM",
    location: "Main Hall",
    type: "Special",
    leader: "Daniel Habimana",
    participants: ["Grace Uwase", "Emmanuel Nkusi"],
  },
  {
    id: 3,
    title: "Friday Morning Prayer",
    date: "2025-12-13",
    time: "06:00 AM - 08:00 AM",
    location: "Prayer Room",
    type: "Regular",
    leader: "Esther Mukamana",
    participants: ["Daniel Habimana", "Grace Uwase"],
  },
  {
    id: 4,
    title: "Monthly Fasting Prayer",
    date: "2025-12-15",
    time: "12:00 PM - 03:00 PM",
    location: "Prayer Room",
    type: "Fasting",
    leader: "Grace Uwase",
    participants: ["Emmanuel Nkusi", "Esther Mukamana", "Daniel Habimana"],
  },
];

export default function IntercessorSchedule() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scheduleData, setScheduleData] = useState<Schedule[]>(initialScheduleData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [formData, setFormData] = useState<Omit<Schedule, "id">>({
    title: "",
    date: "",
    time: "",
    location: "",
    type: "Regular",
    leader: "",
    participants: [],
  });
  const [participantInput, setParticipantInput] = useState("");

  const handleOpenDialog = (schedule?: Schedule) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        title: schedule.title,
        date: schedule.date,
        time: schedule.time,
        location: schedule.location,
        type: schedule.type,
        leader: schedule.leader,
        participants: schedule.participants,
      });
    } else {
      setEditingSchedule(null);
      setFormData({
        title: "",
        date: "",
        time: "",
        location: "",
        type: "Regular",
        leader: "",
        participants: [],
      });
    }
    setParticipantInput("");
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSchedule(null);
    setParticipantInput("");
  };

  const handleAddParticipant = () => {
    if (participantInput.trim()) {
      setFormData({
        ...formData,
        participants: [...formData.participants, participantInput.trim()],
      });
      setParticipantInput("");
    }
  };

  const handleRemoveParticipant = (index: number) => {
    setFormData({
      ...formData,
      participants: formData.participants.filter((_, i) => i !== index),
    });
  };

  const handleSave = () => {
    if (!formData.title || !formData.date || !formData.time || !formData.location || !formData.leader) {
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

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Regular: "bg-blue-100 text-blue-700",
      Special: "bg-purple-100 text-purple-700",
      Fasting: "bg-orange-100 text-orange-700",
    };
    return colors[type] || colors.Regular;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Prayer Schedule</h1>
          <p className="text-gray-500 mt-1">Manage prayer sessions and schedules</p>
        </div>
        <Button onClick={() => navigate("/dashboard/intercessors")}>Back to Dashboard</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 bg-primary text-white">
          <p className="text-sm font-medium opacity-90">Total Sessions</p>
          <p className="text-2xl font-bold mt-1">{scheduleData.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-gray-600">This Week</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-gray-600">Regular Sessions</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {scheduleData.filter((s) => s.type === "Regular").length}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-gray-600">Special Sessions</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {scheduleData.filter((s) => s.type === "Special").length}
          </p>
        </Card>
      </div>

      {/* Schedule List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Upcoming Prayer Sessions</h2>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Schedule
          </Button>
        </div>

        <div className="space-y-4">
          {scheduleData.map((schedule) => (
            <Card key={schedule.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{schedule.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(schedule.type)}`}>
                        {schedule.type}
                      </span>
                    </div>
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
                        <Heart className="w-4 h-4" />
                        <span>{schedule.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Leader: {schedule.leader}</span>
                      </div>
                      {schedule.participants.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          Participants: {schedule.participants.join(", ")}
                        </div>
                      )}
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
                placeholder="e.g., Friday Morning Prayer"
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
                placeholder="e.g., 06:00 AM - 08:00 AM"
              />
            </div>
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Prayer Room"
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="Regular">Regular</option>
                <option value="Special">Special</option>
                <option value="Fasting">Fasting</option>
              </select>
            </div>
            <div>
              <Label htmlFor="leader">Leader *</Label>
              <Input
                id="leader"
                value={formData.leader}
                onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                placeholder="Enter leader name"
              />
            </div>
            <div>
              <Label>Participants</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={participantInput}
                  onChange={(e) => setParticipantInput(e.target.value)}
                  placeholder="Enter participant name"
                  onKeyPress={(e) => e.key === "Enter" && handleAddParticipant()}
                />
                <Button type="button" onClick={handleAddParticipant}>
                  Add
                </Button>
              </div>
              <div className="mt-2 space-y-1">
                {formData.participants.map((participant, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded"
                  >
                    <span className="text-sm">{participant}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveParticipant(index)}
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
