import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Alert, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore } from '@/hooks/use-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Iconify } from '@/components/ui/Iconify';
import { PageBackground } from '@/components/ui/PageBackground';
import { LineChart } from 'react-native-chart-kit';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function FinanceScreen() {
  const router = useRouter();
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language, finance, updateFinance } = useStore();
  const isRTL = language === 'fa';

  const [iban, setIban] = useState(finance.iban);
  const [isEditingIban, setIsEditingIban] = useState(false);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString(isRTL ? 'fa-IR' : 'en-US');
  };

  const handleSaveIban = () => {
    updateFinance({ iban });
    setIsEditingIban(false);
  };

  const handleWithdraw = () => {
    const title = isRTL ? 'درخواست برداشت' : 'Withdrawal Request';
    const message = isRTL
      ? `آیا مایل به برداشت مبلغ ${formatCurrency(finance.balance)} تومان به شماره شبای ${iban} هستید؟`
      : `Are you sure you want to withdraw ${formatCurrency(finance.balance)} to IBAN ${iban}?`;

    Alert.alert(title, message, [
      { text: isRTL ? 'انصراف' : 'Cancel', style: 'cancel' },
      { text: isRTL ? 'تایید' : 'Confirm', onPress: () => {
        Alert.alert(isRTL ? 'موفق' : 'Success', isRTL ? 'درخواست شما ثبت شد.' : 'Your request has been submitted.');
      }}
    ]);
  };

  const chartData = {
    labels: isRTL ? ["شنبه", "۱شنبه", "۲شنبه", "۳شنبه", "۴شنبه", "۵شنبه", "جمعه"] : ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 50],
        color: (opacity = 1) => colors.tint,
        strokeWidth: 3
      }
    ],
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PageBackground />

      {/* Floating Header */}
      <View style={[styles.floatingHeader, { top: insets.top + 10, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.floatingBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Iconify icon={isRTL ? "solar:alt-arrow-right-broken" : "solar:alt-arrow-left-broken"} size={22} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {isRTL ? 'مدیریت مالی' : 'Finance'}
        </Text>

        <TouchableOpacity
          onPress={() => {}}
          style={[styles.floatingBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Iconify icon="solar:history-broken" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Wallet Card */}
        <Animated.View entering={FadeInUp.delay(200)} style={[styles.balanceCard, { backgroundColor: colors.tint }]}>
          <View style={styles.balanceHeader}>
             <Text style={styles.balanceLabel}>{isRTL ? 'موجودی کل' : 'Total Balance'}</Text>
             <Iconify icon="solar:wallet-money-broken" size={24} color="rgba(255,255,255,0.7)" />
          </View>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceValue}>{formatCurrency(finance.balance)}</Text>
            <Text style={styles.currency}>{isRTL ? 'تومان' : 'TOMAN'}</Text>
          </View>
          <TouchableOpacity style={styles.withdrawBtn} onPress={handleWithdraw} activeOpacity={0.9}>
            <Text style={[styles.withdrawText, { color: colors.tint }]}>{isRTL ? 'تسویه حساب سریع' : 'Quick Settlement'}</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Analytics Chart */}
        <View style={styles.chartSection}>
           <Text style={[styles.sectionTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
             {isRTL ? 'روند درآمد هفتگی' : 'Weekly Income Trend'}
           </Text>
           <LineChart
            data={chartData}
            width={width - 40}
            height={220}
            chartConfig={{
              backgroundColor: colors.background,
              backgroundGradientFrom: colors.surfaceStrong,
              backgroundGradientTo: colors.surfaceStrong,
              decimalPlaces: 0,
              color: (opacity = 1) => colors.tint,
              labelColor: (opacity = 1) => colors.textSecondary,
              style: { borderRadius: 24 },
              propsForDots: { r: "6", strokeWidth: "2", stroke: colors.tint }
            }}
            bezier
            style={styles.chart}
          />
        </View>

        {/* IBAN Section */}
        <View style={[styles.infoSection, { backgroundColor: colors.surfaceStrong, borderColor: colors.border }]}>
          <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={styles.sectionHeaderLeft}>
               <Iconify icon="solar:globus-broken" size={20} color={colors.tint} />
               <Text style={[styles.infoTitle, { color: colors.text }]}>{isRTL ? 'شماره شبا مقصد' : 'Target IBAN'}</Text>
            </View>
            <TouchableOpacity onPress={() => isEditingIban ? handleSaveIban() : setIsEditingIban(true)}>
              <Text style={[styles.editBtn, { color: colors.tint }]}>
                {isEditingIban ? (isRTL ? 'ذخیره' : 'Save') : (isRTL ? 'تغییر' : 'Change')}
              </Text>
            </TouchableOpacity>
          </View>
          {isEditingIban ? (
            <TextInput
              style={[styles.ibanInput, { color: colors.text, borderColor: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}
              value={iban}
              onChangeText={setIban}
              placeholder="IR..."
              autoFocus
            />
          ) : (
            <Text style={[styles.ibanValue, { color: colors.textSecondary }]}>{iban}</Text>
          )}
        </View>

        {/* Transactions */}
        <View style={styles.transSection}>
          <Text style={[styles.sectionTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'تراکنش‌های اخیر' : 'Recent Transactions'}
          </Text>
          {[1, 2, 3].map((i, index) => (
            <Animated.View
              entering={FadeInDown.delay(400 + index * 100)}
              key={i}
              style={[styles.transaction, { backgroundColor: colors.surfaceStrong, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            >
              <View style={[styles.transIcon, { backgroundColor: i % 2 === 0 ? colors.success + '15' : colors.destructive + '15' }]}>
                <Iconify icon={i % 2 === 0 ? "solar:graph-up-broken" : "solar:minus-square-broken"} size={22} color={i % 2 === 0 ? colors.success : colors.destructive} />
              </View>
              <View style={[styles.transInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                <Text style={[styles.transTitle, { color: colors.text }]}>{i % 2 === 0 ? (isRTL ? 'واریز فروش' : 'Sales Deposit') : (isRTL ? 'برداشت موجودی' : 'Withdrawal')}</Text>
                <Text style={[styles.transDate, { color: colors.textSecondary }]}>۱۴۰۲/۰۷/{20 - i}</Text>
              </View>
              <Text style={[styles.transAmount, { color: i % 2 === 0 ? colors.success : colors.text }]}>
                {i % 2 === 0 ? '+' : '-'}{formatCurrency(120000 * i)}
              </Text>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
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
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  balanceCard: { padding: 28, borderRadius: 32, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20 },
  balanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '600' },
  balanceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 24 },
  balanceValue: { color: '#fff', fontSize: 38, fontWeight: '900' },
  currency: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '700' },
  withdrawBtn: { backgroundColor: '#fff', height: 55, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  withdrawText: { fontWeight: '800', fontSize: 16 },
  chartSection: { marginTop: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '900', marginBottom: 16 },
  chart: { borderRadius: 24, marginTop: 8 },
  infoSection: { marginTop: 32, padding: 20, borderRadius: 24, gap: 12, borderWidth: 1 },
  sectionHeader: { justifyContent: 'space-between', alignItems: 'center' },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoTitle: { fontSize: 15, fontWeight: '700' },
  editBtn: { fontSize: 14, fontWeight: '700' },
  ibanInput: { height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 14, fontWeight: '600' },
  ibanValue: { fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  transSection: { marginTop: 32 },
  transaction: { padding: 16, borderRadius: 20, alignItems: 'center', gap: 12, marginBottom: 12, borderWidth: 1 },
  transIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  transInfo: { flex: 1, gap: 2 },
  transTitle: { fontSize: 15, fontWeight: '700' },
  transDate: { fontSize: 12 },
  transAmount: { fontSize: 16, fontWeight: '800' },
});
