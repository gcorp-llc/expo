import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore } from '@/hooks/use-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Iconify } from '@/components/ui/Iconify';
import { PageBackground } from '@/components/ui/PageBackground';
import { FloatingIconButton } from '@/components/ui/FloatingIconButton';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function AboutScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language } = useStore();
  const isRTL = language === 'fa';

  const appVersion = '1.0.0 (Build 2025)';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PageBackground />

      <View style={[styles.header, { paddingTop: insets.top + 8, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <FloatingIconButton
          icon={isRTL ? 'solar:alt-arrow-right-broken' : 'solar:alt-arrow-left-broken'}
          onPress={() => router.back()}
        />
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {isRTL ? 'درباره کوتیک' : 'About Kutik'}
        </Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(450)} style={[styles.brandCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.brandIconBox, { backgroundColor: colors.tint + '18' }]}>
            <Iconify icon="solar:bag-smile-bold-duotone" size={54} color={colors.tint} />
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>
            {isRTL ? 'کوتیک | KuTik' : 'KuTik Market'}
          </Text>
          <Text style={[styles.appVersion, { color: colors.textSecondary }]}>
            {isRTL ? `نسخه ${appVersion}` : `Version ${appVersion}`}
          </Text>
          <Text style={[styles.appTagline, { color: colors.tint }]}>
            {isRTL ? 'پلتفرم هوشمند خرید، فروش و گفتگو' : 'Smart Commerce & Messaging Platform'}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(450).delay(100)} style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'معرفی کوتیک' : 'About Kutik'}
          </Text>
          <Text style={[styles.cardBody, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL
              ? 'کوتیک یک سوپراپلیکیشن مدرن تجارت الکترونیک و پیام‌رسانی اختصاصی است که تجربه خرید و فروش آنلاین را با امکانات پیشرفته نظیر حراجی‌های زمانبندی‌شده، خرید اقساطی، گفتگو در لحظه و هوش مصنوعی تلفیق کرده است.'
              : 'KuTik is a next-generation commerce and messaging platform blending seamless online shopping, flexible installments, live seller chat, and AI assistance.'}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(450).delay(200)} style={[styles.featuresCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'امکانات و ویژگی‌ها' : 'Features'}
          </Text>

          {[
            { icon: 'solar:bag-smile-outline', title: isRTL ? 'خرید و فروش بی‌واسطه' : 'Direct Commerce', desc: isRTL ? 'پشتیبانی از فروشگاه‌های اختصاصی با انبارداری زنده' : 'Dedicated storefronts with live stock' },
            { icon: 'solar:wallet-money-broken', title: isRTL ? 'خرید و فروش اقساطی' : 'Installment Sales', desc: isRTL ? 'مدیریت و سررسید اقساط و کیف پول درون‌برنامه‌ای' : 'Flexible installment management and in-app wallet' },
            { icon: 'solar:chat-line-broken', title: isRTL ? 'پیام‌رسان یکپارچه' : 'Integrated Chat', desc: isRTL ? 'گفتگوی مستقیم با خریداران و فروشندگان در لحظه' : 'Direct live chat with buyers and merchants' },
            { icon: 'solar:shield-check-bold', title: isRTL ? 'امنیت و اصالت کالا' : 'Security & Trust', desc: isRTL ? 'ضمانت بازگشت وجه و تایید هویت فروشندگان' : 'Money-back guarantee and verified sellers' },
          ].map((item, idx) => (
            <View key={idx} style={[styles.featureRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={[styles.featureIconBox, { backgroundColor: colors.surface }]}>
                <Iconify icon={item.icon} size={22} color={colors.tint} />
              </View>
              <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </Animated.View>

        <View style={styles.footerNote}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            {isRTL ? 'تمامی حقوق متعلق به کوتیک می‌باشد © ۲۰۲۵' : 'All rights reserved © 2025 KuTik'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingBottom: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 16,
  },
  brandCard: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  brandIconBox: {
    width: 88,
    height: 88,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  appName: {
    fontSize: 22,
    fontWeight: '900',
  },
  appVersion: {
    fontSize: 13,
    fontWeight: '600',
  },
  appTagline: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
    textAlign: 'center',
  },
  infoCard: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    gap: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
  },
  featuresCard: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    gap: 14,
  },
  featureRow: {
    alignItems: 'center',
    gap: 12,
  },
  featureIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  featureDesc: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  footerNote: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
