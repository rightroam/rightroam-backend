import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, SafeAreaView, Alert
} from 'react-native';
import { userService } from '../../services/api';
import { t } from '../../i18n/translations';

export default function RegisterTripScreen({ navigation, route }) {
  const lang = route.params?.lang || 'fr';
  const [form, setForm] = useState({
    destination_country: '',
    destination_city: '',
    start_date: '',
    end_date: '',
  });
  const [loading, setLoading] = useState(false);
  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    if (!form.destination_country || !form.destination_city || !form.start_date || !form.end_date) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    try {
      await userService.registerTrip(form);
      navigation.navigate('Plans', { lang });
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
          <Text style={styles.step}>Étape 3 / 3</Text>
          <Text style={styles.title}>{t(lang, 'register_trip')}</Text>
          <Text style={styles.subtitle}>
            Indiquez où vous allez. En cas de problème, nous saurons exactement où vous envoyer de l'aide.
          </Text>
        </View>

        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            📍 Ces informations sont utilisées uniquement pour vous attribuer le bon avocat en cas d'urgence.
          </Text>
        </View>

        {[
          { key: 'destination_country', label: t(lang, 'country'), placeholder: 'Ex: Espagne, Thaïlande, USA...' },
          { key: 'destination_city', label: t(lang, 'city'), placeholder: 'Ex: Madrid, Bangkok, New York...' },
          { key: 'start_date', label: t(lang, 'start_date'), placeholder: 'JJ/MM/AAAA' },
          { key: 'end_date', label: t(lang, 'end_date'), placeholder: 'JJ/MM/AAAA' },
        ].map(field => (
          <View key={field.key} style={styles.fieldGroup}>
            <Text style={styles.label}>{field.label} <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder={field.placeholder}
              placeholderTextColor="#999"
              value={form[field.key]}
              onChangeText={v => update(field.key, v)}
            />
          </View>
        ))}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>ℹ️ Bon à savoir</Text>
          <Text style={styles.infoText}>
            Vous pouvez enregistrer plusieurs voyages. Votre protection s'active automatiquement à votre date de départ et se désactive à votre retour.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.btnText}>
            {loading ? 'Enregistrement...' : `${t(lang, 'continue')} →`}
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
  infoBox: { backgroundColor: '#FEF9E7', borderRadius: 10, padding: 14, marginBottom: 16, borderLeftWidth: 3, borderLeftColor: '#F0C040' },
  infoTitle: { fontSize: 13, fontWeight: '600', color: '#633806', marginBottom: 4 },
  infoText: { fontSize: 13, color: '#633806', lineHeight: 18 },
  btn: {
    backgroundColor: '#1A3C5E', borderRadius: 12,
    padding: 15, alignItems: 'center', marginTop: 4,
  },
  btnDisabled: { backgroundColor: '#A0B4C5' },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
