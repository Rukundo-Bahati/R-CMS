import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, MapPin, Users, Plus, BookOpen, Mic } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  eventType: string;
  preacher: string;
  expectedAttendance: number;
  status: string;
  notes: string;
}

const initialEvents: Event[] = [
  {
    id: 1,
    title: "Revival Conference 2025",
    description: "Three-day revival conference with guest speakers",
    date: "2025-01-15",
    startTime: "09:00",
    endTime: "17:00",
    location: "Main Auditorium",
    eventType: "Conference",
    preacher: "Rev. John Smith",
    expectedAttendance: 500,
    status: "Planned",
    notes: "Need to arrange accommodation for guest speakers",
  },
  {
    id: 2,
    title: "Youth Retreat Weekend",
    description: "Weekend retreat for youth ministry",
    date: "2025-02-08",
    startTime: "18:00",
    endTime: "20:00",
    location: "Youth Center",
    eventType: "Retreat",
    preacher: "Pastor Mary Johnson",
    expectedAttendance: 80,
    status: "Planned",
    notes: "Transportation arrangements needed",
  },
  {
    id: 3,
    title: "Easter Celebration Service",
    description: "Special Easter Sunday celebration",
    date: "2025-04-20",
    startTime: "10:00",
    endTime: "12:00",
    location: "Main Sanctuary",
    eventType: "Special Service",
    preacher: "Elder David Brown",
    expectedAttendance: 800,
    status: "Planned",
    notes: "Special music and drama presentation",
  },
  {
    id: 4,
    title: "Prayer and Fasting Week",
    description: "Week-long prayer and fasting program",
    date: "2025-03-10",
    startTime: "06:00",
    endTime: "21:00",
    location: "Prayer Hall",
    eventType: "Prayer Meeting",
    preacher: "Pastor Sarah Wilson",
    expectedAttendance: 200,
    status: "Planned",
    notes: "Daily sessions from 6 AM to 9 PM",
  },
];

const eventTypes = [
  "Conference",
  "Retreat", 
  "Special Service",
  "Prayer Meeting",
  "Seminar",
  "Workshop",
  "Crusade",
  "Fellowship",
];

const preachers = [
  "Rev. John Smith",
  "Pastor Mary Johnson", 
  "Elder David Brown",
  "Pastor Sarah Wilson",
  "Rev. Michael Davis",
];

export default function PastorEvents() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [selectedEventType, setSelectedEventType] = useState<string>("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Omit<Event, "id">>({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    eventType: eventTypes[0],
    preacher: preachers[0],
    expectedAttendance: 0,
    status: "Planned",
    notes: "",
  });

  const filteredEvents = events.filter((event) => {
    const matchesType = selectedEventType === "All" || event.eventType === selectedEventType;
    return matchesType;
  });

  const totalEvents = events.length;
  const plannedEvents = events.filter((e) => e.status === "Planned").length;
  const completedEvents = events.filter((e) => e.status === "Completed").length;
  const totalExpectedAttendance = events.reduce((sum, e) => sum + e.expectedAttendance, 0);

  const handleOpenDialog = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        description: event.description,
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
        location: event.location,
        eventType: event.eventType,
        preacher: event.preacher,
        expectedAttendance: event.expectedAttendance,
        status: event.status,
        notes: event.notes,
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        location: "",
        eventType: eventTypes[0],
        preacher: preachers[0],
        expectedAttendance: 0,
        status: "Planned",
        notes: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingEvent(null);
  };

  const handleSave = () => {
    if (!formData.title || !formData.date || !formData.startTime || !formData.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (editingEvent) {
      setEvents(
        events.map((e) =>
          e.id === editingEvent.id ? { ...formData, id: editingEvent.id } : e
        )
      );
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
    } else {
      const newEvent: Event = {
        ...formData,
        id: Math.max(...events.map((e) => e.id)) + 1,
      };
      setEvents([...events, newEvent]);
      toast({
        title: "Success",
        description: "Event added successfully",
      });
    }
    handleCloseDialog();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Planned":
        return "bg-blue-100 text-blue-700";
      case "In Progress":
        return "bg-yellow-100 text-yellow-700";
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Plan Events & Sessions</h1>
          <p className="text-gray-500 mt-1">Organize and manage church events and special sessions</p>
        </div>
        <Button onClick={() => navigate("/dashboard/pastor")}>Back to Dashboard</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 bg-primary text-white">
          <p className="text-sm font-medium opacity-90">Total Events</p>
          <p className="text-2xl font-bold mt-1">{totalEvents}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-gray-600">Planned</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{plannedEvents}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{completedEvents}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-gray-600">Expected Attendance</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalExpectedAttendance}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="event-type-filter">Filter by Event Type</Label>
            <select
              id="event-type-filter"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
            >
              <option value="All">All Event Types</option>
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
      </Card>

      {/* Events List */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Upcoming Events</h2>
        </div>

        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{event.startTime} - {event.endTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                            {event.eventType}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mic className="w-4 h-4" />
                          <span className="font-medium">{event.preacher}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>Expected: {event.expectedAttendance}</span>
                        </div>
                      </div>
                    </div>
                    {event.notes && (
                      <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
                        <strong>Notes:</strong> {event.notes}
                      </div>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleOpenDialog(event)}>
                  Edit
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Revival Conference 2025"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the event"
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
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Main Auditorium"
              />
            </div>
            <div>
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="eventType">Event Type</Label>
              <select
                id="eventType"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
              >
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="preacher">Main Preacher</Label>
              <select
                id="preacher"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
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
            <div>
              <Label htmlFor="expectedAttendance">Expected Attendance</Label>
              <Input
                id="expectedAttendance"
                type="number"
                value={formData.expectedAttendance}
                onChange={(e) => setFormData({ ...formData, expectedAttendance: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Planned">Planned</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes or special instructions"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingEvent ? "Update" : "Add"} Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}