"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const [errors, setErrors] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [touched, setTouched] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const validateField = (name, value) => {
    let error = '';

    if (!value) {
      error = 'This field is required';
    } else if (name === 'newPassword' && value.length < 8) {
      error = 'Password must be at least 8 characters';
    } else if (name === 'confirmPassword' && value !== formData.newPassword) {
      error = 'Passwords do not match';
    }

    return error;
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }

    if (name === 'newPassword' && touched.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: formData.confirmPassword !== value ? 'Passwords do not match' : ''
      }));
    }
  };

  const handleBlur = (name, value) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = () => {
    setTouched({
      oldPassword: true,
      newPassword: true,
      confirmPassword: true
    });

    const newErrors = {
      oldPassword: validateField('oldPassword', formData.oldPassword),
      newPassword: validateField('newPassword', formData.newPassword),
      confirmPassword: validateField('confirmPassword', formData.confirmPassword)
    };

    setErrors(newErrors);

    if (!newErrors.oldPassword && !newErrors.newPassword && !newErrors.confirmPassword) {
      console.log('Password changed successfully!', formData);
      alert('Password updated successfully!');
    }
  };

  const handleCancel = () => {
    setFormData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setTouched({
      oldPassword: false,
      newPassword: false,
      confirmPassword: false
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold mb-8">Change Password</h1>

        <Card className="shadow-sm">
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Old Password */}
              <div className="space-y-2">
                <Label htmlFor="oldPassword" className="text-lg">
                  Old Password <span className="text-red-600">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    type={showPasswords.old ? "text" : "password"}
                    value={formData.oldPassword}
                    onChange={(e) => handleChange('oldPassword', e.target.value)}
                    onBlur={(e) => handleBlur('oldPassword', e.target.value)}
                    placeholder="***********"
                    className={`pr-12 h-12 text-base ${errors.oldPassword && touched.oldPassword ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-red-700'
                      }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => togglePasswordVisibility('old')}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-transparent"
                  >
                    {showPasswords.old ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Button>
                </div>
                {errors.oldPassword && touched.oldPassword && (
                  <p className="text-red-500 text-sm">{errors.oldPassword}</p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-lg">
                  New Password <span className="text-red-600">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => handleChange('newPassword', e.target.value)}
                    onBlur={(e) => handleBlur('newPassword', e.target.value)}
                    placeholder="***********"
                    className={`pr-12 h-12 text-base ${errors.newPassword && touched.newPassword ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-red-700'
                      }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-transparent"
                  >
                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Button>
                </div>
                {errors.newPassword && touched.newPassword && (
                  <p className="text-red-500 text-sm">{errors.newPassword}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-lg">
                  Confirm Password <span className="text-red-600">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    onBlur={(e) => handleBlur('confirmPassword', e.target.value)}
                    placeholder="***********"
                    className={`pr-12 h-12 text-base ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-red-700'
                      }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-transparent"
                  >
                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Button>
                </div>
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-4 justify-center pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="px-12 h-12 text-lg border-2 border-red-700 text-red-700 hover:bg-red-50 hover:text-red-700"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  className="px-12 h-12 text-lg bg-red-700 hover:bg-red-800"
                >
                  Update
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}