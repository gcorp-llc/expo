import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Share, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Iconify } from '@/components/ui/Iconify';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ProfileData } from '@/types/profile';
import { useProfileStore } from '@/hooks/use-profile-store';

interface ProfileCardProps {
  profile: ProfileData;
  isRTL: boolean;
  mode?: 'own' | 'readonly';
  userId?: string; // ID of the user being viewed in readonly mode
}

export const ProfileCard = ({ profile, isRTL, mode = 'own', userId }: ProfileCardProps) => {
  const router = useRouter();
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const { updateProfile, blockUser, blockedUserIds } = useProfileStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // Local state for inline editing
  const [editData, setEditData] = useState({
    name: profile.name,
    role: profile.role || '',
    location: profile.location,
    website: profile.website,
  });

  const isOwn = mode === 'own';
  const isBlocked = userId ? blockedUserIds.includes(userId) : false;

  const handleSave = () => {
    updateProfile(editData);
    setIsEditing(false);
  };

  const onInvite = async () => {
    try {
      await Share.share({
        message: isRTL
          ? 'سلام! بیا در اپلیکیشن کاردیانی با من همراه شو. لینک دانلود: https://cardiani.app/invite'
          : 'Hey! Join me on Cardiani app. Download here: https://cardiani.app/invite',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onBlock = () => {
    if (!userId) return;

    Alert.alert(
      isRTL ? 'مسدود کردن مخاطب' : 'Block Contact',
      isRTL
        ? 'آیا از مسدود کردن این مخاطب اطمینان دارید؟ گفتگوهای این شخص دیگر نمایش داده نخواهند شد.'
        : 'Are you sure you want to block this contact? Conversations with this person will no longer be visible.',
      [
        { text: isRTL ? 'انصراف' : 'Cancel', style: 'cancel' },
        {
          text: isRTL ? 'مسدود کردن' : 'Block',
          style: 'destructive',
          onPress: () => {
            blockUser(userId);
            router.back();
          }
        }
      ]
    );
  };

  const StatItem = ({ label, value }: { label: string; value: string | number }) => (
    <View style={styles.statItem}>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );

  const EditField = ({ label, value, keyName, icon }: { label: string, value: string, keyName: keyof typeof editData, icon: string }) => (
    <View style={[styles.editField, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
      <View style={[styles.editIconWrapper, { backgroundColor: colors.surface }]}>
        <Iconify icon={icon} size={18} color={colors.textSecondary} />
      </View>
      <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
        <Text style={[styles.editLabel, { color: colors.textSecondary }]}>{label}</Text>
        <TextInput
          value={value}
          onChangeText={(text) => setEditData(prev => ({ ...prev, [keyName]: text }))}
          style={[styles.editInput, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
          placeholderTextColor={colors.textSecondary + '80'}
        />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Header & Edit Button */}
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
          {!isEditing ? (
            <>
              <Text style={[styles.name, { color: colors.text }]}>{profile.name}</Text>
              <Text style={[styles.headline, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                {profile.role || profile.headline}
              </Text>
              <Text style={[styles.business, { color: colors.tint }]}>{profile.businessName}</Text>
            </>
          ) : (
            <Text style={[styles.name, { color: colors.text }]}>{isRTL ? 'ویرایش مشخصات' : 'Edit Profile'}</Text>
          )}
        </View>

        {isOwn && !isEditing && (
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            style={[styles.editBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Iconify icon="solar:pen-new-square-broken" size={18} color={colors.tint} />
          </TouchableOpacity>
        )}
      </View>

      {/* Inline Editing Mode */}
      {isEditing ? (
        <View style={styles.editContainer}>
          <EditField label={isRTL ? 'نام' : 'Name'} value={editData.name} keyName="name" icon="solar:user-broken" />
          <EditField label={isRTL ? 'سمت / دسته‌بندی' : 'Role / Category'} value={editData.role} keyName="role" icon="solar:case-minimalistic-broken" />
          <EditField label={isRTL ? 'آدرس' : 'Location'} value={editData.location} keyName="location" icon="solar:map-point-broken" />
          <EditField label={isRTL ? 'وب‌سایت' : 'Website'} value={editData.website} keyName="website" icon="solar:link-broken" />

          <View style={[styles.editActions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <TouchableOpacity
              onPress={() => setIsEditing(false)}
              style={[styles.cancelBtn, { borderColor: colors.border }]}
            >
              <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>{isRTL ? 'انصراف' : 'Cancel'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.saveBtn, { backgroundColor: colors.tint }]}
            >
              <Text style={styles.saveBtnText}>{isRTL ? 'ذخیره تغییرات' : 'Save Changes'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <View style={[styles.infoRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={[styles.infoItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Iconify icon="solar:map-point-broken" size={16} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>{profile.location}</Text>
            </View>
            <View style={[styles.infoItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Iconify icon="solar:link-broken" size={16} color={colors.tint} />
              <Text style={[styles.infoText, { color: colors.tint }]}>{profile.website.replace('https://', '')}</Text>
            </View>
          </View>

          <View style={[styles.statsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <StatItem value={profile.followers} label={isRTL ? 'دنبال‌کننده' : 'Followers'} />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <StatItem value={profile.following} label={isRTL ? 'دنبال‌شونده' : 'Following'} />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <StatItem value={profile.productsCount} label={isRTL ? 'محصول' : 'Products'} />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <StatItem value={profile.rating} label={isRTL ? 'امتیاز' : 'Rating'} />
          </View>

          <View style={[styles.actionRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            {isOwn ? (
              <>
                <TouchableOpacity
                  onPress={() => router.push('/settings/addresses' as any)}
                  style={[styles.secondaryAction, { backgroundColor: colors.surface, borderColor: colors.tint + '40' }]}
                >
                  <Iconify icon="solar:map-point-broken" size={20} color={colors.tint} style={{ marginRight: 6 }} />
                  <Text style={[styles.secondaryActionText, { color: colors.tint }]}>{isRTL ? 'نشانی‌ها' : 'Addresses'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push(`/shop/${profile.businessName || '1'}` as any)}
                  style={[styles.secondaryAction, { backgroundColor: colors.surface, borderColor: colors.border }]}
                >
                  <Iconify icon="solar:shop-broken" size={20} color={colors.text} style={{ marginRight: 8 }} />
                  <Text style={[styles.secondaryActionText, { color: colors.text }]}>{isRTL ? 'فروشگاه' : 'Shop'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onInvite}
                  style={[styles.iconAction, { backgroundColor: colors.surface, borderColor: colors.border }]}
                >
                  <Iconify icon="solar:user-plus-broken" size={20} color={colors.text} />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => setIsFollowing(!isFollowing)}
                  style={[styles.primaryAction, { backgroundColor: isFollowing ? colors.surface : colors.tint, borderWidth: isFollowing ? 1 : 0, borderColor: colors.border }]}
                >
                  <Text style={[styles.primaryActionText, { color: isFollowing ? colors.text : '#fff' }]}>
                    {isFollowing ? (isRTL ? 'دنبال شده' : 'Following') : (isRTL ? 'دنبال کردن' : 'Follow')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onBlock}
                  style={[styles.secondaryAction, { backgroundColor: colors.surface, borderColor: colors.destructive + '40' }]}
                >
                  <Text style={[styles.secondaryActionText, { color: colors.destructive }]}>{isRTL ? 'مسدود کردن' : 'Block'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.iconAction, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Iconify icon="solar:user-plus-broken" size={20} color={colors.text} />
                </TouchableOpacity>
              </>
            )}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    borderRadius: 28,
    padding: Spacing.xl,
    borderWidth: 1,
    marginTop: 10,
  },
  header: {
    marginBottom: 16,
    alignItems: 'center',
    gap: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  headline: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 6,
  },
  business: {
    fontSize: 13,
    fontWeight: '800',
  },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  infoRow: {
    gap: 16,
    marginBottom: 24,
  },
  infoItem: {
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statsRow: {
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'transparent',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 20,
    alignSelf: 'center',
  },
  actionRow: {
    gap: 10,
  },
  primaryAction: {
    flex: 2,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionText: {
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryAction: {
    flex: 1.5,
    height: 48,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: '700',
  },
  iconAction: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  // Editing Styles
  editContainer: {
    gap: 12,
    marginTop: 8,
  },
  editField: {
    gap: 12,
    alignItems: 'center',
  },
  editIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  editInput: {
    fontSize: 14,
    fontWeight: '700',
    padding: 0,
    width: '100%',
  },
  editActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  saveBtn: {
    flex: 2,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
});
