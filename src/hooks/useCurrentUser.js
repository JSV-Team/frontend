import { useState, useEffect } from 'react';

/**
 * Custom hook to get current user from localStorage
 * Automatically reloads when 'userUpdated' event is dispatched
 * 
 * Usage:
 * const currentUser = useCurrentUser();
 * 
 * This hook ensures all components using it will automatically
 * update when user data changes (e.g., avatar upload)
 */
export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Function to load user from localStorage
    const loadUser = () => {
      const userString = localStorage.getItem('user');
      if (userString && userString !== 'undefined') {
        try {
          const userData = JSON.parse(userString);
          setCurrentUser(userData);
        } catch (e) {
          console.error('useCurrentUser: Error parsing user', e);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    };

    // Load initially
    loadUser();

    // Listen for user updates (avatar change, profile edit, etc.)
    window.addEventListener('userUpdated', loadUser);

    // Cleanup
    return () => {
      window.removeEventListener('userUpdated', loadUser);
    };
  }, []);

  return currentUser;
}

/**
 * Get user ID from current user
 */
export function useCurrentUserId() {
  const currentUser = useCurrentUser();
  return currentUser?.user_id || currentUser?.id || null;
}

export default useCurrentUser;
