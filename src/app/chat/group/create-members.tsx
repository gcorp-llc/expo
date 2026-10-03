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
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

const CONTACTS = [
  { id: '1', name: 'علی احمدی', status: 'آخرین بازدید اخیرا', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '4', name: 'سارا محمدی', status: 'آنلاین', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: '5', name: 'رضا علوی', status: 'آخرین بازدید ۳ ساعت پیش', avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: '6', name: 'مریم حسینی', status: 'آخرین بازدید دیروز', avatar: 'https://i.pravatar.cc/150?u=6' },
  { id: '7', name: 'حسین رضایی', status: 'آنلاین', avatar: 'https://i.pravatar.cc/150?u=7' },
  { id: '8', name: 'نرگس کریمی', status: 'آخرین بازدید ۵ دقیقه پیش', avatar: 'https://i.pravatar.cc/150?u=8' },
];

export default function CreateGroupMembersScreen() {
  const router = useRouter();
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language } = useStore();
  const isRTL = language === 'fa';

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedMembers = useMemo(() => CONTACTS.filter(c => selectedIds.includes(c.id)), [selectedIds]);
  const filteredContacts = useMemo(() => CONTACTS.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())), [searchQuery]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const renderSelectedMember = ({ item }: any) => (
    <Animated.View entering={FadeIn} exiting={FadeOut} layout={Layout.springify()} style={styles.selectedItem}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.selectedAvatar} />
        <TouchableOpacity style={[styles.removeBadge, { backgroundColor: colors.destructive }]} onPress={() => toggleSelect(item.id)}>
          <Iconify icon="solar:close-circle-bold" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={[styles.selectedName, { color: colors.text }]} numberOfLines={1}>{item.name.split(' ')[0]}</Text>
    </Animated.View>
  );

  const renderContact = ({ item }: any) => {
    const isSelected = selectedIds.includes(item.id);
    return (
      <TouchableOpacity
        style={[styles.contactItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
        onPress={() => toggleSelect(item.id)}
      >
        <View style={styles.avatarWrapper}>
           <Image source={{ uri: item.avatar }} style={styles.avatar} />
           {isSelected && (
             <View style={[styles.checkBadge, { backgroundColor: colors.tint }]}>
               <Iconify icon="solar:check-read-bold" size={12} color="#fff" />
             </View>
           )}
        </View>
        <View style={[styles.contactInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.status, { color: (item.status === 'آنلاین' || item.status === 'online') ? colors.tint : colors.textSecondary }]}>
            {item.status}
          </Text>
        </View>
        <View style={[styles.checkbox, { borderColor: isSelected ? colors.tint : colors.border, backgroundColor: isSelected ? colors.tint : 'transparent' }]}>
            {isSelected && <Iconify icon="solar:check-read-bold" size={16} color="#fff" />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.background }]}>
        <View style={[styles.headerTop, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <FloatingIconButton
            icon={isRTL ? "solar:alt-arrow-right-broken" : "solar:alt-arrow-left-broken"}
            onPress={() => router.back()}
          />
          <View style={[styles.titleContainer, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
             <Text style={[styles.headerTitle, { color: colors.text }]}>
               {isRTL ? 'گروه جدید' : 'New Group'}
             </Text>
             <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
               {selectedIds.length} / 200,000 {isRTL ? 'عضو' : 'members'}
             </Text>
          </View>
          <View style={{ width: 42 }} />
        </View>

        <View style={[styles.searchBar, { flexDirection: isRTL ? 'row-reverse' : 'row', backgroundColor: colors.card }]}>
          <Iconify icon="solar:magnifer-broken" size={20} color={colors.textSecondary} />
          <TextInput
            placeholder={isRTL ? "افزودن افراد..." : "Add people..."}
            placeholderTextColor={colors.textSecondary}
            style={[styles.searchInput, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {selectedIds.length > 0 && (
        <View style={styles.selectedContainer}>
           <FlatList
             horizontal
             data={selectedMembers}
             keyExtractor={(item) => item.id}
             renderItem={renderSelectedMember}
             showsHorizontalScrollIndicator={false}
             contentContainerStyle={[styles.selectedList, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
           />
        </View>
      )}

      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContact}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {selectedIds.length > 0 && (
        <Animated.View entering={FadeIn} style={[styles.fabContainer, { [isRTL ? 'left' : 'right']: 20 }]}>
           <TouchableOpacity
             style={[styles.fab, { backgroundColor: colors.tint }]}
             onPress={() => router.push({
                 pathname: '/chat/group/create-details',
                 params: { memberIds: selectedIds.join(',') }
             })}
           >
              <Iconify icon={isRTL ? "solar:alt-arrow-left-bold" : "solar:alt-arrow-right-bold"} size={28} color="#fff" />
           </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16, gap: 16 },
  headerTop: { alignItems: 'center', justifyContent: 'space-between' },
  titleContainer: { flex: 1, paddingHorizontal: 12 },
  headerTitle: { fontSize: 18, fontWeight: '900' },
  headerSubtitle: { fontSize: 13, fontWeight: '600' },
  searchBar: { height: 48, borderRadius: 24, paddingHorizontal: 16, alignItems: 'center', gap: 10, borderWidth: 1, borderColor: 'rgba(128,128,128,0.1)' },
  searchInput: { flex: 1, fontSize: 15 },
  selectedContainer: { height: 90, borderBottomWidth: 1, borderBottomColor: 'rgba(128,128,128,0.05)' },
  selectedList: { paddingHorizontal: 16, alignItems: 'center' },
  selectedItem: { width: 70, alignItems: 'center', gap: 4 },
  avatarContainer: { position: 'relative' },
  selectedAvatar: { width: 50, height: 50, borderRadius: 25 },
  removeBadge: { position: 'absolute', bottom: -2, right: -2, width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  selectedName: { fontSize: 11, fontWeight: '600' },
  listContent: { paddingHorizontal: 16, paddingBottom: 100 },
  contactItem: { paddingVertical: 12, alignItems: 'center', gap: 16 },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 54, height: 54, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(128,128,128,0.1)' },
  checkBadge: { position: 'absolute', bottom: -2, right: -2, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  contactInfo: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700' },
  status: { fontSize: 13, fontWeight: '600' },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  fabContainer: { position: 'absolute', bottom: 30, zIndex: 100 },
  fab: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 8, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } }
});
