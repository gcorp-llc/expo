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
import { FloatingIconButton } from '@/components/ui/FloatingIconButton';
import { LineChart } from 'react-native-chart-kit';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function FinanceScreen() {
  const router = useRouter();
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const showModal = useModalStore((state) => state.showModal);
  const { language, finance, updateFinance, payInstallment, rechargeWallet } = useStore();
  const isRTL = language === 'fa';

  const [iban, setIban] = useState(finance.iban);
  const [isEditingIban, setIsEditingIban] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'sales' | 'payouts' | 'fees' | 'installment' | 'topup'>('all');
  const [isTopUpModalVisible, setIsTopUpModalVisible] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('1000000');
  const [installmentPerspective, setInstallmentPerspective] = useState<'buyer' | 'seller'>('buyer');
  const [activeInstallmentTab, setActiveInstallmentTab] = useState<'all' | 'paid' | 'remaining' | 'due' | 'overdue'>('all');
  const [selectedInstallmentPlan, setSelectedInstallmentPlan] = useState<any | null>(null);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString(isRTL ? 'fa-IR' : 'en-US');
  };

  const handleTopUpWallet = () => {
    const num = parseInt(topUpAmount.replace(/[^0-9]/g, ''), 10);
    if (!num || num <= 0) return;
    rechargeWallet(num);
    setIsTopUpModalVisible(false);
    showModal({
      title: isRTL ? 'کیف پول شارژ شد 🎉' : 'Wallet Recharged 🎉',
      message: isRTL
        ? `مبلغ ${formatCurrency(num)} تومان با موفقیت از طریق درگاه بانکی به موجودی کیف پول شما افزوده شد.`
        : `Successfully recharged ${formatCurrency(num)} TOMAN to your wallet.`,
      icon: 'solar:check-circle-bold',
      buttons: [{ text: isRTL ? 'متوجه شدم' : 'OK', style: 'primary' }]
    });
  };

  const handlePayInstallmentItem = (installmentId: string, item: any) => {
    showModal({
      title: isRTL ? 'پرداخت قسط' : 'Pay Installment',
      message: isRTL
        ? `آیا از پرداخت قسط شماره ${item.number} به مبلغ ${formatCurrency(item.amount)} تومان از موجودی کیف پول خود اطمینان دارید؟`
        : `Are you sure you want to pay installment #${item.number} for ${formatCurrency(item.amount)} TOMAN using your wallet balance?`,
      icon: 'solar:card-transfer-broken',
      iconColor: colors.tint,
      buttons: [
        { text: isRTL ? 'انصراف' : 'Cancel', style: 'cancel' },
        {
          text: isRTL ? 'تایید و پرداخت' : 'Confirm & Pay',
          style: 'primary',
          onPress: () => {
            const res = payInstallment(installmentId, item.number);
            if (res.success) {
              setSelectedInstallmentPlan(null);
              showModal({
                title: isRTL ? 'پرداخت موفق 🎉' : 'Payment Successful 🎉',
                message: isRTL
                  ? `قسط شماره ${item.number} با موفقیت تسویه گردید.`
                  : `Installment #${item.number} has been settled successfully.`,
                icon: 'solar:check-circle-bold',
                buttons: [{ text: isRTL ? 'باشه' : 'OK', style: 'primary' }],
              });
            } else {
              showModal({
                title: isRTL ? 'خطا در پرداخت' : 'Payment Error',
                message: res.message || (isRTL ? 'موجودی کیف پول کافی نیست.' : 'Insufficient wallet balance.'),
                icon: 'solar:danger-circle-bold',
                iconColor: colors.destructive,
                buttons: [{ text: isRTL ? 'متوجه شدم' : 'OK', style: 'primary' }],
              });
            }
          },
        },
      ],
    });
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

  const storeTransactions = finance.transactions || [];
  const filteredTransactions = storeTransactions.filter(t => selectedFilter === 'all' || t.type === selectedFilter);

  const allInstallments = finance.installments || [];
  const roleInstallments = allInstallments.filter(i => installmentPerspective === 'buyer' ? i.type === 'purchase' : i.type === 'sale');

  // Aggregated installment stats
  const totalInstallmentVolume = roleInstallments.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalPaidAmount = roleInstallments.reduce((acc, i) => {
    const paidSum = i.schedule.filter(s => s.isPaid).reduce((sAcc, s) => sAcc + s.amount, 0);
    return acc + paidSum + (i.downPayment || 0);
  }, 0);
  const remainingInstallmentBalance = Math.max(0, totalInstallmentVolume - totalPaidAmount);
  const overdueCount = roleInstallments.reduce((acc, i) => acc + i.schedule.filter(s => !s.isPaid && s.isOverdue).length, 0);

  const filteredRoleInstallments = roleInstallments.filter(inst => {
    if (activeInstallmentTab === 'paid') return inst.paidCount === inst.totalCount;
    if (activeInstallmentTab === 'remaining') return inst.paidCount < inst.totalCount;
    if (activeInstallmentTab === 'due') return inst.schedule.some(s => !s.isPaid && s.isDueSoon);
    if (activeInstallmentTab === 'overdue') return inst.schedule.some(s => !s.isPaid && s.isOverdue);
    return true;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PageBackground />

      {/* Coordinated Standard Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={[styles.headerContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <FloatingIconButton
            icon={isRTL ? "solar:alt-arrow-right-broken" : "solar:alt-arrow-left-broken"}
            onPress={() => router.back()}
          />
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {isRTL ? 'امور مالی و کیف‌پول' : 'Finance Dashboard'}
          </Text>
          <FloatingIconButton
            icon="solar:download-broken"
            color={colors.tint}
            onPress={handleExportReport}
          />
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

          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 10, marginTop: 4 }}>
            <TouchableOpacity style={[styles.withdrawBtn, { flex: 1 }]} onPress={handleWithdraw} activeOpacity={0.88}>
              <Iconify icon="solar:card-transfer-broken" size={20} color={colors.tint} />
              <Text style={[styles.withdrawText, { color: colors.tint }]}>{isRTL ? 'تسویه و واریز به شبا' : 'Instant Settlement'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.topUpBtn, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
              onPress={() => setIsTopUpModalVisible(true)}
              activeOpacity={0.88}
            >
              <Iconify icon="solar:add-circle-bold" size={20} color="#fff" />
              <Text style={styles.topUpBtnText}>{isRTL ? 'شارژ کیف‌پول' : 'Top-up'}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Installment Hub Card (خرید و فروش اقساطی) */}
        <Animated.View entering={FadeInDown.duration(450).delay(150)} style={[styles.installmentHubCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.installmentHubHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }}>
              <View style={[styles.installmentHubIcon, { backgroundColor: colors.tint + '18' }]}>
                <Iconify icon="solar:wallet-money-bold" size={22} color={colors.tint} />
              </View>
              <View style={{ alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                <Text style={[styles.installmentHubTitle, { color: colors.text }]}>
                  {isRTL ? 'خرید و فروش اقساطی' : 'Installment Commerce'}
                </Text>
                <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                  {isRTL ? 'گزارش تفصیلی وضعیت اقساط و سررسیدها' : 'Installment tracking and maturities'}
                </Text>
              </View>
            </View>
            <View style={[styles.activePill, { backgroundColor: colors.success + '18' }]}>
              <Text style={{ fontSize: 11, fontWeight: '800', color: colors.success }}>
                {roleInstallments.length} {isRTL ? 'طرح فعال' : 'Active'}
              </Text>
            </View>
          </View>

          {/* Perspective Switcher: Buyer vs Seller */}
          <View style={[styles.perspectiveSwitcher, { backgroundColor: colors.surface, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <TouchableOpacity
              onPress={() => setInstallmentPerspective('buyer')}
              style={[
                styles.perspectiveBtn,
                installmentPerspective === 'buyer' && { backgroundColor: colors.tint },
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.perspectiveText,
                  { color: installmentPerspective === 'buyer' ? '#fff' : colors.textSecondary },
                ]}
              >
                {isRTL ? 'اقساط پرداختی من (خریدار)' : 'Payable by Me (Buyer)'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setInstallmentPerspective('seller')}
              style={[
                styles.perspectiveBtn,
                installmentPerspective === 'seller' && { backgroundColor: colors.tint },
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.perspectiveText,
                  { color: installmentPerspective === 'seller' ? '#fff' : colors.textSecondary },
                ]}
              >
                {isRTL ? 'اقساط دریافتی من (فروشنده)' : 'Receivable by Me (Seller)'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Quick Metrics Bar */}
          <View style={[styles.installmentMetricsGrid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={[styles.metricBox, { backgroundColor: colors.surface }]}>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{isRTL ? 'تسویه / وصول شده' : 'Paid / Settled'}</Text>
              <Text style={[styles.metricVal, { color: colors.success }]}>{formatCurrency(totalPaidAmount)}</Text>
              <Text style={{ fontSize: 10, color: colors.textSecondary }}>{isRTL ? 'تومان' : 'TOMAN'}</Text>
            </View>

            <View style={[styles.metricBox, { backgroundColor: colors.surface }]}>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{isRTL ? 'مانده اقساط' : 'Remaining'}</Text>
              <Text style={[styles.metricVal, { color: colors.warning }]}>{formatCurrency(remainingInstallmentBalance)}</Text>
              <Text style={{ fontSize: 10, color: colors.textSecondary }}>{isRTL ? 'تومان' : 'TOMAN'}</Text>
            </View>

            <View style={[styles.metricBox, { backgroundColor: colors.surface }]}>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{isRTL ? 'اقساط سررسید/معوق' : 'Due / Overdue'}</Text>
              <Text style={[styles.metricVal, { color: overdueCount > 0 ? colors.destructive : colors.tint }]}>
                {overdueCount > 0 ? `${overdueCount} معوق` : (isRTL ? 'به‌موقع' : 'On track')}
              </Text>
              <Text style={{ fontSize: 10, color: colors.destructive }}>
                {overdueCount > 0 ? (isRTL ? 'نیاز به پیگیری' : 'Needs attention') : (isRTL ? 'وضعیت منظم' : 'Good standing')}
              </Text>
            </View>
          </View>

          {/* Installment Filter Chips */}
          <View style={[styles.chipsWrap, { flexDirection: isRTL ? 'row-reverse' : 'row', marginTop: 10 }]}>
            {[
              { id: 'all', labelFa: 'همه', labelEn: 'All' },
              { id: 'paid', labelFa: 'تسویه شده', labelEn: 'Completed' },
              { id: 'remaining', labelFa: 'در جریان', labelEn: 'Active' },
              { id: 'due', labelFa: 'سررسید نزدیک', labelEn: 'Upcoming' },
              { id: 'overdue', labelFa: 'معوقه', labelEn: 'Overdue' },
            ].map((st) => {
              const isSelected = activeInstallmentTab === st.id;
              return (
                <TouchableOpacity
                  key={st.id}
                  onPress={() => setActiveInstallmentTab(st.id as any)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isSelected ? colors.tint : colors.surface,
                      borderColor: isSelected ? colors.tint : colors.border,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                    },
                  ]}
                >
                  <Text style={{ fontSize: 11, fontWeight: '800', color: isSelected ? '#fff' : colors.text }}>
                    {isRTL ? st.labelFa : st.labelEn}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Installments List */}
          <View style={{ gap: 8, marginTop: 12 }}>
            {filteredRoleInstallments.map((inst: any) => {
              const isFullyPaid = inst.paidCount >= inst.totalCount;
              const hasOverdue = inst.schedule.some((s: any) => !s.isPaid && s.isOverdue);
              const hasDueSoon = inst.schedule.some((s: any) => !s.isPaid && s.isDueSoon);

              return (
                <TouchableOpacity
                  key={inst.id}
                  onPress={() => setSelectedInstallmentPlan(inst)}
                  activeOpacity={0.85}
                  style={[
                    styles.installmentRowItem,
                    {
                      backgroundColor: colors.surface,
                      borderColor: hasOverdue ? colors.destructive : hasDueSoon ? colors.warning : colors.border,
                      flexDirection: isRTL ? 'row-reverse' : 'row',
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.instStatusIcon,
                      {
                        backgroundColor: isFullyPaid
                          ? colors.success + '18'
                          : hasOverdue
                          ? colors.destructive + '18'
                          : hasDueSoon
                          ? colors.warning + '18'
                          : colors.tint + '18',
                      },
                    ]}
                  >
                    <Iconify
                      icon={
                        isFullyPaid
                          ? 'solar:check-circle-bold'
                          : hasOverdue
                          ? 'solar:danger-triangle-broken'
                          : hasDueSoon
                          ? 'solar:calendar-mark-broken'
                          : 'solar:clock-circle-broken'
                      }
                      size={18}
                      color={
                        isFullyPaid
                          ? colors.success
                          : hasOverdue
                          ? colors.destructive
                          : hasDueSoon
                          ? colors.warning
                          : colors.tint
                      }
                    />
                  </View>
                  <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start', gap: 2 }}>
                    <Text style={{ fontSize: 13, fontWeight: '800', color: colors.text }} numberOfLines={1}>
                      {inst.title}
                    </Text>
                    <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                      {isRTL ? `قسط ${inst.paidCount} از ${inst.totalCount}` : `Installment ${inst.paidCount}/${inst.totalCount}`} • {inst.nextDueDate}
                    </Text>
                  </View>
                  <View style={{ alignItems: isRTL ? 'flex-start' : 'flex-end', gap: 2 }}>
                    <Text style={{ fontSize: 13, fontWeight: '900', color: colors.tint }}>
                      {formatCurrency(inst.installmentAmount)} {isRTL ? 'تومان' : 'T'}
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        color: isFullyPaid
                          ? colors.success
                          : hasOverdue
                          ? colors.destructive
                          : hasDueSoon
                          ? colors.warning
                          : colors.textSecondary,
                        fontWeight: '700',
                      }}
                    >
                      {isFullyPaid
                        ? (isRTL ? 'تسویه کامل' : 'Completed')
                        : hasOverdue
                        ? (isRTL ? 'دارای معوقه' : 'Overdue')
                        : hasDueSoon
                        ? (isRTL ? 'سررسید نزدیک' : 'Due Soon')
                        : (isRTL ? 'مشاهده جدول' : 'Schedule')}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* Quick Actions Grid */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={[styles.actionTile, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => setIsTopUpModalVisible(true)}
            activeOpacity={0.8}
          >
            <View style={[styles.actionTileIcon, { backgroundColor: colors.tint + '15' }]}>
              <Iconify icon="solar:wallet-money-bold" size={22} color={colors.tint} />
            </View>
            <Text style={[styles.actionTileTitle, { color: colors.text }]}>{isRTL ? 'شارژ کیف‌پول' : 'Top-up'}</Text>
          </TouchableOpacity>

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

      {/* Installment Plan Schedule Modal */}
      {selectedInstallmentPlan && (
        <View style={styles.topUpModalBackdrop}>
          <View style={[styles.topUpModalContent, { backgroundColor: colors.card, borderColor: colors.border, maxHeight: '80%' }]}>
            <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row', marginBottom: 12 }]}>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }}>
                <Iconify icon="solar:calendar-mark-broken" size={24} color={colors.tint} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {isRTL ? 'جدول زمان‌بندی اقساط' : 'Installment Schedule'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedInstallmentPlan(null)}>
                <Iconify icon="solar:close-circle-broken" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 13, fontWeight: '800', color: colors.text, textAlign: isRTL ? 'right' : 'left' }}>
              {selectedInstallmentPlan.title}
            </Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left', marginBottom: 14 }}>
              {isRTL
                ? `مبلغ کل: ${formatCurrency(selectedInstallmentPlan.totalAmount)} تومان | پیش‌پرداخت: ${formatCurrency(selectedInstallmentPlan.downPayment)} تومان`
                : `Total: ${formatCurrency(selectedInstallmentPlan.totalAmount)} TOMAN | Down Payment: ${formatCurrency(selectedInstallmentPlan.downPayment)} TOMAN`}
            </Text>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 10 }}>
              {selectedInstallmentPlan.schedule.map((sch: any) => (
                <View
                  key={sch.number}
                  style={[
                    styles.installmentRowItem,
                    {
                      backgroundColor: colors.surface,
                      borderColor: sch.isPaid ? colors.success + '40' : sch.isOverdue ? colors.destructive : colors.border,
                      flexDirection: isRTL ? 'row-reverse' : 'row',
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.instStatusIcon,
                      {
                        backgroundColor: sch.isPaid
                          ? colors.success + '18'
                          : sch.isOverdue
                          ? colors.destructive + '18'
                          : colors.warning + '18',
                      },
                    ]}
                  >
                    <Iconify
                      icon={
                        sch.isPaid
                          ? 'solar:check-circle-bold'
                          : sch.isOverdue
                          ? 'solar:danger-triangle-broken'
                          : 'solar:clock-circle-broken'
                      }
                      size={18}
                      color={sch.isPaid ? colors.success : sch.isOverdue ? colors.destructive : colors.warning}
                    />
                  </View>

                  <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                    <Text style={{ fontSize: 13, fontWeight: '800', color: colors.text }}>
                      {isRTL ? `قسط شماره ${sch.number}` : `Installment #${sch.number}`}
                    </Text>
                    <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                      {sch.isPaid
                        ? (isRTL ? `تسویه در ${sch.paidDate}` : `Paid on ${sch.paidDate}`)
                        : (isRTL ? `سررسید: ${sch.dueDate}` : `Due: ${sch.dueDate}`)}
                    </Text>
                  </View>

                  <View style={{ alignItems: isRTL ? 'flex-start' : 'flex-end', gap: 4 }}>
                    <Text style={{ fontSize: 13, fontWeight: '900', color: colors.tint }}>
                      {formatCurrency(sch.amount)} {isRTL ? 'تومان' : 'T'}
                    </Text>
                    {selectedInstallmentPlan.type === 'purchase' && !sch.isPaid ? (
                      <TouchableOpacity
                        onPress={() => handlePayInstallmentItem(selectedInstallmentPlan.id, sch)}
                        style={[styles.payNowBtn, { backgroundColor: colors.tint }]}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.payNowBtnText}>{isRTL ? 'پرداخت این قسط' : 'Pay'}</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: '800',
                          color: sch.isPaid ? colors.success : sch.isOverdue ? colors.destructive : colors.textSecondary,
                        }}
                      >
                        {sch.isPaid ? (isRTL ? 'پرداخت شده' : 'Paid') : (isRTL ? 'در انتظار' : 'Pending')}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Wallet Top-Up Modal */}
      {isTopUpModalVisible && (
        <View style={styles.topUpModalBackdrop}>
          <View style={[styles.topUpModalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row', marginBottom: 12 }]}>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }}>
                <Iconify icon="solar:wallet-money-bold" size={24} color={colors.tint} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {isRTL ? 'افزایش موجودی کیف پول' : 'Charge Wallet'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setIsTopUpModalVisible(false)}>
                <Iconify icon="solar:close-circle-broken" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 13, color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left', marginBottom: 14 }}>
              {isRTL
                ? 'مبلغ مورد نظر خود را جهت شارژ آنی کیف پول کوتیک وارد نمایید:'
                : 'Enter amount to instantly charge your KuTik wallet:'}
            </Text>

            <View style={[styles.topUpInputWrap, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <TextInput
                style={[styles.topUpInput, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
                keyboardType="numeric"
                value={topUpAmount}
                onChangeText={setTopUpAmount}
                placeholder="1000000"
                placeholderTextColor={colors.textSecondary}
              />
              <Text style={{ fontSize: 13, fontWeight: '800', color: colors.tint }}>{isRTL ? 'تومان' : 'TOMAN'}</Text>
            </View>

            {/* Quick Presets */}
            <View style={[styles.chipsWrap, { flexDirection: isRTL ? 'row-reverse' : 'row', marginVertical: 12 }]}>
              {['۵۰۰,۰۰۰', '۱,۰۰۰,۰۰۰', '۲,۰۰۰,۰۰۰', '۵,۰۰۰,۰۰۰'].map((preset) => (
                <TouchableOpacity
                  key={preset}
                  onPress={() => setTopUpAmount(preset.replace(/,/g, '').replace(/[٠-٩۰-۹]/g, (d) => String(d.charCodeAt(0) & 0xf)))}
                  style={[styles.chip, { backgroundColor: colors.surface, borderColor: colors.border }]}
                >
                  <Text style={{ fontSize: 12, fontWeight: '800', color: colors.text }}>{preset} {isRTL ? 'ت' : 'T'}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.confirmTopUpBtn, { backgroundColor: colors.tint }]}
              onPress={handleTopUpWallet}
            >
              <Iconify icon="solar:card-transfer-broken" size={20} color="#fff" />
              <Text style={styles.confirmTopUpBtnText}>{isRTL ? 'پرداخت و شارژ آنی' : 'Pay & Top-Up'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { backgroundColor: 'transparent', paddingHorizontal: 16 },
  headerContent: { height: 52, alignItems: 'center', justifyContent: 'space-between' },
  floatingHeaderBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  scrollContent: { padding: 16, gap: 16, paddingBottom: 24 },

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
  withdrawBtn: { backgroundColor: '#fff', height: 48, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  withdrawText: { fontWeight: '800', fontSize: 13 },
  topUpBtn: { height: 48, paddingHorizontal: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  topUpBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },

  installmentHubCard: { padding: 18, borderRadius: 24, borderWidth: 1, gap: 12 },
  installmentHubHeader: { justifyContent: 'space-between', alignItems: 'center' },
  installmentHubIcon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  installmentHubTitle: { fontSize: 15, fontWeight: '900' },
  activePill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  installmentMetricsGrid: { gap: 8, marginTop: 4 },
  metricBox: { flex: 1, padding: 10, borderRadius: 14, gap: 3 },
  metricLabel: { fontSize: 10.5, fontWeight: '700' },
  metricVal: { fontSize: 13.5, fontWeight: '900' },
  chipsWrap: { flexWrap: 'wrap', gap: 6 },
  perspectiveSwitcher: {
    borderRadius: 16,
    padding: 4,
    gap: 6,
    marginBottom: 4,
  },
  perspectiveBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perspectiveText: {
    fontSize: 12,
    fontWeight: '800',
  },
  installmentRowItem: { padding: 12, borderRadius: 16, borderWidth: 1, alignItems: 'center', gap: 10 },
  instStatusIcon: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  payNowBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payNowBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },

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

  topUpModalBackdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  topUpModalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    borderWidth: 1,
  },
  topUpInputWrap: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  topUpInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    height: '100%',
  },
  confirmTopUpBtn: {
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  confirmTopUpBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
});
