'use client';
import { User, Lock, Store, Mail, Edit, Save } from 'lucide-react';
import { useState } from 'react';

export default function ProfilePage() {
  // Mock user data with state
  const [user, setUser] = useState({
    username: 'admin_user',
    email: 'admin@bookinghub.com',
    storeName: 'BookingHub Main Store',
    storeDescription: 'Premium booking services for all your needs'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState({...user});

  const handleEdit = () => {
    setTempData({...user});
    setIsEditing(true);
  };

  const handleSave = () => {
    setUser({...tempData});
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setTempData(prev => ({...prev, [field]: value}));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="space-y-8">
        {/* Profile Header */}
        <div className="text-center">
          <h1 className="text-2xl mt-6 font-bold">Profile Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account information</p>
        </div>

        {/* User Information Card */}
        <div className="bg-white rounded-lg border p-6 space-y-6">
          {/* Username Field */}
          <div className="space-y-2">
            <div className="flex items-center text-gray-500">
              <User className="w-4 h-4 mr-2" />
              <label className="text-sm font-medium">Username</label>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={tempData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                className="p-2 border-b w-full focus:outline-none focus:border-blue-500"
              />
            ) : (
              <div className="p-2 border-b text-gray-800">
                {user.username}
              </div>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <div className="flex items-center text-gray-500">
              <Mail className="w-4 h-4 mr-2" />
              <label className="text-sm font-medium">Email</label>
            </div>
            <div className="p-2 border-b text-gray-800">
              {user.email}
            </div>
          </div>

          {/* Store Information Section */}
          <div className="pt-4 border-t">
            <h3 className="flex items-center text-lg font-medium mb-4">
              <Store className="w-5 h-5 mr-2 text-blue-600" />
              Store Information
            </h3>

            {/* Store Name */}
            <div className="space-y-2 mb-4">
              <label className="text-sm font-medium text-gray-500">Store Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempData.storeName}
                  onChange={(e) => handleChange('storeName', e.target.value)}
                  className="p-2 border-b w-full focus:outline-none focus:border-blue-500"
                />
              ) : (
                <div className="p-2 border-b text-gray-800">
                  {user.storeName}
                </div>
              )}
            </div>

            {/* Store Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Store Description</label>
              {isEditing ? (
                <textarea
                  value={tempData.storeDescription}
                  onChange={(e) => handleChange('storeDescription', e.target.value)}
                  className="p-2 border-b w-full focus:outline-none focus:border-blue-500 min-h-[100px]"
                />
              ) : (
                <div className="p-2 border-b text-gray-800">
                  {user.storeDescription}
                </div>
              )}
            </div>
          </div>

          {/* Edit/Save Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            {isEditing ? (
              <>
                <button 
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </>
            ) : (
              <button 
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Password Reset Section */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Lock className="w-5 h-5 mr-2 text-blue-600" />
              <div>
                <h3 className="font-medium">Password</h3>
                <p className="text-sm text-gray-500">Update your account password</p>
              </div>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Reset Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}