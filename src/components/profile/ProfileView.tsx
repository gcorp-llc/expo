import React, { useRef, useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, Platform, TouchableOpacity } from 'react-native';
import { useModalStore } from '@/hooks/use-modal-store';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore } from '@/hooks/use-store';
import { PageBackground } from '@/components/ui/PageBackground';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';

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

const DEMO_USER_STORES = [
  {
    id: 'store-1',
    name: 'فروشگاه تخصصی کوتیک',
    specialty: 'گجت‌های هوشمند و لوازم جانبی',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&q=80',
    rating: '۴.۹',
  },
  {
    id: 'store-2',
    name: 'گالری پوشاک آریا',
    specialty: 'پوشاک و اکسسوری مدرن',
    avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&q=80',
    rating: '۴.۷',
  },
];

const PURCHASES_FROM_MY_STORE = [
  {
    id: 'p-101',
    title: 'ساعت هوشمند اپل واچ سری ۹',
    price: '$۳۹۹',
    date: '۱۴ اسفند ۱۴۰۳',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
  },
  {
    id: 'p-102',
    title: 'هدفون بی سیم سونی WH-1000XM5',
    price: '$۲۹۹',
    date: '۲۸ بهمن ۱۴۰۳',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
  },
];

export const ProfileView = ({ profile, mode, userId }: ProfileViewProps) => {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
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

  // Profile Options Menu: report icon changed to solar:shield-warning-broken and disable_sharing removed
  const profileDropdownOptions: DropdownOption[] = useMemo(() => [
    { value: 'share', label: isRTL ? 'به اشتراک گذاشتن مخاطب' : 'Share Contact', icon: 'solar:share-broken' },
    { value: 'block', label: isRTL ? 'مسدود کردن کاربر' : 'Block User', icon: 'solar:user-block-broken' },
    { value: 'edit', label: isRTL ? 'ویرایش مخاطب' : 'Edit Contact', icon: 'solar:pen-2-broken' },
    { value: 'delete_contact', label: isRTL ? 'حذف مخاطب' : 'Delete Contact', icon: 'solar:trash-bin-trash-broken' },
    { value: 'secret_chat', label: isRTL ? 'شروع گفتگوی محرمانه' : 'Start Secret Chat', icon: 'solar:lock-password-broken' },
    { value: 'add_home', label: isRTL ? 'افزودن به صفحه اصلی' : 'Add to Home Screen', icon: 'solar:add-square-broken' },
    { value: 'report', label: isRTL ? 'گزارش' : 'Report', icon: 'solar:shield-warning-broken', isDestructive: true },
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
          icon: 'solar:shield-warning-broken',
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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

        {/* Requirement 13: Rename Store to Stores and show list of available stores */}
        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.sectionHeaderRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Iconify icon="solar:bag-smile-bold-duotone" size={22} color={colors.tint} />
            <Text style={[styles.sectionCardTitle, { color: colors.text }]}>
              {isRTL ? 'فروشگاه‌ها' : 'Stores'}
            </Text>
          </View>
          <View style={{ gap: 10, marginTop: 12 }}>
            {DEMO_USER_STORES.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={[styles.storeItemRow, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                onPress={() => router.push('/shop')}
              >
                <Image source={{ uri: s.avatar }} style={styles.storeAvatar} />
                <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start', gap: 2 }}>
                  <Text style={[styles.storeTitle, { color: colors.text }]}>{s.name}</Text>
                  <Text style={[styles.storeSub, { color: colors.textSecondary }]}>{s.specialty}</Text>
                </View>
                <View style={[styles.ratingChip, { backgroundColor: colors.tint + '18' }]}>
                  <Iconify icon="solar:star-bold" size={12} color="#fbbf24" />
                  <Text style={[styles.ratingText, { color: colors.tint }]}>{s.rating}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Requirement 11: Purchases from my store section in shared contact profile */}
        {!isOwn && (
          <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.sectionHeaderRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Iconify icon="solar:wallet-money-broken" size={22} color={colors.success} />
              <Text style={[styles.sectionCardTitle, { color: colors.text }]}>
                {isRTL ? 'لیست خریدها از فروشگاه من' : 'Purchases from My Store'}
              </Text>
            </View>
            <View style={{ gap: 10, marginTop: 12 }}>
              {PURCHASES_FROM_MY_STORE.map((p) => (
                <View
                  key={p.id}
                  style={[styles.purchaseItemRow, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                >
                  <Image source={{ uri: p.image }} style={styles.purchaseThumb} />
                  <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start', gap: 2 }}>
                    <Text style={[styles.purchaseTitle, { color: colors.text }]}>{p.title}</Text>
                    <Text style={[styles.purchaseDate, { color: colors.textSecondary }]}>{p.date}</Text>
                  </View>
                  <Text style={[styles.purchasePrice, { color: colors.tint }]}>{p.price}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

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

      {/* Floating Dropdown Menu */}
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
  sectionCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
  },
  sectionHeaderRow: {
    alignItems: 'center',
    gap: 10,
  },
  sectionCardTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  storeItemRow: {
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    gap: 12,
  },
  storeAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  storeTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  storeSub: {
    fontSize: 12,
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '800',
  },
  purchaseItemRow: {
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 12,
  },
  purchaseThumb: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  purchaseTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  purchaseDate: {
    fontSize: 11,
  },
  purchasePrice: {
    fontSize: 14,
    fontWeight: '900',
  },
});
