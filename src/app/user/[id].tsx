import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ProfileView } from '@/components/profile/ProfileView';
import { MOCK_PROFILE } from '@/constants/mockProfile';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // In a real app, we would fetch the profile by ID
  // For now, we use MOCK_PROFILE with dynamic name/avatar based on ID
  const profile = {
    ...MOCK_PROFILE,
    name: id === '1' ? 'سارا محمدی' : 'علی رضایی',
    avatar: `https://i.pravatar.cc/300?u=${id}`,
    blockedUserIds: [],
  };

  return (
    <ProfileView
      profile={profile}
      mode="readonly"
      userId={id}
    />
  );
}
