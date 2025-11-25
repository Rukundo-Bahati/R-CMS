import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { User, Mail, Shield, Calendar, Lock, Key, Pencil, X, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }
    
    setIsLoading(true);
    setPasswordError("");
    
    try {
      // TODO: Replace with actual API call to change password
      console.log("Changing password...", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form and close dialog on success
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setShowPasswordDialog(false);
      
      // Show success message (you can use a toast notification here)
      alert("Password changed successfully!");
      
    } catch (error) {
      console.error("Failed to change password:", error);
      setPasswordError("Failed to change password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // In a real app, this would make an API call to update the user
    setIsEditing(false);
  };

  const portalLabels: Record<string, string> = {
    president: "President",
    grand_pere_mere: "Grand Père/Mère",
    accountant: "Accountant",
    family: "Family",
    choir: "Choir",
    intercessors: "Intercessors",
    ushers: "Ushers",
    pastor: "Pastor",
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account information and security settings</p>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2"
          >
            <Pencil className="w-4 h-4" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative group">
                <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center mb-4 border-2 border-primary/20">
                  <User className="w-16 h-16 text-primary/70" />
                </div>
                {isEditing && (
                  <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Pencil className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{user.email}</p>
              
              <div className="mt-4 w-full">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10">
                  <Shield className="w-4 h-4 mr-2 text-primary/70" />
                  <span className="text-sm font-medium text-primary">
                    {portalLabels[user.portal] || user.portal.replace("_", " ")}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 w-full pt-4 border-t border-gray-100">
                <div className="flex items-center justify-center text-sm text-gray-500">
                  Member since {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Key className="w-5 h-5 mr-2 text-gray-700" />
              Security
            </h3>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setShowPasswordDialog(true)}
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </Card>
          
          {/* Password Change Dialog */}
          {showPasswordDialog && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                  <button 
                    onClick={() => {
                      setShowPasswordDialog(false);
                      setPasswordError("");
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  {passwordError && (
                    <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md">
                      {passwordError}
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      required
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      required
                      minLength={8}
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      minLength={8}
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowPasswordDialog(false);
                        setPasswordError("");
                      }}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="min-w-24"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Details Card */}
        <div className="lg:col-span-8">
          <Card className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              <p className="text-sm text-gray-500 mt-1">Update your personal details and contact information</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700">First Name</Label>
                  {isEditing ? (
                    <Input
                      type="text"
                      name="name"
                      value={formData.name.split(' ')[0]}
                      onChange={handleChange}
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2 text-gray-900">{formData.name.split(' ')[0]}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Last Name</Label>
                  {isEditing ? (
                    <Input
                      type="text"
                      name="name"
                      value={formData.name.split(' ').slice(1).join(' ')}
                      onChange={handleChange}
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2 text-gray-900">{formData.name.split(' ').slice(1).join(' ')}</p>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Email Address</Label>
                {isEditing ? (
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-2"
                  />
                ) : (
                  <p className="mt-2 text-gray-900">{formData.email}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Role</Label>
                <div className="mt-2 px-3 py-2 bg-gray-50 rounded-md text-gray-700">
                  {portalLabels[user.portal] || user.portal.replace("_", " ")}
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSave}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
