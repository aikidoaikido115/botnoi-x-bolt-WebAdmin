'use client';

import { useState } from 'react';
import { mockStoreProfile } from '../../lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  Store, 
  MessageSquare, 
  Key, 
  Webhook, 
  Save, 
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { StoreProfile } from '../../types';

export default function SettingsPage() {
  const [storeProfile, setStoreProfile] = useState<StoreProfile>(mockStoreProfile);
  const [showSecrets, setShowSecrets] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleProfileUpdate = (field: keyof StoreProfile, value: string) => {
    setStoreProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Profile saved:', storeProfile);
      setIsSaving(false);
    }, 1000);
  };

  const handleSaveLINEConfig = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      console.log('LINE config saved:', {
        channelId: storeProfile.lineChannelId,
        channelSecret: storeProfile.lineChannelSecret,
        webhookUrl: storeProfile.webhookUrl
      });
      setIsSaving(false);
    }, 1000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // TODO: Show toast notification
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mt-6 font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your store profile and integrations
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Store Profile</TabsTrigger>
          <TabsTrigger value="line">LINE Integration</TabsTrigger>
          <TabsTrigger value="webhook">Webhook Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Store className="mr-2 h-5 w-5" />
                Store Information
              </CardTitle>
              <CardDescription>
                Update your store details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={storeProfile.name}
                    onChange={(e) => handleProfileUpdate('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Email</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={storeProfile.email}
                    onChange={(e) => handleProfileUpdate('email', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeDescription">Description</Label>
                <Textarea
                  id="storeDescription"
                  value={storeProfile.description}
                  onChange={(e) => handleProfileUpdate('description', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeAddress">Address</Label>
                <Textarea
                  id="storeAddress"
                  value={storeProfile.address}
                  onChange={(e) => handleProfileUpdate('address', e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storePhone">Phone Number</Label>
                <Input
                  id="storePhone"
                  value={storeProfile.phone}
                  onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={handleSaveProfile}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg 
                            border border-blue-700 hover:border-blue-800 transition-all
                            focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                            active:bg-blue-800 active:border-blue-900"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Save className="mr-2 h-4 w-4" />
                      Save Profile
                    </span>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="line" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                LINE Bot Configuration
              </CardTitle>
              <CardDescription>
                Configure your LINE Messaging API settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    storeProfile.isLineConnected ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <p className="font-medium">LINE Bot Status</p>
                    <p className="text-sm text-muted-foreground">
                      {storeProfile.isLineConnected ? 'Connected and operational' : 'Not connected'}
                    </p>
                  </div>
                </div>
                <Badge variant={storeProfile.isLineConnected ? "default" : "destructive"}>
                  {storeProfile.isLineConnected ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>

              <div className="space-y-2">
                <Label htmlFor="channelId">Channel ID</Label>
                <div className="flex space-x-2">
                  <Input
                    id="channelId"
                    value={storeProfile.lineChannelId || ''}
                    onChange={(e) => handleProfileUpdate('lineChannelId', e.target.value)}
                    placeholder="Enter your LINE Channel ID"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(storeProfile.lineChannelId || '')}
                    className="hover:border-gray-300"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="channelSecret">Channel Secret</Label>
                <div className="flex space-x-2">
                  <Input
                    id="channelSecret"
                    type={showSecrets ? 'text' : 'password'}
                    value={storeProfile.lineChannelSecret || ''}
                    onChange={(e) => handleProfileUpdate('lineChannelSecret', e.target.value)}
                    placeholder="Enter your LINE Channel Secret"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowSecrets(!showSecrets)}
                    className="hover:border-gray-300"
                  >
                    {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(storeProfile.lineChannelSecret || '')}
                    className="hover:border-gray-300"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Setup Instructions:</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Go to the LINE Developers Console</li>
                  <li>Create a new Messaging API channel</li>
                  <li>Copy the Channel ID and Channel Secret</li>
                  <li>Set the webhook URL (see Webhook Settings tab)</li>
                  <li>Enable webhook usage in your LINE channel</li>
                </ol>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleSaveLINEConfig}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg 
                            border border-blue-700 hover:border-blue-800 transition-all
                            focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                            active:bg-blue-800 active:border-blue-900"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Save className="mr-2 h-4 w-4" />
                      Save LINE Configuration
                    </span>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhook" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Webhook className="mr-2 h-5 w-5" />
                Webhook Configuration
              </CardTitle>
              <CardDescription>
                Configure webhook URL for receiving LINE messages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <div className="flex space-x-2">
                  <Input
                    id="webhookUrl"
                    value={storeProfile.webhookUrl || ''}
                    onChange={(e) => handleProfileUpdate('webhookUrl', e.target.value)}
                    placeholder="https://your-domain.com/api/line/webhook"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(storeProfile.webhookUrl || '')}
                    className="hover:border-gray-300"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  This URL will receive LINE webhook events. Make sure it's accessible from the internet.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Webhook Status</h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Active</span>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Last Event</h4>
                  <p className="text-sm text-muted-foreground">
                    2 minutes ago
                  </p>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Important Notes:</h4>
                <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                  <li>Webhook URL must use HTTPS</li>
                  <li>URL must be publicly accessible</li>
                  <li>Webhook events will be sent to this URL</li>
                  <li>Make sure your server can handle POST requests</li>
                </ul>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    // TODO: Test webhook connectivity
                  }}
                  className="hover:border-gray-300"
                >
                  Test Webhook
                </Button>
                <Button 
                  onClick={handleSaveProfile}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg 
                            border border-blue-700 hover:border-blue-800 transition-all
                            focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                            active:bg-blue-800 active:border-blue-900"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Save className="mr-2 h-4 w-4" />
                      Save Webhook Settings
                    </span>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}