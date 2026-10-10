import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Iconify } from '@/components/ui/Iconify';

const { width } = Dimensions.get('window');
const ITEM_WIDTH_GRID = (width - Spacing.lg * 2 - Spacing.md * 2) / 3;
const ITEM_WIDTH_WIDE = (width - Spacing.lg * 2 - Spacing.md) / 2;

interface QuickActionsProps {
  isRTL: boolean;
  mode?: 'own' | 'readonly';
  userId?: string;
}

export const QuickActions = ({ isRTL, mode = 'own', userId }: QuickActionsProps) => {
  const router = useRouter();
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];

  const isOwn = mode === 'own';

  const ownActions = [
    { label: isRTL ? 'محصولات' : 'Products', icon: 'solar:box-broken', color: '#6366F1', route: '/settings/my-products' },
    { label: isRTL ? 'سفارشات' : 'Orders', icon: 'solar:bag-2-broken', color: '#EC4899', route: '/settings/orders' },
    { label: isRTL ? 'علاقه‌مندی' : 'Wishlist', icon: 'solar:heart-broken', color: '#F43F5E', route: '/(tabs)/favorites' },
    { label: isRTL ? 'آنالیز' : 'Analytics', icon: 'solar:graph-up-broken', color: '#8B5CF6', route: '/settings/analytics' },
    { label: isRTL ? 'مالی' : 'Finance', icon: 'solar:wallet-money-broken', color: '#10B981', route: '/settings/finance' },
    { label: isRTL ? 'نظرات' : 'Reviews', icon: 'solar:chat-line-broken', color: '#F59E0B', route: '/shop/reviews' },
  ];

  // TODO: replace with real cross-reference logic once real order/favorites data exists
  const readonlyActions = [
    {
      label: isRTL ? 'علاقه‌مندی‌های مشترک' : 'Mutual Favorites',
      icon: 'solar:heart-broken',
      color: '#F43F5E',
      route: '/(tabs)/favorites' // In a real app, this would filter by the user
    },
    {
      label: isRTL ? 'مشاهده فروشگاه' : 'View Shop',
      icon: 'solar:shop-broken',
      color: '#6366F1',
      route: `/shop/${userId || '1'}`
    },
  ];

  const actions = isOwn ? ownActions : readonlyActions;

  return (
    <View style={[styles.container, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
      {actions.map((action, i) => (
        <TouchableOpacity
          key={i}
          style={[
            styles.actionCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              width: isOwn ? ITEM_WIDTH_GRID : ITEM_WIDTH_WIDE
            }
          ]}
          activeOpacity={0.7}
          onPress={() => router.push(action.route as any)}
        >
          <View style={[styles.iconWrapper, { backgroundColor: action.color + '10' }]}>
            <Iconify icon={action.icon} size={24} color={action.color} />
          </View>
          <Text
            style={[styles.label, { color: colors.text }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {action.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  actionCard: {
    height: 94,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
});
