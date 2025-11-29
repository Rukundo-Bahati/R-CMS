import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Calendar, StickyNote, ListTodo } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  portal: string;
  type: "note" | "plan";
}

export default function Notes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "", type: "note" as "note" | "plan" });

  useEffect(() => {
    if (user?.portal) {
      const savedNotes = localStorage.getItem(`r-cms-notes-${user.portal}`);
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    }
  }, [user?.portal]);

  const saveNotes = (updatedNotes: Note[]) => {
    setNotes(updatedNotes);
    if (user?.portal) {
      localStorage.setItem(`r-cms-notes-${user.portal}`, JSON.stringify(updatedNotes));
    }
  };

  const handleAddNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast.error("Please fill in both title and content");
      return;
    }

    const note: Note = {
      id: crypto.randomUUID(),
      title: newNote.title,
      content: newNote.content,
      createdAt: new Date().toISOString(),
      portal: user?.portal || "unknown",
      type: newNote.type,
    };

    const updatedNotes = [note, ...notes];
    saveNotes(updatedNotes);
    setNewNote({ title: "", content: "", type: "note" });
    setIsDialogOpen(false);
    toast.success(`${newNote.type === 'plan' ? 'Plan' : 'Note'} created successfully`);
  };

  const handleDeleteNote = (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    saveNotes(updatedNotes);
    toast.success("Item deleted");
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notes & Plans</h1>
          <p className="text-muted-foreground mt-2">
            Manage your personal notes and plans for the {user?.portal.replace("_", " ")} portal.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add New
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Item</DialogTitle>
              <DialogDescription>
                Add a new note or plan to your collection.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newNote.type}
                  onValueChange={(value: "note" | "plan") => setNewNote({ ...newNote, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="note">Note</SelectItem>
                    <SelectItem value="plan">Plan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  placeholder={newNote.type === 'plan' ? "e.g., Q1 Goals" : "Meeting notes..."}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  placeholder={newNote.type === 'plan' ? "Outline your plan steps..." : "Discussed upcoming events..."}
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddNote}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg bg-muted/50">
          <div className="flex flex-col items-center justify-center text-center max-w-sm p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <StickyNote className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">No items yet</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              Create your first note or plan to keep track of important information.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} variant="outline">
              Create Item
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {notes.map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-semibold leading-none tracking-tight">
                        {note.title}
                      </CardTitle>
                      <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-wider ${note.type === 'plan'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {note.type || 'NOTE'}
                      </span>
                    </div>
                    <CardDescription className="flex items-center gap-1 text-xs mt-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(note.createdAt), "PPP")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-6">
                      {note.content}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-3 border-t bg-muted/50 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-2"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
