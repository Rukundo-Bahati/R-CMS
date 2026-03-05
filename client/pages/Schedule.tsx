import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Family } from "@/data/families";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ServiceWeek {
  id?: string;
  weekNumber: number;
  date: Date;
  familyId: string | null;
  familyName?: string;
}

export default function Schedule() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [families, setFamilies] = useState<Family[]>([]);
  const [termStartDate, setTermStartDate] = useState<Date>(new Date());
  const [termWeeks, setTermWeeks] = useState<number>(12);
  const [serviceWeeks, setServiceWeeks] = useState<ServiceWeek[]>([]);
  const [showAssignDialog, setShowAssignDialog] = useState<{
    weekNumber: number;
    familyId: string | null;
  } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const familiesData = await api.grandparents.getAll();
      setFamilies(familiesData);

      const scheduleData = await api.schedules.getAll(user?.portal);

      // If we have saved schedules, use them to populate the weeks
      // This is a simplified logic to map back to the 12-week view
      const baseWeeks = generateServiceWeeks(termStartDate, termWeeks);
      const mappedWeeks = baseWeeks.map(week => {
        const found = scheduleData.find((s: any) =>
          new Date(s.date).toDateString() === week.date.toDateString()
        );
        if (found) {
          const family = familiesData.find((f: any) => f.name === found.description); // Using description to store family name for now
          return {
            ...week,
            id: found.id,
            familyId: family?.id || null,
            familyName: found.description
          };
        }
        return week;
      });
      setServiceWeeks(mappedWeeks);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      toast.error("Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.portal]);

  // Generate service weeks for a term (e.g., 12 weeks)
  function generateServiceWeeks(startDate: Date, weeks: number): ServiceWeek[] {
    const baseDate = new Date(startDate);
    baseDate.setHours(12, 0, 0, 0);

    return Array.from({ length: weeks }, (_, i) => {
      const weekDate = new Date(baseDate);
      weekDate.setDate(baseDate.getDate() + (i * 7));

      return {
        weekNumber: i + 1,
        date: weekDate,
        familyId: null,
      };
    });
  }

  const handleAssignFamily = async (weekNumber: number, familyId: string) => {
    const family = families.find(f => f.id === familyId);
    if (!family) return;

    const week = serviceWeeks.find(w => w.weekNumber === weekNumber);
    if (!week) return;

    try {
      await api.schedules.create({
        title: `Service Week: ${family.name}`,
        description: family.name, // Store family name in description
        date: format(week.date, 'yyyy-MM-dd'),
        time: '10:00:00',
        location: 'Main Sanctuary',
        portal: user?.portal,
        user_id: user?.id
      });
      fetchData();
      toast.success(`Assigned ${family.name} to Week ${weekNumber}`);
      setShowAssignDialog(null);
    } catch (error) {
      console.error('Error assigning family:', error);
      toast.error("Failed to assign family");
    }
  };

  const handleRemoveAssignment = async (week: ServiceWeek) => {
    if (!week.id) return;
    try {
      await api.schedules.delete(week.id);
      fetchData();
      toast.success("Assignment removed");
    } catch (error) {
      console.error('Error removing assignment:', error);
      toast.error("Failed to remove assignment");
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
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Service Schedule</h1>
        <p className="text-muted-foreground">
          Manage family service weeks for church services
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Service Schedule</CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Term Start:</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !termStartDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {termStartDate ? format(termStartDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={termStartDate}
                      onSelect={(date) => {
                        if (date) {
                          const newDate = new Date(date);
                          newDate.setHours(12, 0, 0, 0);
                          setTermStartDate(newDate);
                        }
                      }}
                      initialFocus
                      className="rounded-md border"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {serviceWeeks.map((week) => (
              <div key={week.weekNumber} className="flex items-center justify-between p-4 border border-border rounded-lg bg-card transition-colors duration-200">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Week {week.weekNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(week.date, 'EEEE, MMMM d, yyyy')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {week.familyName ? (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{week.familyName}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemoveAssignment(week)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAssignDialog({
                        weekNumber: week.weekNumber,
                        familyId: null
                      })}
                    >
                      Assign Family
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assign Family Dialog */}
      {showAssignDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-all"
            onClick={() => setShowAssignDialog(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 49
            }}
          />
          <div
            className="bg-card p-6 rounded-lg max-w-md w-full relative z-50 border border-border shadow-xl"
            style={{
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <h3 className="text-lg font-medium mb-4 text-foreground">
              Assign Family for Week {showAssignDialog.weekNumber}
            </h3>
            <div className="space-y-4">
              <select
                className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                value={showAssignDialog.familyId || ''}
                onChange={(e) => setShowAssignDialog({
                  ...showAssignDialog,
                  familyId: e.target.value || null
                })}
              >
                <option value="">Select a family</option>
                {families.map((family) => (
                  <option key={family.id} value={family.id}>
                    {family.name}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAssignDialog(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (showAssignDialog.familyId) {
                      handleAssignFamily(
                        showAssignDialog.weekNumber,
                        showAssignDialog.familyId
                      );
                    }
                  }}
                  disabled={!showAssignDialog.familyId}
                >
                  Assign
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
