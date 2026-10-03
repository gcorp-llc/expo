import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useStore } from '@/hooks/use-store';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Iconify } from '@/components/ui/Iconify';
import { Image } from 'expo-image';
import { FloatingIconButton } from '@/components/ui/FloatingIconButton';
import { PageBackground } from '@/components/ui/PageBackground';

const CONTACTS = [
  { id: '1', name: 'علی احمدی', status: 'آخرین بازدید اخیرا', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '4', name: 'سارا محمدی', status: 'آنلاین', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: '5', name: 'رضا علوی', status: 'آخرین بازدید ۳ ساعت پیش', avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: '6', name: 'مریم حسینی', status: 'آخرین بازدید دیروز', avatar: 'https://i.pravatar.cc/150?u=6' },
];

export default function ContactsScreen() {
  const router = useRouter();
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language } = useStore();
  const isRTL = language === 'fa';

  const styles = useMemo(() => createStyles(colors), [colors]);

  const renderContact = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.contactItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
      onPress={() => router.push(`/chat/${item.id}`)}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={[styles.contactInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
        <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.status, { color: (item.status === 'آنلاین' || item.status === 'online') ? colors.tint : colors.textSecondary }]}>
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <View style={styles.listHeader}>
      <TouchableOpacity
        style={[styles.actionItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
        onPress={() => router.push('/chat/group/create-members')}
      >
        <View style={[styles.actionIcon, { backgroundColor: colors.tint + '15' }]}>
          <Iconify icon="solar:users-group-rounded-bold-duotone" size={24} color={colors.tint} />
        </View>
        <Text style={[styles.actionText, { color: colors.text }]}>
          {isRTL ? 'گروه جدید' : 'New Group'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
        onPress={() => router.push('/chat/channel/create-details')}
      >
        <View style={[styles.actionIcon, { backgroundColor: colors.tint + '15' }]}>
          <Iconify icon="solar:speaker-bold-duotone" size={24} color={colors.tint} />
        </View>
        <Text style={[styles.actionText, { color: colors.text }]}>
          {isRTL ? 'کانال جدید' : 'New Channel'}
        </Text>
      </TouchableOpacity>

      <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {isRTL ? 'مرتب‌شده بر اساس آخرین بازدید' : 'Sorted by last seen'}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PageBackground />
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.background }]}>
        <View style={[styles.headerTop, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <FloatingIconButton
            icon={isRTL ? "solar:alt-arrow-right-broken" : "solar:alt-arrow-left-broken"}
            onPress={() => router.back()}
          />
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {isRTL ? 'پیام جدید' : 'New Message'}
          </Text>
          <View style={{ width: 42 }} />
        </View>

        <View style={[styles.searchBar, { flexDirection: isRTL ? 'row-reverse' : 'row', backgroundColor: colors.card }]}>
          <Iconify icon="solar:magnifer-broken" size={20} color={colors.textSecondary} />
          <TextInput
            placeholder={isRTL ? "جستجوی مخاطب..." : "Search contacts..."}
            placeholderTextColor={colors.textSecondary}
            style={[styles.searchInput, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
          />
        </View>
      </View>

      <FlatList
        data={CONTACTS}
        keyExtractor={(item) => item.id}
        renderItem={renderContact}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 16,
  },
  headerTop: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
  },
  searchBar: {
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    height: '100%',
    padding: 0,
    paddingVertical: 0,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  listHeader: {
    paddingVertical: 8,
  },
  actionItem: {
    paddingVertical: 12,
    alignItems: 'center',
    gap: 16,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '700',
  },
  sectionHeader: {
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  contactItem: {
    paddingVertical: 12,
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  status: {
    fontSize: 13,
    fontWeight: '600',
  },
});
