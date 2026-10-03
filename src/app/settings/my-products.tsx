import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore } from '@/hooks/use-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Iconify } from '@/components/ui/Iconify';
import { PRODUCTS } from '@/constants/mock-data';
import { Image } from 'expo-image';
import { PageBackground } from '@/components/ui/PageBackground';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { FloatingIconButton } from '@/components/ui/FloatingIconButton';

export default function MyProductsScreen() {
  const router = useRouter();
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language } = useStore();
  const isRTL = language === 'fa';

  const renderItem = ({ item, index }: any) => (
    <Animated.View
      entering={FadeInDown.delay(100 * index).duration(500)}
      style={[styles.itemCard, { backgroundColor: colors.surfaceStrong, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
    >
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={[styles.itemInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
        <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.itemStock, { color: colors.textSecondary }]}>{isRTL ? 'موجودی: ۱۰' : 'Stock: 10'}</Text>
        <Text style={[styles.itemPrice, { color: colors.tint }]}>${item.price}</Text>
      </View>
      <TouchableOpacity style={styles.editBtn}>
        <Iconify icon="solar:pen-new-square-broken" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PageBackground />

      {/* Floating Header */}
      <View style={[styles.floatingHeader, { top: insets.top + 10, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <FloatingIconButton
          icon={isRTL ? "solar:alt-arrow-right-broken" : "solar:alt-arrow-left-broken"}
          onPress={() => router.back()}
        />

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {isRTL ? 'محصولات من' : 'My Products'}
        </Text>

        <FloatingIconButton
          icon="solar:add-square-broken"
          onPress={() => {}}
          color={colors.tint}
        />
      </View>

      <FlatList
        data={PRODUCTS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[styles.listContent, { paddingTop: insets.top + 80, paddingBottom: 40 }]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  floatingHeader: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  floatingBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  listContent: { paddingHorizontal: 20 },
  itemCard: {
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  itemImage: { width: 70, height: 70, borderRadius: 14 },
  itemInfo: { flex: 1, marginHorizontal: 16 },
  itemName: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  itemStock: { fontSize: 13, marginBottom: 4 },
  itemPrice: { fontSize: 15, fontWeight: '900' },
  editBtn: { padding: 8 },
});
