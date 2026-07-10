import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, SafeAreaView, Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
];

export default function SplashScreen({ navigation }) {
  const [selectedLang, setSelectedLang] = useState('fr');

  const selectLanguage = async (code) => {
    setSelectedLang(code);
    await AsyncStorage.setItem('language', code);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.logo}>⚖️</Text>
        <Text style={styles.appName}>RightRoam</Text>
        <Text style={styles.tagline}>
          {selectedLang === 'fr' && 'Vos droits. Partout dans le monde.'}
          {selectedLang === 'en' && 'Your rights. Everywhere.'}
          {selectedLang === 'es' && 'Tus derechos. En todo el mundo.'}
          {selectedLang === 'ar' && 'حقوقك. في كل مكان.'}
          {selectedLang === 'zh' && '您的权利。遍及全球。'}
          {selectedLang === 'pt' && 'Os seus direitos. Em todo o mundo.'}
          {selectedLang === 'de' && 'Ihre Rechte. Überall auf der Welt.'}
          {!['fr','en','es','ar','zh','pt','de'].includes(selectedLang) && 'Your rights. Everywhere.'}
        </Text>
      </View>

      <View style={styles.langSection}>
        <Text style={styles.langTitle}>Choisissez votre langue / Choose your language</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.langScroll}>
          {LANGUAGES.map(lang => (
            <TouchableOpacity
              key={lang.code}
              style={[styles.langBtn, selectedLang === lang.code && styles.langBtnActive]}
              onPress={() => selectLanguage(lang.code)}
            >
              <Text style={styles.langFlag}>{lang.flag}</Text>
              <Text style={[styles.langLabel, selectedLang === lang.code && styles.langLabelActive]}>
                {lang.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => navigation.navigate('Register', { lang: selectedLang })}
        >
          <Text style={styles.btnPrimaryText}>
            {selectedLang === 'fr' ? 'Commencer' : 'Get started'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => navigation.navigate('Login', { lang: selectedLang })}
        >
          <Text style={styles.btnSecondaryText}>
            {selectedLang === 'fr' ? 'Se connecter' : 'Log in'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnSecondary, { borderColor: '#3B6D11', marginTop: 8 }]}
          onPress={() => navigation.navigate('LawyerRegister', { lang: selectedLang })}
        >
          <Text style={[styles.btnSecondaryText, { color: '#3B6D11' }]}>
            {selectedLang === 'fr' ? '⚖️ Je suis avocat' : '⚖️ I am a lawyer'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A3C5E' },
  top: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  logo: { fontSize: 64, marginBottom: 16 },
  appName: { fontSize: 40, fontWeight: '600', color: '#FFFFFF', letterSpacing: 1 },
  tagline: { fontSize: 16, color: '#A8C4DE', marginTop: 8, textAlign: 'center', lineHeight: 24 },
  langSection: { paddingHorizontal: 20, marginBottom: 8 },
  langTitle: { color: '#A8C4DE', fontSize: 12, marginBottom: 10, textAlign: 'center' },
  langScroll: { flexDirection: 'row' },
  langBtn: {
    paddingHorizontal: 14, paddingVertical: 8, marginRight: 8,
    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  langBtnActive: { backgroundColor: '#FFFFFF', borderColor: '#FFFFFF' },
  langFlag: { fontSize: 18, marginBottom: 2 },
  langLabel: { fontSize: 11, color: '#A8C4DE' },
  langLabelActive: { color: '#1A3C5E', fontWeight: '600' },
  buttons: { padding: 24 },
  btnPrimary: {
    backgroundColor: '#FFFFFF', borderRadius: 12,
    padding: 15, alignItems: 'center',
  },
  btnPrimaryText: { color: '#1A3C5E', fontSize: 16, fontWeight: '600' },
  btnSecondary: {
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 10,
  },
  btnSecondaryText: { color: '#FFFFFF', fontSize: 15, fontWeight: '500' },
});
