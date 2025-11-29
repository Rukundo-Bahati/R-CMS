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
  department: string;
  familyId: string;
  status: "active" | "inactive";
  class: string;
  voice?: "Soprano" | "Alto" | "Tenor" | "Bass";
  isCommittee?: boolean;
}

// Utility function to check if a string is an email
const isEmail = (value: string): boolean => {
  return /\S+@\S+\.\S+/.test(value);
};
// Utility function to check if a string is a phone number (basic pattern)
const isPhone = (value: string): boolean => {
  return /^\+?\d{7,15}$/.test(value.replace(/\s+/g, ""));
};
// Utility to check if string looks like a date (YYYY-MM-DD)
const isDate = (value: string): boolean => {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
};
// Utility to check if string looks like a class/intake year (4-digit)
const isClass = (value: string): boolean => {
  return /^\d{4}$/.test(value);
};

// Sanitize member object to correct misplaced fields
const sanitizeMember = (member: Member): Member => {
  let correctedMember = { ...member };

  // If email field contains multiple lines or a value not an email, attempt to fix fields
  let emailVal = correctedMember.email.trim();

  // Detect common cases separated by newlines or spaces, split into parts
  const parts = emailVal.split(/\s|\n/).filter(Boolean);

  if (parts.length > 1) {
    parts.forEach((part) => {
      if (isEmail(part)) correctedMember.email = part;
      else if (isPhone(part)) correctedMember.phone = part;
      else if (isClass(part)) correctedMember.class = part;
    });
  } else {
    // For single value in emailVal, check if misplaced
    if (!isEmail(emailVal)) {
      // Move value to correct property
      if (isPhone(emailVal)) {
        correctedMember.phone = emailVal;
        correctedMember.email = "";
      } else if (isClass(emailVal)) {
        correctedMember.class = emailVal;
        correctedMember.email = "";
      }
    }
  }

  return correctedMember;
};

const mockMembers: Member[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    phone: "+1234567890",
    department: "Choir",
    familyId: "1",
    status: "active",
    class: "2023",
  },
  {
    id: "2",
    name: "Mary Johnson",
    email: "mary@example.com",
    phone: "+1234567891",
    department: "Finance",
    familyId: "2",
    status: "active",
    class: "2022",
  },
  {
    id: "3",
    name: "Peter Brown",
    email: "peter@example.com",
    phone: "+1234567892",
    department: "Ushers",
    familyId: "3",
    status: "active",
    class: "2023",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    phone: "+1234567893",
    department: "Intercessors",
    familyId: "1",
    status: "active",
    class: "2021",
  },
  {
    id: "5",
    name: "Michael Davis",
    email: "michael@example.com",
    phone: "+1234567894",
    department: "Choir",
    familyId: "2",
    status: "active",
    class: "2024",
    voice: "Bass",
  },
];

interface MemberDialogProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: Member) => void;
  mode: 'view' | 'edit';
  portal?: string;
}

