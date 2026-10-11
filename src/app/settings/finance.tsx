import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Dimensions } from 'react-native';
import { useModalStore } from '@/hooks/use-modal-store';
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
  const showModal = useModalStore((state) => state.showModal);
  const { language, finance, updateFinance } = useStore();
  const isRTL = language === 'fa';

  const [iban, setIban] = useState(finance.iban);
  const [isEditingIban, setIsEditingIban] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'sales' | 'payouts' | 'fees'>('all');

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString(isRTL ? 'fa-IR' : 'en-US');
  };

  const handleSaveIban = () => {
    updateFinance({ iban });
    setIsEditingIban(false);
    showModal({
      title: isRTL ? 'شماره شبا بروزرسانی شد' : 'IBAN Updated',
      message: isRTL ? 'شماره شبای حساب مقصد با موفقیت ذخیره گردید.' : 'Target IBAN saved successfully.',
      icon: 'solar:check-circle-bold',
      buttons: [{ text: isRTL ? 'باشه' : 'OK', style: 'primary' }]
    });
  };

  const handleWithdraw = () => {
    showModal({
      title: isRTL ? 'درخواست تسویه حساب سریع' : 'Instant Settlement Request',
      message: isRTL
        ? `آیا مایل به تسویه و واریز مبلغ ${formatCurrency(finance.balance)} تومان به شماره شبای ${iban} هستید؟`
        : `Are you sure you want to withdraw ${formatCurrency(finance.balance)} to IBAN ${iban}?`,
      icon: 'solar:wallet-money-broken',
      iconColor: colors.tint,
      buttons: [
        { text: isRTL ? 'انصراف' : 'Cancel', style: 'cancel' },
        {
          text: isRTL ? 'تایید و درخواست تسویه' : 'Confirm & Payout',
          style: 'primary',
          onPress: () => {
            showModal({
              title: isRTL ? 'درخواست ثبت شد 🎉' : 'Request Submitted 🎉',
              message: isRTL
                ? 'درخواست تسویه حساب شما با موفقیت ثبت شد و ظرف ۲ ساعت آینده به شماره شبای مقصد واریز می‌شود.'
                : 'Payout request submitted successfully.',
              icon: 'solar:check-circle-bold',
              buttons: [{ text: isRTL ? 'متوجه شدم' : 'Understood', style: 'primary' }]
            });
          }
        }
      ]
    });
  };

  const handleExportReport = () => {
    showModal({
      title: isRTL ? 'دریافت گزارش جامع مالی' : 'Export Financial Statement',
      message: isRTL ? 'گزارش مالی ماه جاری به‌صورت فایل PDF آماده گردید.' : 'Financial statement generated.',
      icon: 'solar:document-text-broken',
      buttons: [{ text: isRTL ? 'دانلود گزارش' : 'Download PDF', style: 'primary' }]
    });
  };

  const handleFeeDetails = () => {
    showModal({
      title: isRTL ? 'شفافیت کارمزد و مالیات' : 'Fees & Tax Policy',
      message: isRTL
        ? 'کارمزد ثابت فروشگاه کوتیک تنها ۲.۵٪ برای هر تراکنش موفق است و هیچ هزینه پنهان دیگری کسر نمی‌گردد.'
        : 'Flat 2.5% platform fee per successful order.',
      icon: 'solar:info-circle-bold',
      buttons: [{ text: isRTL ? 'متوجه شدم' : 'OK', style: 'primary' }]
    });
  };

  const chartData = {
    labels: isRTL ? ["شنبه", "۱شنبه", "۲شنبه", "۳شنبه", "۴شنبه", "۵شنبه", "جمعه"] : ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 50],
        color: () => colors.tint,
        strokeWidth: 3
      }
    ],
  };

  const transactions = [
    { id: '1', type: 'sales', titleFa: 'واریز فروش سفارش #۱۰۴۸', titleEn: 'Sale Deposit #1048', date: '۱۴۰۲/۰۷/۲۰', amount: 4500000, positive: true },
    { id: '2', type: 'payouts', titleFa: 'تسویه حساب به کارت بانک ملت', titleEn: 'Bank Settlement Payout', date: '۱۴۰۲/۰۷/۱۹', amount: 12000000, positive: false },
    { id: '3', type: 'fees', titleFa: 'کارمزد زیرساخت فروشگاهی (۲.۵٪)', titleEn: 'Platform Commission Fee', date: '۱۴۰۲/۰۷/۱۸', amount: 112500, positive: false },
    { id: '4', type: 'sales', titleFa: 'واریز فروش سفارش #۱۰۴۷', titleEn: 'Sale Deposit #1047', date: '۱۴۰۲/۰۷/۱۷', amount: 8900000, positive: true },
  ];

  const filteredTransactions = transactions.filter(t => selectedFilter === 'all' || t.type === selectedFilter);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PageBackground />

      {/* Coordinated Standard Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={[styles.headerContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.floatingHeaderBtn} activeOpacity={0.8}>
            <Iconify icon={isRTL ? "solar:alt-arrow-right-broken" : "solar:alt-arrow-left-broken"} size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {isRTL ? 'امور مالی و کیف‌پول' : 'Finance Dashboard'}
          </Text>
          <TouchableOpacity onPress={handleExportReport} style={styles.floatingHeaderBtn} activeOpacity={0.8}>
            <Iconify icon="solar:download-broken" size={22} color={colors.tint} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Wallet Summary Card */}
        <Animated.View entering={FadeInUp.delay(100)} style={[styles.balanceCard, { backgroundColor: colors.tint }]}>
          <View style={[styles.balanceHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={styles.balanceLabel}>{isRTL ? 'موجودی کل قابل تسویه' : 'Available Balance'}</Text>
            <View style={styles.walletBadge}>
              <Iconify icon="solar:wallet-money-bold" size={18} color="#fff" />
            </View>
          </View>
          <View style={[styles.balanceRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={styles.balanceValue}>{formatCurrency(finance.balance)}</Text>
            <Text style={styles.currency}>{isRTL ? 'تومان' : 'TOMAN'}</Text>
          </View>

          <View style={[styles.cardDivider, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />

          <View style={[styles.balanceSubRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={{ alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
              <Text style={styles.subLabel}>{isRTL ? 'در انتظار تسویه (پایا)' : 'Pending Payout'}</Text>
              <Text style={styles.subValue}>{formatCurrency(3500000)} {isRTL ? 'تومان' : 'TOMAN'}</Text>
            </View>
            <View style={{ alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
              <Text style={styles.subLabel}>{isRTL ? 'سود خالص این ماه' : 'Net Profit (Month)'}</Text>
              <Text style={styles.subValue}>{formatCurrency(18200000)} {isRTL ? 'تومان' : 'TOMAN'}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.withdrawBtn} onPress={handleWithdraw} activeOpacity={0.88}>
            <Iconify icon="solar:card-transfer-broken" size={20} color={colors.tint} />
            <Text style={[styles.withdrawText, { color: colors.tint }]}>{isRTL ? 'تسویه حساب فوری و واریز به شبا' : 'Instant Settlement'}</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Quick Actions Grid */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={[styles.actionTile, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => setIsEditingIban(prev => !prev)}
            activeOpacity={0.8}
          >
            <View style={[styles.actionTileIcon, { backgroundColor: colors.tint + '15' }]}>
              <Iconify icon="solar:card-send-broken" size={22} color={colors.tint} />
            </View>
            <Text style={[styles.actionTileTitle, { color: colors.text }]}>{isRTL ? 'مدیریت شبا' : 'Manage IBAN'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionTile, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={handleExportReport}
            activeOpacity={0.8}
          >
            <View style={[styles.actionTileIcon, { backgroundColor: colors.success + '15' }]}>
              <Iconify icon="solar:document-text-broken" size={22} color={colors.success} />
            </View>
            <Text style={[styles.actionTileTitle, { color: colors.text }]}>{isRTL ? 'گزارش مالی PDF' : 'Tax & PDF Report'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionTile, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={handleFeeDetails}
            activeOpacity={0.8}
          >
            <View style={[styles.actionTileIcon, { backgroundColor: colors.warning + '15' }]}>
              <Iconify icon="solar:info-circle-broken" size={22} color={colors.warning} />
            </View>
            <Text style={[styles.actionTileTitle, { color: colors.text }]}>{isRTL ? 'تعرفه کارمزد (۲.۵٪)' : '2.5% Fee Details'}</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* IBAN Section */}
        <View style={[styles.infoSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={styles.sectionHeaderLeft}>
              <Iconify icon="solar:card-2-broken" size={20} color={colors.tint} />
              <Text style={[styles.infoTitle, { color: colors.text }]}>{isRTL ? 'شماره شبا مقصد واریز' : 'Destination IBAN'}</Text>
            </View>
            <TouchableOpacity onPress={() => isEditingIban ? handleSaveIban() : setIsEditingIban(true)}>
              <Text style={[styles.editBtn, { color: colors.tint }]}>
                {isEditingIban ? (isRTL ? 'ذخیره' : 'Save') : (isRTL ? 'ویرایش' : 'Edit')}
              </Text>
            </TouchableOpacity>
          </View>
          {isEditingIban ? (
            <TextInput
              style={[styles.ibanInput, { color: colors.text, borderColor: colors.tint, backgroundColor: colors.surface, textAlign: isRTL ? 'right' : 'left' }]}
              value={iban}
              onChangeText={setIban}
              placeholder="IR..."
              autoFocus
            />
          ) : (
            <Text style={[styles.ibanValue, { color: colors.textSecondary }]}>{iban}</Text>
          )}
        </View>

        {/* Analytics Chart */}
        <View style={[styles.chartSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'نمودار فروش و درآمد هفتگی' : 'Weekly Revenue Trend'}
          </Text>
          <LineChart
            data={chartData}
            width={width - 72}
            height={190}
            chartConfig={{
              backgroundColor: colors.card,
              backgroundGradientFrom: colors.card,
              backgroundGradientTo: colors.card,
              decimalPlaces: 0,
              color: () => colors.tint,
              labelColor: () => colors.textSecondary,
              style: { borderRadius: 18 },
              propsForDots: { r: "5", strokeWidth: "2", stroke: colors.tint }
            }}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Transactions Section with Filter Chips */}
        <View style={styles.transSection}>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {isRTL ? 'تراکنش‌ها و صورت‌حساب‌ها' : 'Transaction History'}
            </Text>
          </View>

          {/* Filter Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.filterChips, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            {[
              { id: 'all', labelFa: 'همه', labelEn: 'All' },
              { id: 'sales', labelFa: 'فروش', labelEn: 'Sales' },
              { id: 'payouts', labelFa: 'برداشت‌ها', labelEn: 'Payouts' },
              { id: 'fees', labelFa: 'کارمزدها', labelEn: 'Fees' },
            ].map((chip) => {
              const isActive = selectedFilter === chip.id;
              return (
                <TouchableOpacity
                  key={chip.id}
                  onPress={() => setSelectedFilter(chip.id as any)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isActive ? colors.tint : colors.surfaceStrong,
                      borderColor: isActive ? colors.tint : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.chipText, { color: isActive ? '#fff' : colors.text }]}>
                    {isRTL ? chip.labelFa : chip.labelEn}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {filteredTransactions.map((item, index) => (
            <Animated.View
              entering={FadeInDown.delay(300 + index * 80)}
              key={item.id}
              style={[styles.transaction, { backgroundColor: colors.surfaceStrong, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            >
              <View style={[styles.transIcon, { backgroundColor: item.positive ? colors.success + '15' : colors.destructive + '15' }]}>
                <Iconify
                  icon={item.positive ? "solar:graph-up-broken" : "solar:minus-square-broken"}
                  size={22}
                  color={item.positive ? colors.success : colors.destructive}
                />
              </View>
              <View style={[styles.transInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                <Text style={[styles.transTitle, { color: colors.text }]}>
                  {isRTL ? item.titleFa : item.titleEn}
                </Text>
                <Text style={[styles.transDate, { color: colors.textSecondary }]}>{item.date}</Text>
              </View>
              <Text style={[styles.transAmount, { color: item.positive ? colors.success : colors.text }]}>
                {item.positive ? '+' : '-'}{formatCurrency(item.amount)}
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
  header: { backgroundColor: 'transparent', paddingHorizontal: 16 },
  headerContent: { height: 52, alignItems: 'center', justifyContent: 'space-between' },
  floatingHeaderBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  scrollContent: { padding: 16, gap: 16, paddingBottom: 60 },

  balanceCard: { padding: 24, borderRadius: 28, elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16, gap: 12 },
  balanceHeader: { justifyContent: 'space-between', alignItems: 'center' },
  balanceLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '700' },
  walletBadge: { width: 32, height: 32, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  balanceRow: { alignItems: 'baseline', gap: 8 },
  balanceValue: { color: '#fff', fontSize: 34, fontWeight: '900' },
  currency: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '700' },
  cardDivider: { height: 1, marginVertical: 4 },
  balanceSubRow: { justifyContent: 'space-between', alignItems: 'center' },
  subLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '600' },
  subValue: { color: '#fff', fontSize: 14, fontWeight: '800', marginTop: 2 },
  withdrawBtn: { backgroundColor: '#fff', height: 48, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 6 },
  withdrawText: { fontWeight: '800', fontSize: 14 },

  quickActionsGrid: { flexDirection: 'row', gap: 10 },
  actionTile: { flex: 1, padding: 14, borderRadius: 20, borderWidth: 1, alignItems: 'center', gap: 8 },
  actionTileIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  actionTileTitle: { fontSize: 11, fontWeight: '800', textAlign: 'center' },

  infoSection: { padding: 18, borderRadius: 24, gap: 10, borderWidth: 1 },
  sectionHeader: { justifyContent: 'space-between', alignItems: 'center' },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoTitle: { fontSize: 14, fontWeight: '800' },
  editBtn: { fontSize: 13, fontWeight: '800' },
  ibanInput: { height: 46, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, fontSize: 13, fontWeight: '600' },
  ibanValue: { fontSize: 15, fontWeight: '800', letterSpacing: 0.5 },

  chartSection: { padding: 16, borderRadius: 24, borderWidth: 1, gap: 10 },
  chart: { borderRadius: 16, marginTop: 4 },

  transSection: { gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '800' },
  filterChips: { gap: 8, paddingBottom: 4 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
  chipText: { fontSize: 12, fontWeight: '800' },

  transaction: { padding: 14, borderRadius: 20, alignItems: 'center', gap: 12, borderWidth: 1 },
  transIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  transInfo: { flex: 1, gap: 2 },
  transTitle: { fontSize: 14, fontWeight: '700' },
  transDate: { fontSize: 11 },
  transAmount: { fontSize: 15, fontWeight: '800' },
});
