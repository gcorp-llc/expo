import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Iconify } from '@/components/ui/Iconify';
import { SocialLink } from '@/types/profile';
import Animated, { Layout, FadeIn, FadeOut } from 'react-native-reanimated';
import { useProfileStore } from '@/hooks/use-profile-store';

interface ContactCardProps {
  socialLinks: SocialLink[];
  isRTL: boolean;
  mode?: 'own' | 'readonly';
}

export const ContactCard = ({ socialLinks, isRTL, mode = 'own' }: ContactCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const { email, phoneNumber, location, website, updateContactInfo, updateSocialLink } = useProfileStore();

  const isOwn = mode === 'own';

  return (
    <Animated.View
      layout={Layout.springify()}
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {isRTL ? 'اطلاعات تماس' : 'Contact Information'}
        </Text>
        {isOwn && (
          <TouchableOpacity
            onPress={() => setIsEditing(!isEditing)}
            style={[styles.editBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Iconify icon={isEditing ? "solar:check-read-broken" : "solar:pen-2-broken"} size={16} color={isEditing ? colors.success : colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {isEditing && isOwn ? (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.editForm}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>{isRTL ? 'ایمیل' : 'Email'}</Text>
            <TextInput
              style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border, textAlign: isRTL ? 'right' : 'left' }]}
              value={email}
              onChangeText={(text) => updateContactInfo({ email: text })}
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>{isRTL ? 'شماره تماس' : 'Phone'}</Text>
            <TextInput
              style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border, textAlign: isRTL ? 'right' : 'left' }]}
              value={phoneNumber}
              onChangeText={(text) => updateContactInfo({ phoneNumber: text })}
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>{isRTL ? 'وب‌سایت' : 'Website'}</Text>
            <TextInput
              style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border, textAlign: isRTL ? 'right' : 'left' }]}
              value={website}
              onChangeText={(text) => updateContactInfo({ website: text })}
            />
          </View>

          <Text style={[styles.subTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>{isRTL ? 'شبکه‌های اجتماعی' : 'Social Media'}</Text>
          {socialLinks.map((link) => (
            <View key={link.id} style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>{link.platform}</Text>
              <TextInput
                style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border, textAlign: isRTL ? 'right' : 'left' }]}
                value={link.url}
                onChangeText={(text) => updateSocialLink(link.id, text)}
              />
            </View>
          ))}
        </Animated.View>
      ) : (
        <View style={styles.grid}>
           <View style={[styles.contactItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Iconify icon="solar:letter-broken" size={20} color={colors.tint} />
              <Text style={[styles.contactText, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>{email}</Text>
           </View>
           <View style={[styles.contactItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Iconify icon="solar:phone-broken" size={20} color={colors.tint} />
              <Text style={[styles.contactText, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>{phoneNumber}</Text>
           </View>
           <View style={[styles.contactItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Iconify icon="solar:globus-broken" size={20} color={colors.tint} />
              <Text style={[styles.contactText, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>{website}</Text>
           </View>

          <View style={[styles.socialDivider, { backgroundColor: colors.border }]} />

          {socialLinks.map((link) => (
            <TouchableOpacity
              key={link.id}
              style={[styles.linkItem, { flexDirection: isRTL ? 'row-reverse' : 'row', backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={[styles.iconBox, { backgroundColor: colors.card }]}>
                <Iconify icon={link.icon} size={20} color={colors.tint} />
              </View>
              <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start', marginHorizontal: 12 }}>
                <Text style={[styles.platform, { color: colors.text }]}>{link.platform}</Text>
                <Text style={[styles.username, { color: colors.textSecondary }]}>{link.username}</Text>
              </View>
              <Iconify icon={isRTL ? "solar:alt-arrow-left-broken" : "solar:alt-arrow-right-broken"} size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    borderRadius: 28,
    padding: Spacing.xl,
    borderWidth: 1,
    marginTop: Spacing.lg,
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  editBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  grid: {
    gap: 12,
  },
  contactItem: {
    alignItems: 'center',
    gap: 12,
  },
  contactText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  socialDivider: {
    height: 1,
    width: '100%',
    marginVertical: 8,
  },
  linkItem: {
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  platform: {
    fontSize: 14,
    fontWeight: '800',
  },
  username: {
    fontSize: 12,
    fontWeight: '600',
  },
  editForm: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '600',
  },
  subTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 8,
  },
});
