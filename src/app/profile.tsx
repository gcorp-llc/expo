import React from 'react';
import { useProfileStore } from '@/hooks/use-profile-store';
import { ProfileView } from '@/components/profile/ProfileView';

export default function ProfileScreen() {
  const profile = useProfileStore();

  return (
    <ProfileView
      profile={profile}
      mode="own"
    />
  );
}
