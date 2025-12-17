import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Search, Mail, Phone, UserCheck, Plus, Mic, Calendar } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Member {
    id: number;
    name: string;
    email: string;
    phone: string;
    department: string;
    role: string;
    status: string;
    joinDate: string;
    canPreach: boolean;
    preachingExperience: string;
}

const initialMembers: Member[] = [
    {
        id: 1,
        name: "John Doe",
        email: "john.doe@church.com",
        phone: "+250 788 123 456",
        department: "Youth Ministry",
        role: "Member",
        status: "Active",
        joinDate: "2023-01-15",
        canPreach: true,
        preachingExperience: "2 years",
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@church.com",
        phone: "+250 788 234 567",
        department: "Worship Team",
        role: "Leader",
        status: "Active",
        joinDate: "2022-06-10",
        canPreach: false,
        preachingExperience: "",
    },
    {
        id: 3,
        name: "Mike Johnson",
        email: "mike.johnson@church.com",
        phone: "+250 788 345 678",
        department: "Evangelism",
        role: "Member",
        status: "Active",
        joinDate: "2023-03-20",
        canPreach: true,
        preachingExperience: "1 year",
    },
    {
        id: 4,
        name: "Sarah Williams",
        email: "sarah.williams@church.com",
        phone: "+250 788 456 789",
        department: "Children Ministry",
        role: "Coordinator",
        status: "Active",
        joinDate: "2021-09-05",
        canPreach: true,
        preachingExperience: "3 years",
    },
    {
        id: 5,
        name: "David Brown",
        email: "david.brown@church.com",
        phone: "+250 788 567 890",
        department: "Prayer Ministry",
        role: "Member",
        status: "Inactive",
        joinDate: "2022-11-12",
        canPreach: false,
        preachingExperience: "",
    },
];

