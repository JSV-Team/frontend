// MatchContainer - Main component for interest-based matching
// Integrates hooks (useMatchSocket, useMatchQueue), state management, and motion animations
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import useMatchSocket from '../../hooks/useMatchSocket';
import useMatchQueue from '../../hooks/useMatchQueue';
import { useMatch } from '../../contexts/MatchContext';
import MatchHeader from './MatchHeader';
import MatchContent from './MatchContent';
import MatchSidebar from './MatchSidebar';
import { useTheme } from '../../contexts/ThemeContext';
import Particles from '../../components/Particles/Particles';
import Aurora from '../../components/Aurora/Aurora';
import Grainient from '../../components/Grainient/Grainient';
import './Match.css';

function MatchContainer() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Get user info from localStorage
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [userInterests, setUserInterests] = useState([]);

  // Get global match context
  const matchContext = useMatch();

  // Setup Socket.IO connection
  const {
    isConnected,
    queueState: socketQueueState,
    matchData: socketMatchData,
    error: socketError,
    joinQueue: socketJoinQueue,
    cancelQueue: socketCancelQueue,
    clearMatch: socketClearMatch,
    socket,
  } = useMatchSocket(userId, token);

  // Setup queue management
  const {
    queueState,
    queueInfo,
    matchData,
    error: queueError,
    joinQueue: queueJoinQueue,
    cancelQueue: queueCancelQueue,
    clearMatch: queueClearMatch,
  } = useMatchQueue(socket);

  // Initialize user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedUser !== "undefined" && storedToken) {
      try {
        const user = JSON.parse(storedUser);
        setUserId(user.user_id);
        setToken(storedToken);

        // Fetch user interests from API to get latest data
        const fetchUserInterests = async () => {
          try {
            console.log('🔍 Fetching user interests for user:', user.user_id);
            const response = await fetch(`/api/profile/${user.user_id}`, {
              headers: {
                'Authorization': `Bearer ${storedToken}`
              }
            });
            if (response.ok) {
              const result = await response.json();
              console.log('📦 API result received:', result);

              // API returns { success: true, data: { user_id, interests, ... } }
              const userData = result.data || result;
              console.log('📦 User data:', userData);
              console.log('📦 Interests from API:', userData.interests);

              if (userData.interests && Array.isArray(userData.interests)) {
                console.log('✅ Setting user interests:', userData.interests);
                setUserInterests(userData.interests);
              } else {
                console.log('⚠️ No interests array in API response');
              }
            } else {
              console.log('❌ API response not OK:', response.status);
            }
          } catch (err) {
            console.error('Failed to fetch user interests:', err);
            // Fallback to localStorage interests
            if (user.interests && Array.isArray(user.interests)) {
              console.log('📦 Using localStorage interests:', user.interests);
              setUserInterests(user.interests);
            }
          }
        };

        fetchUserInterests();
      } catch (err) {
        console.error('Failed to parse user data:', err);
      }
    }
  }, []);

  // Sync socket state with queue state
  useEffect(() => {
    if (socketQueueState.status === 'searching') {
      matchContext.setMatchState('searching');
      matchContext.updateQueueInfo({
        queueSize: socketQueueState.queueSize,
        estimatedWaitTime: socketQueueState.estimatedWaitTime,
        waitTime: socketQueueState.waitTime,
      });
    } else if (socketQueueState.status === 'matched' && socketMatchData) {
      matchContext.handleMatchFound(socketMatchData);
    } else if (socketQueueState.status === 'idle') {
      matchContext.setMatchState('empty');
    }
  }, [socketQueueState, socketMatchData, matchContext]);

  // Handle join queue
  const handleJoinQueue = async () => {
    console.log('🎯 handleJoinQueue called');
    console.log('   isConnected:', isConnected);
    console.log('   userInterests:', userInterests);
    console.log('   userInterests.length:', userInterests?.length);

    if (!isConnected) {
      matchContext.setError('Socket not connected. Please try again.');
      return;
    }

    if (!userInterests || userInterests.length === 0) {
      matchContext.setError('Please add at least one interest before joining the queue.');
      return;
    }

    matchContext.setIsLoading(true);
    matchContext.setUserInterests(userInterests);

    try {
      // Join via socket (this will emit match:join event)
      socketJoinQueue();
    } catch (err) {
      matchContext.setError(err.message || 'Failed to join queue');
    } finally {
      matchContext.setIsLoading(false);
    }
  };

  // Handle cancel queue
  const handleCancelQueue = async () => {
    matchContext.setIsLoading(true);

    try {
      socketCancelQueue();
      matchContext.cancelSearch();
    } catch (err) {
      matchContext.setError(err.message || 'Failed to cancel queue');
    } finally {
      matchContext.setIsLoading(false);
    }
  };

  // Handle message match
  const handleMessageMatch = () => {
    const conversationId = matchData?.conversationId || matchContext.conversationId;
    if (conversationId) {
      // Navigate to Friends page with conversation ID as state (using openChatId key)
      navigate('/friends', { state: { openChatId: conversationId } });
    } else {
      // If no conversation ID, just go to Friends page
      navigate('/friends');
    }
  };

  // Handle view profile
  const handleViewProfile = () => {
    const matchedUser = matchData?.matchedUser || matchContext.matchedUser;
    console.log('🔍 handleViewProfile - matchedUser:', matchedUser);
    
    if (matchedUser?.user_id) {
      console.log('✅ Navigating to profile:', matchedUser.user_id);
      navigate(`/profile/${matchedUser.user_id}`);
    } else {
      console.log('❌ No user_id found in matchedUser');
      // Try alternative field names
      const userId = matchedUser?.userId || matchedUser?.id;
      if (userId) {
        console.log('✅ Found alternative userId:', userId);
        navigate(`/profile/${userId}`);
      } else {
        console.error('❌ Cannot navigate - no user ID found');
      }
    }
  };

  // Handle clear match
  const handleClearMatch = () => {
    socketClearMatch();
    matchContext.clearMatch();
  };

  // Combine errors from both sources
  const error = socketError || queueError || matchContext.error;

  return (
    <motion.div
      className="match-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background effects - only visible in dark mode */}
      {theme === 'dark' && (
        <>
          <div className="home-aurora-bg">
            <Aurora
              colorStops={['#d666ff', '#e15b83', '#5227FF']}
              blend={0.5}
              amplitude={1.0}
              speed={1.2}
            />
          </div>
          <div className="home-particles-bg">
            <Particles
              particleColors={['#c653b6', '#8b5cf6', '#6366f1']}
              particleCount={200}
              particleSpread={10}
              speed={0.1}
              particleBaseSize={400}
              moveParticlesOnHover={false}
              alphaParticles={true}
              disableRotation={false}
              sizeRandomness={1}
              cameraDistance={20}
              pixelRatio={1}
            />
          </div>
        </>
      )}

      {/* Background effect - only visible in light mode */}
      {theme === 'light' && (
        <div className="home-grainient-bg">
          <Grainient />
        </div>
      )}

      <div className="match-main">
        <MatchHeader />

        <div className="match-layout">
          <MatchContent
            matchState={matchContext.matchState}
            queueInfo={queueInfo}
            matchData={matchData || matchContext}
            userInterests={userInterests}
            isLoading={matchContext.isLoading}
            error={error}
            isConnected={isConnected}
            onJoinQueue={handleJoinQueue}
            onCancelQueue={handleCancelQueue}
            onMessageMatch={handleMessageMatch}
            onViewProfile={handleViewProfile}
            onClearMatch={handleClearMatch}
            onClearError={matchContext.clearError}
          />

          <MatchSidebar
            matchData={matchData || socketMatchData}
            queueInfo={queueInfo}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default MatchContainer;
