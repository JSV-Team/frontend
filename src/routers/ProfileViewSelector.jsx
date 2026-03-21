import React from 'react';
import { useParams, Outlet } from 'react-router-dom';
import PublicProfile from '../pages/PublicProfile/PublicProfile';
import ProfileLayout from '../layouts/ProfileLayout';

export default function ProfileViewSelector() {
  const { userId } = useParams();
  
  // Get current logged-in user ID
  const userStr = localStorage.getItem('user');
  let myId = null;
  if (userStr) {
    const user = JSON.parse(userStr);
    myId = (user.user_id || user.id || user.USER_ID)?.toString();
  }

  // If viewing own profile, use the owner's layout (with Sidebar and Edit/Rep/Posts tabs)
  if (userId === myId) {
    return <ProfileLayout />;
  }

  // Otherwise, show the Public Profile standalone page (One Column, Centered)
  return <PublicProfile />;
}
