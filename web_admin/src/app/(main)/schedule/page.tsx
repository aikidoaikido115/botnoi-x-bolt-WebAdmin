'use client';

import { useState } from 'react';
import { mockSchedule } from '../../lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Clock, Calendar, Save } from 'lucide-react';
import { ScheduleSettings } from '../../types';

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dayNamesLong = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleSettings[]>(mockSchedule);

  const handleScheduleChange = (dayOfWeek: number, field: keyof ScheduleSettings, value: any) => {
    setSchedule(schedule.map(day => 
      day.dayOfWeek === dayOfWeek 
        ? { ...day, [field]: value }
        : day
    ));
  };

  const handleSave = () => {
    // TODO: Save schedule settings via API
    console.log('Saving schedule:', schedule);
  };

  const getDaySchedule = (dayOfWeek: number) => {
    return schedule.find(day => day.dayOfWeek === dayOfWeek);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mt-6 font-bold">Schedule Settings</h1>
          <p className="text-muted-foreground">
            Configure your business hours and availability
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6">
        {[1, 2, 3, 4, 5, 6, 0].map((dayOfWeek) => {
          const daySchedule = getDaySchedule(dayOfWeek);
          if (!daySchedule) return null;

          return (
            <Card key={dayOfWeek}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">
                      {dayNamesLong[dayOfWeek]} ({dayNames[dayOfWeek]})
                    </CardTitle>
                  </div>
                  <Switch
                    checked={daySchedule.isOpen}
                    onCheckedChange={(checked) => 
                      handleScheduleChange(dayOfWeek, 'isOpen', checked)
                    }
                  />
                </div>
                <CardDescription>
                  {daySchedule.isOpen ? 'Open for business' : 'Closed'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {daySchedule.isOpen && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`open-${dayOfWeek}`}>Open Time</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id={`open-${dayOfWeek}`}
                          type="time"
                          value={daySchedule.openTime}
                          onChange={(e) => 
                            handleScheduleChange(dayOfWeek, 'openTime', e.target.value)
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`close-${dayOfWeek}`}>Close Time</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id={`close-${dayOfWeek}`}
                          type="time"
                          value={daySchedule.closeTime}
                          onChange={(e) => 
                            handleScheduleChange(dayOfWeek, 'closeTime', e.target.value)
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`break-start-${dayOfWeek}`}>Break Start (Optional)</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id={`break-start-${dayOfWeek}`}
                          type="time"
                          value={daySchedule.breakStart || ''}
                          onChange={(e) => 
                            handleScheduleChange(dayOfWeek, 'breakStart', e.target.value || undefined)
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`break-end-${dayOfWeek}`}>Break End (Optional)</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id={`break-end-${dayOfWeek}`}
                          type="time"
                          value={daySchedule.breakEnd || ''}
                          onChange={(e) => 
                            handleScheduleChange(dayOfWeek, 'breakEnd', e.target.value || undefined)
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Quickly configure common schedule patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              onClick={() => {
                // Set weekdays 9-19, weekends 10-18
                const newSchedule = schedule.map(day => ({
                  ...day,
                  isOpen: true,
                  openTime: [6, 0].includes(day.dayOfWeek) ? '10:00' : '09:00',
                  closeTime: [6, 0].includes(day.dayOfWeek) ? '18:00' : '19:00',
                  breakStart: undefined,
                  breakEnd: undefined
                }));
                setSchedule(newSchedule);
              }}
            >
              Standard Hours (9-19, Weekends 10-18)
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Set all days 9-18
                const newSchedule = schedule.map(day => ({
                  ...day,
                  isOpen: true,
                  openTime: '09:00',
                  closeTime: '18:00',
                  breakStart: undefined,
                  breakEnd: undefined
                }));
                setSchedule(newSchedule);
              }}
            >
              All Days 9-18
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Close Sundays
                const newSchedule = schedule.map(day => ({
                  ...day,
                  isOpen: day.dayOfWeek !== 0
                }));
                setSchedule(newSchedule);
              }}
            >
              Close Sundays
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Add lunch break 12-13
                const newSchedule = schedule.map(day => ({
                  ...day,
                  breakStart: day.isOpen ? '12:00' : undefined,
                  breakEnd: day.isOpen ? '13:00' : undefined
                }));
                setSchedule(newSchedule);
              }}
            >
              Add Lunch Break (12-13)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}