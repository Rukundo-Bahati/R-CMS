import { useState } from "react";
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
import { initialFamilies, Family, FamilyMember } from "@/data/families";
import {
  Plus,
  MoreVertical,
  Users,
  User,
  Mail,
  Phone,
  X,
} from "lucide-react";

export default function Families() {
  const [families, setFamilies] = useState<Family[]>(initialFamilies);
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
  const [isAddFamilyOpen, setIsAddFamilyOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState("");
  const [newMemberData, setNewMemberData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "M" as "M" | "F",
    class: "Y1" as "Y1" | "Y2" | "Y3" | "Parent",
  });

  const calculateStats = (family: Family) => {
    const totalMembers = family.members.length;
    const totalBoys = family.members.filter((m) => m.gender === "M").length;
    const totalGirls = family.members.filter((m) => m.gender === "F").length;
    const totalY1 = family.members.filter((m) => m.class === "Y1").length;
    const totalY2 = family.members.filter((m) => m.class === "Y2").length;
    const totalY3 = family.members.filter((m) => m.class === "Y3").length;

    return { totalMembers, totalBoys, totalGirls, totalY1, totalY2, totalY3 };
  };

  const handleAddFamily = () => {
    if (!newFamilyName.trim()) return;

    const newFamily: Family = {
      id: String(families.length + 1),
      name: newFamilyName,
      generation: newFamilyName.toLowerCase(),
      members: [],
    };

    setFamilies([...families, newFamily]);
    setNewFamilyName("");
    setIsAddFamilyOpen(false);
  };

  const handleAddMember = () => {
    if (!selectedFamily || !newMemberData.name.trim()) return;

    const updatedFamily = {
      ...selectedFamily,
      members: [
        ...selectedFamily.members,
        {
          id: `m${Date.now()}`,
          ...newMemberData,
        },
      ],
    };

    setFamilies(
      families.map((f) => (f.id === selectedFamily.id ? updatedFamily : f))
    );
    setSelectedFamily(updatedFamily);
    setNewMemberData({
      name: "",
      email: "",
      phone: "",
      gender: "M",
      class: "Y1",
    });
    setIsAddMemberOpen(false);
  };

  const handleRemoveMember = (memberId: string) => {
    if (!selectedFamily) return;

    const updatedFamily = {
      ...selectedFamily,
      members: selectedFamily.members.filter((m) => m.id !== memberId),
    };

    setFamilies(
      families.map((f) => (f.id === selectedFamily.id ? updatedFamily : f))
    );
    setSelectedFamily(updatedFamily);
  };

  const handleDeleteFamily = (familyId: string) => {
    setFamilies(families.filter((f) => f.id !== familyId));
    if (selectedFamily?.id === familyId) {
      setSelectedFamily(null);
    }
  };

  if (!selectedFamily) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Families</h1>
            <p className="text-gray-600 mt-1">
              Manage church families and their members
            </p>
          </div>
          <Dialog open={isAddFamilyOpen} onOpenChange={setIsAddFamilyOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" disabled>
                <Plus className="w-4 h-4" />
                Add Family
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Family</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="family-name">Family Name</Label>
                  <Input
                    id="family-name"
                    placeholder="e.g., Jonathan, Jobs"
                    value={newFamilyName}
                    onChange={(e) => setNewFamilyName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddFamilyOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddFamily} className="flex-1">
                    Add Family
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {families.map((family) => {
            const stats = calculateStats(family);
            const colorVariants = [
              'bg-primary/10 text-primary',
              'bg-blue-50 text-blue-600',
              'bg-emerald-50 text-emerald-600',
              'bg-amber-50 text-amber-600',
              'bg-purple-50 text-purple-600',
              'bg-rose-50 text-rose-600',
            ][parseInt(family.id) % 6];
            
            return (
              <Card
                key={family.id}
                className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md border border-gray-200"
                onClick={() => setSelectedFamily(family)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors">
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
                    <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                      <Users className="w-5 h-5 text-muted-foreground mb-1.5" />
                      <span className="text-xl font-semibold text-foreground">{stats.totalMembers}</span>
                      <span className="text-xs text-muted-foreground">Members</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                      <User className="w-5 h-5 text-blue-500 mb-1.5" />
                      <span className="text-xl font-semibold text-foreground">{stats.totalBoys}</span>
                      <span className="text-xs text-muted-foreground">Boys</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                      <User className="w-5 h-5 text-pink-500 mb-1.5" />
                      <span className="text-xl font-semibold text-foreground">{stats.totalGirls}</span>
                      <span className="text-xs text-muted-foreground">Girls</span>
                    </div>
                  </div>

                  {/* Classes */}
                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Classes</h4>
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex-1 px-3 py-1.5 text-xs font-medium text-center rounded-md bg-blue-50 text-blue-700">
                        Y1: {stats.totalY1}
                      </span>
                      <span className="flex-1 px-3 py-1.5 text-xs font-medium text-center rounded-md bg-emerald-50 text-emerald-700">
                        Y2: {stats.totalY2}
                      </span>
                      <span className="flex-1 px-3 py-1.5 text-xs font-medium text-center rounded-md bg-amber-50 text-amber-700">
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {selectedFamily.name} Family
          </h2>

          {/* Parents */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase">
              Parents
            </h3>

            {selectedFamily.pere && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-xs font-semibold text-blue-700 mb-2">
                  PÈRE (Father)
                </p>
                <p className="font-semibold text-gray-900">
                  {selectedFamily.pere.name}
                </p>
                <p className="text-sm text-gray-600">{selectedFamily.pere.email}</p>
                <p className="text-sm text-gray-600">{selectedFamily.pere.phone}</p>
              </div>
            )}

            {selectedFamily.mere && (
              <div className="p-4 bg-pink-50 rounded-lg">
                <p className="text-xs font-semibold text-pink-700 mb-2">
                  MÈRE (Mother)
                </p>
                <p className="font-semibold text-gray-900">
                  {selectedFamily.mere.name}
                </p>
                <p className="text-sm text-gray-600">{selectedFamily.mere.email}</p>
                <p className="text-sm text-gray-600">{selectedFamily.mere.phone}</p>
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4">
              Family Statistics
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Members</span>
                <span className="text-xl font-bold text-primary">
                  {stats.totalMembers}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Boys</span>
                <span className="text-xl font-bold text-blue-600">
                  {stats.totalBoys}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Girls</span>
                <span className="text-xl font-bold text-pink-600">
                  {stats.totalGirls}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Y1</span>
                <span className="font-bold text-gray-900">{stats.totalY1}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Y2</span>
                <span className="font-bold text-gray-900">{stats.totalY2}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Y3</span>
                <span className="font-bold text-gray-900">{stats.totalY3}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Family Members */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Family Members</h3>
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
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No members in this family yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedFamily.members.map((member) => (
                <div
                  key={member.id}
                  className="p-4 bg-gray-50 rounded-lg flex items-start justify-between hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      member.gender === "M"
                        ? "bg-blue-100"
                        : "bg-pink-100"
                    }`}>
                      <User className={`w-5 h-5 ${
                        member.gender === "M"
                          ? "text-blue-600"
                          : "text-pink-600"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {member.name}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
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
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          member.gender === "M"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-pink-100 text-pink-700"
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
