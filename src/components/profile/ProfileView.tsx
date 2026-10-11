import React, { useRef, useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { useModalStore } from '@/hooks/use-modal-store';
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

  const showModal = useModalStore((state) => state.showModal);

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
        showModal({
          title: isRTL ? 'مسدود کردن کاربر' : 'Block User',
          message: isRTL ? 'آیا از مسدود کردن این کاربر اطمینان دارید؟ پیام‌های وی دیگر به شما نمایش داده نخواهند شد.' : 'Are you sure you want to block this user?',
          icon: 'solar:user-block-broken',
          iconColor: colors.destructive,
          buttons: [
            { text: isRTL ? 'لغو' : 'Cancel', style: 'cancel' },
            { text: isRTL ? 'مسدود کن' : 'Block', style: 'destructive' },
          ]
        });
        break;
      case 'edit':
        showModal({
          title: isRTL ? 'ویرایش مخاطب' : 'Edit Contact',
          message: isRTL ? 'اطلاعات مخاطب را می‌توانید ویرایش کنید.' : 'Edit contact details.',
          icon: 'solar:pen-2-broken',
          buttons: [{ text: isRTL ? 'تایید' : 'OK', style: 'primary' }]
        });
        break;
      case 'delete_contact':
        showModal({
          title: isRTL ? 'حذف مخاطب' : 'Delete Contact',
          message: isRTL ? 'آیا این مخاطب از فهرست مخاطبین شما حذف شود؟' : 'Remove this contact from your contacts list?',
          icon: 'solar:trash-bin-trash-broken',
          iconColor: colors.destructive,
          buttons: [
            { text: isRTL ? 'لغو' : 'Cancel', style: 'cancel' },
            { text: isRTL ? 'حذف مخاطب' : 'Delete', style: 'destructive' },
          ]
        });
        break;
      case 'secret_chat':
        showModal({
          title: isRTL ? 'گفتگوی محرمانه' : 'Secret Chat',
          message: isRTL ? 'گفتگوی محرمانه رمزشده با مخاطب فعال گردید.' : 'Secret encrypted chat session initiated.',
          icon: 'solar:lock-password-broken',
          iconColor: colors.tint,
          buttons: [{ text: isRTL ? 'شروع گفتگو' : 'Start Chat', style: 'primary' }]
        });
        break;
      case 'disable_sharing':
        showModal({
          title: isRTL ? 'اشتراک‌گذاری' : 'Sharing',
          message: isRTL ? 'اشتراک‌گذاری اطلاعات غیرفعال گردید.' : 'Sharing disabled for this user.',
          icon: 'solar:transmission-broken',
          buttons: [{ text: isRTL ? 'متوجه شدم' : 'Understood', style: 'primary' }]
        });
        break;
      case 'add_home':
        showModal({
          title: isRTL ? 'افزودن به صفحه اصلی' : 'Add to Home Screen',
          message: isRTL ? 'میانبر مخاطب به صفحه اصلی اضافه شد.' : 'Contact shortcut added to home screen.',
          icon: 'solar:add-square-broken',
          buttons: [{ text: isRTL ? 'باشه' : 'OK', style: 'primary' }]
        });
        break;
      case 'report':
        showModal({
          title: isRTL ? 'گزارش تخلف' : 'Report User',
          message: isRTL ? 'گزارش شما بررسی شده و توسط تیم پشتیبانی کوتیک پیگیری می‌شود.' : 'Your report will be sent to moderation.',
          icon: 'solar:danger-circle-bold',
          iconColor: colors.destructive,
          buttons: [
            { text: isRTL ? 'انصراف' : 'Cancel', style: 'cancel' },
            { text: isRTL ? 'ارسال گزارش' : 'Send Report', style: 'destructive' },
          ]
        });
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
          {isOwn && (
            <FloatingIconButton
              icon="solar:settings-minimalistic-broken"
              onPress={() => router.push('/settings')}
              iconSize={20}
            />
          )}
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
          showModal({
            title: isRTL ? 'تنظیمات ذخیره شد' : 'Timer Set',
            message: isRTL ? 'زمان حذف خودکار پیام‌ها با موفقیت تنظیم گردید.' : 'Auto-delete timer set.',
            icon: 'solar:clock-circle-broken',
            buttons: [{ text: isRTL ? 'باشه' : 'OK', style: 'primary' }]
          });
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
