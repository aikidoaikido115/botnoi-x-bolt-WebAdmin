'use client';

import { useState } from 'react';
import { mockServices } from '../../lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { MessageSquare, Calendar, Clock, DollarSign, Smartphone } from 'lucide-react';

export default function LinePreviewPage() {
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  const service = mockServices.find(s => s.id === selectedService);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30'
  ];

  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('th-TH', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        })
      });
    }
    return dates;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">LINE Booking Preview</h1>
          <p className="text-muted-foreground">
            Preview how your booking system will appear in LINE messages
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            <MessageSquare className="mr-1 h-3 w-3" />
            LINE Flex Message
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Message Configuration</CardTitle>
            <CardDescription>
              Configure the booking message settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Service</label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
                <SelectContent>
                  {mockServices.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - ฿{service.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Select Date</label>
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a date" />
                </SelectTrigger>
                <SelectContent>
                  {generateDates().map((date) => (
                    <SelectItem key={date.value} value={date.value}>
                      {date.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Select Time</label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="w-full" 
              disabled={!selectedService || !selectedDate || !selectedTime}
              onClick={() => {
                // TODO: Generate and send LINE Flex Message
                console.log('Generate LINE message:', {
                  service: selectedService,
                  date: selectedDate,
                  time: selectedTime
                });
              }}
            >
              Generate LINE Message
            </Button>
          </CardContent>
        </Card>

        {/* LINE Message Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="mr-2 h-5 w-5" />
              LINE Message Preview
            </CardTitle>
            <CardDescription>
              How the booking message will appear to customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded-lg max-w-sm mx-auto">
              {/* LINE Chat Header */}
              <div className="bg-green-500 text-white p-3 rounded-t-lg flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-green-500 font-bold text-sm">B</span>
                </div>
                <span className="font-medium">BookingHub</span>
              </div>

              {/* Message Content */}
              <div className="bg-white border border-gray-200 rounded-b-lg p-4 space-y-3">
                <div className="text-center">
                  <h3 className="font-bold text-lg text-gray-800">
                    🎉 Booking Confirmation
                  </h3>
                  <p className="text-sm text-gray-600">
                    Your appointment has been confirmed!
                  </p>
                </div>

                {service && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">Service:</span>
                      <span className="text-sm">{service.name}</span>
                    </div>
                    {selectedDate && (
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">Date:</span>
                        <span className="text-sm">
                          {new Date(selectedDate).toLocaleDateString('th-TH')}
                        </span>
                      </div>
                    )}
                    {selectedTime && (
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">Time:</span>
                        <span className="text-sm">{selectedTime}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">Duration:</span>
                      <span className="text-sm">{service.duration} minutes</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="text-sm font-medium">Price:</span>
                      <span className="text-sm font-bold text-green-600">
                        ฿{service.promotionPrice || service.price}
                        {service.promotionPrice && (
                          <span className="text-xs text-gray-500 line-through ml-1">
                            ฿{service.price}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                )}

                <div className="pt-2 space-y-2">
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white text-sm">
                    Confirm Booking
                  </Button>
                  <Button variant="outline" className="w-full text-sm">
                    Reschedule
                  </Button>
                  <Button variant="ghost" className="w-full text-sm text-red-600">
                    Cancel
                  </Button>
                </div>

                <div className="text-center pt-2 border-t">
                  <p className="text-xs text-gray-500">
                    📍 Happy Hair Salon<br />
                    📞 02-123-4567
                  </p>
                </div>
              </div>
            </div>

            {!selectedService && (
              <div className="text-center text-sm text-muted-foreground mt-4">
                Select a service to see the preview
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* LINE Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle>LINE Integration Status</CardTitle>
          <CardDescription>
            Current status of your LINE bot integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">LINE Bot</p>
                <p className="text-xs text-muted-foreground">Connected</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Webhook</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Rich Menu</p>
                <p className="text-xs text-muted-foreground">Pending Setup</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}