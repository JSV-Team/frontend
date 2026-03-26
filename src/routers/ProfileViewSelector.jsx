import React from 'react';
import { useParams, Outlet } from 'react-router-dom';
import PublicProfile from '../pages/PublicProfile/PublicProfile';
import ProfileLayout from '../layouts/ProfileLayout';

export default function ProfileViewSelector() {
  const { username } = useParams();

  // Get current logged-in user profile info
  const userStr = localStorage.getItem('user');
  let myId = null;
  let myUsername = null;
  
  if (userStr && userStr !== 'undefined') {
    try {
      const user = JSON.parse(userStr);
      myId = (user.user_id || user.id || user.USER_ID)?.toString();
      myUsername = user.username;
    } catch (e) {
      console.error("ProfileViewSelector: Error parsing user", e);
    }
  }

  // If viewing own profile (by username or ID), use the owner's layout
  if (username === myUsername || username === myId) {
    return <ProfileLayout />;
  }

  // Otherwise, show the Public Profile standalone page (One Column, Centered)
  return <PublicProfile />;
}
