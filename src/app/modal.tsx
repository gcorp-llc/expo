import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MOCK_CONTACTS } from '@/constants/mock-data';
import { Iconify } from '@/components/ui/Iconify';
import { useRouter } from 'expo-router';

export default function NewMessageModal() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  const actions = [
    { icon: <Iconify icon="solar:users-group-rounded-bold" size={22} color={colors.icon} />, label: 'New Group' },
    { icon: <Iconify icon="solar:user-plus-bold" size={22} color={colors.icon} />, label: 'New Secret Chat' },
    { icon: <Iconify icon="solar:speaker-bold" size={22} color={colors.icon} />, label: 'New Channel' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Iconify icon="solar:close-circle-bold" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>New Message</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={MOCK_CONTACTS}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.actionsContainer}>
            {actions.map((item, index) => (
              <TouchableOpacity key={index} style={styles.actionItem}>
                <View style={[styles.iconContainer, { backgroundColor: colors.secondaryBackground }]}>
                  {item.icon}
                </View>
                <Text style={[styles.actionLabel, { color: colors.text }]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
            <View style={[sectionHeaderStyles.sectionHeader, { backgroundColor: colors.secondaryBackground }]}>
              <Text style={[sectionHeaderStyles.sectionTitle, { color: colors.textSecondary }]}>Contacts</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.contactItem}>
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.tint }]}>
              <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
            </View>
            <View style={[styles.contactInfo, { borderBottomColor: colors.border }]}>
              <Text style={[styles.contactName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.contactStatus, { color: colors.textSecondary }]}>{item.status}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const sectionHeaderStyles = StyleSheet.create({
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  actionsContainer: {
    paddingTop: 8,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 16,
    marginLeft: 16,
    fontWeight: '500',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    height: 60,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  contactInfo: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    marginLeft: 16,
    paddingRight: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
  },
  contactStatus: {
    fontSize: 13,
    marginTop: 2,
  },
});
