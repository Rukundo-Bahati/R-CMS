import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Circle, Clock, Plus, Trash2, User, AlertCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface Assignment {
    id: string;
    member_id: string;
    member_name: string;
    task: string;
    status: "pending" | "completed";
    due_date: string;
    assigned_by: string;
    portal: string;
    created_at: string;
}

export default function Assignments() {
    const { user } = useAuth();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newAssignment, setNewAssignment] = useState({
        member_id: "",
        task: "",
        due_date: format(new Date(), "yyyy-MM-dd"),
    });

    const fetchData = async () => {
        if (!user?.portal) return;
        setLoading(true);
        try {
            const [assignmentsData, membersData] = await Promise.all([
                api.assignments.getAll(user.portal),
                api.grandparents.getMembers()
            ]);
            setAssignments(assignmentsData);
            setMembers(membersData);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load assignments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user?.portal]);

    const handleAddAssignment = async () => {
        if (!newAssignment.member_id || !newAssignment.task.trim()) {
            toast.error("Please select a member and enter a task");
            return;
        }

        try {
            await api.assignments.create({
                ...newAssignment,
                portal: user?.portal,
                assigned_by: user?.id,
            });
            fetchData();
            setNewAssignment({
                member_id: "",
                task: "",
                due_date: format(new Date(), "yyyy-MM-dd"),
            });
            setIsDialogOpen(false);
            toast.success("Assignment created successfully");
        } catch (error) {
            console.error("Error adding assignment:", error);
            toast.error("Failed to create assignment");
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === "pending" ? "completed" : "pending";
        try {
            await api.assignments.updateStatus(id, newStatus);
            setAssignments(assignments.map(a => a.id === id ? { ...a, status: newStatus as any } : a));
            toast.success(`Task marked as ${newStatus}`);
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    };

    const handleDeleteAssignment = async (id: string) => {
        if (!confirm("Are you sure you want to delete this assignment?")) return;
        try {
            await api.assignments.delete(id);
            setAssignments(assignments.filter(a => a.id !== id));
            toast.success("Assignment deleted");
        } catch (error) {
            console.error("Error deleting assignment:", error);
            toast.error("Failed to delete assignment");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
                    <p className="text-muted-foreground mt-2">
                        Assign tasks to members and track their progress.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            New Assignment
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Assignment</DialogTitle>
                            <DialogDescription>
                                Assign a task to a church member.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="member">Member</Label>
                                <Select
                                    value={newAssignment.member_id}
                                    onValueChange={(value) => setNewAssignment({ ...newAssignment, member_id: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a member" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {members.map((member) => (
                                            <SelectItem key={member.id} value={member.id.toString()}>
                                                {member.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="task">Task Description</Label>
                                <Input
                                    id="task"
                                    value={newAssignment.task}
                                    onChange={(e) => setNewAssignment({ ...newAssignment, task: e.target.value })}
                                    placeholder="What needs to be done?"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="due_date">Due Date</Label>
                                <Input
                                    id="due_date"
                                    type="date"
                                    value={newAssignment.due_date}
                                    onChange={(e) => setNewAssignment({ ...newAssignment, due_date: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleAddAssignment}>Create</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {assignments.length === 0 ? (
                <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">No assignments found</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                        Tasks assigned to members will appear here. Start by creating a new assignment.
                    </p>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {assignments.map((assignment) => (
                        <Card key={assignment.id} className={`hover:shadow-md transition-shadow ${assignment.status === 'completed' ? 'opacity-75' : ''}`}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        {assignment.status === "completed" ? (
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-blue-500" />
                                        )}
                                        <CardTitle className={`text-lg ${assignment.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                                            {assignment.task}
                                        </CardTitle>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pb-2">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <User className="w-4 h-4" />
                                        <span>Assigned to: <span className="font-medium text-foreground">{assignment.member_name}</span></span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="w-4 h-4" />
                                        <span>Due: {format(new Date(assignment.due_date), "PPP")}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between pt-4 border-t">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleToggleStatus(assignment.id, assignment.status)}
                                >
                                    {assignment.status === "completed" ? "Mark as Pending" : "Mark as Completed"}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:bg-destructive/10"
                                    onClick={() => handleDeleteAssignment(assignment.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