export default function PastorMembers() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [members, setMembers] = useState<Member[]>(initialMembers);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState<string>("All");
    const [showPreachersOnly, setShowPreachersOnly] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const [formData, setFormData] = useState<Omit<Member, "id">>({
        name: "",
        email: "",
        phone: "",
        department: "Youth Ministry",
        role: "Member",
        status: "Active",
        joinDate: "",
        canPreach: false,
        preachingExperience: "",
    });

    const filteredMembers = members.filter((member) => {
        const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDepartment = selectedDepartment === "All" || member.department === selectedDepartment;
        const matchesPreacher = !showPreachersOnly || member.canPreach;
        return matchesSearch && matchesDepartment && matchesPreacher;
    });

    const activeMembers = members.filter((m) => m.status === "Active").length;
    const inactiveMembers = members.filter((m) => m.status === "Inactive").length;
    const preachingMembers = members.filter((m) => m.canPreach).length;

    const departments = [...new Set(members.map(m => m.department))];

    const handleOpenDialog = (member?: Member) => {
        if (member) {
            setEditingMember(member);
            setFormData({
                name: member.name,
                email: member.email,
                phone: member.phone,
                department: member.department,
                role: member.role,
                status: member.status,
                joinDate: member.joinDate,
                canPreach: member.canPreach,
                preachingExperience: member.preachingExperience,
            });
        } else {
            setEditingMember(null);
            setFormData({
                name: "",
                email: "",
                phone: "",
                department: "Youth Ministry",
                role: "Member",
                status: "Active",
                joinDate: "",
                canPreach: false,
                preachingExperience: "",
            });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingMember(null);
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

        if (editingMember) {
            setMembers(
                members.map((m) =>
                    m.id === editingMember.id ? { ...formData, id: editingMember.id } : m
                )
            );
            toast({
                title: "Success",
                description: "Member updated successfully",
            });
        } else {
            const newMember: Member = {
                ...formData,
                id: Math.max(...members.map((m) => m.id)) + 1,
            };
            setMembers([...members, newMember]);
            toast({
                title: "Success",
                description: "Member added successfully",
            });
        }
        handleCloseDialog();
    };

    const handleAssignToPreaching = (memberId: number) => {
        navigate(`/dashboard/pastor/schedule?assignMember=${memberId}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Church Members</h1>
                    <p className="text-gray-500 mt-1">Manage church members and identify potential preachers</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => handleOpenDialog()}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Member
                    </Button>
                    <Button variant="outline" onClick={() => navigate("/dashboard/pastor")}>
                        Back to Dashboard
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-5 bg-primary text-white">
                    <p className="text-sm font-medium opacity-90">Total Members</p>
                    <p className="text-2xl font-bold mt-1">{members.length}</p>
                </Card>
                <Card className="p-5">
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{activeMembers}</p>
                </Card>
                <Card className="p-5">
                    <p className="text-sm font-medium text-gray-600">Can Preach</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{preachingMembers}</p>
                </Card>
                <Card className="p-5">
                    <p className="text-sm font-medium text-gray-600">Departments</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{departments.length}</p>
                </Card>
            </div>

            {/* Filters */}
            <Card className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            placeholder="Search members..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <select
                        className="border border-gray-300 rounded-md px-3 py-2"
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                        <option value="All">All Departments</option>
                        {departments.map((dept) => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showPreachersOnly}
                            onChange={(e) => setShowPreachersOnly(e.target.checked)}
                            className="rounded"
                        />
                        <span className="text-sm">Preachers Only</span>
                    </label>
                </div>
            </Card>

            {/* Members List */}
            <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold">Members List</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Department</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Preaching</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMembers.map((member) => (
                                <tr key={member.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <UserCheck className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-900">{member.name}</span>
                                                <div className="text-xs text-gray-500">Joined: {member.joinDate}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                <span>{member.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4" />
                                                <span>{member.phone}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                            {member.department}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-700">{member.role}</td>
                                    <td className="py-3 px-4">
                                        {member.canPreach ? (
                                            <div className="text-sm">
                                                <div className="flex items-center gap-1 text-green-600">
                                                    <Mic className="w-4 h-4" />
                                                    <span>Yes</span>
                                                </div>
                                                <div className="text-xs text-gray-500">{member.preachingExperience}</div>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-sm">No</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`px-2 py-1 rounded-full text-sm ${member.status === "Active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleOpenDialog(member)}>
                                                Edit
                                            </Button>
                                            {member.canPreach && (
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => handleAssignToPreaching(member.id)}
                                                >
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    Assign
                                                </Button>
                                            )}
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
                        <DialogTitle>{editingMember ? "Edit Member" : "Add New Member"}</DialogTitle>
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
                            <Label htmlFor="department">Department</Label>
                            <select
                                id="department"
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            >
                                <option value="Youth Ministry">Youth Ministry</option>
                                <option value="Worship Team">Worship Team</option>
                                <option value="Evangelism">Evangelism</option>
                                <option value="Children Ministry">Children Ministry</option>
                                <option value="Prayer Ministry">Prayer Ministry</option>
                                <option value="Ushering">Ushering</option>
                                <option value="Media Team">Media Team</option>
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="role">Role</Label>
                            <select
                                id="role"
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="Member">Member</option>
                                <option value="Leader">Leader</option>
                                <option value="Coordinator">Coordinator</option>
                                <option value="Assistant">Assistant</option>
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="joinDate">Join Date</Label>
                            <Input
                                id="joinDate"
                                type="date"
                                value={formData.joinDate}
                                onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="canPreach"
                                checked={formData.canPreach}
                                onChange={(e) => setFormData({ ...formData, canPreach: e.target.checked })}
                                className="rounded"
                            />
                            <Label htmlFor="canPreach">Can Preach</Label>
                        </div>
                        {formData.canPreach && (
                            <div>
                                <Label htmlFor="preachingExperience">Preaching Experience</Label>
                                <Input
                                    id="preachingExperience"
                                    value={formData.preachingExperience}
                                    onChange={(e) => setFormData({ ...formData, preachingExperience: e.target.value })}
                                    placeholder="e.g., 2 years"
                                />
                            </div>
                        )}
                        <div>
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCloseDialog}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>{editingMember ? "Update" : "Add"} Member</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}