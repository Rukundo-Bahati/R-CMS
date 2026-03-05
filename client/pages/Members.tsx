import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

// New form components for choir and general members
import { ChoirMemberForm } from "@/components/Members/ChoirMemberForm";
import { GeneralMemberForm } from "@/components/Members/GeneralMemberForm";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Search,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  User,
  Calendar as CalendarIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Briefcase as BriefcaseIcon,
  Trash2,
  Eye,
  Edit,
  Calendar as CalendarDays,
  UserCheck,
  X
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { initialFamilies } from "@/data/families";
import { api } from "@/lib/api";

import { useDebounce } from "../hooks/use-debounce";

type SortDirection = 'asc' | 'desc';
interface SortConfig {
  key: keyof Member;
  direction: SortDirection;
}

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  family_id: string; // Mapping from familyId to family_id for DB
  status: "active" | "inactive";
  class: string;
  gender: "M" | "F";
  role?: string;
  department?: string;
  is_committee?: boolean;
  year?: string;
  // compatibility with UI
  familyId?: string;
  voice?: string;
}

interface MemberDialogProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: Member) => void;
  mode: 'view' | 'edit';
  portal?: string;
  families: any[];
}
const MemberDialog: React.FC<MemberDialogProps> = ({
  member,
  isOpen,
  onClose,
  onSave,
  mode,
  portal,
  families
}) => {
  const [formData, setFormData] = useState<Omit<Member, 'id'>>({
    name: '',
    email: '',
    phone: '',
    family_id: '',
    familyId: '',
    status: 'active',
    class: new Date().getFullYear().toString(),
    gender: 'M',
    role: 'Member',
    department: '',
    is_committee: false,
    year: new Date().getFullYear().toString(),
    voice: '',
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        phone: member.phone,
        family_id: member.family_id,
        familyId: member.family_id,
        status: member.status,
        class: member.class,
        gender: member.gender,
        role: member.role || 'Member',
        department: member.department || '',
        is_committee: member.is_committee || false,
        year: member.year || member.class,
        voice: member.voice || '',
      });
    }
  }, [member]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: member?.id || '' } as Member);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'view' ? (
              <><User className="w-5 h-5" /> Member Profile</>
            ) : (
              <><Edit className="w-5 h-5" /> {member ? 'Edit Member' : 'Add New Member'}</>
            )}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} disabled={mode === 'view'} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} disabled={mode === 'view'} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} disabled={mode === 'view'} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="familyId">Family</Label>
              <select
                id="familyId"
                name="familyId"
                value={formData.familyId}
                onChange={handleChange}
                disabled={mode === 'view'}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select Family</option>
                {families.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={mode === 'view'}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="class">Class/Intake</Label>
              <Input id="class" name="class" value={formData.class} onChange={handleChange} disabled={mode === 'view'} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" name="role" value={formData.role} onChange={handleChange} disabled={mode === 'view'} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input id="year" name="year" placeholder="e.g., 2024-2027" value={formData.year} onChange={handleChange} disabled={mode === 'view'} />
            </div>
            {portal === 'choir' ? (
              <ChoirMemberForm formData={formData as any} onChange={handleChange} mode={mode} />
            ) : (
              <GeneralMemberForm formData={formData as any} onChange={handleChange} mode={mode} />
            )}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={mode === 'view'}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {mode === 'edit' && (
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog >
  );
};

export default function Members() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [members, setMembers] = useState<Member[]>([]);
  const [families, setFamilies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit'>('view');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  const itemsPerPage = 10;

  const fetchData = async () => {
    setLoading(true);
    try {
      const familiesData = await api.grandparents.getAll();
      setFamilies(familiesData);

      const membersData = await api.grandparents.getMembers();
      // Map back to UI expectations if needed
      setMembers(membersData.map((m: any) => ({
        ...m,
        familyId: m.family_id
      })));
    } catch (error) {
      console.error('Error fetching members:', error);
      toast({ title: "Error", description: "Failed to load members", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const sortedAndFilteredMembers = React.useMemo(() => {
    let result = [...members];

    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      result = result.filter((member) => {
        const familyName = families.find(f => f.id.toString() === (member.family_id || member.familyId)?.toString())?.name || '';
        return (
          member.name.toLowerCase().includes(searchLower) ||
          member.email.toLowerCase().includes(searchLower) ||
          familyName.toLowerCase().includes(searchLower)
        );
      });
    }

    if (sortConfig) {
      result.sort((a, b) => {
        let aValue = (a as any)[sortConfig.key];
        let bValue = (b as any)[sortConfig.key];

        if (sortConfig.key === 'familyId' as any) {
          aValue = families.find(f => f.id.toString() === (a.family_id || a.familyId)?.toString())?.name || '';
          bValue = families.find(f => f.id.toString() === (b.family_id || b.familyId)?.toString())?.name || '';
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [members, debouncedSearchTerm, sortConfig, families]);

  const requestSort = (key: keyof Member) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const totalPages = Math.ceil(sortedAndFilteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMembers = sortedAndFilteredMembers.slice(startIndex, startIndex + itemsPerPage);

  const getSortIcon = (key: keyof Member) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const SortableHeader = ({ columnKey, children }: { columnKey: keyof Member; children: React.ReactNode }) => (
    <TableHead
      className="cursor-pointer hover:bg-muted transition-colors"
      onClick={() => requestSort(columnKey)}
    >
      <div className="flex items-center">
        {children}
        <span className="ml-1">{getSortIcon(columnKey)}</span>
      </div>
    </TableHead>
  );

  const handleAddMember = async (newMember: any) => {
    try {
      await api.grandparents.createMember({
        ...newMember,
        family_id: newMember.familyId,
        gender: newMember.gender || 'M' // Default
      });
      fetchData();
      toast({ title: "Member Added", description: `${newMember.name} has been added.` });
      setIsAddOpen(false);
    } catch (error) {
      console.error('Error adding member:', error);
      toast({ title: "Error", description: "Failed to add member", variant: "destructive" });
    }
  };

  const handleUpdateMember = async (updatedMember: any) => {
    try {
      await api.grandparents.updateMember(updatedMember.id, {
        ...updatedMember,
        family_id: updatedMember.familyId
      });
      fetchData();
      toast({ title: "Member Updated", description: `${updatedMember.name}'s details updated.` });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error updating member:', error);
      toast({ title: "Error", description: "Failed to update member", variant: "destructive" });
    }
  };

  const handleDeleteMember = async (memberId: string, memberName: string) => {
    if (!confirm(`Are you sure you want to delete ${memberName}?`)) return;
    try {
      await api.grandparents.deleteMember(memberId);
      setMembers(members.filter(m => m.id !== memberId));
      toast({ title: "Member Deleted", description: `${memberName} removed.` });
    } catch (error) {
      console.error('Error deleting member:', error);
      toast({ title: "Error", description: "Failed to delete member", variant: "destructive" });
    }
  };

  const openMemberDialog = (member: Member, mode: 'view' | 'edit') => {
    setSelectedMember(member);
    setDialogMode(mode);
    setIsDialogOpen(true);
  };

  const handleViewAttendance = (memberName: string) => {
    toast({
      title: "Attendance",
      description: `Viewing attendance for ${memberName}`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Members</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view all church members
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Member
            </Button>
          </DialogTrigger>
          <MemberDialog
            member={null}
            isOpen={isAddOpen}
            onClose={() => setIsAddOpen(false)}
            onSave={handleAddMember}
            mode="edit"
            portal={user?.portal}
            families={families}
          />
        </Dialog>

        {/* Member View/Edit Dialog */}
        <MemberDialog
          member={selectedMember}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={selectedMember ? handleUpdateMember : handleAddMember}
          mode={dialogMode}
          portal={user?.portal}
          families={families}
        />
      </div>

      <div className="mb-8">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
          {searchTerm && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <button
                onClick={() => setSearchTerm('')}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        {searchTerm && (
          <p className="text-xs text-muted-foreground mt-1 px-1">
            {currentMembers.length} {currentMembers.length === 1 ? 'result' : 'results'} found
          </p>
        )}
      </div>

      {currentMembers.length > 0 ? (
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <SortableHeader columnKey="name">Member Information</SortableHeader>
                <SortableHeader columnKey="email">Email</SortableHeader>
                {user?.portal === 'choir' ? (
                  <TableHead>Committee</TableHead>
                ) : (
                  <SortableHeader columnKey="department">Department</SortableHeader>
                )}
                <SortableHeader columnKey="class">Class</SortableHeader>
                {user?.portal === 'choir' ? (
                  <SortableHeader columnKey="voice">Voice</SortableHeader>
                ) : (
                  <SortableHeader columnKey="familyId">Family Name</SortableHeader>
                )}
                <SortableHeader columnKey="status">Status</SortableHeader>
                <TableHead className="w-[80px] text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    {member.name}
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    {user?.portal === 'choir' ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${member.is_committee
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-muted text-muted-foreground"
                        }`}>
                        {member.is_committee ? "Yes" : "No"}
                      </span>
                    ) : (
                      member.department
                    )}
                  </TableCell>
                  <TableCell>{member.class} Intake</TableCell>
                  <TableCell>
                    {user?.portal === 'choir' ? (
                      member.voice || '-'
                    ) : (
                      families.find(f => f.id.toString() === (member.family_id || member.familyId)?.toString())?.name || '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${member.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-muted text-muted-foreground"
                      }`}>
                      {member.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => openMemberDialog(member, 'view')}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => openMemberDialog(member, 'edit')}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleViewAttendance(member.name)}
                        >
                          <CalendarDays className="mr-2 h-4 w-4" />
                          <span>View Attendance</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-red-600"
                          onClick={() => handleDeleteMember(member.id, member.name)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Remove Member</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Card className="text-center py-12">
          <p className="text-muted-foreground">No members found matching your search</p>
        </Card>
      )}

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {Math.min(startIndex + 1, sortedAndFilteredMembers.length)} to {Math.min(startIndex + currentMembers.length, sortedAndFilteredMembers.length)} of {sortedAndFilteredMembers.length} members
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm px-2">
            Page {currentPage} of {totalPages || 1}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="h-8 w-8 p-0"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
