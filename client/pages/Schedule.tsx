import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Family, initialFamilies } from "@/data/families";

interface ServiceWeek {
  weekNumber: number;
  date: Date;
  familyId: string | null;
  familyName?: string;
}

export default function Schedule() {
  // Service schedule state
  const [termStartDate, setTermStartDate] = useState<Date>(new Date());
  const [termWeeks, setTermWeeks] = useState<number>(12);
  const [serviceWeeks, setServiceWeeks] = useState<ServiceWeek[]>(
    generateServiceWeeks(termStartDate, termWeeks)
  );
  const [families, setFamilies] = useState<Family[]>(initialFamilies);
  const [showAssignDialog, setShowAssignDialog] = useState<{
    weekNumber: number;
    familyId: string | null;
  } | null>(null);

  // Generate service weeks for a term (e.g., 12 weeks)
  function generateServiceWeeks(startDate: Date, weeks: number): ServiceWeek[] {
    // Create a new date at noon to avoid timezone issues
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

  const handleAssignFamily = (weekNumber: number, familyId: string) => {
    setServiceWeeks(prev => 
      prev.map(week => 
        week.weekNumber === weekNumber 
          ? { 
              ...week, 
              familyId,
              familyName: families.find(f => f.id === familyId)?.name 
            } 
          : week
      )
    );
    setShowAssignDialog(null);
  };

  const handleRemoveAssignment = (weekNumber: number) => {
    setServiceWeeks(prev => 
      prev.map(week => 
        week.weekNumber === weekNumber 
          ? { ...week, familyId: null, familyName: undefined } 
          : week
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Service Schedule</h1>
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
                          // Set the time to noon to avoid timezone issues
                          const newDate = new Date(date);
                          newDate.setHours(12, 0, 0, 0);
                          setTermStartDate(newDate);
                          setServiceWeeks(generateServiceWeeks(newDate, termWeeks));
                        }
                      }}
                      initialFocus
                      className="rounded-md border"
                      classNames={{
                        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                        head_cell: "w-10 text-muted-foreground text-[0.8rem] font-normal",
                        cell: "p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent",
                        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                        day_today: "bg-accent text-accent-foreground",
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Weeks:</span>
                <select
                  className="flex h-10 w-20 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={termWeeks}
                  onChange={(e) => {
                    const weeks = parseInt(e.target.value);
                    setTermWeeks(weeks);
                    setServiceWeeks(generateServiceWeeks(termStartDate, weeks));
                  }}
                >
                  {Array.from({ length: 8 }, (_, i) => i + 8).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {serviceWeeks.map((week) => (
              <div key={week.weekNumber} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">Week {week.weekNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(week.date, 'EEEE, MMMM d, yyyy')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {week.familyName ? (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{week.familyName}</span>
                      <Button 
                        variant="outline"
                        size="sm" 
                        className="bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary"
                        onClick={() => handleRemoveAssignment(week.weekNumber)}
                      >
                        Change
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
            className="fixed inset-0 bg-black/50" 
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
            className="bg-background p-6 rounded-lg max-w-md w-full relative z-50"
            style={{
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <h3 className="text-lg font-medium mb-4">
              Assign Family for Week {showAssignDialog.weekNumber}
            </h3>
            <div className="space-y-4">
              <select
                className="w-full p-2 border rounded-md"
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
