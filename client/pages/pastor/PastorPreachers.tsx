import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mic, Search, Mail, Phone, UserCheck, Plus, Calendar, BookOpen } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Preacher {
    id: number;
    name: string;
    email: string;
    phone: string;
    specialization: string;
    experience: string;
    status: string;
    lastPreached: string;
    totalSermons: number;
}

const initialPreachers: Preacher[] = [
    {
        id: 1,
        name: "Rev. John Smith",
        email: "john.smith@church.com",
        phone: "+250 788 123 456",
        specialization: "Evangelism",
        experience: "15 years",
        status: "Active",
        lastPreached: "2025-11-24",
        totalSermons: 145,
    },
    {
        id: 2,
        name: "Pastor Mary Johnson",
        email: "mary.johnson@church.com",
        phone: "+250 788 234 567",
        specialization: "Youth Ministry",
        experience: "8 years",
        status: "Active",
        lastPreached: "2025-11-17",
        totalSermons: 89,
    },
    {
        id: 3,
        name: "Elder David Brown",
        email: "david.brown@church.com",
        phone: "+250 788 345 678",
        specialization: "Biblical Teaching",
        experience: "12 years",
        status: "Active",
        lastPreached: "2025-11-10",
        totalSermons: 112,
    },
    {
        id: 4,
        name: "Pastor Sarah Wilson",
        email: "sarah.wilson@church.com",
        phone: "+250 788 456 789",
        specialization: "Worship & Prayer",
        experience: "6 years",
        status: "Active",
        lastPreached: "2025-11-03",
        totalSermons: 67,
    },
    {
        id: 5,
        name: "Rev. Michael Davis",
        email: "michael.davis@church.com",
        phone: "+250 788 567 890",
        specialization: "Pastoral Care",
        experience: "20 years",
        status: "On Leave",
        lastPreached: "2025-10-15",
        totalSermons: 203,
    },
];