const MemberDialog: React.FC<MemberDialogProps> = ({
  member,
  isOpen,
  onClose,
  onSave,
  mode,
  portal
}) => {
  const [formData, setFormData] = useState<Omit<Member, 'id'>>({
    name: '',
    email: '',
    phone: '',
    department: '',
    familyId: '',
    status: 'active',
    class: new Date().getFullYear().toString(),
    voice: undefined,
    isCommittee: false,
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        phone: member.phone,
        department: member.department,
        familyId: member.familyId,
        status: member.status,
        class: member.class,
        voice: member.voice,
        isCommittee: member.isCommittee || false,
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
    if (member) {
      onSave({ ...formData, id: member.id });
    } else {
      onSave({ ...formData, id: Date.now().toString() });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'view' ? (
              <>
                <User className="w-5 h-5" />
                Member Profile
              </>
            ) : (
              <>
                <Edit className="w-5 h-5" />
                {member ? 'Edit Member' : 'Add New Member'}
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={mode === 'view'}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={mode === 'view'}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
            {portal === 'choir' ? (
              <div className="space-y-2">
                <Label htmlFor="isCommittee">Committee Member</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isCommittee"
                    name="isCommittee"
                    checked={formData.isCommittee || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, isCommittee: e.target.checked }))}
                    disabled={mode === 'view'}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                  />
                  <label htmlFor="isCommittee" className="text-sm text-muted-foreground">
                    {formData.isCommittee ? 'Yes' : 'No'}
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  disabled={mode === 'view'}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="class">Class/Intake</Label>
              <Input
                id="class"
                name="class"
                type="number"
                value={formData.class}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>

            {portal === 'choir' ? (
              <div className="space-y-2">
                <Label htmlFor="voice">Voice Type</Label>
                <select
                  id="voice"
                  name="voice"
                  value={formData.voice || ''}
                  onChange={handleChange}
                  disabled={mode === 'view'}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select a voice</option>
                  <option value="Soprano">Soprano</option>
                  <option value="Alto">Alto</option>
                  <option value="Tenor">Tenor</option>
                  <option value="Bass">Bass</option>
                </select>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="familyId">Family</Label>
                <select
                  id="familyId"
                  name="familyId"
                  value={formData.familyId}
                  onChange={handleChange}
                  disabled={mode === 'view'}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select a family</option>
                  {initialFamilies.map((family) => (
                    <option key={family.id} value={family.id}>
                      {family.name} ({family.generation})
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={mode === 'view'}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {mode === 'edit' && (
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
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
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit'>('view');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  const itemsPerPage = 5;

  // On mount, sanitize members data and set state
  useEffect(() => {
    const sanitized = mockMembers.map((m) => sanitizeMember(m));
    setMembers(sanitized);
  }, []);

  const sortedAndFilteredMembers = React.useMemo(() => {
    let result = [...members];

    // Apply search filter
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      result = result.filter((member) => {
        const familyName = initialFamilies.find(f => f.id === member.familyId)?.name || '';
        return (
          member.name.toLowerCase().includes(searchLower) ||
          member.email.toLowerCase().includes(searchLower) ||
          member.department.toLowerCase().includes(searchLower) ||
          familyName.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Special handling for family name
        if (sortConfig.key === 'familyId') {
          aValue = initialFamilies.find(f => f.id === a.familyId)?.name || '';
          bValue = initialFamilies.find(f => f.id === b.familyId)?.name || '';
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [members, debouncedSearchTerm, sortConfig]);

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
      className="cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => requestSort(columnKey)}
    >
      <div className="flex items-center">
        {children}
        <span className="ml-1">{getSortIcon(columnKey)}</span>
      </div>
    </TableHead>
  );

  const handleAddMember = (newMember: Member) => {
    setMembers(prev => {
      const updated = [...prev, newMember];
      toast({
        title: "Member Added",
        description: `${newMember.name} has been added successfully.`,
      });
      return updated;
    });
    setIsAddOpen(false);
  };

  const handleUpdateMember = (updatedMember: Member) => {
    setMembers(prev => {
      const updated = prev.map(member =>
        member.id === updatedMember.id ? updatedMember : member
      );
      toast({
        title: "Member Updated",
        description: `${updatedMember.name}'s details have been updated.`,
      });
      return updated;
    });
    setIsDialogOpen(false);
  };

  const handleDeleteMember = (memberId: string, memberName: string) => {
    const deleteMember = () => {
      setMembers(prev => {
        const newMembers = prev.filter(member => member.id !== memberId);
        toast({
          title: "Member Deleted",
          description: `${memberName} has been removed successfully.`,
          variant: "default",
        });
        return newMembers;
      });
    };

    // Store the toast instance first
    const toastInstance = toast({
      title: "Confirm Deletion",
      description: `Are you sure you want to delete ${memberName}?`,
      variant: "destructive",
      action: (
        <button
          onClick={() => {
            deleteMember();
            // Dismiss the current toast using the stored instance
            toastInstance.dismiss();
          }}
          className="ml-4 px-3 py-1.5 text-sm font-medium text-white bg-destructive rounded hover:bg-destructive/90 focus:outline-none"
        >
          Delete
        </button>
      ),
    });
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
          <h1 className="text-3xl font-bold text-gray-900">Members</h1>
          <p className="text-gray-600 mt-1">
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
          />
        </Dialog>

        {/* Member View/Edit Dialog */}
        <MemberDialog
          member={selectedMember}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleUpdateMember}
          mode={dialogMode}
          portal={user?.portal}
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
                className="text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        {searchTerm && (
          <p className="text-xs text-gray-500 mt-1 px-1">
            {currentMembers.length} {currentMembers.length === 1 ? 'result' : 'results'} found
          </p>
        )}
      </div>

      {currentMembers.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-gray-50">
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
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${member.isCommittee
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-600"
                        }`}>
                        {member.isCommittee ? "Yes" : "No"}
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
                      initialFamilies.find(f => f.id === member.familyId)?.name || '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${member.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
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
          <p className="text-gray-600">No members found matching your search</p>
        </Card>
      )}

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
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
