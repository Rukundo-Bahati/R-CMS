import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Mic, Users, Plus, BookOpen, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface PreachingSchedule {
  id: number;
  title: string;
  date: string;
  time: string;
  preacher: string;
  topic: string;
  serviceType: string;
  notes: string;
  status: string;
}

const initialScheduleData: PreachingSchedule[] = [
  {
    id: 1,
    title: "Sunday Morning Service",
    date: "2025-12-01",
    time: "10:00 AM",
    preacher: "Rev. John Smith",
    topic: "Faith and Hope in Difficult Times",
    serviceType: "Sunday Service",
    notes: "Focus on community support",
    status: "Scheduled",
  },
  {
    id: 2,
    title: "Sunday Evening Service",
    date: "2025-12-01",
    time: "06:00 PM",
    preacher: "Pastor Mary Johnson",
    topic: "Love in Action",
    serviceType: "Sunday Service",
    notes: "Youth participation encouraged",
    status: "Scheduled",
  },
  {
    id: 3,
    title: "Midweek Service",
    date: "2025-12-04",
    time: "07:00 PM",
    preacher: "Elder David Brown",
    topic: "The Power of Prayer",
    serviceType: "Midweek Service",
    notes: "Interactive prayer session",
    status: "Scheduled",
  },
  {
    id: 4,
    title: "Youth Service",
    date: "2025-12-07",
    time: "04:00 PM",
    preacher: "Pastor Sarah Wilson",
    topic: "Purpose Driven Life for Young People",
    serviceType: "Youth Service",
    notes: "Modern worship style",
    status: "Scheduled",
  },
  {
    id: 5,
    title: "Sunday Morning Service",
    date: "2025-12-08",
    time: "10:00 AM",
    preacher: "Rev. Michael Davis",
    topic: "Grace and Mercy",
    serviceType: "Sunday Service",
    notes: "Communion service",
    status: "Scheduled",
  },
];

const preachers = [
  "Rev. John Smith",
  "Pastor Mary Johnson", 
  "Elder David Brown",
  "Pastor Sarah Wilson",
  "Rev. Michael Davis",
];

const serviceTypes = [
  "Sunday Service",
  "Midweek Service", 
  "Youth Service",
  "Special Event",
  "Prayer Meeting",
];

export default function PastorSchedule() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scheduleData, setScheduleData] = useState<PreachingSchedule[]>(initialScheduleData);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedPreacher, setSelectedPreacher] = useState<string>("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<PreachingSchedule | null>(null);
  const [formData, setFormData] = useState<Omit<PreachingSchedule, "id">>({
    title: "",
    date: "",
    time: "",
    preacher: preachers[0],
    topic: "",
    serviceType: serviceTypes[0],
    notes: "",
    status: "Scheduled",
  });

  const filteredSchedule = scheduleData.filter((item) => {
    const matchesDate = !selectedDate || item.date === selectedDate;
    const matchesPreacher = selectedPreacher === "All" || item.preacher === selectedPreacher;
    return matchesDate && matchesPreacher;
  });

  const handleOpenDialog = (schedule?: PreachingSchedule) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        title: schedule.title,
        date: schedule.date,
        time: schedule.time,
        preacher: schedule.preacher,
        topic: schedule.topic,
        serviceType: schedule.serviceType,
        notes: schedule.notes,
        status: schedule.status,
      });
    } else {
      setEditingSchedule(null);
      setFormData({
        title: "",
        date: "",
        time: "",
        preacher: preachers[0],
        topic: "",
        serviceType: serviceTypes[0],
        notes: "",
        status: "Scheduled",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSchedule(null);
  };

  const handleSave = () => {
    if (!formData.title || !formData.date || !formData.time || !formData.topic) {
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
      const newSchedule: PreachingSchedule = {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Preaching Schedule</h1>
          <p className="text-gray-500 mt-1">Manage sermon assignments and preaching schedule</p>
        </div>
        <Button onClick={() => navigate("/dashboard/pastor")}>Back to Dashboard</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 bg-primary text-white">
          <p className="text-sm font-medium opacity-90">Total Scheduled</p>
          <p className="text-2xl font-bold mt-1">{scheduleData.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-gray-600">This Week</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-gray-600">This Month</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-gray-600">Active Preachers</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{preachers.length}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="date-filter">Filter by Date</Label>
            <Input
              id="date-filter"
              type="date"
              value={selectedDate || ""}
              onChange={(e) => setSelectedDate(e.target.value || null)}
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="preacher-filter">Filter by Preacher</Label>
            <select
              id="preacher-filter"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={selectedPreacher}
              onChange={(e) => setSelectedPreacher(e.target.value)}
            >
              <option value="All">All Preachers</option>
              {preachers.map((preacher) => (
                <option key={preacher} value={preacher}>
                  {preacher}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Schedule List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Preaching Schedule</h2>
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
                <div className="flex gap-4 flex-1">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Mic className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{schedule.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(schedule.status)}`}>
                        {schedule.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{schedule.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{schedule.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{schedule.serviceType}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mic className="w-4 h-4" />
                          <span className="font-medium">{schedule.preacher}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          <span className="font-medium text-primary">{schedule.topic}</span>
                        </div>
                        {schedule.notes && (
                          <div className="text-xs text-gray-500 mt-2">
                            Notes: {schedule.notes}
                          </div>
                        )}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-0 shadow-2xl">
          <DialogHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {editingSchedule ? "Edit Schedule" : "Add New Schedule"}
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">Plan and organize preaching schedules</p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Service Information Section */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-gray-800">Service Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Service Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Sunday Morning Service"
                    className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceType" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Service Type
                  </Label>
                  <select
                    id="serviceType"
                    className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg px-3 py-2 transition-all duration-200 bg-white"
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  >
                    {serviceTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Time *
                  </Label>
                  <Input
                    id="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="e.g., 10:00 AM"
                    className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Preaching Details Section */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Mic className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-gray-800">Preaching Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preacher" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mic className="w-4 h-4" />
                    Preacher *
                  </Label>
                  <select
                    id="preacher"
                    className="w-full border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg px-3 py-2 transition-all duration-200 bg-white"
                    value={formData.preacher}
                    onChange={(e) => setFormData({ ...formData, preacher: e.target.value })}
                  >
                    {preachers.map((preacher) => (
                      <option key={preacher} value={preacher}>
                        {preacher}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topic" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Sermon Topic *
                  </Label>
                  <Input
                    id="topic"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="e.g., Faith and Hope in Difficult Times"
                    className="border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Notes & Instructions
                  </Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes, special instructions, or preparation reminders"
                    className="border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="status" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Schedule Status
                  </Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="Scheduled"
                        checked={formData.status === "Scheduled"}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Scheduled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="Completed"
                        checked={formData.status === "Completed"}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Completed</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="Cancelled"
                        checked={formData.status === "Cancelled"}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Cancelled</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-6 border-t border-gray-200 bg-gray-50/50 rounded-b-xl">
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              className="border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {editingSchedule ? "Update" : "Schedule"} Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}