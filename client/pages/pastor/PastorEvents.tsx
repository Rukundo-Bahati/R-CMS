import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, MapPin, Users, Plus, BookOpen, Mic, ChevronRight, ChevronLeft, CheckCircle, Info, Settings } from "lucide-react";
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
  const [currentStep, setCurrentStep] = useState(1);
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
    setCurrentStep(1);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingEvent(null);
    setCurrentStep(1);
  };

  const handleNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-primary/5 to-primary/10 border-0 shadow-2xl">
          <DialogHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-primary to-primary/80 rounded-xl shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  {editingEvent ? "Edit Event" : "Add New Event"}
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">Follow the steps to create your event</p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center mt-6">
              <div className="flex items-center space-x-4">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                  <Info className="w-5 h-5" />
                </div>
                <div className={`flex-1 h-1 ${currentStep >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                  <Settings className="w-5 h-5" />
                </div>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span className={currentStep >= 1 ? 'text-primary font-medium' : ''}>Basic Info</span>
              <span className={currentStep >= 2 ? 'text-primary font-medium' : ''}>Details</span>
            </div>
          </DialogHeader>

          <div className="py-4">
            {currentStep === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
                {/* Step 1: Basic Information */}
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Event Title *
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Revival Conference 2025"
                        className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Description
                      </Label>
                      <Input
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Brief description of the event"
                        className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
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
                      <div>
                        <Label htmlFor="location" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Location *
                        </Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="e.g., Main Auditorium"
                          className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
                {/* Step 2: Event Details */}
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Settings className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-gray-800">Event Details</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startTime" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Start Time *
                      </Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        className="border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        End Time
                      </Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        className="border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="eventType" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Event Type
                      </Label>
                      <select
                        id="eventType"
                        className="w-full border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg px-3 py-2 transition-all duration-200 bg-white"
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
                      <Label htmlFor="preacher" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Mic className="w-4 h-4" />
                        Main Preacher *
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
                    <div>
                      <Label htmlFor="expectedAttendance" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Expected Attendance
                      </Label>
                      <Input
                        id="expectedAttendance"
                        type="number"
                        value={formData.expectedAttendance}
                        onChange={(e) => setFormData({ ...formData, expectedAttendance: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                        className="border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="status" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Status
                      </Label>
                      <select
                        id="status"
                        className="w-full border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg px-3 py-2 transition-all duration-200 bg-white"
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
                      <Label htmlFor="notes" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Notes
                      </Label>
                      <Input
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Additional notes or special instructions"
                        className="border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="pt-6 border-t border-gray-200 bg-gray-50/50 rounded-b-xl">
            <div className="flex justify-between w-full">
              <Button
                variant="outline"
                onClick={handleCloseDialog}
                className="border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </Button>

              <div className="flex gap-2">
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                    className="border-2 border-blue-300 text-primary hover:bg-blue-50 transition-all duration-200"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                )}

                {currentStep < 2 ? (
                  <Button
                    onClick={handleNextStep}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {editingEvent ? "Update" : "Create"} Event
                  </Button>
                )}
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}