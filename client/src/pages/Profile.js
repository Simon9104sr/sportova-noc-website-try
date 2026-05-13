import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile({ user }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
    } catch (err) {
      console.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Loading profile...</div>;
  if (!profile) return <div className="container">Profile not found</div>;

  return (
    <div className="container">
      <h1>My Profile</h1>
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-info">
            <strong>Full Name</strong>
            <span>{profile.full_name}</span>
          </div>
          <div className="profile-info">
            <strong>Username</strong>
            <span>@{profile.username}</span>
          </div>
          <div className="profile-info">
            <strong>Email</strong>
            <span>{profile.email}</span>
          </div>
          {profile.phone && (
            <div className="profile-info">
              <strong>Phone</strong>
              <span>{profile.phone}</span>
            </div>
          )}
          {profile.city && (
            <div className="profile-info">
              <strong>City</strong>
              <span>{profile.city}</span>
            </div>
          )}
          <div className="profile-info">
            <strong>Member Since</strong>
            <span>{new Date(profile.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="profile-card">
          <h3>About</h3>
          <p>{profile.bio || 'No bio yet'}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;