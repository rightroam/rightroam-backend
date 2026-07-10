import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, SafeAreaView, Alert
} from 'react-native';
import { userService } from '../../services/api';
import { t } from '../../i18n/translations';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CASE_TYPES = [
  { key: 'accident', icon: '🚗' },
  { key: 'theft', icon: '🛡️' },
  { key: 'hotel_dispute', icon: '🏨' },
  { key: 'flight_issue', icon: '✈️' },
  { key: 'arrest', icon: '🔒' },
  { key: 'other', icon: '📋' },
];

export default function HomeScreen({ navigation }) {
  const [lang, setLang] = useState('fr');
  const [user, setUser] = useState(null);
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const l = await AsyncStorage.getItem('language');
    if (l) setLang(l);
    try {
      const res = await userService.getMe();
      setUser(res.data.user);
      setTrip(res.data.user.active_trip);
    } catch {}
  };

  const handleEmergency = () => {
    if (!trip?.is_active) {
      Alert.alert('Aucun voyage actif', 'Activez votre voyage pour accéder à l\'assistance juridique.');
      return;
    }
    navigation.navigate('Emergency', { lang, trip });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bonjour, {user?.first_name || 'Jean'} 👋</Text>
            <Text style={styles.subGreeting}>
              {trip?.is_active ? `📍 ${trip.destination_city}, ${trip.destination_country}` : 'Aucun voyage actif'}
            </Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </Text>
          </View>
        </View>

        {/* Status card */}
        <View style={[styles.statusCard, trip?.is_active ? styles.statusActive : styles.statusInactive]}>
          <Text style={styles.statusIcon}>{trip?.is_active ? '🛡️' : '⚠️'}</Text>
          <View style={styles.statusText}>
            <Text style={[styles.statusTitle, { color: trip?.is_active ? '#1A5C2E' : '#7D3A00' }]}>
              {trip?.is_active ? t(lang, 'protected') : t(lang, 'not_protected')}
            </Text>
            <Text style={[styles.statusSub, { color: trip?.is_active ? '#2E7D52' : '#9E5000' }]}>
              {trip?.is_active
                ? `Pass actif · Retour le ${trip.end_date}`
                : 'Enregistrez votre voyage pour être protégé'}
            </Text>
          </View>
        </View>

        {/* Bouton urgence */}
        <TouchableOpacity style={styles.emergencyBtn} onPress={handleEmergency}>
          <Text style={styles.emergencyIcon}>🚨</Text>
          <Text style={styles.emergencyText}>{t(lang, 'emergency')}</Text>
        </TouchableOpacity>

        {/* Types de problèmes */}
        <Text style={styles.sectionTitle}>Type de problème</Text>
        <View style={styles.caseGrid}>
          {CASE_TYPES.map(ct => (
            <TouchableOpacity
              key={ct.key}
              style={styles.caseCard}
              onPress={() => navigation.navigate('Emergency', { lang, trip, caseType: ct.key })}
            >
              <Text style={styles.caseIcon}>{ct.icon}</Text>
              <Text style={styles.caseLabel}>{t(lang, ct.key)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Infos pays */}
        {trip?.is_active && (
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>📞 Numéros d'urgence — {trip.destination_country}</Text>
            <Text style={styles.infoLine}>🚨 Urgences générales : 112</Text>
            <Text style={styles.infoLine}>👮 Police : 091 (Espagne)</Text>
            <Text style={styles.infoLine}>🏥 Ambulance : 061 (Espagne)</Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scroll: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  greeting: { fontSize: 20, fontWeight: '600', color: '#1A3C5E' },
  subGreeting: { fontSize: 13, color: '#666', marginTop: 2 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1A3C5E', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  statusCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 14, marginBottom: 16, gap: 12 },
  statusActive: { backgroundColor: '#EAF3DE', borderWidth: 1, borderColor: '#C0DD97' },
  statusInactive: { backgroundColor: '#FEF3E2', borderWidth: 1, borderColor: '#FAC775' },
  statusIcon: { fontSize: 28 },
  statusText: { flex: 1 },
  statusTitle: { fontSize: 15, fontWeight: '600' },
  statusSub: { fontSize: 12, marginTop: 2 },
  emergencyBtn: {
    backgroundColor: '#A32D2D', borderRadius: 14,
    padding: 18, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10, marginBottom: 20,
  },
  emergencyIcon: { fontSize: 22 },
  emergencyText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  caseGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  caseCard: {
    width: '30%', backgroundColor: '#FFF', borderRadius: 12,
    padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#E8E8E8',
  },
  caseIcon: { fontSize: 26, marginBottom: 6 },
  caseLabel: { fontSize: 11, fontWeight: '500', color: '#333', textAlign: 'center' },
  infoCard: { backgroundColor: '#EBF5FB', borderRadius: 12, padding: 14, borderLeftWidth: 3, borderLeftColor: '#2E75B6' },
  infoTitle: { fontSize: 13, fontWeight: '600', color: '#1A3C5E', marginBottom: 8 },
  infoLine: { fontSize: 13, color: '#2C5F85', marginBottom: 4 },
});
