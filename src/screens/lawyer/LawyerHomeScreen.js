import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, SafeAreaView, Switch, Alert
} from 'react-native';
import { caseService, lawyerService } from '../../services/api';

export default function LawyerHomeScreen({ navigation }) {
  const [isAvailable, setIsAvailable] = useState(false);
  const [cases, setCases] = useState([]);
  const [stats, setStats] = useState({ active: 0, total: 127, earnings: 847 });

  useEffect(() => { loadCases(); }, []);

  const loadCases = async () => {
    try {
      const res = await caseService.getLawyerCases();
      setCases(res.data.cases);
    } catch {}
  };

  const toggleAvailability = async (val) => {
    setIsAvailable(val);
    try {
      await lawyerService.updateAvailability(val);
    } catch {}
  };

  const handleCase = async (caseId, status) => {
    try {
      await caseService.updateStatus(caseId, status);
      loadCases();
      if (status === 'accepted') navigation.navigate('LawyerChat', { caseId });
    } catch {
      Alert.alert('Erreur', 'Impossible de mettre à jour le dossier.');
    }
  };

  const URGENCY_COLOR = { urgent: '#A32D2D', normal: '#1A3C5E', low: '#27500A' };
  const STATUS_LABEL = { pending: '⏳ En attente', accepted: '✅ Accepté', in_progress: '🔄 En cours', resolved: '✔️ Résolu' };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Tableau de bord</Text>
            <Text style={styles.sub}>María Rodriguez · Madrid</Text>
          </View>
          <View style={styles.availRow}>
            <Text style={styles.availLabel}>{isAvailable ? '🟢 En ligne' : '🔴 Hors ligne'}</Text>
            <Switch
              value={isAvailable}
              onValueChange={toggleAvailability}
              trackColor={{ false: '#DDD', true: '#C0DD97' }}
              thumbColor={isAvailable ? '#27500A' : '#999'}
            />
          </View>
        </View>

        <View style={styles.statsRow}>
          {[
            { val: cases.filter(c => c.status === 'pending').length, lbl: 'En attente' },
            { val: stats.total, lbl: 'Total' },
            { val: `${stats.earnings}€`, lbl: 'Ce mois' },
          ].map((s, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statVal}>{s.val}</Text>
              <Text style={styles.statLbl}>{s.lbl}</Text>
            </View>
          ))}
        </View>

        {cases.filter(c => c.status === 'pending').length > 0 && (
          <>
            <Text style={styles.sectionTitle}>🚨 Nouvelles demandes</Text>
            {cases.filter(c => c.status === 'pending').map(c => (
              <View key={c.id} style={[styles.caseCard, styles.urgentCard]}>
                <View style={styles.caseHeader}>
                  <Text style={styles.caseType}>{c.case_type} · {c.urgency === 'urgent' ? '🚨 Urgent' : 'Normal'}</Text>
                  <Text style={styles.caseTime}>Maintenant</Text>
                </View>
                <Text style={styles.caseUser}>
                  {c.user.first_name} {c.user.last_name} · {c.user.nationality} · {c.country}, {c.city}
                </Text>
                <Text style={styles.caseDesc} numberOfLines={2}>{c.description}</Text>
                <View style={styles.caseActions}>
                  <TouchableOpacity style={styles.btnAccept} onPress={() => handleCase(c.id, 'accepted')}>
                    <Text style={styles.btnAcceptText}>✅ Accepter</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnDecline} onPress={() => handleCase(c.id, 'cancelled')}>
                    <Text style={styles.btnDeclineText}>Refuser</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        <Text style={styles.sectionTitle}>Dossiers en cours</Text>
        {cases.filter(c => c.status !== 'pending').map(c => (
          <TouchableOpacity
            key={c.id}
            style={styles.caseCard}
            onPress={() => navigation.navigate('LawyerChat', { caseId: c.id })}
          >
            <View style={styles.caseHeader}>
              <Text style={styles.caseType}>{c.case_type}</Text>
              <Text style={[styles.caseStatus, { color: URGENCY_COLOR[c.urgency] || '#1A3C5E' }]}>
                {STATUS_LABEL[c.status]}
              </Text>
            </View>
            <Text style={styles.caseUser}>{c.user?.first_name} · {c.country}, {c.city}</Text>
          </TouchableOpacity>
        ))}

        {cases.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>Aucun dossier pour le moment.{'\n'}Activez votre disponibilité pour recevoir des demandes.</Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scroll: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '600', color: '#1A3C5E' },
  sub: { fontSize: 13, color: '#666', marginTop: 2 },
  availRow: { alignItems: 'flex-end', gap: 4 },
  availLabel: { fontSize: 12, fontWeight: '500', color: '#444' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: '#FFF', borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#E8E8E8' },
  statVal: { fontSize: 22, fontWeight: '600', color: '#1A3C5E' },
  statLbl: { fontSize: 11, color: '#888', marginTop: 2 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10, marginTop: 4 },
  caseCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#E8E8E8' },
  urgentCard: { backgroundColor: '#FCEBEB', borderColor: '#F7C1C1' },
  caseHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  caseType: { fontSize: 14, fontWeight: '600', color: '#1A3C5E' },
  caseTime: { fontSize: 12, color: '#A32D2D', fontWeight: '500' },
  caseStatus: { fontSize: 12, fontWeight: '500' },
  caseUser: { fontSize: 13, color: '#555', marginBottom: 4 },
  caseDesc: { fontSize: 13, color: '#777', lineHeight: 18 },
  caseActions: { flexDirection: 'row', gap: 10, marginTop: 10 },
  btnAccept: { flex: 1, backgroundColor: '#1A3C5E', borderRadius: 8, padding: 10, alignItems: 'center' },
  btnAcceptText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
  btnDecline: { flex: 1, backgroundColor: 'transparent', borderRadius: 8, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: '#CCC' },
  btnDeclineText: { color: '#888', fontSize: 13 },
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 22 },
});
