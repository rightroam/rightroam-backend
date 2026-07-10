import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, SafeAreaView, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { authService } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { t } from '../../i18n/translations';

const SPECIALTIES = [
  'Droit pénal', 'Droit civil', 'Droit du travail',
  'Droit des transports', 'Droit du tourisme',
  'Litiges consommateurs', 'Droit de la famille', 'Autre',
];

const LANGUAGES = [
  { code: 'fr', label: '🇫🇷 Français' },
  { code: 'en', label: '🇬🇧 English' },
  { code: 'es', label: '🇪🇸 Español' },
  { code: 'ar', label: '🇸🇦 العربية' },
  { code: 'de', label: '🇩🇪 Deutsch' },
  { code: 'pt', label: '🇵🇹 Português' },
  { code: 'zh', label: '🇨🇳 中文' },
  { code: 'it', label: '🇮🇹 Italiano' },
];

export default function LawyerRegisterScreen({ navigation, route }) {
  const lang = route.params?.lang || 'fr';
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', password: '',
    bar_number: '', bar_country: '', city: '', country: '',
    phone: '', bio: '',
    specialties: [], languages: [],
    bar_certificate_url: '',
  });
  const [certificateLabel, setCertificateLabel] = useState('');
  const [loading, setLoading] = useState(false);
  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const toggleItem = (key, val) => {
    setForm(prev => ({
      ...prev,
      [key]: prev[key].includes(val)
        ? prev[key].filter(x => x !== val)
        : [...prev[key], val]
    }));
  };

  const pickCertificate = async () => {
    const result = await ImagePicker.launchDocumentPickerAsync({ type: '*/*' }).catch(() =>
      ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.All })
    );
    if (!result.canceled) {
      const uri = result.assets?.[0]?.uri || result.uri;
      update('bar_certificate_url', uri);
      setCertificateLabel(uri.split('/').pop());
    }
  };

  const handleSubmit = async () => {
    const required = ['first_name', 'last_name', 'email', 'password', 'bar_number', 'bar_country', 'city', 'country'];
    if (required.some(k => !form[k])) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }
    if (!form.bar_certificate_url) {
      Alert.alert('Certificat requis', 'Veuillez uploader votre certificat du barreau.');
      return;
    }
    setLoading(true);
    try {
      const res = await authService.lawyerRegister(form);
      await AsyncStorage.setItem('token', res.data.token);
      await AsyncStorage.setItem('userType', 'lawyer');
      global.authToken = res.data.token;
      Alert.alert(
        'Inscription envoyée ✅',
        res.data.message,
        [{ text: 'OK', onPress: () => navigation.navigate('LawyerTabs') }]
      );
    } catch (err) {
      Alert.alert('Erreur', err.response?.data?.error || 'Erreur lors de l\'inscription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>⚖️ Inscription Avocat</Text>
          <Text style={styles.subtitle}>Rejoignez le réseau RightRoam et recevez des clients voyageurs dans votre ville.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          {[
            { key: 'first_name', label: 'Prénom *', placeholder: 'María' },
            { key: 'last_name', label: 'Nom *', placeholder: 'Rodriguez' },
            { key: 'email', label: 'Email *', placeholder: 'avocat@email.com', keyboard: 'email-address' },
            { key: 'password', label: 'Mot de passe *', placeholder: '••••••••', secure: true },
            { key: 'phone', label: 'Téléphone', placeholder: '+34 612 345 678', keyboard: 'phone-pad' },
          ].map(f => (
            <View key={f.key} style={styles.fieldGroup}>
              <Text style={styles.label}>{f.label}</Text>
              <TextInput
                style={styles.input} placeholder={f.placeholder} placeholderTextColor="#999"
                keyboardType={f.keyboard || 'default'} secureTextEntry={f.secure}
                value={form[f.key]} onChangeText={v => update(f.key, v)}
              />
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations professionnelles</Text>
          {[
            { key: 'bar_number', label: 'Numéro de barreau *', placeholder: 'MAD-12345' },
            { key: 'bar_country', label: 'Pays du barreau *', placeholder: 'Espagne' },
            { key: 'city', label: 'Ville d\'exercice *', placeholder: 'Madrid' },
            { key: 'country', label: 'Pays *', placeholder: 'Espagne' },
          ].map(f => (
            <View key={f.key} style={styles.fieldGroup}>
              <Text style={styles.label}>{f.label}</Text>
              <TextInput
                style={styles.input} placeholder={f.placeholder} placeholderTextColor="#999"
                value={form[f.key]} onChangeText={v => update(f.key, v)}
              />
            </View>
          ))}

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Biographie (optionnel)</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Décrivez votre expérience, vos spécialités..."
              placeholderTextColor="#999" multiline numberOfLines={4}
              value={form.bio} onChangeText={v => update('bio', v)}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spécialités</Text>
          <View style={styles.tagGrid}>
            {SPECIALTIES.map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.tag, form.specialties.includes(s) && styles.tagActive]}
                onPress={() => toggleItem('specialties', s)}
              >
                <Text style={[styles.tagText, form.specialties.includes(s) && styles.tagTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Langues parlées</Text>
          <View style={styles.tagGrid}>
            {LANGUAGES.map(l => (
              <TouchableOpacity
                key={l.code}
                style={[styles.tag, form.languages.includes(l.code) && styles.tagActive]}
                onPress={() => toggleItem('languages', l.code)}
              >
                <Text style={[styles.tagText, form.languages.includes(l.code) && styles.tagTextActive]}>{l.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certificat du barreau *</Text>
          <Text style={styles.certNote}>Uploadez votre certificat officiel. Notre équipe le vérifie sous 24-48h.</Text>
          <TouchableOpacity style={styles.uploadBtn} onPress={pickCertificate}>
            <Text style={styles.uploadIcon}>📄</Text>
            <Text style={styles.uploadText}>
              {certificateLabel || 'Choisir un fichier (PDF, JPG, PNG)'}
            </Text>
          </TouchableOpacity>
          {form.bar_certificate_url ? (
            <Text style={styles.uploadSuccess}>✅ Fichier sélectionné : {certificateLabel}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleSubmit} disabled={loading}
        >
          <Text style={styles.btnText}>{loading ? 'Envoi en cours...' : 'Soumettre mon dossier'}</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          En vous inscrivant, vous certifiez être un avocat qualifié et acceptez les conditions d'utilisation de RightRoam.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scroll: { padding: 20 },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '600', color: '#1A3C5E', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#666', lineHeight: 20 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#1A3C5E', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12, paddingTop: 4 },
  fieldGroup: { marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '500', color: '#333', marginBottom: 5 },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDD', borderRadius: 10, padding: 12, fontSize: 15, color: '#111' },
  textarea: { height: 90, textAlignVertical: 'top' },
  tagGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: '#DDD', backgroundColor: '#FFF' },
  tagActive: { backgroundColor: '#1A3C5E', borderColor: '#1A3C5E' },
  tagText: { fontSize: 13, color: '#555' },
  tagTextActive: { color: '#FFF', fontWeight: '500' },
  certNote: { fontSize: 12, color: '#888', marginBottom: 10 },
  uploadBtn: { backgroundColor: '#EBF5FB', borderWidth: 1.5, borderColor: '#2E75B6', borderStyle: 'dashed', borderRadius: 10, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 10 },
  uploadIcon: { fontSize: 22 },
  uploadText: { fontSize: 14, color: '#2E75B6', flex: 1 },
  uploadSuccess: { fontSize: 12, color: '#27500A', marginTop: 6 },
  btn: { backgroundColor: '#1A3C5E', borderRadius: 12, padding: 15, alignItems: 'center', marginTop: 4 },
  btnDisabled: { backgroundColor: '#A0B4C5' },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  disclaimer: { fontSize: 11, color: '#999', textAlign: 'center', marginTop: 16, lineHeight: 16 },
});
