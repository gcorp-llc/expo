import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Iconify } from '@/components/ui/Iconify';

interface OverflowMenuProps {
  visible: boolean;
  onClose: () => void;
}

export const OverflowMenu = ({ visible, onClose }: OverflowMenuProps) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const menuItems = [
    { icon: <Iconify icon="solar:users-group-rounded-bold" width={19} height={19} color={colors.icon} />, label: 'New Group' },
    { icon: <Iconify icon="solar:user-plus-bold" width={19} height={19} color={colors.icon} />, label: 'New Secret Chat' },
    { icon: <Iconify icon="solar:bookmark-bold" width={19} height={19} color={colors.icon} />, label: 'Saved Messages' },
    { icon: <Iconify icon="solar:shield-check-bold" width={19} height={19} color={colors.icon} />, label: 'Archive' },
    { icon: <Iconify icon="solar:settings-bold" width={19} height={19} color={colors.icon} />, label: 'Settings' },
    { icon: <Iconify icon="solar:question-circle-bold" width={19} height={19} color={colors.icon} />, label: 'Telegram Features' },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View style={[styles.menu, { borderColor: colors.border, backgroundColor: colors.card }]}>
            {menuItems.map((item, index) => (
              <TouchableOpacity key={index} style={styles.menuItem} onPress={onClose}>
                {item.icon}
                <Text style={[styles.label, { color: colors.text }]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1 },
  menu: { position: 'absolute', top: 84, right: 12, width: 238, borderRadius: 18, paddingVertical: 8, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, paddingHorizontal: 14, gap: 12 },
  label: { fontSize: 15, fontWeight: '500' },
});