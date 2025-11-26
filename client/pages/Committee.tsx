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
import { useDebounce } from "../hooks/use-debounce";

type SortDirection = 'asc' | 'desc';
interface SortConfig {
  key: keyof Committee;
  direction: SortDirection;
}

interface Committee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: "active" | "inactive";
}

// Utility function to check if a string is an email
const isEmail = (value: string): boolean => {
  return /\S+@\S+\.\S+/.test(value);
};
// Utility function to check if a string is a phone number (basic pattern)
const isPhone = (value: string): boolean => {
  return /^\+?\d{7,15}$/.test(value.replace(/\s+/g, ""));
};

const mockCommitteeMembers: Committee[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@church.org",
    phone: "+1234567890",
    role: "Chairperson",
    department: "Leadership",
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@church.org",
    phone: "+1234567891",
    role: "Vice Chair",
    department: "Leadership",
    status: "active",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.johnson@church.org",
    phone: "+1234567892",
    role: "Secretary",
    department: "Administration",
    status: "active",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@church.org",
    phone: "+1234567893",
    role: "Treasurer",
    department: "Finance",
    status: "active",
  },
  {
    id: "5",
    name: "Michael Wilson",
    email: "michael.wilson@church.org",
    phone: "+1234567894",
    role: "Member",
    department: "Worship",
    status: "active",
  },
  {
    id: "6",
    name: "Sarah Brown",
    email: "sarah.brown@church.org",
    phone: "+1234567895",
    role: "Member",
    department: "Youth Ministry",
    status: "active",
  },
  {
    id: "7",
    name: "David Lee",
    email: "david.lee@church.org",
    phone: "+1234567896",
    role: "Member",
    department: "Evangelism",
    status: "active",
  },
  {
    id: "8",
    name: "Lisa Garcia",
    email: "lisa.garcia@church.org",
    phone: "+1234567897",
    role: "Member",
    department: "Children's Ministry",
    status: "inactive",
  },
  {
    id: "9",
    name: "James Miller",
    email: "james.miller@church.org",
    phone: "+1234567898",
    role: "Member",
    department: "Men's Ministry",
    status: "active",
  },
  {
    id: "10",
    name: "Maria Rodriguez",
    email: "maria.rodriguez@church.org",
    phone: "+1234567899",
    role: "Member",
    department: "Women's Ministry",
    status: "active",
  },
];

interface CommitteeDialogProps {
  committee: Committee | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (committee: Committee) => void;
  mode: 'view' | 'edit';
}

