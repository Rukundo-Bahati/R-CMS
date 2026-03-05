import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { StickyNote, Plus, Edit, Trash2, Calendar } from "lucide-react";

// Mock data
const mockNotes = [
  {
    id: 1,
    title: "Sunday Service Preparation",
    content: "Ensure all entrance doors are unlocked by 7:30 AM. Check sound system and lighting.",
    date: "2025-11-28",
    category: "Service",
  },
  {
    id: 2,
    title: "Equipment Maintenance",
    content: "Replace batteries in wireless microphones. Check all offering baskets for damage.",
    date: "2025-11-27",
    category: "Maintenance",
  },
  {
    id: 3,
    title: "New Usher Training",
    content: "Schedule orientation for 3 new ushers. Cover greeting protocols and emergency procedures.",
    date: "2025-11-25",
    category: "Training",
  },
  {
    id: 4,
    title: "Special Event - Christmas Service",
    content: "Extra ushers needed for Christmas Eve service. Coordinate with Team A and B for extended hours.",
    date: "2025-11-20",
    category: "Event",
  },
];

export default function UsherNotes() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState(mockNotes);
  const [isAdding, setIsAdding] = useState(false);
  const [editingNote, setEditingNote] = useState<typeof mockNotes[0] | null>(null);
  const [newNote, setNewNote] = useState({ title: "", content: "", category: "General" });

  const handleAddNote = () => {
    if (newNote.title && newNote.content) {
      if (editingNote) {
        setNotes(
          notes.map((note) =>
            note.id === editingNote.id
              ? { ...note, title: newNote.title, content: newNote.content, category: newNote.category }
              : note
          )
        );
        setEditingNote(null);
      } else {
        const note = {
          id: notes.length + 1,
          ...newNote,
          date: new Date().toISOString().split("T")[0],
        };
        setNotes([note, ...notes]);
      }
      setNewNote({ title: "", content: "", category: "General" });
      setIsAdding(false);
    }
  };

  const handleEditNote = (note: typeof mockNotes[0]) => {
    setEditingNote(note);
    setNewNote({ title: note.title, content: note.content, category: note.category });
    setIsAdding(true);
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setNewNote({ title: "", content: "", category: "General" });
    setIsAdding(false);
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Service: "bg-blue-100 text-blue-700",
      Maintenance: "bg-orange-100 text-orange-700",
      Training: "bg-green-100 text-green-700",
      Event: "bg-purple-100 text-purple-700",
      General: "bg-gray-100 text-gray-700",
    };
    return colors[category] || colors.General;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Notes & Plans</h1>
          <p className="text-gray-500 mt-1">Keep track of important usher notes and plans</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsAdding(!isAdding)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Note
          </Button>
          <Button variant="outline" onClick={() => navigate("/dashboard/ushers")}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Add/Edit Note Form */}
      {isAdding && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingNote ? "Edit Note" : "Create New Note"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Title</label>
              <Input
                placeholder="Note title..."
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={newNote.category}
                onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
              >
                <option value="General">General</option>
                <option value="Service">Service</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Training">Training</option>
                <option value="Event">Event</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Content</label>
              <Textarea
                placeholder="Write your note here..."
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddNote}>
                {editingNote ? "Update" : "Save"} Note
              </Button>
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 bg-primary text-white">
          <p className="text-sm font-medium opacity-90">Total Notes</p>
          <p className="text-2xl font-bold mt-1">{notes.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-gray-600">Service Notes</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {notes.filter((n) => n.category === "Service").length}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-gray-600">Maintenance</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {notes.filter((n) => n.category === "Maintenance").length}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-gray-600">Training</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {notes.filter((n) => n.category === "Training").length}
          </p>
        </Card>
      </div>

      {/* Notes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.map((note) => (
          <Card key={note.id} className="p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <StickyNote className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-gray-900">{note.title}</h3>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => handleEditNote(note)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteNote(note.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">{note.content}</p>
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(note.category)}`}>
                {note.category}
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{note.date}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
