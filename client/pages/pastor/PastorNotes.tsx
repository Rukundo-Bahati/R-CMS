import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Search, Plus, Calendar, Tag, FileText, Mic, Users, Hash, CheckCircle, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Note {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdDate: string;
  lastModified: string;
  priority: string;
  relatedTo: string;
}

const initialNotes: Note[] = [
  {
    id: 1,
    title: "Sunday Service Planning - December 2025",
    content: "Focus on Advent themes. Plan special music for Christmas season. Consider guest speakers for the month. Coordinate with worship team for special arrangements.",
    category: "Service Planning",
    tags: ["advent", "christmas", "worship", "guest-speakers"],
    createdDate: "2025-11-15",
    lastModified: "2025-11-20",
    priority: "High",
    relatedTo: "Sunday Services",
  },
  {
    id: 2,
    title: "Youth Ministry Development Ideas",
    content: "Implement mentorship program. Plan quarterly youth retreats. Develop leadership training curriculum. Create youth-led service opportunities.",
    category: "Ministry Development",
    tags: ["youth", "mentorship", "leadership", "retreats"],
    createdDate: "2025-11-10",
    lastModified: "2025-11-18",
    priority: "Medium",
    relatedTo: "Youth Ministry",
  },
  {
    id: 3,
    title: "Preacher Training Program Outline",
    content: "Module 1: Biblical Hermeneutics. Module 2: Sermon Preparation. Module 3: Delivery Techniques. Module 4: Pastoral Care. Schedule monthly workshops.",
    category: "Training",
    tags: ["preacher-training", "hermeneutics", "sermon-prep", "pastoral-care"],
    createdDate: "2025-11-05",
    lastModified: "2025-11-15",
    priority: "High",
    relatedTo: "Preacher Development",
  },
  {
    id: 4,
    title: "Annual Conference Planning Notes",
    content: "Theme: 'Renewed Vision for 2026'. Keynote speakers confirmed. Venue booking completed. Registration system setup needed. Catering arrangements in progress.",
    category: "Event Planning",
    tags: ["conference", "2026", "keynote", "venue", "registration"],
    createdDate: "2025-10-20",
    lastModified: "2025-11-12",
    priority: "High",
    relatedTo: "Annual Conference",
  },
  {
    id: 5,
    title: "Member Pastoral Care Follow-ups",
    content: "Visit Mrs. Johnson (health concerns). Follow up with the Smith family (new baby). Check on Elder Brown (recent loss). Schedule counseling sessions as needed.",
    category: "Pastoral Care",
    tags: ["pastoral-care", "visits", "counseling", "follow-up"],
    createdDate: "2025-11-08",
    lastModified: "2025-11-16",
    priority: "Medium",
    relatedTo: "Member Care",
  },
];

const categories = [
  "Service Planning",
  "Ministry Development", 
  "Training",
  "Event Planning",
  "Pastoral Care",
  "Sermon Ideas",
  "Administrative",
  "Personal Reflection",
];

const priorities = ["Low", "Medium", "High", "Urgent"];

