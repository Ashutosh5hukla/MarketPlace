import { useState, useEffect } from 'react';
import { getCurrentUser } from '../api';
import { 
  User, Mail, Shield, Calendar, Package, ShoppingBag, 
  Edit2, Save, X, Camera, MapPin, Phone, Briefcase
} from 'lucide-react';

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: ''
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        bio: currentUser.bio || ''
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // Here you would typically make an API call to update the user profile
    // For now, we'll just update the local state
    const updatedUser = { ...user, ...formData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      bio: user.bio || ''
    });
    setIsEditing(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-primary-500 via-purple-500 to-secondary-500 relative">
            <div className="absolute inset-0 opacity-20">
              <div style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px', height: '100%' }}></div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-20 mb-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-40 h-40 rounded-full border-8 border-white bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-xl">
                  <User className="w-20 h-20 text-white" />
                </div>
                <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                  <Camera className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Edit Button */}
              <div className="mt-4 md:mt-0">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  >
                    <Edit2 className="w-5 h-5" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all"
                    >
                      <Save className="w-5 h-5" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white font-bold rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all"
                    >
                      <X className="w-5 h-5" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* User Details */}
            <div className="space-y-4">
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="text-4xl font-bold text-gray-900 w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-primary-500 focus:outline-none"
                  placeholder="Your Name"
                />
              ) : (
                <h1 className="text-4xl font-bold text-gray-900">{user.name}</h1>
              )}

              <div className="flex flex-wrap gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary-500" />
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="border-2 border-gray-200 rounded-lg px-3 py-1 focus:border-primary-500 focus:outline-none"
                      placeholder="email@example.com"
                    />
                  ) : (
                    <span>{user.email}</span>
                  )}
                </div>

                {(formData.phone || isEditing) && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-primary-500" />
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="border-2 border-gray-200 rounded-lg px-3 py-1 focus:border-primary-500 focus:outline-none"
                        placeholder="Phone number"
                      />
                    ) : (
                      <span>{formData.phone}</span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary-500" />
                  <span className="px-3 py-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full text-sm font-semibold capitalize">
                    {user.role}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-500" />
                  <span>Joined {formatDate(user.createdAt || new Date())}</span>
                </div>
              </div>

              {(formData.address || isEditing) && (
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin className="w-5 h-5 text-primary-500 mt-1" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-1 focus:border-primary-500 focus:outline-none"
                      placeholder="Your address"
                    />
                  ) : (
                    <span>{formData.address}</span>
                  )}
                </div>
              )}

              {(formData.bio || isEditing) && (
                <div className="pt-4">
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary-500 focus:outline-none resize-none"
                      rows="3"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-700">{formData.bio}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Package className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">0</div>
                <div className="text-gray-600">Total Orders</div>
              </div>
            </div>
          </div>

          {user.role === 'seller' && (
            <>
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900">0</div>
                    <div className="text-gray-600">Products Listed</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900">₹0</div>
                    <div className="text-gray-600">Total Sales</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Additional Info Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-4 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Account Status</span>
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold">Active</span>
            </div>
            <div className="flex justify-between items-center py-4 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Email Verified</span>
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold">Yes</span>
            </div>
            <div className="flex justify-between items-center py-4">
              <span className="text-gray-600 font-medium">Member Since</span>
              <span className="text-gray-900 font-semibold">{formatDate(user.createdAt || new Date())}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
