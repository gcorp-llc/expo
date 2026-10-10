import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Toast, { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Iconify } from '@/components/ui/Iconify';
import { useStore } from '@/hooks/use-store';

export const createToastConfig = (colorScheme: 'light' | 'dark', isRTL: boolean): ToastConfig => {
  const colors = Colors[colorScheme];

  return {
    success: (props) => (
      <View
        style={[
          styles.toastCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.success + '60',
            borderRightWidth: isRTL ? 4 : 1,
            borderLeftWidth: isRTL ? 1 : 4,
            borderLeftColor: isRTL ? colors.border : colors.success,
            borderRightColor: isRTL ? colors.success : colors.border,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
      >
        <View style={[styles.iconWrap, { backgroundColor: colors.success + '18' }]}>
          <Iconify icon="solar:check-circle-bold" size={22} color={colors.success} />
        </View>
        <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
          {props.text1 ? (
            <Text style={[styles.toastTitle, { color: colors.text }]}>{props.text1}</Text>
          ) : null}
          {props.text2 ? (
            <Text style={[styles.toastSub, { color: colors.textSecondary }]}>{props.text2}</Text>
          ) : null}
        </View>
      </View>
    ),

    error: (props) => (
      <View
        style={[
          styles.toastCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.destructive + '60',
            borderRightWidth: isRTL ? 4 : 1,
            borderLeftWidth: isRTL ? 1 : 4,
            borderLeftColor: isRTL ? colors.border : colors.destructive,
            borderRightColor: isRTL ? colors.destructive : colors.border,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
      >
        <View style={[styles.iconWrap, { backgroundColor: colors.destructive + '18' }]}>
          <Iconify icon="solar:danger-circle-bold" size={22} color={colors.destructive} />
        </View>
        <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
          {props.text1 ? (
            <Text style={[styles.toastTitle, { color: colors.text }]}>{props.text1}</Text>
          ) : null}
          {props.text2 ? (
            <Text style={[styles.toastSub, { color: colors.textSecondary }]}>{props.text2}</Text>
          ) : null}
        </View>
      </View>
    ),

    info: (props) => (
      <View
        style={[
          styles.toastCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.tint + '60',
            borderRightWidth: isRTL ? 4 : 1,
            borderLeftWidth: isRTL ? 1 : 4,
            borderLeftColor: isRTL ? colors.border : colors.tint,
            borderRightColor: isRTL ? colors.tint : colors.border,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
      >
        <View style={[styles.iconWrap, { backgroundColor: colors.tint + '18' }]}>
          <Iconify icon="solar:info-circle-bold" size={22} color={colors.tint} />
        </View>
        <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
          {props.text1 ? (
            <Text style={[styles.toastTitle, { color: colors.text }]}>{props.text1}</Text>
          ) : null}
          {props.text2 ? (
            <Text style={[styles.toastSub, { color: colors.textSecondary }]}>{props.text2}</Text>
          ) : null}
        </View>
      </View>
    ),
  };
};

export const CustomToastProvider = () => {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const { language } = useStore();
  const isRTL = language === 'fa';

  const toastConfig = createToastConfig(colorScheme, isRTL);

  return <Toast config={toastConfig} />;
};

const styles = StyleSheet.create({
  toastCard: {
    width: '90%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  toastSub: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
});
