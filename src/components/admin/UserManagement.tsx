import React, { useState } from 'react';
import { Users, Edit, Save, X, Phone, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../contexts/AuthContext';

export const UserManagement: React.FC = () => {
  const { getUsers, updateCredentials } = useAuth();
  const [users, setUsers] = useState(getUsers());
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    phoneNumber: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleEdit = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setEditingUser(userId);
      setFormData({
        username: user.username,
        password: '',
        phoneNumber: user.phoneNumber || ''
      });
    }
  };

  const handleSave = async () => {
    if (!editingUser || !formData.username || !formData.password) {
      setMessage('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 8) {
      setMessage('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const success = await updateCredentials(
        editingUser,
        formData.username,
        formData.password,
        formData.phoneNumber
      );

      if (success) {
        setUsers(getUsers());
        setEditingUser(null);
        setFormData({ username: '', password: '', phoneNumber: '' });
        setMessage('User credentials updated successfully');
      } else {
        setMessage('Failed to update credentials. Username might already exist.');
      }
    } catch (error) {
      setMessage('An error occurred while updating credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setFormData({ username: '', password: '', phoneNumber: '' });
    setMessage('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-slate-900 dark:text-white">
          <Users className="w-5 h-5 mr-2" />
          User Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="border border-slate-200 dark:border-slate-600 rounded-lg p-4">
              {editingUser === user.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Username
                    </label>
                    <Input
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="Enter username"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      New Password
                    </label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter new password (min 8 characters)"
                      required
                      minLength={8}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      placeholder="Enter phone number (+1234567890)"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleSave}
                      disabled={isLoading}
                      size="sm"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      {isLoading ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      size="sm"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center">
                      <Shield className={`w-4 h-4 mr-2 ${user.role === 'admin' ? 'text-red-500' : 'text-blue-500'}`} />
                      <h3 className="font-semibold text-slate-900 dark:text-white">{user.username}</h3>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200' 
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                    <div className="flex items-center mt-1 text-sm text-slate-600 dark:text-slate-400">
                      <Phone className="w-3 h-3 mr-1" />
                      <span>{user.phoneNumber || 'No phone number'}</span>
                    </div>
                    {user.lastLogin && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Last login: {new Date(user.lastLogin).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={() => handleEdit(user.id)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${
            message.includes('successfully') 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
          }`}>
            {message}
          </div>
        )}
      </CardContent>
    </Card>
  );
};