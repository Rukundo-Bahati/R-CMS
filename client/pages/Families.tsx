import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Family } from "@/data/families";
import {
  Plus,
  MoreVertical,
  Users,
  User,
  Mail,
  Phone,
  X,
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function Families() {
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
  const [isAddFamilyOpen, setIsAddFamilyOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [addFamilyStep, setAddFamilyStep] = useState(1);
  const [newFamilyData, setNewFamilyData] = useState({
    name: "",
    generation: "",
    total_members: 0,
    total_boys: 0,
    total_girls: 0,
    total_y1: 0,
    total_y2: 0,
    total_y3: 0,
    pere: { name: "", email: "", phone: "" },
    mere: { name: "", email: "", phone: "" },
  });
  const [newMemberData, setNewMemberData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "M" as "M" | "F",
    class: "Y1" as "Y1" | "Y2" | "Y3" | "Parent",
  });

  const fetchFamilies = async () => {
    setLoading(true);
    try {
      const data = await api.grandparents.getAll();
      setFamilies(data);
      if (selectedFamily) {
        const updated = data.find((f: Family) => f.id === selectedFamily.id);
        if (updated) setSelectedFamily(updated);
      }
    } catch (error) {
      console.error('Error fetching families:', error);
      toast.error("Failed to load families");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFamilies();
  }, []);

  const calculateStats = (family: Family) => {
    const members = family.members || [];
    const totalMembers = members.length;
    const totalBoys = members.filter((m) => m.gender === "M").length;
    const totalGirls = members.filter((m) => m.gender === "F").length;
    const totalY1 = members.filter((m) => m.class === "Y1").length;
    const totalY2 = members.filter((m) => m.class === "Y2").length;
    const totalY3 = members.filter((m) => m.class === "Y3").length;

    return { totalMembers, totalBoys, totalGirls, totalY1, totalY2, totalY3 };
  };

  const handleAddFamily = async () => {
    if (!newFamilyData.name.trim()) return;

    try {
      await api.grandparents.create({
        ...newFamilyData,
        generation: newFamilyData.generation || newFamilyData.name.toLowerCase(),
      });
      fetchFamilies();
      setNewFamilyData({
        name: "",
        generation: "",
        total_members: 0,
        total_boys: 0,
        total_girls: 0,
        total_y1: 0,
        total_y2: 0,
        total_y3: 0,
        pere: { name: "", email: "", phone: "" },
        mere: { name: "", email: "", phone: "" },
      });
      setAddFamilyStep(1);
      setIsAddFamilyOpen(false);
      toast.success("Family added successfully");
    } catch (error) {
      console.error('Error adding family:', error);
      toast.error("Failed to add family");
    }
  };

  const handleAddMember = async () => {
    if (!selectedFamily || !newMemberData.name.trim()) return;

    try {
      await api.grandparents.createMember({
        ...newMemberData,
        family_id: selectedFamily.id
      });
      await fetchFamilies();
      setNewMemberData({
        name: "",
        email: "",
        phone: "",
        gender: "M",
        class: "Y1",
      });
      setIsAddMemberOpen(false);
      toast.success("Member added to family");
    } catch (error) {
      console.error('Error adding member:', error);
      toast.error("Failed to add member");
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      await api.grandparents.deleteMember(memberId);
      await fetchFamilies();
      toast.success("Member removed");
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error("Failed to remove member");
    }
  };

  const handleDeleteFamily = async (familyId: string) => {
    if (!confirm("Are you sure you want to delete this family? All members will be removed.")) return;
    try {
      await api.grandparents.delete(familyId);
      setFamilies(families.filter((f) => f.id !== familyId));
      if (selectedFamily?.id === familyId) {
        setSelectedFamily(null);
      }
      toast.success("Family deleted");
    } catch (error) {
      console.error('Error deleting family:', error);
      toast.error("Failed to delete family");
    }
  };

  if (!selectedFamily) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Families</h1>
            <p className="text-muted-foreground mt-1">
              Manage church families and their members
            </p>
          </div>
          <Dialog open={isAddFamilyOpen} onOpenChange={(open) => {
            setIsAddFamilyOpen(open);
            if (!open) setAddFamilyStep(1);
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => setIsAddFamilyOpen(true)}>
                <Plus className="w-4 h-4" />
                Add Family
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add Family - Step {addFamilyStep} of 3</DialogTitle>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${addFamilyStep >= s ? "bg-primary" : "bg-muted"}`}
                    />
                  ))}
                </div>
              </DialogHeader>

              {addFamilyStep === 1 && (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="family-name">Family Name</Label>
                    <Input
                      id="family-name"
                      placeholder="e.g., Jonathan, Jobs"
                      value={newFamilyData.name}
                      onChange={(e) => setNewFamilyData({ ...newFamilyData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="generation">Generation</Label>
                    <select
                      id="generation"
                      value={newFamilyData.generation}
                      onChange={(e) => setNewFamilyData({ ...newFamilyData, generation: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                      <option value="">Select Generation</option>
                      <option value="1st">1st Generation</option>
                      <option value="2nd">2nd Generation</option>
                      <option value="3rd">3rd Generation</option>
                      <option value="4th">4th Generation</option>
                    </select>
                  </div>
                </div>
              )}

              {addFamilyStep === 2 && (
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="total-members">Total Members</Label>
                      <Input
                        id="total-members"
                        type="number"
                        min="0"
                        value={newFamilyData.total_members}
                        onChange={(e) => setNewFamilyData({ ...newFamilyData, total_members: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="total-boys">Total Boys</Label>
                      <Input
                        id="total-boys"
                        type="number"
                        min="0"
                        value={newFamilyData.total_boys}
                        onChange={(e) => setNewFamilyData({ ...newFamilyData, total_boys: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="total-girls">Total Girls</Label>
                      <Input
                        id="total-girls"
                        type="number"
                        min="0"
                        value={newFamilyData.total_girls}
                        onChange={(e) => setNewFamilyData({ ...newFamilyData, total_girls: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2 col-span-2">
                      <div className="space-y-2">
                        <Label htmlFor="total-y1">Total Y1</Label>
                        <Input
                          id="total-y1"
                          type="number"
                          min="0"
                          value={newFamilyData.total_y1}
                          onChange={(e) => setNewFamilyData({ ...newFamilyData, total_y1: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="total-y2">Total Y2</Label>
                        <Input
                          id="total-y2"
                          type="number"
                          min="0"
                          value={newFamilyData.total_y2}
                          onChange={(e) => setNewFamilyData({ ...newFamilyData, total_y2: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="total-y3">Total Y3</Label>
                        <Input
                          id="total-y3"
                          type="number"
                          min="0"
                          value={newFamilyData.total_y3}
                          onChange={(e) => setNewFamilyData({ ...newFamilyData, total_y3: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {addFamilyStep === 3 && (
                <div className="space-y-6 py-4">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-primary">Le Père (Father)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 col-span-2">
                        <Input
                          placeholder="Full Name"
                          value={newFamilyData.pere.name}
                          onChange={(e) => setNewFamilyData({
                            ...newFamilyData,
                            pere: { ...newFamilyData.pere, name: e.target.value }
                          })}
                        />
                      </div>
                      <Input
                        placeholder="Email"
                        value={newFamilyData.pere.email}
                        onChange={(e) => setNewFamilyData({
                          ...newFamilyData,
                          pere: { ...newFamilyData.pere, email: e.target.value }
                        })}
                      />
                      <Input
                        placeholder="Phone"
                        value={newFamilyData.pere.phone}
                        onChange={(e) => setNewFamilyData({
                          ...newFamilyData,
                          pere: { ...newFamilyData.pere, phone: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-pink-500">La Mère (Mother)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 col-span-2">
                        <Input
                          placeholder="Full Name"
                          value={newFamilyData.mere.name}
                          onChange={(e) => setNewFamilyData({
                            ...newFamilyData,
                            mere: { ...newFamilyData.mere, name: e.target.value }
                          })}
                        />
                      </div>
                      <Input
                        placeholder="Email"
                        value={newFamilyData.mere.email}
                        onChange={(e) => setNewFamilyData({
                          ...newFamilyData,
                          mere: { ...newFamilyData.mere, email: e.target.value }
                        })}
                      />
                      <Input
                        placeholder="Phone"
                        value={newFamilyData.mere.phone}
                        onChange={(e) => setNewFamilyData({
                          ...newFamilyData,
                          mere: { ...newFamilyData.mere, phone: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                {addFamilyStep > 1 && (
                  <Button variant="outline" onClick={() => setAddFamilyStep(s => s - 1)} className="flex-1">
                    Previous
                  </Button>
                )}
                {addFamilyStep < 3 ? (
                  <Button onClick={() => setAddFamilyStep(s => s + 1)} className="flex-1">
                    Next
                  </Button>
                ) : (
                  <Button onClick={handleAddFamily} className="flex-1">
                    Complete Registration
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {families.map((family) => {
            const stats = calculateStats(family);
            const colorVariants = [
              'bg-primary/10 text-primary',
              'bg-blue-100/50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
              'bg-emerald-100/50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
              'bg-amber-100/50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
              'bg-purple-100/50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
              'bg-rose-100/50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
            ][parseInt(family.id) % 6];

            return (
              <Card
                key={family.id}
                className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md border border-border"
                onClick={() => setSelectedFamily(family)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {family.name} Family
                      </h3>
                      <span className={`inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full ${colorVariants}`}>
                        {family.generation} Generation
                      </span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:bg-gray-100">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => setSelectedFamily(family)}>
                          <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFamily(family.id);
                          }}
                        >
                          <X className="w-4 h-4 mr-2" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 mt-5">
                    <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                      <Users className="w-5 h-5 text-muted-foreground mb-1.5" />
                      <span className="text-xl font-semibold text-foreground">{stats.totalMembers}</span>
                      <span className="text-xs text-muted-foreground">Members</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                      <User className="w-5 h-5 text-blue-500 mb-1.5" />
                      <span className="text-xl font-semibold text-foreground">{stats.totalBoys}</span>
                      <span className="text-xs text-muted-foreground">Boys</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                      <User className="w-5 h-5 text-pink-500 mb-1.5" />
                      <span className="text-xl font-semibold text-foreground">{stats.totalGirls}</span>
                      <span className="text-xs text-muted-foreground">Girls</span>
                    </div>
                  </div>

                  {/* Classes */}
                  <div className="mt-5 pt-4 border-t border-border">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Classes</h4>
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex-1 px-3 py-1.5 text-xs font-medium text-center rounded-md bg-blue-100/50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        Y1: {stats.totalY1}
                      </span>
                      <span className="flex-1 px-3 py-1.5 text-xs font-medium text-center rounded-md bg-emerald-100/50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        Y2: {stats.totalY2}
                      </span>
                      <span className="flex-1 px-3 py-1.5 text-xs font-medium text-center rounded-md bg-amber-100/50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        Y3: {stats.totalY3}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  const stats = calculateStats(selectedFamily);

  return (
    <div className="max-w-7xl mx-auto">
      <Button
        variant="outline"
        onClick={() => setSelectedFamily(null)}
        className="mb-6"
      >
        ← Back to Families
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Family Overview */}
        <Card className="lg:col-span-1 p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {selectedFamily.name} Family
          </h2>

          {/* Parents */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase">
              Parents
            </h3>

            {selectedFamily.pere && (
              <div className="p-4 bg-blue-100/50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2">
                  PÈRE (Father)
                </p>
                <p className="font-semibold text-foreground">
                  {selectedFamily.pere.name}
                </p>
                <p className="text-sm text-muted-foreground">{selectedFamily.pere.email}</p>
                <p className="text-sm text-muted-foreground">{selectedFamily.pere.phone}</p>
              </div>
            )}

            {selectedFamily.mere && (
              <div className="p-4 bg-pink-100/50 dark:bg-pink-900/20 rounded-lg">
                <p className="text-xs font-semibold text-pink-700 dark:text-pink-400 mb-2">
                  MÈRE (Mother)
                </p>
                <p className="font-semibold text-foreground">
                  {selectedFamily.mere.name}
                </p>
                <p className="text-sm text-muted-foreground">{selectedFamily.mere.email}</p>
                <p className="text-sm text-muted-foreground">{selectedFamily.mere.phone}</p>
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-4">
              Family Statistics
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Members</span>
                <span className="text-xl font-bold text-primary">
                  {stats.totalMembers}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Boys</span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.totalBoys}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Girls</span>
                <span className="text-xl font-bold text-pink-600 dark:text-pink-400">
                  {stats.totalGirls}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Y1</span>
                <span className="font-bold text-foreground">{stats.totalY1}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Y2</span>
                <span className="font-bold text-foreground">{stats.totalY2}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Y3</span>
                <span className="font-bold text-foreground">{stats.totalY3}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Family Members */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-foreground">Family Members</h3>
            <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Member to {selectedFamily.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="member-name">Full Name</Label>
                    <Input
                      id="member-name"
                      placeholder="John Doe"
                      value={newMemberData.name}
                      onChange={(e) =>
                        setNewMemberData({
                          ...newMemberData,
                          name: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="member-email">Email</Label>
                    <Input
                      id="member-email"
                      type="email"
                      placeholder="john@example.com"
                      value={newMemberData.email}
                      onChange={(e) =>
                        setNewMemberData({
                          ...newMemberData,
                          email: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="member-phone">Phone</Label>
                    <Input
                      id="member-phone"
                      placeholder="+1234567890"
                      value={newMemberData.phone}
                      onChange={(e) =>
                        setNewMemberData({
                          ...newMemberData,
                          phone: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="member-gender">Gender</Label>
                    <select
                      id="member-gender"
                      value={newMemberData.gender}
                      onChange={(e) =>
                        setNewMemberData({
                          ...newMemberData,
                          gender: e.target.value as "M" | "F",
                        })
                      }
                      className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="member-class">Class</Label>
                    <select
                      id="member-class"
                      value={newMemberData.class}
                      onChange={(e) =>
                        setNewMemberData({
                          ...newMemberData,
                          class: e.target.value as
                            | "Y1"
                            | "Y2"
                            | "Y3"
                            | "Parent",
                        })
                      }
                      className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Y1">Year 1 (Y1)</option>
                      <option value="Y2">Year 2 (Y2)</option>
                      <option value="Y3">Year 3 (Y3)</option>
                      <option value="Parent">Parent</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddMemberOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddMember} className="flex-1">
                      Add Member
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {selectedFamily.members.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No members in this family yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedFamily.members.map((member) => (
                <div
                  key={member.id}
                  className="p-4 bg-muted/50 rounded-lg flex items-start justify-between hover:bg-muted transition-colors border border-transparent hover:border-border"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${member.gender === "M"
                      ? "bg-blue-100/50 dark:bg-blue-900/30"
                      : "bg-pink-100/50 dark:bg-pink-900/30"
                      }`}>
                      <User className={`w-5 h-5 ${member.gender === "M"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-pink-600 dark:text-pink-400"
                        }`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">
                        {member.name}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {member.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {member.phone}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${member.gender === "M"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400"
                          }`}>
                          {member.gender === "M" ? "Boy" : "Girl"}
                        </span>
                        <span className="text-xs font-semibold px-2 py-1 rounded bg-primary/10 text-primary">
                          {member.class}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