const CommitteeDialog: React.FC<CommitteeDialogProps> = ({
  committee,
  isOpen,
  onClose,
  onSave,
  mode
}) => {
  const [formData, setFormData] = useState<Omit<Committee, 'id'>>({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    status: 'active',
  });

  useEffect(() => {
    if (committee) {
      setFormData({
        name: committee.name,
        email: committee.email,
        phone: committee.phone,
        role: committee.role,
        department: committee.department,
        status: committee.status,
      });
    }
  }, [committee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (committee) {
      onSave({ ...formData, id: committee.id });
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
                Committee Member Profile
              </>
            ) : (
              <>
                <Edit className="w-5 h-5" />
                {committee ? 'Edit Committee Member' : 'Add New Committee Member'}
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
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={mode === 'view'}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                disabled={mode === 'view'}
                required
              />
            </div>
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
    </Dialog>
  );
};

export default function Committee() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(null);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit'>('view');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  const itemsPerPage = 5;

  // On mount, set committee data
  useEffect(() => {
    setCommittees(mockCommitteeMembers);
  }, []);

  const sortedAndFilteredCommittees = React.useMemo(() => {
    let result = [...committees];

    // Apply search filter
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      result = result.filter((committee) => {
        return (
          committee.name.toLowerCase().includes(searchLower) ||
          committee.email.toLowerCase().includes(searchLower) ||
          committee.role.toLowerCase().includes(searchLower) ||
          committee.department.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

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
  }, [committees, debouncedSearchTerm, sortConfig]);

  const requestSort = (key: keyof Committee) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const totalPages = Math.ceil(sortedAndFilteredCommittees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCommittees = sortedAndFilteredCommittees.slice(startIndex, startIndex + itemsPerPage);

  const getSortIcon = (key: keyof Committee) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const SortableHeader = ({ columnKey, children }: { columnKey: keyof Committee; children: React.ReactNode }) => (
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

  const handleAddCommittee = (newCommittee: Committee) => {
    setCommittees(prev => {
      const updated = [...prev, newCommittee];
      toast({
        title: "Committee Member Added",
        description: `${newCommittee.name} has been added successfully.`,
      });
      return updated;
    });
    setIsAddOpen(false);
  };

  const handleUpdateCommittee = (updatedCommittee: Committee) => {
    setCommittees(prev => {
      const updated = prev.map(committee =>
        committee.id === updatedCommittee.id ? updatedCommittee : committee
      );
      toast({
        title: "Committee Member Updated",
        description: `${updatedCommittee.name}'s details have been updated.`,
      });
      return updated;
    });
    setIsDialogOpen(false);
  };

  const handleDeleteCommittee = (committeeId: string, committeeName: string) => {
    const deleteCommittee = () => {
      setCommittees(prev => {
        const newCommittees = prev.filter(committee => committee.id !== committeeId);
        toast({
          title: "Committee Member Deleted",
          description: `${committeeName} has been removed successfully.`,
          variant: "default",
        });
        return newCommittees;
      });
    };

    // Store the toast instance first
    const toastInstance = toast({
      title: "Confirm Deletion",
      description: `Are you sure you want to delete ${committeeName}?`,
      variant: "destructive",
      action: (
        <button
          onClick={() => {
            deleteCommittee();
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

  const openCommitteeDialog = (committee: Committee, mode: 'view' | 'edit') => {
    setSelectedCommittee(committee);
    setDialogMode(mode);
    setIsDialogOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Committee</h1>
          <p className="text-gray-600 mt-1">
            Manage and view all committee members
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Committee Member
          </Button>
        </DialogTrigger>
        <CommitteeDialog
          committee={null}
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSave={handleAddCommittee}
          mode="edit"
        />
      </Dialog>

      {/* Committee View/Edit Dialog */}
      <CommitteeDialog
        committee={selectedCommittee}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleUpdateCommittee}
        mode={dialogMode}
      />
      </div>

      <div className="mb-8">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            placeholder="Search committee members..."
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
            {currentCommittees.length} {currentCommittees.length === 1 ? 'result' : 'results'} found
          </p>
        )}
      </div>

      {currentCommittees.length > 0 ? (
        <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <SortableHeader columnKey="name">Committee Member</SortableHeader>
              <SortableHeader columnKey="email">Email</SortableHeader>
              <SortableHeader columnKey="role">Role</SortableHeader>
              <SortableHeader columnKey="department">Department</SortableHeader>
              <SortableHeader columnKey="status">Status</SortableHeader>
              <TableHead className="w-[80px] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCommittees.map((committee) => (
              <TableRow key={committee.id}>
                <TableCell className="font-medium">
                  {committee.name}
                </TableCell>
                <TableCell>{committee.email}</TableCell>
                <TableCell>{committee.role}</TableCell>
                <TableCell>{committee.department}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    committee.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {committee.status === "active" ? "Active" : "Inactive"}
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
                        onClick={() => openCommitteeDialog(committee, 'view')}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => openCommitteeDialog(committee, 'edit')}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit Details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer text-red-600"
                        onClick={() => handleDeleteCommittee(committee.id, committee.name)}
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
          <p className="text-gray-600">No committee members found matching your search</p>
        </Card>
      )}

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {Math.min(startIndex + 1, sortedAndFilteredCommittees.length)} to {Math.min(startIndex + currentCommittees.length, sortedAndFilteredCommittees.length)} of {sortedAndFilteredCommittees.length} committee members
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
  
