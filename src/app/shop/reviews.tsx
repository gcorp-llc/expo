import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore } from '@/hooks/use-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Iconify } from '@/components/ui/Iconify';
import { Image } from 'expo-image';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ShopReviewsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language } = useStore();
  const isRTL = language === 'fa';

  const reviews = [
    {
      id: '1',
      user: 'علی محمدی',
      avatar: 'https://i.pravatar.cc/100?u=1',
      rating: 5,
      date: '۲ روز پیش',
      text: 'محصول بسیار با کیفیتی بود، حتما پیشنهاد می‌کنم.',
      product: 'قالب اپلیکیشن فروشگاهی',
      reply: 'خیلی خوشحالم که راضی بودید، علی عزیز!'
    },
    {
      id: '2',
      user: 'مریم رضایی',
      avatar: 'https://i.pravatar.cc/100?u=2',
      rating: 4,
      date: '۱ هفته پیش',
      text: 'طراحی عالیه، فقط اگر کمی فونت‌ها بزرگتر بود بهتر می‌شد.',
      product: 'مجموعه آیکون‌های سه بعدی',
      reply: null
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={[styles.headerContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: colors.surfaceStrong }]}>
            <Iconify icon={isRTL ? "solar:alt-arrow-right-broken" : "solar:alt-arrow-left-broken"} size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {isRTL ? 'نظرات مشتریان' : 'Customer Reviews'}
          </Text>
          <View style={{ width: 45 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {reviews.map((review, index) => (
          <Animated.View
            key={review.id}
            entering={FadeInDown.delay(index * 100)}
            style={[styles.reviewCard, { backgroundColor: colors.surfaceStrong, borderColor: colors.border }]}
          >
            <View style={[styles.reviewHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
               <Image source={{ uri: review.avatar }} style={styles.avatar} />
               <View style={[styles.headerInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                 <Text style={[styles.userName, { color: colors.text }]}>{review.user}</Text>
                 <Text style={[styles.reviewDate, { color: colors.textSecondary }]}>{review.date}</Text>
               </View>
               <View style={[styles.ratingBadge, { backgroundColor: colors.tint + '10', flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                 <Iconify icon="solar:star-bold" size={14} color="#F59E0B" />
                 <Text style={[styles.ratingText, { color: colors.text }]}>{review.rating}</Text>
               </View>
            </View>

            <View style={[styles.productTag, { backgroundColor: colors.background, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
               <Iconify icon="solar:box-broken" size={14} color={colors.textSecondary} />
               <Text style={[styles.productName, { color: colors.textSecondary }]}>{review.product}</Text>
            </View>

            <Text style={[styles.reviewText, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
              {review.text}
            </Text>

            {review.reply ? (
              <View style={[styles.replyContainer, { backgroundColor: colors.background, borderLeftColor: colors.tint, borderLeftWidth: isRTL ? 0 : 3, borderRightColor: colors.tint, borderRightWidth: isRTL ? 3 : 0 }]}>
                <Text style={[styles.replyLabel, { color: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}>{isRTL ? 'پاسخ شما:' : 'Your Reply:'}</Text>
                <Text style={[styles.replyText, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>{review.reply}</Text>
              </View>
            ) : (
              <TouchableOpacity style={[styles.replyBtn, { borderColor: colors.tint }]}>
                <Iconify icon="solar:chat-line-broken" size={18} color={colors.tint} />
                <Text style={[styles.replyBtnText, { color: colors.tint }]}>{isRTL ? 'ارسال پاسخ' : 'Reply'}</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 10 },
  headerContent: { height: 60, alignItems: 'center', justifyContent: 'space-between' },
  iconBtn: { width: 45, height: 45, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800' },
  scrollContent: { padding: 20, gap: 16 },
  reviewCard: { padding: 20, borderRadius: 28, borderWidth: 1, gap: 12 },
  reviewHeader: { gap: 12, alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  headerInfo: { flex: 1, gap: 2 },
  userName: { fontSize: 15, fontWeight: '800' },
  reviewDate: { fontSize: 12 },
  ratingBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 13, fontWeight: '800' },
  productTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, alignSelf: 'flex-start', alignItems: 'center', gap: 6 },
  productName: { fontSize: 11, fontWeight: '700' },
  reviewText: { fontSize: 14, lineHeight: 22, fontWeight: '600' },
  replyContainer: { padding: 12, borderRadius: 12, gap: 4 },
  replyLabel: { fontSize: 12, fontWeight: '800' },
  replyText: { fontSize: 13, fontWeight: '600' },
  replyBtn: { height: 44, borderRadius: 12, borderWith: 1, borderStyle: 'dashed', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1 },
  replyBtnText: { fontSize: 14, fontWeight: '800' },
});
