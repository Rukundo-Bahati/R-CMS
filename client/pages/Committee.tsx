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
  Trash2,
  Eye,
  Edit,
  X,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useDebounce } from "../hooks/use-debounce";
import { api } from "@/lib/api";

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
  year: string;
  family_id?: string;
  is_committee?: boolean;
}

interface CommitteeDialogProps {
  committee: Committee | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (committee: any) => void;
  mode: 'view' | 'edit';
}

const CommitteeDialog: React.FC<CommitteeDialogProps> = ({
  committee,
  isOpen,
  onClose,
  onSave,
  mode
}) => {
  const [formData, setFormData] = useState<any>({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    status: 'active',
    year: '2025-2026',
    is_committee: true
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
        year: committee.year,
        is_committee: true
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: '',
        department: '',
        status: 'active',
        year: '2025-2026',
        is_committee: true
      });
    }
  }, [committee, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: committee?.id });
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                disabled={mode === 'view'}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="2023-2024">2023-2024</option>
                <option value="2024-2025">2024-2025</option>
                <option value="2025-2026">2025-2026</option>
              </select>
            </div>
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
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {committee ? 'Save Changes' : 'Add Member'}
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
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(null);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit'>('view');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  const [selectedYear, setSelectedYear] = useState("2025-2026");
  const itemsPerPage = 10;

  const years = ["2023-2024", "2024-2025", "2025-2026"];

  const fetchCommittee = async () => {
    setLoading(true);
    try {
      const data = await api.grandparents.getCommittee();
      setCommittees(data);
    } catch (error) {
      console.error('Error fetching committee:', error);
      toast.error("Failed to load committee members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommittee();
  }, []);

  const sortedAndFilteredCommittees = React.useMemo(() => {
    let result = [...committees];

    // Apply year filter
    result = result.filter((c) => c.year === selectedYear);

    // Apply search filter
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      result = result.filter((committee) => {
        return (
          committee.name.toLowerCase().includes(searchLower) ||
          committee.email.toLowerCase().includes(searchLower) ||
          (committee.role && committee.role.toLowerCase().includes(searchLower)) ||
          (committee.department && committee.department.toLowerCase().includes(searchLower))
        );
      });
    }

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key] || '';
        let bValue = b[sortConfig.key] || '';

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
  }, [committees, debouncedSearchTerm, sortConfig, selectedYear]);

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
      className="cursor-pointer hover:bg-muted transition-colors"
      onClick={() => requestSort(columnKey)}
    >
      <div className="flex items-center">
        {children}
        <span className="ml-1">{getSortIcon(columnKey)}</span>
      </div>
    </TableHead>
  );

  const handleSaveCommittee = async (data: any) => {
    try {
      if (data.id) {
        await api.grandparents.updateMember(data.id, data);
        toast.success("Committee member updated");
      } else {
        await api.grandparents.createMember(data);
        toast.success("Committee member added");
      }
      fetchCommittee();
    } catch (error) {
      console.error('Error saving committee member:', error);
      toast.error("Failed to save changes");
    }
  };

  const handleDeleteCommittee = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the committee?`)) return;
    try {
      await api.grandparents.deleteMember(id);
      setCommittees(committees.filter(c => c.id !== id));
      toast.success("Member removed from committee");
    } catch (error) {
      console.error('Error deleting committee member:', error);
      toast.error("Failed to remove member");
    }
  };

  const openCommitteeDialog = (committee: Committee | null, mode: 'view' | 'edit') => {
    setSelectedCommittee(committee);
    setDialogMode(mode);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Committee</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view all committee members
          </p>
        </div>
        <Button className="gap-2" onClick={() => openCommitteeDialog(null, 'edit')}>
          <Plus className="w-4 h-4" />
          Add Committee Member
        </Button>

        <CommitteeDialog
          committee={selectedCommittee}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSaveCommittee}
          mode={dialogMode}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
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
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Label className="whitespace-nowrap">Service Year:</Label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year} {year === "2025-2026" ? "[Current]" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentCommittees.length > 0 ? (
        <div className="rounded-md border bg-card text-card-foreground">
          <Table>
            <TableHeader className="bg-muted/50">
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
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${committee.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-muted text-muted-foreground"
                      }`}>
                      {committee.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => openCommitteeDialog(committee, 'view')}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openCommitteeDialog(committee, 'edit')}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteCommittee(committee.id, committee.name)}>
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
          <p className="text-muted-foreground">No committee members found for {selectedYear}</p>
        </Card>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedAndFilteredCommittees.length)} of {sortedAndFilteredCommittees.length} members
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
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
