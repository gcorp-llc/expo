import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Modal, Alert, Platform } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Iconify } from '@/components/ui/Iconify';
import { Experience } from '@/types/profile';
import Animated, { Layout } from 'react-native-reanimated';
import { useProfileStore } from '@/hooks/use-profile-store';

interface ExperienceCardProps {
  experiences: Experience[];
  isRTL: boolean;
  mode?: 'own' | 'readonly';
}

export const ExperienceCard = ({ experiences, isRTL, mode = 'own' }: ExperienceCardProps) => {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const { addExperience, removeExperience } = useProfileStore();

  const isOwn = mode === 'own';

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newExp, setNewExp] = useState({
    company: '',
    role: '',
    period: '',
    description: ''
  });

  const handleDelete = (id: string) => {
    Alert.alert(
      isRTL ? 'حذف تجربه' : 'Delete Experience',
      isRTL ? 'آیا از حذف این تجربه اطمینان دارید؟' : 'Are you sure you want to delete this experience?',
      [
        { text: isRTL ? 'انصراف' : 'Cancel', style: 'cancel' },
        { text: isRTL ? 'حذف' : 'Delete', style: 'destructive', onPress: () => removeExperience(id) }
      ]
    );
  };

  const handleAdd = () => {
    if (!newExp.company || !newExp.role) return;
    addExperience(newExp);
    setNewExp({ company: '', role: '', period: '', description: '' });
    setIsModalVisible(false);
  };

  return (
    <Animated.View
      layout={Layout.springify()}
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {isRTL ? 'تجربیات کاری' : 'Experience'}
        </Text>
        {isOwn && (
          <TouchableOpacity
            onPress={() => setIsModalVisible(true)}
            style={[styles.editBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Iconify icon="solar:add-circle-broken" size={18} color={colors.tint} />
          </TouchableOpacity>
        )}
      </View>

      {experiences.length === 0 ? (
        <View style={styles.emptyState}>
           <Iconify icon="solar:case-broken" size={48} color={colors.textSecondary} />
           <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
             {isRTL ? 'هنوز تجربه‌ای اضافه نشده است.' : 'No experience added yet.'}
           </Text>
           {isOwn && (
             <TouchableOpacity onPress={() => setIsModalVisible(true)} style={[styles.addFirstBtn, { borderColor: colors.tint }]}>
                <Text style={{ color: colors.tint, fontWeight: '800' }}>{isRTL ? 'افزودن اولین مورد' : 'Add your first experience'}</Text>
             </TouchableOpacity>
           )}
        </View>
      ) : (
        <View style={styles.list}>
          {experiences.map((exp, i) => (
            <Animated.View
              layout={Layout.springify()}
              key={exp.id}
              style={[styles.item, i !== experiences.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
            >
              <View style={[styles.itemHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <View style={[styles.logoPlaceholder, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Iconify icon="solar:case-minimalistic-broken" size={24} color={colors.textSecondary} />
                </View>
                <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start', marginHorizontal: 12 }}>
                  <Text style={[styles.role, { color: colors.text }]}>{exp.role}</Text>
                  <Text style={[styles.company, { color: colors.textSecondary }]}>{exp.company}</Text>
                  <Text style={[styles.period, { color: colors.textSecondary }]}>{exp.period}</Text>
                </View>
                {isOwn && (
                  <TouchableOpacity onPress={() => handleDelete(exp.id)}>
                    <Iconify icon="solar:trash-bin-trash-broken" size={20} color={colors.destructive} />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={[styles.description, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                {exp.description}
              </Text>
            </Animated.View>
          ))}
        </View>
      )}

      {/* Add Experience Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={[styles.modalHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{isRTL ? 'افزودن تجربه جدید' : 'Add Experience'}</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Iconify icon="solar:close-circle-broken" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>{isRTL ? 'نام شرکت' : 'Company'}</Text>
                <TextInput
                  style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border, textAlign: isRTL ? 'right' : 'left' }]}
                  value={newExp.company}
                  onChangeText={(t) => setNewExp({...newExp, company: t})}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>{isRTL ? 'عنوان شغلی' : 'Role'}</Text>
                <TextInput
                  style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border, textAlign: isRTL ? 'right' : 'left' }]}
                  value={newExp.role}
                  onChangeText={(t) => setNewExp({...newExp, role: t})}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>{isRTL ? 'بازه زمانی' : 'Period'}</Text>
                <TextInput
                  style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border, textAlign: isRTL ? 'right' : 'left' }]}
                  value={newExp.period}
                  placeholder="e.g. 2022 - Present"
                  onChangeText={(t) => setNewExp({...newExp, period: t})}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>{isRTL ? 'توضیحات' : 'Description'}</Text>
                <TextInput
                  style={[styles.input, styles.textArea, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border, textAlign: isRTL ? 'right' : 'left' }]}
                  value={newExp.description}
                  multiline
                  onChangeText={(t) => setNewExp({...newExp, description: t})}
                />
              </View>

              <TouchableOpacity onPress={handleAdd} style={[styles.saveBtn, { backgroundColor: colors.tint }]}>
                <Text style={styles.saveBtnText}>{isRTL ? 'ذخیره تجربه' : 'Save Experience'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    borderRadius: 28,
    padding: Spacing.xl,
    borderWidth: 1,
    marginTop: Spacing.lg,
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  list: {
    gap: 20,
  },
  item: {
    paddingBottom: 20,
  },
  itemHeader: {
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  logoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  role: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  company: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  period: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.8,
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
  },
  addFirstBtn: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    minHeight: '60%',
  },
  modalHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '600',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  saveBtn: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});
