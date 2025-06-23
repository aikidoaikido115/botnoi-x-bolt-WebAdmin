'use client';
import React, { useState, useRef } from 'react';
import { Edit, Save, Camera, Lock, Mail, User, Phone, MapPin, Calendar, Settings, Shield, Bell, Trash2, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent } from '../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';

interface UserData {
  name: string;
  email: string;
  avatar: string;
  role: string;
  phone: string;
  bio: string;
  location: string;
  joinDate: string;
  department: string;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<UserData>({
    name: "สมชาย ใจดี",
    email: "somchai@example.com",
    avatar: "",
    role: "Senior Developer",
    phone: "081-234-5678",
    bio: "Passionate full-stack developer with 5+ years of experience in React, Node.js, and cloud technologies. Love creating beautiful and functional web applications.",
    location: "Bangkok, Thailand",
    joinDate: "January 2020",
    department: "Engineering"
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to your backend
    console.log('Profile updated:', user);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values if needed
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 opacity-90"></div>
          <CardContent className="relative p-8 text-white">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar Section */}
              <div className="relative group">
                <div 
                  className={`relative ${isEditing ? 'cursor-pointer' : ''}`}
                  onClick={handleAvatarClick}
                >
                  <Avatar className="w-32 h-32 border-4 border-white/20 shadow-2xl ring-4 ring-white/10">
                    <AvatarImage 
                      src={user.avatar} 
                      alt={user.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-white/10 text-white text-2xl font-bold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                {isEditing ? (
                  <Input
                    name="name"
                    value={user.name}
                    onChange={handleInputChange}
                    className="text-2xl font-bold bg-white/10 border-white/20 text-white placeholder:text-white/70 mb-2"
                    placeholder="Your name"
                  />
                ) : (
                  <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                )}
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {user.role}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {user.department}
                  </Badge>
                </div>

                <div className="flex flex-col md:flex-row gap-4 text-sm opacity-90">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {isEditing ? (
                      <Input
                        name="location"
                        value={user.location}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                        placeholder="Location"
                      />
                    ) : (
                      <span>{user.location}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {user.joinDate}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline" className="border-white/30 text-white hover:bg-white/10">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} className="bg-white/10 hover:bg-white/20 border border-white/30">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      {isEditing ? (
                        <Input
                          name="email"
                          type="email"
                          value={user.email}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span>{user.email}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <Input
                          name="phone"
                          value={user.phone}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    {isEditing ? (
                      <Textarea
                        name="bio"
                        value={user.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-gray-700">{user.bio}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Account Settings
                </h2>
                
                <div className="space-y-3">
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <Shield className="w-4 h-4 mr-2" />
                    Privacy Settings
                  </Button>
                  
                  <Separator className="my-3" />
                  
                  <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Account Stats</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Profile Completion</span>
                    <span className="font-semibold">95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                  
                  <div className="pt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Login</span>
                      <span>2 hours ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Status</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}