export default function PastorNotes() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedPriority, setSelectedPriority] = useState<string>("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState<Omit<Note, "id" | "createdDate" | "lastModified">>({
    title: "",
    content: "",
    category: categories[0],
    tags: [],
    priority: "Medium",
    relatedTo: "",
  });
  const [tagInput, setTagInput] = useState("");

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || note.category === selectedCategory;
    const matchesPriority = selectedPriority === "All" || note.priority === selectedPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const totalNotes = notes.length;
  const highPriorityNotes = notes.filter((n) => n.priority === "High" || n.priority === "Urgent").length;
  const recentNotes = notes.filter((n) => {
    const noteDate = new Date(n.lastModified);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return noteDate >= weekAgo;
  }).length;

  const handleOpenDialog = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setFormData({
        title: note.title,
        content: note.content,
        category: note.category,
        tags: note.tags,
        priority: note.priority,
        relatedTo: note.relatedTo,
      });
    } else {
      setEditingNote(null);
      setFormData({
        title: "",
        content: "",
        category: categories[0],
        tags: [],
        priority: "Medium",
        relatedTo: "",
      });
    }
    setTagInput("");
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingNote(null);
    setTagInput("");
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    });
  };

  const handleSave = () => {
    if (!formData.title || !formData.content) {
      toast({
        title: "Error",
        description: "Please fill in title and content",
        variant: "destructive",
      });
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];

    if (editingNote) {
      setNotes(
        notes.map((n) =>
          n.id === editingNote.id 
            ? { 
                ...formData, 
                id: editingNote.id, 
                createdDate: editingNote.createdDate,
                lastModified: currentDate 
              } 
            : n
        )
      );
      toast({
        title: "Success",
        description: "Note updated successfully",
      });
    } else {
      const newNote: Note = {
        ...formData,
        id: Math.max(...notes.map((n) => n.id)) + 1,
        createdDate: currentDate,
        lastModified: currentDate,
      };
      setNotes([...notes, newNote]);
      toast({
        title: "Success",
        description: "Note added successfully",
      });
    }
    handleCloseDialog();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-700";
      case "High":
        return "bg-orange-100 text-orange-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Notes & Plans</h1>
          <p className="text-gray-500 mt-1">Manage pastoral notes, plans, and ideas</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Note
          </Button>
          <Button variant="outline" onClick={() => navigate("/dashboard/pastor")}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 bg-primary text-white">
          <p className="text-sm font-medium opacity-90">Total Notes</p>
          <p className="text-2xl font-bold mt-1">{totalNotes}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-gray-600">High Priority</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{highPriorityNotes}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-gray-600">Recent (7 days)</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{recentNotes}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-gray-600">Categories</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{categories.length}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            className="border border-gray-300 rounded-md px-3 py-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            className="border border-gray-300 rounded-md px-3 py-2"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
          >
            <option value="All">All Priorities</option>
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Notes List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredNotes.map((note) => (
          <Card key={note.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-gray-900 line-clamp-1">{note.title}</h3>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(note.priority)}`}>
                {note.priority}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{note.content}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Tag className="w-4 h-4" />
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                  {note.category}
                </span>
              </div>
              
              {note.relatedTo && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>{note.relatedTo}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Modified: {note.lastModified}</span>
              </div>
            </div>
            
            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {note.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            
            <Button variant="outline" size="sm" onClick={() => handleOpenDialog(note)}>
              Edit Note
            </Button>
          </Card>
        ))}
      </div>

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-0 shadow-2xl">
                    <DialogHeader className="pb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {editingNote ? "Edit Note" : "Add New Note"}
                                </DialogTitle>
                                <p className="text-sm text-gray-600 mt-1">Create and organize your pastoral notes</p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Note Content Section */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <FileText className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-semibold text-gray-800">Note Content</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="title" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" />
                                        Title *
                                    </Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Enter a descriptive title"
                                        className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="content" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Content *
                                    </Label>
                                    <Textarea
                                        id="content"
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        placeholder="Write your note content here..."
                                        rows={8}
                                        className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200 resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Organization Section */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <Tag className="w-5 h-5 text-purple-600" />
                                <h3 className="text-lg font-semibold text-gray-800">Organization</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="category" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Tag className="w-4 h-4" />
                                        Category
                                    </Label>
                                    <select
                                        id="category"
                                        className="w-full border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-purple-200 rounded-lg px-3 py-2 transition-all duration-200 bg-white"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <Label htmlFor="priority" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        Priority
                                    </Label>
                                    <select
                                        id="priority"
                                        className="w-full border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-purple-200 rounded-lg px-3 py-2 transition-all duration-200 bg-white"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    >
                                        {priorities.map((priority) => (
                                            <option key={priority} value={priority}>
                                                {priority}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="relatedTo" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        Related To
                                    </Label>
                                    <Input
                                        id="relatedTo"
                                        value={formData.relatedTo}
                                        onChange={(e) => setFormData({ ...formData, relatedTo: e.target.value })}
                                        placeholder="e.g., Sunday Services, Youth Ministry, Member Name"
                                        className="border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-purple-200 rounded-lg transition-all duration-200"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tags Section */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <Hash className="w-5 h-5 text-green-600" />
                                <h3 className="text-lg font-semibold text-gray-800">Tags</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        placeholder="Enter a tag (e.g., sermon, prayer, youth)"
                                        onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                                        className="border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg transition-all duration-200"
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleAddTag}
                                        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Tag
                                    </Button>
                                </div>

                                {formData.tags.length > 0 && (
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700">Added Tags:</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full text-sm font-medium shadow-sm border border-green-200"
                                                >
                                                    <Hash className="w-3 h-3" />
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveTag(index)}
                                                        className="text-green-600 hover:text-green-800 transition-colors duration-200"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
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
                            {editingNote ? "Update" : "Create"} Note
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
    </div>
  );
}