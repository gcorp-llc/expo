import React, { useRef, useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Platform, Alert } from 'react-native';
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
import { FloatingDropdownMenu, DropdownOption } from '@/components/ui/FloatingDropdownMenu';
import { SelectionModal, Option } from '@/components/ui/SelectionModal';

// Hooks & Store
import { useProfileAnimations } from '@/hooks/useProfileAnimations';
import { ProfileData } from '@/types/profile';

interface ProfileViewProps {
  profile: ProfileData;
  mode: 'own' | 'readonly';
  userId?: string;
}

export const ProfileView = ({ profile, mode, userId }: ProfileViewProps) => {
  const colorScheme = (useColorScheme() ?? 'dark') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const { language, isGuest, hasEnteredDemoMode } = useStore();
  const isRTL = language === 'fa';
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const isOwn = mode === 'own';
  const [isLazyMounted, setIsLazyMounted] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isAutoDeleteModalVisible, setIsAutoDeleteModalVisible] = useState(false);
  const shareSheetRef = useRef<ShareBottomSheetRef>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLazyMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const { scrollHandler, coverStyle } = useProfileAnimations();

  const onShare = () => {
    shareSheetRef.current?.open();
  };

  // Profile Options Menu matching Image 1
  const profileDropdownOptions: DropdownOption[] = useMemo(() => [
    { value: 'share', label: isRTL ? 'به اشتراک گذاشتن مخاطب' : 'Share Contact', icon: 'solar:share-broken' },
    { value: 'block', label: isRTL ? 'مسدود کردن کاربر' : 'Block User', icon: 'solar:user-block-broken' },
    { value: 'edit', label: isRTL ? 'ویرایش مخاطب' : 'Edit Contact', icon: 'solar:pen-2-broken' },
    { value: 'delete_contact', label: isRTL ? 'حذف مخاطب' : 'Delete Contact', icon: 'solar:trash-bin-trash-broken' },
    { value: 'secret_chat', label: isRTL ? 'شروع گفتگوی محرمانه' : 'Start Secret Chat', icon: 'solar:lock-password-broken' },
    { value: 'disable_sharing', label: isRTL ? 'غیرفعال کردن اشتراک‌گذاری' : 'Disable Sharing', icon: 'solar:transmission-broken' },
    { value: 'add_home', label: isRTL ? 'افزودن به صفحه اصلی' : 'Add to Home Screen', icon: 'solar:add-square-broken' },
    { value: 'report', label: isRTL ? 'گزارش' : 'Report', icon: 'solar:danger-circle-bold', isDestructive: true },
  ], [isRTL]);

  const autoDeleteOptions: Option[] = useMemo(() => [
    { value: 'off', label: isRTL ? 'خاموش' : 'Off' },
    { value: '24h', label: isRTL ? '۲۴ ساعت' : '24 Hours' },
    { value: '7d', label: isRTL ? '۱ هفته' : '1 Week' },
    { value: '1m', label: isRTL ? '۱ ماه' : '1 Month' },
  ], [isRTL]);

  const handleMenuSelect = (val: string) => {
    switch (val) {
      case 'share':
        onShare();
        break;
      case 'block':
        Alert.alert(
          isRTL ? 'مسدود کردن کاربر' : 'Block User',
          isRTL ? 'آیا از مسدود کردن این کاربر اطمینان دارید؟' : 'Are you sure you want to block this user?',
          [
            { text: isRTL ? 'لغو' : 'Cancel', style: 'cancel' },
            { text: isRTL ? 'مسدود کن' : 'Block', style: 'destructive' },
          ]
        );
        break;
      case 'edit':
        Alert.alert(isRTL ? 'ویرایش مخاطب' : 'Edit Contact', isRTL ? 'فرم ویرایش اطلاعات مخاطب.' : 'Edit contact details.');
        break;
      case 'delete_contact':
        Alert.alert(
          isRTL ? 'حذف مخاطب' : 'Delete Contact',
          isRTL ? 'آیا این مخاطب از فهرست مخاطبین شما حذف شود؟' : 'Remove this contact from your contacts list?',
          [
            { text: isRTL ? 'لغو' : 'Cancel', style: 'cancel' },
            { text: isRTL ? 'حذف' : 'Delete', style: 'destructive' },
          ]
        );
        break;
      case 'secret_chat':
        Alert.alert(
          isRTL ? 'گفتگوی محرمانه' : 'Secret Chat',
          isRTL ? 'گفتگوی محرمانه رمزشده با مخاطب فعال گردید.' : 'Secret encrypted chat session initiated.'
        );
        break;
      case 'disable_sharing':
        Alert.alert(
          isRTL ? 'اشتراک‌گذاری' : 'Sharing',
          isRTL ? 'اشتراک‌گذاری اطلاعات غیرفعال گردید.' : 'Sharing disabled for this user.'
        );
        break;
      case 'add_home':
        Alert.alert(
          isRTL ? 'صفحه اصلی' : 'Home Screen',
          isRTL ? 'میانبر مخاطب به صفحه اصلی اضافه شد.' : 'Contact shortcut added to home screen.'
        );
        break;
      case 'report':
        Alert.alert(
          isRTL ? 'گزارش تخلف' : 'Report User',
          isRTL ? 'گزارش شما برای تیم پشتیبانی ارسال می‌شود.' : 'Your report will be sent to moderation.',
          [
            { text: isRTL ? 'انصراف' : 'Cancel', style: 'cancel' },
            { text: isRTL ? 'ارسال گزارش' : 'Send Report', style: 'destructive' },
          ]
        );
        break;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#1A1825' }]}>
      <PageBackground />

      {isOwn && isGuest && !hasEnteredDemoMode && (
        <GuestRestrictionOverlay
          icon={<Iconify icon="solar:user-circle-bold" width={42} height={42} color={colors.tint} />}
          title={isRTL ? 'پروفایل کاربری' : 'User Profile'}
          description={
            isRTL
              ? 'برای مشاهده پروفایل و مدیریت محصولات، لطفاً ثبت‌نام کنید.'
              : 'To view your profile and manage products, please sign up first.'
          }
        />
      )}

      {/* Floating Header Buttons */}
      <View
        style={[
          styles.floatingHeader,
          { top: insets.top + 10, flexDirection: isRTL ? 'row-reverse' : 'row' },
        ]}
      >
        <FloatingIconButton
          icon={isRTL ? 'solar:alt-arrow-right-broken' : 'solar:alt-arrow-left-broken'}
          onPress={() => router.back()}
        />

        <View style={[styles.rightActions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <FloatingIconButton icon="solar:share-broken" onPress={onShare} iconSize={20} />
          {!isOwn && (
            <FloatingIconButton
              icon="solar:menu-dots-broken"
              onPress={() => setIsMenuVisible(true)}
              iconSize={20}
            />
          )}
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

        <ProfileCard profile={profile} isRTL={isRTL} mode={mode} userId={userId} />

        <QuickActions isRTL={isRTL} mode={mode} userId={userId} />

        {isOwn && <ProfileCompletion percentage={profile.completionPercentage} isRTL={isRTL} />}

        <AboutCard bio={profile.bio} isRTL={isRTL} mode={mode} />

        <ProductsGrid products={profile.products} isRTL={isRTL} />

        {isLazyMounted && (
          <>
            <ExperienceCard experiences={profile.experiences} isRTL={isRTL} mode={mode} />
            <SkillsCard skills={profile.skills} isRTL={isRTL} mode={mode} />
            <AchievementsCard achievements={profile.achievements} isRTL={isRTL} />
            <ReviewsCard rating={profile.rating} count={128} isRTL={isRTL} />
            <TimelineCard events={profile.timeline} isRTL={isRTL} />
            <ContactCard socialLinks={profile.socialLinks} isRTL={isRTL} mode={mode} />
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

      {/* Floating Dropdown Menu matching Image 1 */}
      <FloatingDropdownMenu
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        headerTitle={isRTL ? 'حذف خودکار' : 'Auto Delete'}
        headerIcon="solar:clock-circle-broken"
        onHeaderPress={() => setIsAutoDeleteModalVisible(true)}
        options={profileDropdownOptions}
        onSelectOption={handleMenuSelect}
        isRTL={isRTL}
        topOffset={insets.top + 54}
      />

      <SelectionModal
        isVisible={isAutoDeleteModalVisible}
        onClose={() => setIsAutoDeleteModalVisible(false)}
        title={isRTL ? 'حذف خودکار پیام‌ها' : 'Auto-Delete Messages'}
        options={autoDeleteOptions}
        onSelect={(val) => {
          setIsAutoDeleteModalVisible(false);
          Alert.alert(isRTL ? 'زمان حذف خودکار تنظیم گردید.' : 'Auto-delete timer set.');
        }}
        isRTL={isRTL}
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
    left: 16,
    right: 16,
    zIndex: 100,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightActions: {
    gap: 8,
  },
});
