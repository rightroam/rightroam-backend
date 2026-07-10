import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, SafeAreaView, Alert
} from 'react-native';
import { userService } from '../../services/api';
import { t } from '../../i18n/translations';

export default function CompleteProfileScreen({ navigation, route }) {
  const lang = route.params?.lang || 'fr';
  const [form, setForm] = useState({
    nationality: '', passport_number: '',
    phone: '', emergency_contact: '',
    birth_date: '', address: '',
  });
  const [loading, setLoading] = useState(false);

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.nationality || !form.passport_number || !form.phone || !form.emergency_contact) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setLoading(true);
    try {
      await userService.completeProfile(form);
      navigation.navigate('RegisterTrip', { lang });
    } catch (err) {
      Alert.alert('Erreur', err.response?.data?.error || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.step}>Étape 2 / 3</Text>
          <Text style={styles.title}>{t(lang, 'complete_profile')}</Text>
          <Text style={styles.subtitle}>
            Ces informations nous permettent de vous identifier et de vous localiser en cas de problème.
          </Text>
        </View>

        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            🔒 Vos données sont chiffrées et ne sont utilisées qu'en cas d'urgence juridique.
          </Text>
        </View>

        {[
          { key: 'nationality', label: t(lang, 'nationality'), placeholder: 'Ex: Belge, Français...', required: true },
          { key: 'passport_number', label: t(lang, 'passport'), placeholder: 'Ex: BE123456789', required: true },
          { key: 'phone', label: t(lang, 'phone'), placeholder: '+32 470 12 34 56', required: true, keyboard: 'phone-pad' },
          { key: 'emergency_contact', label: t(lang, 'emergency_contact'), placeholder: '+32 470 99 88 77', required: true, keyboard: 'phone-pad' },
          { key: 'birth_date', label: 'Date de naissance', placeholder: 'JJ/MM/AAAA', required: false },
          { key: 'address', label: 'Adresse (optionnel)', placeholder: 'Votre adresse de domicile', required: false },
        ].map(field => (
          <View key={field.key} style={styles.fieldGroup}>
            <Text style={styles.label}>
              {field.label} {field.required && <Text style={styles.required}>*</Text>}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={field.placeholder}
              placeholderTextColor="#999"
              keyboardType={field.keyboard || 'default'}
              value={form[field.key]}
              onChangeText={v => update(field.key, v)}
            />
          </View>
        ))}

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.btnText}>
            {loading ? 'Enregistrement...' : t(lang, 'continue')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scroll: { padding: 20 },
  header: { marginBottom: 16 },
  step: { fontSize: 12, color: '#2E75B6', fontWeight: '600', marginBottom: 4 },
  title: { fontSize: 22, fontWeight: '600', color: '#1A3C5E', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', lineHeight: 20 },
  notice: { backgroundColor: '#EBF5FB', borderRadius: 10, padding: 12, marginBottom: 20 },
  noticeText: { fontSize: 13, color: '#1A3C5E', lineHeight: 18 },
  fieldGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '500', color: '#333', marginBottom: 6 },
  required: { color: '#A32D2D' },
  input: {
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DDD',
    borderRadius: 10, padding: 12, fontSize: 15, color: '#111',
  },
  btn: {
    backgroundColor: '#1A3C5E', borderRadius: 12,
    padding: 15, alignItems: 'center', marginTop: 8,
  },
  btnDisabled: { backgroundColor: '#A0B4C5' },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
