import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore } from '@/hooks/use-store';
import { PageBackground } from '@/components/ui/PageBackground';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Components
import { CoverSection } from './CoverSection';
import { ProfileCard } from './ProfileCard';
import { QuickActions } from './QuickActions';
import { AboutCard } from './AboutCard';
import { ExperienceCard } from './ExperienceCard';
import { SkillsCard } from './SkillsCard';
import { AchievementsCard } from './AchievementsCard';
import { ProductsGrid } from './ProductsGrid';
import { ReviewsCard } from './ReviewsCard';
import { TimelineCard } from './TimelineCard';
import { ContactCard } from './ContactCard';
import { ProfileCompletion } from './ProfileCompletion';
import { ShareBottomSheet, ShareBottomSheetRef } from '@/components/ui/ShareBottomSheet';
import { FloatingIconButton } from '@/components/ui/FloatingIconButton';
import { GuestRestrictionOverlay } from '@/components/ui/GuestRestrictionOverlay';
import { Iconify } from '@/components/ui/Iconify';

// Hooks & Store
import { useProfileAnimations } from '@/hooks/useProfileAnimations';
import { ProfileData } from '@/types/profile';

interface ProfileViewProps {
  profile: ProfileData;
  mode: 'own' | 'readonly';
  userId?: string;
}

export const ProfileView = ({ profile, mode, userId }: ProfileViewProps) => {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const { language, isGuest, hasEnteredDemoMode } = useStore();
  const isRTL = language === 'fa';
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const isOwn = mode === 'own';
  const [isLazyMounted, setIsLazyMounted] = useState(false);
  const shareSheetRef = useRef<ShareBottomSheetRef>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLazyMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const {
    scrollHandler,
    coverStyle
  } = useProfileAnimations();

  const onShare = () => {
    shareSheetRef.current?.open();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PageBackground />

      {isOwn && isGuest && !hasEnteredDemoMode && (
        <GuestRestrictionOverlay
          icon={<Iconify icon="solar:user-circle-bold" width={42} height={42} color={colors.tint} />}
          title={isRTL ? 'پروفایل کاربری' : 'User Profile'}
          description={isRTL ? 'برای مشاهده پروفایل و مدیریت محصولات، لطفاً ثبت‌نام کنید.' : 'To view your profile and manage products, please sign up first.'}
        />
      )}

      {/* Floating Header Buttons */}
      <View style={[styles.floatingHeader, { top: insets.top + 10, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <FloatingIconButton
          icon={isRTL ? "solar:alt-arrow-right-broken" : "solar:alt-arrow-left-broken"}
          onPress={() => router.back()}
        />

        <View style={[styles.rightActions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <FloatingIconButton
            icon="solar:share-broken"
            onPress={onShare}
            iconSize={20}
          />
        </View>
      </View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={Platform.OS === 'android'}
      >
        <CoverSection
          image={profile.coverImage}
          avatar={profile.avatar}
          isVerified={profile.isVerified}
          isOpenToWork={profile.isOpenToWork}
          coverStyle={coverStyle}
          isRTL={isRTL}
          mode={mode}
        />

        <ProfileCard
          profile={profile}
          isRTL={isRTL}
          mode={mode}
          userId={userId}
        />

        <QuickActions
          isRTL={isRTL}
          mode={mode}
          userId={userId}
        />

        {isOwn && (
          <ProfileCompletion
            percentage={profile.completionPercentage}
            isRTL={isRTL}
          />
        )}

        <AboutCard
          bio={profile.bio}
          isRTL={isRTL}
          mode={mode}
        />

        <ProductsGrid
          products={profile.products}
          isRTL={isRTL}
        />

        {isLazyMounted && (
          <>
            <ExperienceCard
              experiences={profile.experiences}
              isRTL={isRTL}
              mode={mode}
            />
            <SkillsCard
              skills={profile.skills}
              isRTL={isRTL}
              mode={mode}
            />
            <AchievementsCard
              achievements={profile.achievements}
              isRTL={isRTL}
            />
            <ReviewsCard
              rating={profile.rating}
              count={128}
              isRTL={isRTL}
            />
            <TimelineCard
              events={profile.timeline}
              isRTL={isRTL}
            />
            <ContactCard
              socialLinks={profile.socialLinks}
              isRTL={isRTL}
              mode={mode}
            />
          </>
        )}

        {/* Bottom padding */}
        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      <ShareBottomSheet
        ref={shareSheetRef}
        isRTL={isRTL}
        title={isRTL ? 'اشتراک‌گذاری پروفایل' : 'Share Profile'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  floatingHeader: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 100,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightActions: {
    gap: 10,
  },
});
