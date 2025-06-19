'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/app/(main)/components/card'
import { Input } from '@/app/(main)/components/input'
import { Label } from '@/app/(main)/components/label'
import { Button } from '@/app/(main)/components/button'
import { useState } from 'react'

export default function ProfilePage() {
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      <h1 className="text-3xl font-bold">Profile</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="สมชาย ใจดี" defaultValue="สมชาย ใจดี" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="example@email.com" defaultValue="somsak@example.com" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button>Save Changes</Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </CardContent>
      </Card>

      {/* Password Change Section (เริ่มต้นเป็นปุ่ม) */}
      <Card>
        <CardHeader>
          <CardTitle>Password Settings</CardTitle>
        </CardHeader>
        <CardContent>
          {!showPasswordForm ? (
            <Button 
              variant="outline" 
              onClick={() => setShowPasswordForm(true)}
            >
              Change Password
            </Button>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" placeholder="Enter current password" />
              </div>
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" placeholder="Enter new password" />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" placeholder="Confirm new password" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="destructive">Confirm Change</Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowPasswordForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}