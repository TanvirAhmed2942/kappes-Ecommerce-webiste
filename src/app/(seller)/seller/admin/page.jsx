"use client";

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, EyeOff, Pencil, Trash2, X } from 'lucide-react';
import { useState } from 'react';

export default function AdminList() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    password: ''
  });

  const [admins, setAdmins] = useState([
    {
      id: 1,
      name: 'Osama Walid',
      role: 'Super Admin',
      email: 'Demo@gmail.com',
      createdDate: '22 Jan 2025'
    },
    {
      id: 2,
      name: 'Osama Walid',
      role: 'Admin',
      email: 'Demo@gmail.com',
      createdDate: '22 Jan 2025'
    },
    {
      id: 3,
      name: 'Osama Walid',
      role: 'Admin',
      email: 'Demo@gmail.com',
      createdDate: '22 Jan 2025'
    }
  ]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddAdmin = () => {
    const requiredFields = ['name', 'email', 'role', 'password'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      alert('Please fill in all required fields');
      return;
    }

    const newAdmin = {
      id: admins.length + 1,
      name: formData.name,
      role: formData.role,
      email: formData.email,
      createdDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    setAdmins([...admins, newAdmin]);
    setFormData({ name: '', email: '', role: '', password: '' });
    setIsDialogOpen(false);
    alert('Admin added successfully!');
  };

  const handleEdit = (id) => {
    console.log('Edit admin:', id);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this admin?')) {
      setAdmins(admins.filter(admin => admin.id !== id));
    }
  };

  return (
    <div className="">
      <div className="">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Admin List</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 flex justify-end">
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              + Add Admin
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-black">Name</TableHead>
                <TableHead className="font-semibold text-black">Role</TableHead>
                <TableHead className="font-semibold text-black">Email</TableHead>
                <TableHead className="font-semibold text-black">Created Date</TableHead>
                <TableHead className="font-semibold text-black">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>{admin.name}</TableCell>
                  <TableCell>{admin.role}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.createdDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-teal-500 text-teal-500 hover:bg-teal-50"
                        onClick={() => handleEdit(admin.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-red-500 text-red-500 hover:bg-red-50"
                        onClick={() => handleDelete(admin.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Add Admin Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Add New Admin</DialogTitle>
              <DialogClose className="absolute right-4 top-4">
                <X className="h-4 w-4" />
              </DialogClose>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="h-11"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="h-11"
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role">
                  Role<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="role"
                  placeholder="Enter role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="h-11"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password<span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Add Button */}
              <Button
                onClick={handleAddAdmin}
                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white mt-6"
              >
                Add Admin
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}