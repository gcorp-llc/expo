import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Dimensions, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore } from '@/hooks/use-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Iconify } from '@/components/ui/Iconify';
import { Image } from 'expo-image';


const { width } = Dimensions.get('window');

const PERMISSIONS = [
  { id: 'products', label: 'مدیریت محصولات', icon: 'solar:box-broken' },
  { id: 'orders', label: 'مشاهده سفارشات', icon: 'solar:bag-heart-broken' },
  { id: 'chat', label: 'پاسخگویی چت', icon: 'solar:chat-line-broken' },
  { id: 'finance', label: 'دسترسی مالی', icon: 'solar:wallet-money-broken' },
];

export default function StaffManagementScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language, shop, addStaff, removeStaff, updateStaff } = useStore();
  const isRTL = language === 'fa';

  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addingPhone, setAddingPhone] = useState('');

  const filteredStaff = shop.staff.filter(s =>
    s.name.includes(searchQuery) ||
    s.phoneNumber.includes(searchQuery) ||
    s.role.includes(searchQuery)
  );

  const togglePermission = (staffId: string, permId: string) => {
    const staff = shop.staff.find(s => s.id === staffId);
    if (!staff) return;

    let newPermissions;
    if (staff.permissions.includes(permId)) {
      newPermissions = staff.permissions.filter(p => p !== permId);
    } else {
      newPermissions = [...staff.permissions, permId];
    }
    updateStaff(staffId, { permissions: newPermissions });
  };

  const StaffItem = ({ item }: { item: any }) => (
    <View style={[styles.staffItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.staffMain, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Image source={{ uri: item.avatar }} style={styles.staffAvatar} />
        <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
          <Text style={[styles.staffName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.staffRole, { color: colors.tint }]}>{item.role}</Text>
          <Text style={[styles.staffPhone, { color: colors.textSecondary }]}>{item.phoneNumber}</Text>
        </View>
        <TouchableOpacity onPress={() => removeStaff(item.id)} style={styles.deleteStaffBtn}>
          <Iconify icon="solar:user-broken" size={20} color={colors.destructive} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.permTitle, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
        {isRTL ? 'سطوح دسترسی:' : 'Permissions:'}
      </Text>

      <View style={[styles.permissionsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        {PERMISSIONS.map((p) => {
          const isGranted = item.permissions.includes(p.id);
          return (
            <TouchableOpacity
              key={p.id}
              onPress={() => togglePermission(item.id, p.id)}
              style={[
                styles.pBadge,
                {
                  backgroundColor: isGranted ? colors.tint + '20' : colors.surfaceStrong,
                  borderColor: isGranted ? colors.tint : 'transparent',
                  borderWidth: 1
                }
              ]}
            >
              <Iconify icon={p.icon} size={12} color={isGranted ? colors.tint : colors.textSecondary} />
              <Text style={[styles.pBadgeText, { color: isGranted ? colors.tint : colors.textSecondary }]}>{p.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top, borderBottomColor: colors.border }]}>
        <View style={[styles.headerContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Iconify icon={isRTL ? "solar:alt-arrow-right-broken" : "solar:alt-arrow-left-broken"} size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {isRTL ? 'کارکنان فروشگاه' : 'Shop Staff'}
          </Text>
          <TouchableOpacity onPress={() => setIsAdding(true)} style={[styles.addBtn, { backgroundColor: colors.tint }]}>
            <Iconify icon="solar:user-broken" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={[styles.searchWrapper, { backgroundColor: colors.card, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Iconify icon="solar:magnifer-broken" size={20} color={colors.textSecondary} />
          <TextInput
            placeholder={isRTL ? 'جستجوی نام، آیدی یا شماره...' : 'Search name, ID or phone...'}
            style={[styles.searchInput, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
            placeholderTextColor={colors.textSecondary + '80'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.qrBtn}>
            <Iconify icon="solar:widget-2-broken" size={20} color={colors.tint} />
          </TouchableOpacity>
        </View>

        <View style={styles.staffList}>
          {filteredStaff.map(member => (
            <StaffItem key={member.id} item={member} />
          ))}
        </View>

        {filteredStaff.length === 0 && (
          <View style={styles.emptyState}>
            <Iconify icon="solar:user-broken" size={64} color={colors.textSecondary + '40'} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {searchQuery ? (isRTL ? 'نتیجه‌ای یافت نشد' : 'No results found') : (isRTL ? 'هنوز کارمندی اضافه نشده است' : 'No staff members added yet')}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add Staff Modal */}
      {isAdding && (
        <View style={StyleSheet.absoluteFill}>
          <View intensity={20} style={StyleSheet.absoluteFill} />
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setIsAdding(false)} />
          <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
             <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>{isRTL ? 'افزودن نیروی جدید' : 'Add New Staff'}</Text>
                <TouchableOpacity onPress={() => setIsAdding(false)}>
                  <Iconify icon="solar:close-circle-broken" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
             </View>
             <View style={styles.modalContent}>
                <View style={[styles.boxedInput, { backgroundColor: colors.surfaceStrong }]}>
                    <TextInput
                        placeholder={isRTL ? 'شماره تماس یا آیدی را وارد کنید' : 'Enter phone or ID'}
                        style={[styles.input, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
                        placeholderTextColor={colors.textSecondary}
                        value={addingPhone}
                        onChangeText={setAddingPhone}
                    />
                </View>
                <TouchableOpacity
                    style={[styles.primaryBtn, { backgroundColor: colors.tint }]}
                    onPress={() => {
                        addStaff({
                            id: Math.random().toString(),
                            name: addingPhone.includes('@') ? addingPhone : 'کاربر جدید',
                            role: 'فروشنده',
                            phoneNumber: addingPhone.includes('09') ? addingPhone : '۰۹۳۰******',
                            avatar: 'https://i.pravatar.cc/150?u=' + Math.random(),
                            permissions: ['products']
                        });
                        setAddingPhone('');
                        setIsAdding(false);
                    }}
                >
                    <Text style={styles.primaryBtnText}>{isRTL ? 'جستجو و افزودن' : 'Search & Add'}</Text>
                </TouchableOpacity>

                <View style={{ alignItems: 'center', gap: 12, marginTop: 10 }}>
                    <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{isRTL ? 'یا اسکن کد QR مخصوص' : 'Or scan unique QR code'}</Text>
                    <TouchableOpacity style={[styles.qrScanBtn, { borderColor: colors.tint }]}>
                        <Iconify icon="solar:widget-2-broken" size={32} color={colors.tint} />
                    </TouchableOpacity>
                </View>
             </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { borderBottomWidth: 1 },
  headerContent: { height: 70, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  addBtn: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 16, gap: 16 },
  searchWrapper: { height: 56, borderRadius: 18, paddingHorizontal: 16, alignItems: 'center', gap: 12 },
  searchInput: { flex: 1, fontSize: 14, fontWeight: '600' },
  qrBtn: { padding: 4 },
  staffList: { gap: 12 },
  staffItem: { padding: 16, borderRadius: 24, borderWidth: 1, gap: 12 },
  staffMain: { alignItems: 'center', gap: 12 },
  staffAvatar: { width: 56, height: 56, borderRadius: 28 },
  staffName: { fontSize: 16, fontWeight: '800' },
  staffRole: { fontSize: 13, fontWeight: '700' },
  staffPhone: { fontSize: 12, fontWeight: '600' },
  deleteStaffBtn: { padding: 8 },
  permTitle: { fontSize: 11, fontWeight: '700', marginTop: 4 },
  permissionsRow: { flexWrap: 'wrap', gap: 8 },
  pBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, gap: 4 },
  pBadgeText: { fontSize: 10, fontWeight: '700' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80, gap: 16 },
  emptyText: { fontSize: 15, fontWeight: '600' },
  modalContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 60, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: '800' },
  modalContent: { gap: 16 },
  boxedInput: { height: 56, borderRadius: 16, paddingHorizontal: 16, justifyContent: 'center' },
  input: { fontSize: 15, fontWeight: '600' },
  primaryBtn: { height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  qrScanBtn: { width: 64, height: 64, borderRadius: 20, borderWidth: 2, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
});