export default function PastorPreachers() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [preachers, setPreachers] = useState<Preacher[]>(initialPreachers);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSpecialization, setSelectedSpecialization] = useState<string>("All");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPreacher, setEditingPreacher] = useState<Preacher | null>(null);
    const [formData, setFormData] = useState<Omit<Preacher, "id" | "totalSermons">>({
        name: "",
        email: "",
        phone: "",
        specialization: "Evangelism",
        experience: "",
        status: "Active",
        lastPreached: "",
    });

    const filteredPreachers = preachers.filter((preacher) => {
        const matchesSearch = preacher.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSpecialization = selectedSpecialization === "All" || preacher.specialization === selectedSpecialization;
        return matchesSearch && matchesSpecialization;
    });

    const activePreachers = preachers.filter((p) => p.status === "Active").length;
    const onLeavePreachers = preachers.filter((p) => p.status === "On Leave").length;
    const totalSermons = preachers.reduce((sum, p) => sum + p.totalSermons, 0);

    const handleOpenDialog = (preacher?: Preacher) => {
        if (preacher) {
            setEditingPreacher(preacher);
            setFormData({
                name: preacher.name,
                email: preacher.email,
                phone: preacher.phone,
                specialization: preacher.specialization,
                experience: preacher.experience,
                status: preacher.status,
                lastPreached: preacher.lastPreached,
            });
        } else {
            setEditingPreacher(null);
            setFormData({
                name: "",
                email: "",
                phone: "",
                specialization: "Evangelism",
                experience: "",
                status: "Active",
                lastPreached: "",
            });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingPreacher(null);
    };

    const handleSave = () => {
        if (!formData.name || !formData.email || !formData.phone) {
            toast({
                title: "Error",
                description: "Please fill in all required fields",
                variant: "destructive",
            });
            return;
        }

        if (editingPreacher) {
            setPreachers(
                preachers.map((p) =>
                    p.id === editingPreacher.id 
                        ? { ...formData, id: editingPreacher.id, totalSermons: editingPreacher.totalSermons } 
                        : p
                )
            );
            toast({
                title: "Success",
                description: "Preacher updated successfully",
            });
        } else {
            const newPreacher: Preacher = {
                ...formData,
                id: Math.max(...preachers.map((p) => p.id)) + 1,
                totalSermons: 0,
            };
            setPreachers([...preachers, newPreacher]);
            toast({
                title: "Success",
                description: "Preacher added successfully",
            });
        }
        handleCloseDialog();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Manage Preachers</h1>
                    <p className="text-gray-500 mt-1">Oversee and manage church preachers</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => handleOpenDialog()}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Preacher
                    </Button>
                    <Button variant="outline" onClick={() => navigate("/dashboard/pastor")}>
                        Back to Dashboard
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-5 bg-primary text-white">
                    <p className="text-sm font-medium opacity-90">Total Preachers</p>
                    <p className="text-2xl font-bold mt-1">{preachers.length}</p>
                </Card>
                <Card className="p-5">
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{activePreachers}</p>
                </Card>
                <Card className="p-5">
                    <p className="text-sm font-medium text-gray-600">On Leave</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{onLeavePreachers}</p>
                </Card>
                <Card className="p-5">
                    <p className="text-sm font-medium text-gray-600">Total Sermons</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{totalSermons}</p>
                </Card>
            </div>

            {/* Filters */}
            <Card className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            placeholder="Search preachers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <select
                        className="border border-gray-300 rounded-md px-3 py-2"
                        value={selectedSpecialization}
                        onChange={(e) => setSelectedSpecialization(e.target.value)}
                    >
                        <option value="All">All Specializations</option>
                        <option value="Evangelism">Evangelism</option>
                        <option value="Youth Ministry">Youth Ministry</option>
                        <option value="Biblical Teaching">Biblical Teaching</option>
                        <option value="Worship & Prayer">Worship & Prayer</option>
                        <option value="Pastoral Care">Pastoral Care</option>
                    </select>
                </div>
            </Card>

            {/* Preachers List */}
            <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Mic className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold">Preachers List</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Specialization</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Experience</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Sermons</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPreachers.map((preacher) => (
                                <tr key={preacher.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Mic className="w-5 h-5 text-primary" />
                                            </div>
                                            <span className="font-medium text-gray-900">{preacher.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                <span>{preacher.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4" />
                                                <span>{preacher.phone}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                            {preacher.specialization}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-700">{preacher.experience}</td>
                                    <td className="py-3 px-4">
                                        <div className="text-sm">
                                            <div className="font-medium text-gray-900">{preacher.totalSermons}</div>
                                            <div className="text-gray-500">Last: {preacher.lastPreached}</div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`px-2 py-1 rounded-full text-sm ${preacher.status === "Active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {preacher.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleOpenDialog(preacher)}>
                                                Edit
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => navigate(`/dashboard/pastor/schedule?preacher=${preacher.id}`)}
                                            >
                                                Schedule
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingPreacher ? "Edit Preacher" : "Add New Preacher"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Enter email"
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone">Phone *</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+250 788 123 456"
                            />
                        </div>
                        <div>
                            <Label htmlFor="specialization">Specialization</Label>
                            <select
                                id="specialization"
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                value={formData.specialization}
                                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                            >
                                <option value="Evangelism">Evangelism</option>
                                <option value="Youth Ministry">Youth Ministry</option>
                                <option value="Biblical Teaching">Biblical Teaching</option>
                                <option value="Worship & Prayer">Worship & Prayer</option>
                                <option value="Pastoral Care">Pastoral Care</option>
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="experience">Experience</Label>
                            <Input
                                id="experience"
                                value={formData.experience}
                                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                placeholder="e.g., 5 years"
                            />
                        </div>
                        <div>
                            <Label htmlFor="lastPreached">Last Preached</Label>
                            <Input
                                id="lastPreached"
                                type="date"
                                value={formData.lastPreached}
                                onChange={(e) => setFormData({ ...formData, lastPreached: e.target.value })}
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
                                <option value="Active">Active</option>
                                <option value="On Leave">On Leave</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCloseDialog}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>{editingPreacher ? "Update" : "Add"} Preacher</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}