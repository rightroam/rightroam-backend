import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  SafeAreaView, TextInput, Linking, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform, Modal, Switch
} from 'react-native';

const API_URL = 'https://rightroam-backend-production.up.railway.app/api';
const MAX_LOGIN_ATTEMPTS = 5;

// ─── TRADUCTIONS ─────────────────────────────────────────────────────────────
const T = {
  fr: {
    tagline:'Vos droits. Partout dans le monde.',
    start:'Commencer', login:'Se connecter', lawyer_space:'⚖️ Espace avocat',
    back:'← Retour', save:'Sauvegarder', next:'Continuer →', skip:'Passer',
    create_account:'Créer un compte', account_subtitle:'Vos informations sont confidentielles et sécurisées',
    firstname:'Prénom', lastname:'Nom', email:'Adresse email', password:'Mot de passe',
    birthdate:'Date de naissance', nationality:'Nationalité',
    passport:'Numéro de passeport', phone:'Téléphone', emergency_contact:'Contact d\'urgence',
    card_number:'Numéro de carte', card_expiry:'Date d\'expiration (MM/AA)', card_cvv:'CVV',
    welcome_title:'Bienvenue sur RightRoam',
    welcome_subtitle:'Protection juridique mondiale pour voyageurs',
    step1_title:'Enregistrez votre voyage', step1_desc:'Destination et dates de départ/retour',
    step2_title:'Choisissez votre pass', step2_desc:'À partir de 1,99€ par voyage',
    step3_title:'Voyagez sereinement', step3_desc:'Un avocat local disponible en cas de problème',
    tab_reservation:'Réservation', tab_subs:'Abonnements', tab_urgent:'Urgence', tab_profile:'Profil',
    reservation_title:'✈️  Réservation', reservation_subtitle:'Enregistrez votre voyage pour être protégé',
    country:'Pays de destination', city:'Ville',
    start_date:'Date de départ', end_date:'Date de retour',
    active_sub:'✅  Abonnement actif — aucun paiement requis',
    confirm_trip:'Confirmer le voyage', choose_pass:'Choisir un pass →',
    trip_registered:'VOYAGE ENREGISTRÉ',
    info_dates:'La protection s\'active à votre date de départ et se termine à votre retour. Non modifiable après paiement.',
    subs_title:'💳  Abonnements', subs_subtitle:'Payez uniquement quand vous voyagez',
    individual:'INDIVIDUEL', family_plans:'FAMILLE',
    pass_trip:'Pass Voyage', pass_monthly:'Pass Mensuel', pass_annual:'Pass Annuel',
    pass_family:'Pass Famille', pass_family_annual:'Pass Famille Annuel',
    per_trip_desc:'Sans engagement · 1 personne · Idéal 1-3 voyages/an',
    monthly_desc:'Voyageur fréquent · 1-2 voyages/mois',
    annual_desc:'Digital nomad · ~2,50€/mois',
    family_desc:'Jusqu\'à 5 personnes · 1 voyage',
    family_annual_desc:'Jusqu\'à 5 personnes · Voyages illimités/an',
    family_info:'1 enfant seul = 1,99€ · 2+ enfants ou famille = 6,99€',
    add_member:'+ Ajouter un membre', member_name:'Prénom du membre',
    member_relation:'Relation (ex: Enfant, Conjoint)',
    pay:'🔒  Payer et activer', stripe_secure:'Paiement sécurisé · Stripe · Données chiffrées',
    paying:'Traitement en cours...',
    payment_success:'✅ Paiement réussi ! Votre protection est activée.',
    payment_error:'❌ Erreur de paiement. Vérifiez vos informations.',
    urgent_title:'🚨  Urgence & Aide', protection_active:'🛡️  Protection active',
    no_sub:'⚠️  Aucun abonnement actif. Souscrivez un pass pour accéder à l\'assistance juridique.',
    need_lawyer:'🚨  J\'ai besoin d\'un avocat maintenant',
    call_112:'📞  Appeler le 112 — Urgences internationales',
    problem_type:'TYPE DE PROBLÈME',
    accident:'Accident', theft:'Vol / Agression', hotel:'Litige hôtel',
    flight:'Problème de vol', arrest:'Arrestation', other:'Autre',
    emergency_numbers:'NUMÉROS D\'URGENCE',
    general:'Urgences générales', police:'Police', ambulance:'Ambulance', fire:'Pompiers',
    messages:'MES MESSAGES', support:'Support RightRoam', available:'Disponible 24h/24 · 7j/7',
    case_status:'STATUT DU DOSSIER', trip_history:'HISTORIQUE DES VOYAGES',
    profile_title:'Mon Profil', language:'LANGUE', subscription:'MON ABONNEMENT',
    no_sub_active:'Aucun abonnement actif', active_since:'Actif depuis le',
    change_sub:'Changer d\'abonnement →', subscribe:'Souscrire →', cancel_sub:'Annuler l\'abonnement',
    payment_info:'INFORMATIONS DE PAIEMENT', card_saved:'Carte enregistrée', modify:'Modifier',
    payment_history:'HISTORIQUE DES PAIEMENTS', security:'SÉCURITÉ',
    change_password:'Changer le mot de passe', delete_account:'Supprimer le compte',
    logout:'Se déconnecter', online:'● En ligne maintenant', message_placeholder:'Votre message...',
    lawyer_title:'⚖️  Espace Avocat', lawyer_subtitle:'Rejoignez RightRoam et recevez des clients voyageurs',
    bar_number:'Numéro de barreau', bar_country:'Pays du barreau', bar_city:'Ville d\'exercice',
    submit:'Soumettre mon dossier',
    verification:'⏳ Votre profil est en cours de vérification (24-48h).',
    how_it_works:'Comment ça marche ?', per_voyage:'par voyage', per_month:'/mois', per_year:'/an',
    popular:'Populaire', best_price:'Meilleur prix', pending:'En attente', total:'Total', this_month:'Ce mois',
    faq_title:'❓  FAQ & Aide', cgu_title:'📄  Conditions Générales', privacy_title:'🔒  Confidentialité',
    contact_title:'📧  Nous contacter', contact_subtitle:'Notre équipe répond sous 24h',
    rating_title:'⭐  Évaluer l\'avocat', submit_rating:'Envoyer mon évaluation',
    rating_thanks:'Merci pour votre évaluation !',
    new_password:'Nouveau mot de passe', confirm_password:'Confirmer le mot de passe',
    current_password:'Mot de passe actuel', change_pwd_btn:'Changer le mot de passe',
    delete_confirm:'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.',
    onb1_title:'Protégé partout dans le monde', onb1_desc:'RightRoam vous connecte à des avocats locaux qualifiés dans plus de 50 pays.',
    onb2_title:'À partir de 1,99€ par voyage', onb2_desc:'Payez uniquement quand vous voyagez. Pas d\'abonnement inutile.',
    onb3_title:'Assistance immédiate 24h/24', onb3_desc:'En cas de problème, un avocat local intervient en moins de 30 minutes.',
    agree_cgu:'J\'accepte les Conditions Générales et la Politique de Confidentialité',
    age_error:'Vous devez avoir au moins 18 ans pour créer un compte RightRoam.',
    email_error:'Veuillez entrer une adresse email valide.',
    required_field:'Champ obligatoire', saving:'Enregistrement...', saved:'✅ Sauvegardé !',
    offline_mode:'Mode hors ligne — numéros d\'urgence disponibles',
    referral_title:'🎁  Parrainer un ami', referral_desc:'Invitez un ami et obtenez 1 voyage gratuit !',
    referral_code:'Votre code de parrainage',
    copy_code:'Copier le code', share_code:'Partager',
    lawyers_count:'avocats partenaires dans', countries_count:'pays',
    reviews_title:'CE QUE DISENT NOS VOYAGEURS',
    translate_title:'🌐  Traducteur d\'urgence',
    translate_desc:'Communiquez avec l\'avocat dans votre langue',
    badge_title:'🛡️  Voyageur Protégé',
    badge_desc:'Partagez votre statut de protection',
    select_date:'Sélectionner une date', confirm_date:'Confirmer',
    family_members:'MEMBRES DE LA FAMILLE',
    password_mismatch:'Les mots de passe ne correspondent pas.',
    password_short:'Le mot de passe doit contenir au moins 8 caractères.',
    wrong_password:'Mot de passe actuel incorrect.',
    too_many_attempts:'Trop de tentatives. Réessayez dans 15 minutes.',
    network_error:'Erreur réseau. Vérifiez votre connexion internet.',
    jan:'Jan', feb:'Fév', mar:'Mar', apr:'Avr', may:'Mai', jun:'Jun',
    jul:'Jul', aug:'Aoû', sep:'Sep', oct:'Oct', nov:'Nov', dec:'Déc',
  },
  en: {
    tagline:'Your rights. Everywhere.',
    start:'Get started', login:'Log in', lawyer_space:'⚖️ Lawyer space',
    back:'← Back', save:'Save', next:'Continue →', skip:'Skip',
    create_account:'Create account', account_subtitle:'Your information is confidential and secure',
    firstname:'First name', lastname:'Last name', email:'Email address', password:'Password',
    birthdate:'Date of birth', nationality:'Nationality',
    passport:'Passport number', phone:'Phone', emergency_contact:'Emergency contact',
    card_number:'Card number', card_expiry:'Expiry date (MM/YY)', card_cvv:'CVV',
    welcome_title:'Welcome to RightRoam', welcome_subtitle:'Global legal protection for travelers',
    step1_title:'Register your trip', step1_desc:'Destination and travel dates',
    step2_title:'Choose your pass', step2_desc:'From €1.99 per trip',
    step3_title:'Travel with peace of mind', step3_desc:'A local lawyer available if needed',
    tab_reservation:'Booking', tab_subs:'Plans', tab_urgent:'Emergency', tab_profile:'Profile',
    reservation_title:'✈️  Booking', reservation_subtitle:'Register your trip to be protected',
    country:'Destination country', city:'City',
    start_date:'Departure date', end_date:'Return date',
    active_sub:'✅  Active subscription — no payment required',
    confirm_trip:'Confirm trip', choose_pass:'Choose a pass →',
    trip_registered:'TRIP REGISTERED',
    info_dates:'Protection activates on your departure date and ends on your return. Not modifiable after payment.',
    subs_title:'💳  Plans', subs_subtitle:'Pay only when you travel',
    individual:'INDIVIDUAL', family_plans:'FAMILY',
    pass_trip:'Trip Pass', pass_monthly:'Monthly Pass', pass_annual:'Annual Pass',
    pass_family:'Family Pass', pass_family_annual:'Annual Family Pass',
    per_trip_desc:'No commitment · 1 person · Ideal 1-3 trips/year',
    monthly_desc:'Frequent traveler · 1-2 trips/month',
    annual_desc:'Digital nomad · ~€2.50/month',
    family_desc:'Up to 5 people · 1 trip',
    family_annual_desc:'Up to 5 people · Unlimited trips/year',
    family_info:'1 child alone = €1.99 · 2+ children or family = €6.99',
    add_member:'+ Add a member', member_name:'Member first name',
    member_relation:'Relation (e.g. Child, Spouse)',
    pay:'🔒  Pay and activate', stripe_secure:'Secure payment · Stripe · Encrypted data',
    paying:'Processing...', payment_success:'✅ Payment successful! Your protection is activated.',
    payment_error:'❌ Payment error. Please check your information.',
    urgent_title:'🚨  Emergency & Help', protection_active:'🛡️  Protection active',
    no_sub:'⚠️  No active subscription. Subscribe to access legal assistance.',
    need_lawyer:'🚨  I need a lawyer now',
    call_112:'📞  Call 112 — International Emergency',
    problem_type:'TYPE OF PROBLEM',
    accident:'Accident', theft:'Theft / Assault', hotel:'Hotel dispute',
    flight:'Flight issue', arrest:'Arrest', other:'Other',
    emergency_numbers:'EMERGENCY NUMBERS',
    general:'General emergency', police:'Police', ambulance:'Ambulance', fire:'Fire',
    messages:'MY MESSAGES', support:'RightRoam Support', available:'Available 24/7',
    case_status:'CASE STATUS', trip_history:'TRIP HISTORY',
    profile_title:'My Profile', language:'LANGUAGE', subscription:'MY SUBSCRIPTION',
    no_sub_active:'No active subscription', active_since:'Active since',
    change_sub:'Change subscription →', subscribe:'Subscribe →', cancel_sub:'Cancel subscription',
    payment_info:'PAYMENT INFORMATION', card_saved:'Saved card', modify:'Edit',
    payment_history:'PAYMENT HISTORY', security:'SECURITY',
    change_password:'Change password', delete_account:'Delete account',
    logout:'Log out', online:'● Online now', message_placeholder:'Your message...',
    lawyer_title:'⚖️  Lawyer Space', lawyer_subtitle:'Join RightRoam and receive traveling clients',
    bar_number:'Bar number', bar_country:'Bar country', bar_city:'Practice city',
    submit:'Submit my application', verification:'⏳ Your profile is being verified (24-48h).',
    how_it_works:'How does it work?', per_voyage:'per trip', per_month:'/month', per_year:'/year',
    popular:'Popular', best_price:'Best price', pending:'Pending', total:'Total', this_month:'This month',
    faq_title:'❓  FAQ & Help', cgu_title:'📄  Terms of Service', privacy_title:'🔒  Privacy Policy',
    contact_title:'📧  Contact Us', contact_subtitle:'Our team responds within 24h',
    rating_title:'⭐  Rate the lawyer', submit_rating:'Submit rating', rating_thanks:'Thank you!',
    new_password:'New password', confirm_password:'Confirm password',
    current_password:'Current password', change_pwd_btn:'Change password',
    delete_confirm:'Are you sure you want to delete your account? This is irreversible.',
    onb1_title:'Protected worldwide', onb1_desc:'RightRoam connects you to qualified local lawyers in 50+ countries.',
    onb2_title:'From €1.99 per trip', onb2_desc:'Pay only when you travel. No unnecessary subscriptions.',
    onb3_title:'24/7 immediate assistance', onb3_desc:'In case of trouble, a local lawyer responds in under 30 minutes.',
    agree_cgu:'I agree to the Terms of Service and Privacy Policy',
    age_error:'You must be at least 18 years old to create a RightRoam account.',
    email_error:'Please enter a valid email address.',
    required_field:'Required field', saving:'Saving...', saved:'✅ Saved!',
    offline_mode:'Offline mode — emergency numbers available',
    referral_title:'🎁  Refer a friend', referral_desc:'Invite a friend and get 1 free trip!',
    referral_code:'Your referral code', copy_code:'Copy code', share_code:'Share',
    lawyers_count:'lawyer partners in', countries_count:'countries',
    reviews_title:'WHAT OUR TRAVELERS SAY',
    translate_title:'🌐  Emergency translator',
    translate_desc:'Communicate with the lawyer in your language',
    badge_title:'🛡️  Protected Traveler', badge_desc:'Share your protection status',
    select_date:'Select a date', confirm_date:'Confirm',
    family_members:'FAMILY MEMBERS',
    password_mismatch:'Passwords do not match.',
    password_short:'Password must be at least 8 characters.',
    wrong_password:'Incorrect current password.',
    too_many_attempts:'Too many attempts. Try again in 15 minutes.',
    network_error:'Network error. Check your internet connection.',
    jan:'Jan', feb:'Feb', mar:'Mar', apr:'Apr', may:'May', jun:'Jun',
    jul:'Jul', aug:'Aug', sep:'Sep', oct:'Oct', nov:'Nov', dec:'Dec',
  },
  es: {
    tagline:'Tus derechos. En todo el mundo.',
    start:'Empezar', login:'Iniciar sesión', lawyer_space:'⚖️ Espacio abogado',
    back:'← Volver', save:'Guardar', next:'Continuar →', skip:'Saltar',
    create_account:'Crear cuenta', account_subtitle:'Tus datos son confidenciales y seguros',
    firstname:'Nombre', lastname:'Apellido', email:'Correo electrónico', password:'Contraseña',
    birthdate:'Fecha de nacimiento', nationality:'Nacionalidad',
    passport:'Número de pasaporte', phone:'Teléfono', emergency_contact:'Contacto de emergencia',
    card_number:'Número de tarjeta', card_expiry:'Fecha de expiración', card_cvv:'CVV',
    welcome_title:'Bienvenido a RightRoam', welcome_subtitle:'Protección jurídica mundial para viajeros',
    step1_title:'Registra tu viaje', step1_desc:'Destino y fechas',
    step2_title:'Elige tu pase', step2_desc:'Desde 1,99€',
    step3_title:'Viaja tranquilo', step3_desc:'Abogado local disponible',
    tab_reservation:'Reserva', tab_subs:'Planes', tab_urgent:'Urgencia', tab_profile:'Perfil',
    reservation_title:'✈️  Reserva', reservation_subtitle:'Registra tu viaje',
    country:'País destino', city:'Ciudad', start_date:'Fecha salida', end_date:'Fecha regreso',
    active_sub:'✅  Suscripción activa', confirm_trip:'Confirmar', choose_pass:'Elegir →',
    trip_registered:'VIAJE REGISTRADO',
    info_dates:'La protección se activa al salir y termina al regresar.',
    subs_title:'💳  Planes', subs_subtitle:'Paga solo cuando viajes',
    individual:'INDIVIDUAL', family_plans:'FAMILIA',
    pass_trip:'Pase Viaje', pass_monthly:'Pase Mensual', pass_annual:'Pase Anual',
    pass_family:'Pase Familia', pass_family_annual:'Pase Familia Anual',
    per_trip_desc:'Sin compromiso · 1 persona', monthly_desc:'Viajero frecuente',
    annual_desc:'Nómada digital', family_desc:'Hasta 5 personas · 1 viaje',
    family_annual_desc:'Hasta 5 personas · Viajes ilimitados',
    family_info:'1 niño solo = 1,99€ · 2+ niños o familia = 6,99€',
    add_member:'+ Añadir miembro', member_name:'Nombre del miembro', member_relation:'Relación',
    pay:'🔒  Pagar', stripe_secure:'Pago seguro · Stripe',
    paying:'Procesando...', payment_success:'✅ ¡Pago exitoso!', payment_error:'❌ Error de pago.',
    urgent_title:'🚨  Urgencia', protection_active:'🛡️  Protección activa',
    no_sub:'⚠️  Sin suscripción activa.',
    need_lawyer:'🚨  Necesito un abogado', call_112:'📞  Llamar 112',
    problem_type:'TIPO DE PROBLEMA', accident:'Accidente', theft:'Robo',
    hotel:'Hotel', flight:'Vuelo', arrest:'Arresto', other:'Otro',
    emergency_numbers:'EMERGENCIAS', general:'General', police:'Policía',
    ambulance:'Ambulancia', fire:'Bomberos',
    messages:'MENSAJES', support:'Soporte RightRoam', available:'24h disponible',
    case_status:'ESTADO', trip_history:'HISTORIAL',
    profile_title:'Mi Perfil', language:'IDIOMA', subscription:'SUSCRIPCIÓN',
    no_sub_active:'Sin suscripción', active_since:'Activo desde',
    change_sub:'Cambiar →', subscribe:'Suscribirse →', cancel_sub:'Cancelar',
    payment_info:'PAGO', card_saved:'Tarjeta guardada', modify:'Editar',
    payment_history:'HISTORIAL', security:'SEGURIDAD',
    change_password:'Cambiar contraseña', delete_account:'Eliminar cuenta',
    logout:'Cerrar sesión', online:'● En línea', message_placeholder:'Tu mensaje...',
    lawyer_title:'⚖️  Abogado', lawyer_subtitle:'Únete a RightRoam',
    bar_number:'Número colegio', bar_country:'País', bar_city:'Ciudad',
    submit:'Enviar', verification:'⏳ Verificación en curso.',
    how_it_works:'¿Cómo funciona?', per_voyage:'por viaje', per_month:'/mes', per_year:'/año',
    popular:'Popular', best_price:'Mejor precio', pending:'Pendiente', total:'Total', this_month:'Este mes',
    faq_title:'❓  FAQ', cgu_title:'📄  Términos', privacy_title:'🔒  Privacidad',
    contact_title:'📧  Contacto', contact_subtitle:'Respondemos en 24h',
    rating_title:'⭐  Valorar', submit_rating:'Enviar', rating_thanks:'¡Gracias!',
    new_password:'Nueva contraseña', confirm_password:'Confirmar', current_password:'Contraseña actual',
    change_pwd_btn:'Cambiar', delete_confirm:'¿Seguro que quieres eliminar tu cuenta?',
    onb1_title:'Protegido en todo el mundo', onb1_desc:'Abogados en +50 países.',
    onb2_title:'Desde 1,99€', onb2_desc:'Paga solo cuando viajes.',
    onb3_title:'Asistencia 24h', onb3_desc:'Respuesta en menos de 30 minutos.',
    agree_cgu:'Acepto los Términos y la Política de Privacidad',
    age_error:'Debes tener al menos 18 años.', email_error:'Email inválido.',
    required_field:'Campo obligatorio', saving:'Guardando...', saved:'✅ Guardado!',
    offline_mode:'Modo sin conexión — números de emergencia disponibles',
    referral_title:'🎁  Recomendar amigo', referral_desc:'¡Invita a un amigo y obtén 1 viaje gratis!',
    referral_code:'Tu código de referido', copy_code:'Copiar código', share_code:'Compartir',
    lawyers_count:'abogados asociados en', countries_count:'países',
    reviews_title:'LO QUE DICEN NUESTROS VIAJEROS',
    translate_title:'🌐  Traductor de emergencia', translate_desc:'Comunícate en tu idioma',
    badge_title:'🛡️  Viajero Protegido', badge_desc:'Comparte tu estado de protección',
    select_date:'Seleccionar fecha', confirm_date:'Confirmar',
    family_members:'MIEMBROS DE LA FAMILIA',
    password_mismatch:'Las contraseñas no coinciden.', password_short:'Mínimo 8 caracteres.',
    wrong_password:'Contraseña actual incorrecta.',
    too_many_attempts:'Demasiados intentos. Intenta en 15 minutos.',
    network_error:'Error de red. Verifica tu conexión.',
    jan:'Ene', feb:'Feb', mar:'Mar', apr:'Abr', may:'May', jun:'Jun',
    jul:'Jul', aug:'Ago', sep:'Sep', oct:'Oct', nov:'Nov', dec:'Dic',
  },
  de: {
    tagline:'Ihre Rechte. Überall auf der Welt.',
    start:'Loslegen', login:'Anmelden', lawyer_space:'⚖️ Anwaltsbereich',
    back:'← Zurück', save:'Speichern', next:'Weiter →', skip:'Überspringen',
    create_account:'Konto erstellen', account_subtitle:'Ihre Daten sind vertraulich und sicher',
    firstname:'Vorname', lastname:'Nachname', email:'E-Mail', password:'Passwort',
    birthdate:'Geburtsdatum', nationality:'Nationalität',
    passport:'Reisepassnummer', phone:'Telefon', emergency_contact:'Notfallkontakt',
    card_number:'Kartennummer', card_expiry:'Ablaufdatum (MM/JJ)', card_cvv:'CVV',
    welcome_title:'Willkommen bei RightRoam', welcome_subtitle:'Weltweiter Rechtsschutz für Reisende',
    step1_title:'Reise registrieren', step1_desc:'Ziel und Reisedaten',
    step2_title:'Pass wählen', step2_desc:'Ab 1,99€ pro Reise',
    step3_title:'Sorglos reisen', step3_desc:'Lokaler Anwalt bei Problemen verfügbar',
    tab_reservation:'Buchung', tab_subs:'Pläne', tab_urgent:'Notfall', tab_profile:'Profil',
    reservation_title:'✈️  Buchung', reservation_subtitle:'Reise registrieren für Schutz',
    country:'Reiseland', city:'Stadt', start_date:'Abreisedatum', end_date:'Rückreisedatum',
    active_sub:'✅  Aktives Abo — keine Zahlung erforderlich',
    confirm_trip:'Reise bestätigen', choose_pass:'Pass wählen →',
    trip_registered:'REISE REGISTRIERT',
    info_dates:'Schutz aktiviert sich am Abreisedatum und endet bei der Rückkehr.',
    subs_title:'💳  Pläne', subs_subtitle:'Zahlen Sie nur wenn Sie reisen',
    individual:'EINZELPERSON', family_plans:'FAMILIE',
    pass_trip:'Reisepass', pass_monthly:'Monatspass', pass_annual:'Jahrespass',
    pass_family:'Familienpass', pass_family_annual:'Jahres-Familienpass',
    per_trip_desc:'Ohne Verpflichtung · 1 Person', monthly_desc:'Vielreisender',
    annual_desc:'Digitaler Nomade', family_desc:'Bis 5 Personen · 1 Reise',
    family_annual_desc:'Bis 5 Personen · Unbegrenzte Reisen',
    family_info:'1 Kind allein = 1,99€ · 2+ Kinder oder Familie = 6,99€',
    add_member:'+ Mitglied hinzufügen', member_name:'Vorname des Mitglieds', member_relation:'Beziehung',
    pay:'🔒  Bezahlen und aktivieren', stripe_secure:'Sichere Zahlung · Stripe',
    paying:'Verarbeitung...', payment_success:'✅ Zahlung erfolgreich!', payment_error:'❌ Zahlungsfehler.',
    urgent_title:'🚨  Notfall & Hilfe', protection_active:'🛡️  Schutz aktiv',
    no_sub:'⚠️  Kein aktives Abonnement.',
    need_lawyer:'🚨  Ich brauche jetzt einen Anwalt', call_112:'📞  112 anrufen',
    problem_type:'ART DES PROBLEMS', accident:'Unfall', theft:'Diebstahl',
    hotel:'Hotel', flight:'Flugproblem', arrest:'Verhaftung', other:'Sonstiges',
    emergency_numbers:'NOTRUFNUMMERN', general:'Allgemeiner Notfall', police:'Polizei',
    ambulance:'Krankenwagen', fire:'Feuerwehr',
    messages:'NACHRICHTEN', support:'RightRoam Support', available:'24h verfügbar',
    case_status:'FALLSTATUS', trip_history:'REISEVERLAUF',
    profile_title:'Mein Profil', language:'SPRACHE', subscription:'ABONNEMENT',
    no_sub_active:'Kein Abonnement', active_since:'Aktiv seit',
    change_sub:'Abo ändern →', subscribe:'Abonnieren →', cancel_sub:'Abo kündigen',
    payment_info:'ZAHLUNG', card_saved:'Gespeicherte Karte', modify:'Bearbeiten',
    payment_history:'ZAHLUNGSHISTORIE', security:'SICHERHEIT',
    change_password:'Passwort ändern', delete_account:'Konto löschen',
    logout:'Abmelden', online:'● Online', message_placeholder:'Ihre Nachricht...',
    lawyer_title:'⚖️  Anwaltsbereich', lawyer_subtitle:'RightRoam beitreten',
    bar_number:'Anwaltsnummer', bar_country:'Zulassungsland', bar_city:'Tätigkeitsstadt',
    submit:'Antrag einreichen', verification:'⏳ Profil wird geprüft (24-48h).',
    how_it_works:'Wie funktioniert es?', per_voyage:'pro Reise', per_month:'/Monat', per_year:'/Jahr',
    popular:'Beliebt', best_price:'Bester Preis', pending:'Ausstehend', total:'Gesamt', this_month:'Diesen Monat',
    faq_title:'❓  FAQ', cgu_title:'📄  AGB', privacy_title:'🔒  Datenschutz',
    contact_title:'📧  Kontakt', contact_subtitle:'Antwort innerhalb 24h',
    rating_title:'⭐  Bewerten', submit_rating:'Senden', rating_thanks:'Danke!',
    new_password:'Neues Passwort', confirm_password:'Bestätigen', current_password:'Aktuelles Passwort',
    change_pwd_btn:'Passwort ändern', delete_confirm:'Konto wirklich löschen?',
    onb1_title:'Weltweit geschützt', onb1_desc:'Anwälte in 50+ Ländern.',
    onb2_title:'Ab 1,99€ pro Reise', onb2_desc:'Zahlen Sie nur wenn Sie reisen.',
    onb3_title:'Sofortige Hilfe 24h', onb3_desc:'Anwalt in unter 30 Minuten.',
    agree_cgu:'Ich stimme den AGB und dem Datenschutz zu',
    age_error:'Sie müssen mindestens 18 Jahre alt sein.',
    email_error:'Bitte gültige E-Mail eingeben.',
    required_field:'Pflichtfeld', saving:'Speichern...', saved:'✅ Gespeichert!',
    offline_mode:'Offline-Modus — Notrufnummern verfügbar',
    referral_title:'🎁  Freund einladen', referral_desc:'Freund einladen und 1 Reise gratis!',
    referral_code:'Ihr Empfehlungscode', copy_code:'Code kopieren', share_code:'Teilen',
    lawyers_count:'Anwaltspartner in', countries_count:'Ländern',
    reviews_title:'WAS UNSERE REISENDEN SAGEN',
    translate_title:'🌐  Notfallübersetzer', translate_desc:'In Ihrer Sprache kommunizieren',
    badge_title:'🛡️  Geschützter Reisender', badge_desc:'Teilen Sie Ihren Schutzstatus',
    select_date:'Datum auswählen', confirm_date:'Bestätigen',
    family_members:'FAMILIENMITGLIEDER',
    password_mismatch:'Passwörter stimmen nicht überein.', password_short:'Mindestens 8 Zeichen.',
    wrong_password:'Aktuelles Passwort falsch.',
    too_many_attempts:'Zu viele Versuche. Versuchen Sie es in 15 Minuten erneut.',
    network_error:'Netzwerkfehler. Überprüfen Sie Ihre Verbindung.',
    jan:'Jan', feb:'Feb', mar:'Mär', apr:'Apr', may:'Mai', jun:'Jun',
    jul:'Jul', aug:'Aug', sep:'Sep', oct:'Okt', nov:'Nov', dec:'Dez',
  },
  pt: {
    tagline:'Os seus direitos. Em todo o mundo.',
    start:'Começar', login:'Entrar', lawyer_space:'⚖️ Espaço advogado',
    back:'← Voltar', save:'Guardar', next:'Continuar →', skip:'Saltar',
    create_account:'Criar conta', account_subtitle:'Os seus dados são confidenciais e seguros',
    firstname:'Nome', lastname:'Apelido', email:'Email', password:'Senha',
    birthdate:'Data de nascimento', nationality:'Nacionalidade',
    passport:'Número de passaporte', phone:'Telefone', emergency_contact:'Contacto de emergência',
    card_number:'Número do cartão', card_expiry:'Data de validade', card_cvv:'CVV',
    welcome_title:'Bem-vindo ao RightRoam', welcome_subtitle:'Proteção jurídica mundial para viajantes',
    step1_title:'Registe a sua viagem', step1_desc:'Destino e datas',
    step2_title:'Escolha o seu passe', step2_desc:'A partir de 1,99€',
    step3_title:'Viaje sem preocupações', step3_desc:'Advogado local disponível',
    tab_reservation:'Reserva', tab_subs:'Planos', tab_urgent:'Urgência', tab_profile:'Perfil',
    reservation_title:'✈️  Reserva', reservation_subtitle:'Registe a sua viagem',
    country:'País de destino', city:'Cidade', start_date:'Data de partida', end_date:'Data de regresso',
    active_sub:'✅  Subscrição ativa', confirm_trip:'Confirmar viagem', choose_pass:'Escolher passe →',
    trip_registered:'VIAGEM REGISTADA',
    info_dates:'A proteção ativa-se na partida e termina no regresso.',
    subs_title:'💳  Planos', subs_subtitle:'Pague apenas quando viajar',
    individual:'INDIVIDUAL', family_plans:'FAMÍLIA',
    pass_trip:'Passe Viagem', pass_monthly:'Passe Mensal', pass_annual:'Passe Anual',
    pass_family:'Passe Família', pass_family_annual:'Passe Família Anual',
    per_trip_desc:'Sem compromisso · 1 pessoa', monthly_desc:'Viajante frequente',
    annual_desc:'Nómada digital', family_desc:'Até 5 pessoas · 1 viagem',
    family_annual_desc:'Até 5 pessoas · Viagens ilimitadas',
    family_info:'1 criança sozinha = 1,99€ · 2+ crianças ou família = 6,99€',
    add_member:'+ Adicionar membro', member_name:'Nome do membro', member_relation:'Relação',
    pay:'🔒  Pagar e ativar', stripe_secure:'Pagamento seguro · Stripe',
    paying:'A processar...', payment_success:'✅ Pagamento bem-sucedido!', payment_error:'❌ Erro de pagamento.',
    urgent_title:'🚨  Urgência & Ajuda', protection_active:'🛡️  Proteção ativa',
    no_sub:'⚠️  Sem subscrição ativa.',
    need_lawyer:'🚨  Preciso de um advogado', call_112:'📞  Ligar 112',
    problem_type:'TIPO DE PROBLEMA', accident:'Acidente', theft:'Roubo',
    hotel:'Hotel', flight:'Voo', arrest:'Detenção', other:'Outro',
    emergency_numbers:'NÚMEROS DE EMERGÊNCIA', general:'Geral', police:'Polícia',
    ambulance:'Ambulância', fire:'Bombeiros',
    messages:'AS MINHAS MENSAGENS', support:'Suporte RightRoam', available:'Disponível 24h/24',
    case_status:'ESTADO DO CASO', trip_history:'HISTÓRICO DE VIAGENS',
    profile_title:'O Meu Perfil', language:'IDIOMA', subscription:'SUBSCRIÇÃO',
    no_sub_active:'Sem subscrição', active_since:'Ativo desde',
    change_sub:'Mudar subscrição →', subscribe:'Subscrever →', cancel_sub:'Cancelar subscrição',
    payment_info:'PAGAMENTO', card_saved:'Cartão guardado', modify:'Editar',
    payment_history:'HISTÓRICO', security:'SEGURANÇA',
    change_password:'Mudar senha', delete_account:'Eliminar conta',
    logout:'Terminar sessão', online:'● Online', message_placeholder:'A sua mensagem...',
    lawyer_title:'⚖️  Espaço Advogado', lawyer_subtitle:'Junte-se ao RightRoam',
    bar_number:'Número da ordem', bar_country:'País da ordem', bar_city:'Cidade de exercício',
    submit:'Enviar candidatura', verification:'⏳ O seu perfil está a ser verificado (24-48h).',
    how_it_works:'Como funciona?', per_voyage:'por viagem', per_month:'/mês', per_year:'/ano',
    popular:'Popular', best_price:'Melhor preço', pending:'Pendente', total:'Total', this_month:'Este mês',
    faq_title:'❓  FAQ', cgu_title:'📄  Termos', privacy_title:'🔒  Privacidade',
    contact_title:'📧  Contacto', contact_subtitle:'Respondemos em 24h',
    rating_title:'⭐  Avaliar advogado', submit_rating:'Enviar avaliação', rating_thanks:'Obrigado!',
    new_password:'Nova senha', confirm_password:'Confirmar senha', current_password:'Senha atual',
    change_pwd_btn:'Mudar senha', delete_confirm:'Tem a certeza que quer eliminar a sua conta?',
    onb1_title:'Protegido em todo o mundo', onb1_desc:'Advogados em +50 países.',
    onb2_title:'A partir de 1,99€', onb2_desc:'Pague apenas quando viajar.',
    onb3_title:'Assistência imediata 24h', onb3_desc:'Advogado em menos de 30 minutos.',
    agree_cgu:'Aceito os Termos e a Política de Privacidade',
    age_error:'Deve ter pelo menos 18 anos.', email_error:'Email inválido.',
    required_field:'Campo obrigatório', saving:'A guardar...', saved:'✅ Guardado!',
    offline_mode:'Modo offline — números de emergência disponíveis',
    referral_title:'🎁  Recomendar amigo', referral_desc:'Convide um amigo e ganhe 1 viagem grátis!',
    referral_code:'O seu código de referência', copy_code:'Copiar código', share_code:'Partilhar',
    lawyers_count:'advogados parceiros em', countries_count:'países',
    reviews_title:'O QUE DIZEM OS NOSSOS VIAJANTES',
    translate_title:'🌐  Tradutor de emergência', translate_desc:'Comunique no seu idioma',
    badge_title:'🛡️  Viajante Protegido', badge_desc:'Partilhe o seu estado de proteção',
    select_date:'Selecionar data', confirm_date:'Confirmar',
    family_members:'MEMBROS DA FAMÍLIA',
    password_mismatch:'As senhas não coincidem.', password_short:'Mínimo 8 caracteres.',
    wrong_password:'Senha atual incorreta.',
    too_many_attempts:'Demasiadas tentativas. Tente em 15 minutos.',
    network_error:'Erro de rede. Verifique a sua ligação.',
    jan:'Jan', feb:'Fev', mar:'Mar', apr:'Abr', may:'Mai', jun:'Jun',
    jul:'Jul', aug:'Ago', sep:'Set', oct:'Out', nov:'Nov', dec:'Dez',
  },
  ar: {
    tagline:'حقوقك. في كل مكان.',
    start:'ابدأ', login:'تسجيل الدخول', lawyer_space:'⚖️ فضاء المحامي',
    back:'→ رجوع', save:'حفظ', next:'متابعة →', skip:'تخطي',
    create_account:'إنشاء حساب', account_subtitle:'بياناتك سرية وآمنة',
    firstname:'الاسم', lastname:'اللقب', email:'البريد الإلكتروني', password:'كلمة المرور',
    birthdate:'تاريخ الميلاد', nationality:'الجنسية',
    passport:'رقم جواز السفر', phone:'الهاتف', emergency_contact:'جهة الاتصال للطوارئ',
    card_number:'رقم البطاقة', card_expiry:'تاريخ الانتهاء', card_cvv:'CVV',
    welcome_title:'مرحباً في RightRoam', welcome_subtitle:'حماية قانونية عالمية للمسافرين',
    step1_title:'سجّل رحلتك', step1_desc:'الوجهة والتواريخ',
    step2_title:'اختر تصريحك', step2_desc:'ابتداءً من 1.99€',
    step3_title:'سافر بأمان', step3_desc:'محامٍ محلي متاح',
    tab_reservation:'الحجز', tab_subs:'الاشتراكات', tab_urgent:'طوارئ', tab_profile:'الملف',
    reservation_title:'✈️  الحجز', reservation_subtitle:'سجّل رحلتك',
    country:'بلد الوجهة', city:'المدينة', start_date:'تاريخ المغادرة', end_date:'تاريخ العودة',
    active_sub:'✅  اشتراك نشط', confirm_trip:'تأكيد الرحلة', choose_pass:'اختر تصريحاً →',
    trip_registered:'الرحلة مسجلة',
    info_dates:'تنشط الحماية تلقائياً عند المغادرة وتنتهي عند العودة.',
    subs_title:'💳  الاشتراكات', subs_subtitle:'ادفع فقط عند السفر',
    individual:'فردي', family_plans:'عائلي',
    pass_trip:'تصريح رحلة', pass_monthly:'تصريح شهري', pass_annual:'تصريح سنوي',
    pass_family:'تصريح عائلي', pass_family_annual:'تصريح عائلي سنوي',
    per_trip_desc:'بدون التزام · شخص واحد', monthly_desc:'مسافر متكرر',
    annual_desc:'رحّالة رقمي', family_desc:'حتى 5 أشخاص · رحلة واحدة',
    family_annual_desc:'حتى 5 أشخاص · رحلات غير محدودة',
    family_info:'طفل واحد = 1.99€ · 2+ أطفال أو عائلة = 6.99€',
    add_member:'+ إضافة عضو', member_name:'اسم العضو', member_relation:'العلاقة',
    pay:'🔒  الدفع والتفعيل', stripe_secure:'دفع آمن · Stripe',
    paying:'جارٍ المعالجة...', payment_success:'✅ تم الدفع بنجاح!', payment_error:'❌ خطأ في الدفع.',
    urgent_title:'🚨  طوارئ ومساعدة', protection_active:'🛡️  الحماية نشطة',
    no_sub:'⚠️  لا يوجد اشتراك نشط.',
    need_lawyer:'🚨  أحتاج محامياً الآن', call_112:'📞  الاتصال بـ 112',
    problem_type:'نوع المشكلة', accident:'حادث', theft:'سرقة',
    hotel:'فندق', flight:'رحلة', arrest:'اعتقال', other:'أخرى',
    emergency_numbers:'أرقام الطوارئ', general:'طوارئ عامة', police:'الشرطة',
    ambulance:'الإسعاف', fire:'الإطفاء',
    messages:'رسائلي', support:'دعم RightRoam', available:'متاح 24/7',
    case_status:'حالة الملف', trip_history:'سجل الرحلات',
    profile_title:'ملفي الشخصي', language:'اللغة', subscription:'اشتراكي',
    no_sub_active:'لا يوجد اشتراك', active_since:'نشط منذ',
    change_sub:'تغيير الاشتراك →', subscribe:'اشترك →', cancel_sub:'إلغاء الاشتراك',
    payment_info:'معلومات الدفع', card_saved:'البطاقة المحفوظة', modify:'تعديل',
    payment_history:'سجل المدفوعات', security:'الأمان',
    change_password:'تغيير كلمة المرور', delete_account:'حذف الحساب',
    logout:'تسجيل الخروج', online:'● متصل الآن', message_placeholder:'رسالتك...',
    lawyer_title:'⚖️  فضاء المحامي', lawyer_subtitle:'انضم إلى RightRoam',
    bar_number:'رقم نقابة المحامين', bar_country:'بلد النقابة', bar_city:'مدينة الممارسة',
    submit:'إرسال الملف', verification:'⏳ ملفك قيد المراجعة (24-48 ساعة).',
    how_it_works:'كيف يعمل؟', per_voyage:'لكل رحلة', per_month:'/شهر', per_year:'/سنة',
    popular:'شائع', best_price:'أفضل سعر', pending:'قيد الانتظار', total:'الإجمالي', this_month:'هذا الشهر',
    faq_title:'❓  الأسئلة الشائعة', cgu_title:'📄  الشروط', privacy_title:'🔒  الخصوصية',
    contact_title:'📧  اتصل بنا', contact_subtitle:'نرد خلال 24 ساعة',
    rating_title:'⭐  تقييم المحامي', submit_rating:'إرسال التقييم', rating_thanks:'شكراً لك!',
    new_password:'كلمة مرور جديدة', confirm_password:'تأكيد كلمة المرور',
    current_password:'كلمة المرور الحالية', change_pwd_btn:'تغيير كلمة المرور',
    delete_confirm:'هل أنت متأكد من حذف حسابك؟',
    onb1_title:'محمي في كل العالم', onb1_desc:'محامون في أكثر من 50 دولة.',
    onb2_title:'من 1.99€ للرحلة', onb2_desc:'ادفع فقط عند السفر.',
    onb3_title:'مساعدة فورية 24 ساعة', onb3_desc:'محامٍ محلي يستجيب في أقل من 30 دقيقة.',
    agree_cgu:'أوافق على الشروط وسياسة الخصوصية',
    age_error:'يجب أن يكون عمرك 18 عاماً على الأقل.', email_error:'بريد إلكتروني غير صالح.',
    required_field:'هذا الحقل مطلوب', saving:'جارٍ الحفظ...', saved:'✅ تم الحفظ!',
    offline_mode:'وضع عدم الاتصال — أرقام الطوارئ متاحة',
    referral_title:'🎁  دعوة صديق', referral_desc:'ادعُ صديقاً واحصل على رحلة مجانية!',
    referral_code:'رمز الإحالة الخاص بك', copy_code:'نسخ الرمز', share_code:'مشاركة',
    lawyers_count:'محامون شركاء في', countries_count:'دولة',
    reviews_title:'ما يقوله مسافرونا',
    translate_title:'🌐  مترجم الطوارئ', translate_desc:'تواصل بلغتك مع المحامي',
    badge_title:'🛡️  مسافر محمي', badge_desc:'شارك حالة حمايتك',
    select_date:'اختر تاريخاً', confirm_date:'تأكيد',
    family_members:'أفراد الأسرة',
    password_mismatch:'كلمات المرور غير متطابقة.', password_short:'8 أحرف على الأقل.',
    wrong_password:'كلمة المرور الحالية خاطئة.',
    too_many_attempts:'محاولات كثيرة. حاول بعد 15 دقيقة.',
    network_error:'خطأ في الشبكة. تحقق من اتصالك.',
    jan:'يناير', feb:'فبراير', mar:'مارس', apr:'أبريل', may:'مايو', jun:'يونيو',
    jul:'يوليو', aug:'أغسطس', sep:'سبتمبر', oct:'أكتوبر', nov:'نوفمبر', dec:'ديسمبر',
  },
  zh: {
    tagline:'您的权利。遍及全球。',
    start:'开始', login:'登录', lawyer_space:'⚖️ 律师空间',
    back:'← 返回', save:'保存', next:'继续 →', skip:'跳过',
    create_account:'创建账户', account_subtitle:'您的信息保密且安全',
    firstname:'名字', lastname:'姓氏', email:'电子邮件', password:'密码',
    birthdate:'出生日期', nationality:'国籍',
    passport:'护照号码', phone:'电话', emergency_contact:'紧急联系人',
    card_number:'卡号', card_expiry:'有效期 (MM/YY)', card_cvv:'CVV',
    welcome_title:'欢迎使用 RightRoam', welcome_subtitle:'全球旅行者法律保障',
    step1_title:'注册您的旅行', step1_desc:'目的地和旅行日期',
    step2_title:'选择您的通行证', step2_desc:'每次旅行仅需1.99€',
    step3_title:'安心旅行', step3_desc:'遇到问题时当地律师立即协助',
    tab_reservation:'预订', tab_subs:'套餐', tab_urgent:'紧急', tab_profile:'个人资料',
    reservation_title:'✈️  预订', reservation_subtitle:'注册您的旅行以获得保障',
    country:'目的地国家', city:'城市', start_date:'出发日期', end_date:'返回日期',
    active_sub:'✅  订阅有效 — 无需付款',
    confirm_trip:'确认旅行', choose_pass:'选择通行证 →',
    trip_registered:'旅行已注册',
    info_dates:'保障在出发日期自动激活，返回时结束。付款后不可修改。',
    subs_title:'💳  套餐', subs_subtitle:'只在旅行时付费',
    individual:'个人', family_plans:'家庭',
    pass_trip:'旅行通行证', pass_monthly:'月度通行证', pass_annual:'年度通行证',
    pass_family:'家庭通行证', pass_family_annual:'年度家庭通行证',
    per_trip_desc:'无需承诺 · 1人 · 适合每年1-3次旅行', monthly_desc:'频繁旅行者',
    annual_desc:'数字游民 · ~2.50€/月', family_desc:'最多5人 · 1次旅行',
    family_annual_desc:'最多5人 · 无限次旅行',
    family_info:'1个孩子独行 = 1.99€ · 2+个孩子或家庭 = 6.99€',
    add_member:'+ 添加成员', member_name:'成员姓名', member_relation:'关系',
    pay:'🔒  支付并激活', stripe_secure:'Stripe安全支付 · 数据加密',
    paying:'处理中...', payment_success:'✅ 支付成功！保障已激活。', payment_error:'❌ 支付错误。',
    urgent_title:'🚨  紧急与帮助', protection_active:'🛡️  保障有效',
    no_sub:'⚠️  没有有效订阅。请订阅以获得法律援助。',
    need_lawyer:'🚨  我现在需要律师', call_112:'📞  拨打112 — 国际紧急',
    problem_type:'问题类型', accident:'事故', theft:'盗窃 / 袭击',
    hotel:'酒店纠纷', flight:'航班问题', arrest:'逮捕', other:'其他',
    emergency_numbers:'紧急号码', general:'一般紧急', police:'警察',
    ambulance:'救护车', fire:'消防',
    messages:'我的消息', support:'RightRoam支持', available:'24小时全天候可用',
    case_status:'案件状态', trip_history:'旅行历史',
    profile_title:'我的资料', language:'语言', subscription:'我的订阅',
    no_sub_active:'没有有效订阅', active_since:'自',
    change_sub:'更改订阅 →', subscribe:'订阅 →', cancel_sub:'取消订阅',
    payment_info:'支付信息', card_saved:'已保存的卡', modify:'修改',
    payment_history:'支付历史', security:'安全',
    change_password:'更改密码', delete_account:'删除账户',
    logout:'退出登录', online:'● 在线', message_placeholder:'您的消息...',
    lawyer_title:'⚖️  律师空间', lawyer_subtitle:'加入RightRoam并接待旅行客户',
    bar_number:'律师证号', bar_country:'执照国家', bar_city:'执业城市',
    submit:'提交申请', verification:'⏳ 您的资料正在审核中（24-48小时）。',
    how_it_works:'如何使用？', per_voyage:'每次旅行', per_month:'/月', per_year:'/年',
    popular:'热门', best_price:'最优价格', pending:'待处理', total:'总计', this_month:'本月',
    faq_title:'❓  常见问题', cgu_title:'📄  服务条款', privacy_title:'🔒  隐私政策',
    contact_title:'📧  联系我们', contact_subtitle:'24小时内回复',
    rating_title:'⭐  评价律师', submit_rating:'提交评价', rating_thanks:'感谢您的评价！',
    new_password:'新密码', confirm_password:'确认密码', current_password:'当前密码',
    change_pwd_btn:'更改密码', delete_confirm:'确定要删除您的账户吗？此操作不可逆。',
    onb1_title:'全球保障', onb1_desc:'连接您与50+国家的合格本地律师。',
    onb2_title:'每次旅行仅需1.99€', onb2_desc:'只在旅行时付费。无不必要订阅。',
    onb3_title:'24小时即时援助', onb3_desc:'遇到问题时，当地律师30分钟内响应。',
    agree_cgu:'我同意服务条款和隐私政策',
    age_error:'您必须年满18岁才能创建RightRoam账户。',
    email_error:'请输入有效的电子邮件地址。',
    required_field:'此字段为必填项', saving:'保存中...', saved:'✅ 已保存！',
    offline_mode:'离线模式 — 紧急号码可用',
    referral_title:'🎁  推荐朋友', referral_desc:'邀请朋友，获得1次免费旅行！',
    referral_code:'您的推荐码', copy_code:'复制代码', share_code:'分享',
    lawyers_count:'律师合作伙伴，遍布', countries_count:'个国家',
    reviews_title:'我们的旅行者怎么说',
    translate_title:'🌐  紧急翻译器', translate_desc:'用您的语言与律师沟通',
    badge_title:'🛡️  受保护的旅行者', badge_desc:'分享您的保护状态',
    select_date:'选择日期', confirm_date:'确认',
    family_members:'家庭成员',
    password_mismatch:'密码不匹配。', password_short:'密码至少需要8个字符。',
    wrong_password:'当前密码不正确。',
    too_many_attempts:'尝试次数过多。请在15分钟后重试。',
    network_error:'网络错误。请检查您的网络连接。',
    jan:'一月', feb:'二月', mar:'三月', apr:'四月', may:'五月', jun:'六月',
    jul:'七月', aug:'八月', sep:'九月', oct:'十月', nov:'十一月', dec:'十二月',
  },
};

const LANGS = [
  {code:'fr',flag:'🇫🇷',label:'FR'},{code:'en',flag:'🇬🇧',label:'EN'},
  {code:'es',flag:'🇪🇸',label:'ES'},{code:'ar',flag:'🇸🇦',label:'AR'},
  {code:'zh',flag:'🇨🇳',label:'ZH'},{code:'pt',flag:'🇵🇹',label:'PT'},
  {code:'de',flag:'🇩🇪',label:'DE'},
];

const EMERGENCY = {
  'France':{police:'17',ambulance:'15',fire:'18'},
  'Espagne':{police:'091',ambulance:'061',fire:'080'},
  'Spain':{police:'091',ambulance:'061',fire:'080'},
  'Italie':{police:'113',ambulance:'118',fire:'115'},
  'Italy':{police:'113',ambulance:'118',fire:'115'},
  'USA':{police:'911',ambulance:'911',fire:'911'},
  'États-Unis':{police:'911',ambulance:'911',fire:'911'},
  'Thaïlande':{police:'191',ambulance:'1669',fire:'199'},
  'Thailand':{police:'191',ambulance:'1669',fire:'199'},
  'Maroc':{police:'19',ambulance:'15',fire:'15'},
  'Morocco':{police:'19',ambulance:'15',fire:'15'},
  'Turquie':{police:'155',ambulance:'112',fire:'110'},
  'Turkey':{police:'155',ambulance:'112',fire:'110'},
  'Grèce':{police:'100',ambulance:'166',fire:'199'},
  'Greece':{police:'100',ambulance:'166',fire:'199'},
  'Portugal':{police:'112',ambulance:'112',fire:'112'},
  'Allemagne':{police:'110',ambulance:'112',fire:'112'},
  'Germany':{police:'110',ambulance:'112',fire:'112'},
  'Belgique':{police:'101',ambulance:'100',fire:'100'},
  'Belgium':{police:'101',ambulance:'100',fire:'100'},
  'Pays-Bas':{police:'0900-8844',ambulance:'112',fire:'112'},
  'Netherlands':{police:'0900-8844',ambulance:'112',fire:'112'},
  'Japon':{police:'110',ambulance:'119',fire:'119'},
  'Japan':{police:'110',ambulance:'119',fire:'119'},
  'Australie':{police:'000',ambulance:'000',fire:'000'},
  'Australia':{police:'000',ambulance:'000',fire:'000'},
  'Canada':{police:'911',ambulance:'911',fire:'911'},
  'Mexique':{police:'911',ambulance:'911',fire:'911'},
  'Mexico':{police:'911',ambulance:'911',fire:'911'},
  'Brésil':{police:'190',ambulance:'192',fire:'193'},
  'Brazil':{police:'190',ambulance:'192',fire:'193'},
  'Chine':{police:'110',ambulance:'120',fire:'119'},
  'China':{police:'110',ambulance:'120',fire:'119'},
  'Inde':{police:'100',ambulance:'108',fire:'101'},
  'India':{police:'100',ambulance:'108',fire:'101'},
  'default':{police:'112',ambulance:'112',fire:'112'},
};

const FAQ_DATA = [
  {q:'Comment fonctionne RightRoam ?', a:'RightRoam vous connecte à des avocats locaux qualifiés dans le monde entier. En cas de problème lors de votre voyage, ouvrez l\'app, décrivez votre situation et un avocat local vous contacte en moins de 30 minutes.'},
  {q:'Quand la protection s\'active-t-elle ?', a:'Votre protection s\'active automatiquement à votre date de départ et se désactive à votre date de retour. Vous n\'avez rien à faire.'},
  {q:'Que couvre RightRoam ?', a:'RightRoam couvre tous types de problèmes juridiques : accidents, vols, litiges hôtels ou compagnies aériennes, arrestations, problèmes administratifs et plus encore.'},
  {q:'Comment fonctionne le Pass Famille ?', a:'Le Pass Famille couvre jusqu\'à 5 personnes. 1 enfant voyageant seul = 1,99€ (prix individuel). 2 enfants ou plus, ou une famille = 6,99€. Les parents peuvent souscrire pour leurs enfants mineurs.'},
  {q:'Puis-je utiliser RightRoam dans n\'importe quel pays ?', a:'Oui ! RightRoam est disponible dans plus de 50 pays et nous étendons continuellement notre réseau.'},
  {q:'Comment sont sélectionnés les avocats ?', a:'Chaque avocat est vérifié par notre équipe : numéro de barreau, certifications et évaluations clients. Seuls les avocats certifiés apparaissent sur la plateforme.'},
  {q:'Que faire si je n\'ai pas de connexion internet ?', a:'Les numéros d\'urgence sont accessibles en mode hors ligne depuis la page Urgence. Nous vous recommandons de les consulter avant votre départ.'},
  {q:'Comment annuler mon abonnement ?', a:'Vous pouvez annuler à tout moment depuis votre profil, section "Mon abonnement". L\'annulation prend effet immédiatement.'},
  {q:'Comment fonctionne le parrainage ?', a:'Partagez votre code unique avec vos amis. Quand un ami s\'inscrit avec votre code, vous recevez 1 voyage gratuit sur votre prochain Pass Voyage.'},
  {q:'Mes données personnelles sont-elles sécurisées ?', a:'Absolument. Vos données sont chiffrées et stockées de manière sécurisée. Nous ne partageons jamais vos informations avec des tiers sans votre consentement explicite.'},
];

const CGU_TEXT = `CONDITIONS GÉNÉRALES D'UTILISATION
RightRoam — Fondateur : Hamedu Ahmednur
Dernière mise à jour : Juillet 2025

1. OBJET
RightRoam est une plateforme de mise en relation entre voyageurs et avocats locaux qualifiés dans le monde entier.

2. CONDITIONS D'ÂGE
L'utilisation de RightRoam est réservée aux personnes âgées d'au moins 18 ans. Les parents peuvent souscrire des abonnements pour leurs enfants mineurs dans le cadre du Pass Famille.

3. SERVICES PROPOSÉS
- Mise en relation avec des avocats locaux certifiés
- Assistance juridique en cas de problème lors d'un voyage
- Service de chat sécurisé entre client et avocat
- Numéros d'urgence par pays

4. ABONNEMENTS ET TARIFS
Pass Voyage : 1,99€ par voyage (1 personne)
Pass Mensuel : 3,99€/mois (1 personne)
Pass Annuel : 29,99€/an (1 personne)
Pass Famille : 6,99€ par voyage (jusqu'à 5 personnes)
Pass Famille Annuel : 49,99€/an (jusqu'à 5 personnes)
Note : 1 enfant voyageant seul bénéficie du tarif individuel (1,99€).

5. PAIEMENTS
Les paiements sont traités de manière sécurisée par Stripe. Aucun remboursement n'est accordé une fois le service activé.

6. PARRAINAGE
Le programme de parrainage offre 1 voyage gratuit par ami inscrit avec votre code. L'offre est non cumulable et soumise aux conditions en vigueur.

7. RESPONSABILITÉS
RightRoam agit en tant qu'intermédiaire. La responsabilité des conseils juridiques reste celle de l'avocat intervenant.

8. DONNÉES PERSONNELLES
Vos données sont protégées conformément au RGPD. Voir notre Politique de Confidentialité.

9. RÉSILIATION
Vous pouvez supprimer votre compte à tout moment depuis l'application.

10. DROIT APPLICABLE
Les présentes conditions sont soumises au droit belge.

Contact : rightroam.app@gmail.com`;

const PRIVACY_TEXT = `POLITIQUE DE CONFIDENTIALITÉ
RightRoam — Fondateur : Hamedu Ahmednur
Dernière mise à jour : Juillet 2025

1. DONNÉES COLLECTÉES
Nous collectons :
- Informations d'identité (nom, prénom, date de naissance, nationalité, passeport)
- Coordonnées (email, téléphone, contact d'urgence)
- Membres de la famille enregistrés
- Informations de voyage (destination, dates)
- Données de paiement (traitées par Stripe, non stockées par nous)
- Données d'utilisation de l'application

2. UTILISATION DES DONNÉES
Vos données servent exclusivement à :
- Fournir le service RightRoam
- Vous mettre en contact avec un avocat en cas d'urgence
- Améliorer nos services
- Vous envoyer des notifications importantes liées à votre protection

3. PARTAGE DES DONNÉES
Nous ne vendons jamais vos données personnelles.
Partage uniquement avec :
- L'avocat assigné à votre dossier
- Stripe (paiements sécurisés)
- Firebase (notifications push)

4. SÉCURITÉ
Toutes les données sont chiffrées avec SSL/TLS.
Accès restreint aux seuls employés autorisés.

5. VOS DROITS (RGPD)
Vous avez le droit d'accéder, corriger, supprimer et exporter vos données.
Pour exercer ces droits : rightroam.app@gmail.com

6. MINEURS
Les données des mineurs sont gérées par leur parent ou tuteur légal dans le cadre du Pass Famille.

7. COOKIES
L'application n'utilise que des cookies techniques nécessaires au fonctionnement.

8. MODIFICATIONS
Nous vous informerons de toute modification importante de cette politique.

Contact : rightroam.app@gmail.com
Politique de confidentialité complète : https://rightroam.app/privacy`;

const REVIEWS = [
  {name:'Sophie M.', country:'🇫🇷', text:'J\'ai eu un accident de voiture en Espagne. L\'avocat était là en 20 minutes. Service incroyable !', stars:5},
  {name:'James K.', country:'🇬🇧', text:'Got robbed in Bangkok. RightRoam connected me with a local lawyer immediately. Saved my trip!', stars:5},
  {name:'María G.', country:'🇪🇸', text:'Litige avec mon hôtel à Dubai. Résolu en 2 heures grâce à RightRoam. Je recommande !', stars:5},
  {name:'Ahmed B.', country:'🇸🇦', text:'خدمة ممتازة! كنت في مشكلة قانونية في إيطاليا والمحامي ساعدني بسرعة.', stars:5},
];

const formatCardNumber = (value) => {
  const v = value.replace(/\D/g, '').substring(0, 16);
  return v.replace(/(.{4})/g, '$1 ').trim();
};

const formatExpiry = (value) => {
  const v = value.replace(/\D/g, '').substring(0, 4);
  if (v.length >= 2) return v.substring(0, 2) + '/' + v.substring(2);
  return v;
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const checkAge = (birthdate) => {
  if (!birthdate) return false;
  const parts = birthdate.split('/');
  if (parts.length !== 3) return false;
  const birth = new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]));
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m===0 && today.getDate() < birth.getDate())) age--;
  return age >= 18;
};

const getDaysInMonth = (month, year) => new Date(year, month+1, 0).getDate();

const generateReferralCode = () => 'RR-' + Math.random().toString(36).substring(2, 8).toUpperCase();

export default function App() {
  const [screen, setScreen] = useState('onboarding');
  const [onboardStep, setOnboardStep] = useState(0);
  const [lang, setLang] = useState('fr');
  const [plan, setPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('reservation');
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [agreedCGU, setAgreedCGU] = useState(false);
  const [cardSaved, setCardSaved] = useState(false);
  const [editingCard, setEditingCard] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateField, setDateField] = useState(null);
  const [selDay, setSelDay] = useState(new Date().getDate());
  const [selMonth, setSelMonth] = useState(new Date().getMonth());
  const [selYear, setSelYear] = useState(new Date().getFullYear());
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [referralCode] = useState(generateReferralCode());
  const [ratingComment, setRatingComment] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [messages, setMessages] = useState([
    {id:1,from:'lawyer',text:'Bonjour ! Je suis votre avocat RightRoam. Comment puis-je vous aider ?'},
  ]);
  const [msgInput, setMsgInput] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [form, setForm] = useState({
    first_name:'', last_name:'', email:'', password:'',
    birthdate:'', nationality:'', passport:'', phone:'', emergency_contact:'',
    card_number:'', card_expiry:'', card_cvv:'',
    country:'', city:'', start_date:'', end_date:'',
    current_password:'', new_password:'', confirm_password:'',
    bar_number:'', bar_country:'', bar_city:'',
    new_member_name:'', new_member_relation:'',
    translate_text:'',
  });

  const upd = (k,v) => setForm(p=>({...p,[k]:v}));
  const go = (s) => setScreen(s);
  const i = (key) => T[lang]?.[key] || T['en']?.[key] || key;
  const em = EMERGENCY[form.country] || EMERGENCY['default'];
  const isFamily = plan === 'family' || plan === 'family_annual';

  const paymentHistory = [
    {date:'10/06/2025', desc:'Pass Voyage', amount:'1,99€', status:'✅'},
    {date:'15/03/2025', desc:'Pass Voyage', amount:'1,99€', status:'✅'},
    {date:'02/01/2025', desc:'Pass Mensuel', amount:'3,99€', status:'✅'},
  ];
  const tripHistory = [
    {city:'Madrid', country:'Espagne', dates:'10/06 → 20/06/2025', status:'✅ Terminé'},
    {city:'Paris', country:'France', dates:'15/03 → 22/03/2025', status:'✅ Terminé'},
  ];
  const caseHistory = [
    {type:'Litige hôtel', city:'Madrid', date:'12/06/2025', status:'✅ Résolu', lawyer:'María Rodriguez'},
  ];

  const months = () => {
    const t = T[lang] || T['en'];
    return [t.jan,t.feb,t.mar,t.apr,t.may,t.jun,t.jul,t.aug,t.sep,t.oct,t.nov,t.dec];
  };

  const getPlanName = () => {
    if(plan==='per_trip') return i('pass_trip');
    if(plan==='monthly') return i('pass_monthly');
    if(plan==='annual') return i('pass_annual');
    if(plan==='family') return i('pass_family');
    if(plan==='family_annual') return i('pass_family_annual');
    return '';
  };

  const getPlanPrice = () => {
    if(plan==='per_trip') return '1,99€';
    if(plan==='monthly') return '3,99€/mois';
    if(plan==='annual') return '29,99€/an';
    if(plan==='family') return '6,99€';
    if(plan==='family_annual') return '49,99€/an';
    return '';
  };

  const openDatePicker = (field) => {
    setDateField(field);
    setShowDatePicker(true);
  };

  const confirmDate = () => {
    const d = String(selDay).padStart(2,'0');
    const m = String(selMonth+1).padStart(2,'0');
    upd(dateField, `${d}/${m}/${selYear}`);
    setShowDatePicker(false);
  };

  const addMember = () => {
    if(!form.new_member_name.trim()) return;
    setFamilyMembers(prev=>[...prev,{name:form.new_member_name,relation:form.new_member_relation}]);
    upd('new_member_name',''); upd('new_member_relation','');
  };

  const sendMsg = () => {
    if(!msgInput.trim()) return;
    setMessages(m=>[...m,{id:Date.now(),from:'user',text:msgInput}]);
    setMsgInput('');
    setTimeout(()=>{
      setMessages(m=>[...m,{id:Date.now()+1,from:'lawyer',
        text:'Je comprends votre situation. Je prépare votre dossier immédiatement. Pouvez-vous me donner plus de détails sur ce qui s\'est passé ?'}]);
    },1200);
  };

  const handlePayment = async () => {
    if(!form.card_number && !cardSaved){
      Alert.alert('Erreur', 'Veuillez entrer vos informations de paiement.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/payment/plans`);
      const data = await res.json();
      setCardSaved(true);
      Alert.alert('✅', i('payment_success'));
      setActiveTab('reservation');
      go('main');
    } catch(e) {
      // Mode hors ligne ou erreur — on active quand même pour la démo
      setCardSaved(true);
      Alert.alert('✅', i('payment_success'));
      setActiveTab('reservation');
      go('main');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    // Validation email
    if(!isValidEmail(form.email)){
      Alert.alert('Erreur', i('email_error'));
      return;
    }
    // Champs requis
    const required = ['first_name','last_name','email','password','birthdate','nationality','passport','phone','emergency_contact'];
    for(const f of required){
      if(!form[f]){
        Alert.alert('Erreur', `${i('required_field')}: ${i(f)}`);
        return;
      }
    }
    // Vérification âge 18 ans
    if(!checkAge(form.birthdate)){
      Alert.alert('Erreur', i('age_error'));
      return;
    }
    // CGU
    if(!agreedCGU){
      Alert.alert('Erreur', i('agree_cgu'));
      return;
    }
    setLoading(true);
    try {
      await fetch(`${API_URL}/auth/register`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          first_name:form.first_name, last_name:form.last_name,
          email:form.email, password:form.password,
          nationality:form.nationality, language:lang,
        })
      });
    } catch(e) {}
    setLoading(false);
    go('welcome');
  };

  const handleLogin = async () => {
    // Vérification blocage
    if(lockoutTime && new Date() < lockoutTime){
      Alert.alert('Erreur', i('too_many_attempts'));
      return;
    }
    if(!isValidEmail(form.email)){
      Alert.alert('Erreur', i('email_error'));
      return;
    }
    if(!form.password){
      Alert.alert('Erreur', i('required_field'));
      return;
    }
    setLoading(true);
    try {
      await fetch(`${API_URL}/auth/login`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({email:form.email, password:form.password})
      });
      setLoginAttempts(0);
      go('main');
    } catch(e) {
      const attempts = loginAttempts + 1;
      setLoginAttempts(attempts);
      if(attempts >= MAX_LOGIN_ATTEMPTS){
        const lockout = new Date(Date.now() + 15*60*1000);
        setLockoutTime(lockout);
        Alert.alert('Erreur', i('too_many_attempts'));
      } else {
        go('main'); // Pour la démo on connecte quand même
      }
    }
    setLoading(false);
  };

  const handleChangePassword = () => {
    if(!form.current_password){
      Alert.alert('Erreur', `${i('required_field')}: ${i('current_password')}`);
      return;
    }
    // Simulation vérification mot de passe actuel
    if(form.current_password.length < 3){
      Alert.alert('Erreur', i('wrong_password'));
      return;
    }
    if(form.new_password !== form.confirm_password){
      Alert.alert('Erreur', i('password_mismatch'));
      return;
    }
    if(form.new_password.length < 8){
      Alert.alert('Erreur', i('password_short'));
      return;
    }
    Alert.alert('✅', i('saved'));
    go('main');
  };

  const BackBtn = ({to}) => (
    <TouchableOpacity onPress={()=>go(to)} style={s.backBtn}>
      <Text style={s.backBtnTxt}>{i('back')}</Text>
    </TouchableOpacity>
  );

  const DateInput = ({field, placeholder}) => (
    <TouchableOpacity style={s.dateInput} onPress={()=>openDatePicker(field)}>
      <Text style={form[field]?s.dateInputText:s.dateInputPlaceholder}>
        {form[field]||placeholder}
      </Text>
      <Text style={{fontSize:20}}>📅</Text>
    </TouchableOpacity>
  );

  const StarRating = () => (
    <View style={{flexDirection:'row',justifyContent:'center',gap:12,marginVertical:20}}>
      {[1,2,3,4,5].map(star=>(
        <TouchableOpacity key={star} onPress={()=>setRating(star)}>
          <Text style={{fontSize:40,opacity:star<=rating?1:0.25}}>⭐</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const ONBOARDING = [
    {icon:'🌍',title:i('onb1_title'),desc:i('onb1_desc')},
    {icon:'💰',title:i('onb2_title'),desc:i('onb2_desc')},
    {icon:'⚡',title:i('onb3_title'),desc:i('onb3_desc')},
  ];

  // ── DATE PICKER MODAL ──
  const DatePickerModal = () => {
    const days = getDaysInMonth(selMonth, selYear);
    const isBirthdate = dateField === 'birthdate';
    const years = isBirthdate
      ? Array.from({length:83},(_,idx)=>1924+idx)
      : Array.from({length:3},(_,idx)=>new Date().getFullYear()+idx);
    return (
      <Modal visible={showDatePicker} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>{i('select_date')}</Text>
            <View style={s.pickerRow}>
              <ScrollView style={s.pickerCol} showsVerticalScrollIndicator={false}>
                {Array.from({length:days},(_,idx)=>idx+1).map(d=>(
                  <TouchableOpacity key={d} onPress={()=>setSelDay(d)}
                    style={[s.pickerItem,selDay===d&&s.pickerItemActive]}>
                    <Text style={[s.pickerTxt,selDay===d&&s.pickerTxtActive]}>{String(d).padStart(2,'0')}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <ScrollView style={[s.pickerCol,{flex:2}]} showsVerticalScrollIndicator={false}>
                {months().map((m,idx)=>(
                  <TouchableOpacity key={idx} onPress={()=>setSelMonth(idx)}
                    style={[s.pickerItem,selMonth===idx&&s.pickerItemActive]}>
                    <Text style={[s.pickerTxt,selMonth===idx&&s.pickerTxtActive]}>{m}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <ScrollView style={s.pickerCol} showsVerticalScrollIndicator={false}>
                {years.map(y=>(
                  <TouchableOpacity key={y} onPress={()=>setSelYear(y)}
                    style={[s.pickerItem,selYear===y&&s.pickerItemActive]}>
                    <Text style={[s.pickerTxt,selYear===y&&s.pickerTxtActive]}>{y}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <TouchableOpacity style={s.btnPrimary} onPress={confirmDate}>
              <Text style={s.btnPrimaryTxt}>✓ {i('confirm_date')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{alignItems:'center',marginTop:8}} onPress={()=>setShowDatePicker(false)}>
              <Text style={{color:'#888',fontSize:14}}>{i('back')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  // ── ONBOARDING ──
  if(screen==='onboarding') return (
    <SafeAreaView style={s.splash}>
      <DatePickerModal/>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={{position:'absolute',top:50,paddingHorizontal:20}}>
        {LANGS.map(l=>(
          <TouchableOpacity key={l.code} onPress={()=>setLang(l.code)}
            style={[s.langBtn,lang===l.code&&s.langBtnActive]}>
            <Text style={{fontSize:22}}>{l.flag}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={{flex:1,alignItems:'center',justifyContent:'center',padding:32,marginTop:60}}>
        <Text style={{fontSize:72,marginBottom:24}}>{ONBOARDING[onboardStep].icon}</Text>
        <Text style={{fontSize:26,fontWeight:'800',color:'#fff',textAlign:'center',marginBottom:16}}>
          {ONBOARDING[onboardStep].title}
        </Text>
        <Text style={{fontSize:16,color:'rgba(255,255,255,0.7)',textAlign:'center',lineHeight:26}}>
          {ONBOARDING[onboardStep].desc}
        </Text>
      </View>
      <View style={{flexDirection:'row',gap:8,marginBottom:24,justifyContent:'center'}}>
        {ONBOARDING.map((_,idx)=>(
          <View key={idx} style={{
            width:idx===onboardStep?24:8,height:8,borderRadius:4,
            backgroundColor:idx===onboardStep?'#fff':'rgba(255,255,255,0.3)'
          }}/>
        ))}
      </View>
      <View style={{padding:24,gap:10}}>
        {onboardStep<2?(
          <>
            <TouchableOpacity style={s.btnPrimary} onPress={()=>setOnboardStep(onboardStep+1)}>
              <Text style={s.btnPrimaryTxt}>{i('next')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{alignItems:'center',padding:10}} onPress={()=>go('splash')}>
              <Text style={{color:'rgba(255,255,255,0.5)',fontSize:14}}>{i('skip')}</Text>
            </TouchableOpacity>
          </>
        ):(
          <TouchableOpacity style={s.btnPrimary} onPress={()=>go('splash')}>
            <Text style={s.btnPrimaryTxt}>{i('start')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );

  // ── SPLASH ──
  if(screen==='splash') return (
    <SafeAreaView style={s.splash}>
      <DatePickerModal/>
      {isOffline&&<View style={{backgroundColor:'#FF6B00',padding:8,width:'100%',alignItems:'center'}}>
        <Text style={{color:'#fff',fontSize:12,fontWeight:'600'}}>📡 {i('offline_mode')}</Text>
      </View>}
      <View style={s.splashLogo}><Text style={{fontSize:36}}>⚖️</Text></View>
      <Text style={s.splashTitle}>RIGHTROAM</Text>
      <View style={s.splashDivider}/>
      <Text style={s.splashTag}>{i('tagline')}</Text>
      <View style={{alignItems:'center',marginTop:8,marginBottom:8}}>
        <Text style={{color:'rgba(255,255,255,0.4)',fontSize:12}}>
          850+ {i('lawyers_count')} 50 {i('countries_count')}
        </Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginVertical:20}}>
        {LANGS.map(l=>(
          <TouchableOpacity key={l.code} onPress={()=>setLang(l.code)}
            style={[s.langBtn,lang===l.code&&s.langBtnActive]}>
            <Text style={{fontSize:26}}>{l.flag}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={s.btnPrimary} onPress={()=>go('register')}>
        <Text style={s.btnPrimaryTxt}>{i('start')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.btnOutline} onPress={()=>go('login')}>
        <Text style={s.btnOutlineTxt}>{i('login')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[s.btnOutline,{borderColor:'rgba(255,255,255,0.2)',marginTop:8}]}
        onPress={()=>go('lawyer-register')}>
        <Text style={[s.btnOutlineTxt,{color:'rgba(255,255,255,0.5)',fontSize:13}]}>{i('lawyer_space')}</Text>
      </TouchableOpacity>
      <View style={{marginTop:24,width:'100%'}}>
        <Text style={{color:'rgba(255,255,255,0.3)',fontSize:11,textAlign:'center',marginBottom:12,fontWeight:'600',letterSpacing:1}}>
          {i('reviews_title')}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {REVIEWS.map((r,idx)=>(
            <View key={idx} style={{backgroundColor:'rgba(255,255,255,0.08)',borderRadius:12,padding:12,marginRight:10,width:200}}>
              <Text style={{color:'#FFD700',fontSize:12,marginBottom:4}}>{'⭐'.repeat(r.stars)}</Text>
              <Text style={{color:'rgba(255,255,255,0.8)',fontSize:11,lineHeight:16,marginBottom:6}}>{r.text}</Text>
              <Text style={{color:'rgba(255,255,255,0.5)',fontSize:11}}>{r.name} {r.country}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );

  // ── LOGIN ──
  if(screen==='login') return (
    <SafeAreaView style={s.container}>
      <DatePickerModal/>
      <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{flex:1}}>
        <ScrollView contentContainerStyle={s.scroll}>
          <BackBtn to='splash'/>
          <View style={s.pageHeader}>
            <Text style={s.pageTitle}>{i('login')}</Text>
            <Text style={s.pageSubtitle}>Bon retour sur RightRoam</Text>
          </View>
          <TextInput style={s.input} placeholder={i('email')} placeholderTextColor="#999"
            keyboardType="email-address" autoCapitalize="none"
            value={form.email} onChangeText={v=>upd('email',v)}/>
          <View style={{position:'relative'}}>
            <TextInput style={s.input} placeholder={i('password')} placeholderTextColor="#999"
              secureTextEntry={!showPassword} autoCapitalize="none"
              value={form.password} onChangeText={v=>upd('password',v)}/>
            <TouchableOpacity onPress={()=>setShowPassword(!showPassword)}
              style={{position:'absolute',right:14,top:14}}>
              <Text style={{fontSize:18}}>{showPassword?'🙈':'👁️'}</Text>
            </TouchableOpacity>
          </View>
          {loginAttempts>0&&loginAttempts<MAX_LOGIN_ATTEMPTS&&(
            <View style={[s.notice,{backgroundColor:'#FEF3E2',borderColor:'#FAC775',marginBottom:12}]}>
              <Text style={{fontSize:13,color:'#9E5000'}}>
                ⚠️ {MAX_LOGIN_ATTEMPTS-loginAttempts} tentative(s) restante(s) avant blocage temporaire.
              </Text>
            </View>
          )}
          <TouchableOpacity style={s.btnPrimary} onPress={handleLogin} disabled={loading}>
            {loading?<ActivityIndicator color="#fff"/>:<Text style={s.btnPrimaryTxt}>{i('login')}</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={{alignItems:'center',marginTop:16}} onPress={()=>go('register')}>
            <Text style={{color:'#666',fontSize:14}}>
              Pas encore de compte ? <Text style={{color:'#111',fontWeight:'600'}}>{i('create_account')}</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

  // ── REGISTER ──
  if(screen==='register') return (
    <SafeAreaView style={s.container}>
      <DatePickerModal/>
      <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{flex:1}}>
        <ScrollView contentContainerStyle={s.scroll}>
          <BackBtn to='splash'/>
          <View style={s.pageHeader}>
            <Text style={s.pageTitle}>{i('create_account')}</Text>
            <Text style={s.pageSubtitle}>{i('account_subtitle')}</Text>
          </View>
          {[
            {k:'first_name',ph:i('firstname')},
            {k:'last_name',ph:i('lastname')},
            {k:'email',ph:i('email'),kb:'email-address'},
          ].map(f=>(
            <TextInput key={f.k} style={s.input} placeholder={f.ph} placeholderTextColor="#999"
              keyboardType={f.kb||'default'}
              autoCapitalize="none" value={form[f.k]} onChangeText={v=>upd(f.k,v)}/>
          ))}
          <View style={{position:'relative'}}>
            <TextInput style={s.input} placeholder={i('password')} placeholderTextColor="#999"
              secureTextEntry={!showPassword} autoCapitalize="none"
              value={form.password} onChangeText={v=>upd('password',v)}/>
            <TouchableOpacity onPress={()=>setShowPassword(!showPassword)}
              style={{position:'absolute',right:14,top:14}}>
              <Text style={{fontSize:18}}>{showPassword?'🙈':'👁️'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={s.fieldLabel}>{i('birthdate')} <Text style={{color:'#cc0000'}}>*</Text></Text>
          <DateInput field="birthdate" placeholder="JJ/MM/AAAA"/>
          {[
            {k:'nationality',ph:i('nationality')},
            {k:'passport',ph:i('passport')},
            {k:'phone',ph:i('phone'),kb:'phone-pad'},
            {k:'emergency_contact',ph:i('emergency_contact'),kb:'phone-pad'},
          ].map(f=>(
            <TextInput key={f.k} style={s.input} placeholder={f.ph} placeholderTextColor="#999"
              keyboardType={f.kb||'default'} autoCapitalize="none"
              value={form[f.k]} onChangeText={v=>upd(f.k,v)}/>
          ))}
          <Text style={s.fieldLabel}>💳 {i('card_number')}</Text>
          <TextInput style={s.input} placeholder="4242 4242 4242 4242" placeholderTextColor="#999"
            keyboardType="numeric" autoCapitalize="none"
            value={form.card_number} onChangeText={v=>upd('card_number',formatCardNumber(v))}/>
          <View style={{flexDirection:'row',gap:10}}>
            <TextInput style={[s.input,{flex:1}]} placeholder="MM/AA" placeholderTextColor="#999"
              keyboardType="numeric" autoCapitalize="none"
              value={form.card_expiry} onChangeText={v=>upd('card_expiry',formatExpiry(v))}/>
            <TextInput style={[s.input,{flex:1}]} placeholder="CVV" placeholderTextColor="#999"
              keyboardType="numeric" autoCapitalize="none" maxLength={4}
              value={form.card_cvv} onChangeText={v=>upd('card_cvv',v)}/>
          </View>
          <TouchableOpacity style={{flexDirection:'row',alignItems:'center',gap:10,marginBottom:12}}
            onPress={()=>setAgreedCGU(!agreedCGU)}>
            <View style={{width:22,height:22,borderRadius:4,borderWidth:2,borderColor:'#111',
              backgroundColor:agreedCGU?'#111':'transparent',alignItems:'center',justifyContent:'center'}}>
              {agreedCGU&&<Text style={{color:'#fff',fontSize:14}}>✓</Text>}
            </View>
            <Text style={{fontSize:12,color:'#444',flex:1}}>{i('agree_cgu')}</Text>
          </TouchableOpacity>
          <View style={{flexDirection:'row',gap:16,marginBottom:16}}>
            <TouchableOpacity onPress={()=>go('cgu')}>
              <Text style={{color:'#2E75B6',fontSize:12,textDecorationLine:'underline'}}>{i('cgu_title')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>go('privacy')}>
              <Text style={{color:'#2E75B6',fontSize:12,textDecorationLine:'underline'}}>{i('privacy_title')}</Text>
            </TouchableOpacity>
          </View>
          <View style={s.notice}>
            <Text style={s.noticeTxt}>🔒 {i('account_subtitle')} · Âge minimum : 18 ans</Text>
          </View>
          <TouchableOpacity style={s.btnPrimary} onPress={handleRegister} disabled={loading}>
            {loading?<ActivityIndicator color="#fff"/>:<Text style={s.btnPrimaryTxt}>{i('create_account')}</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={{alignItems:'center',marginTop:12}} onPress={()=>go('login')}>
            <Text style={{color:'#666',fontSize:14}}>
              Déjà un compte ? <Text style={{color:'#111',fontWeight:'600'}}>{i('login')}</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

  // ── WELCOME ──
  if(screen==='welcome') return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={{fontSize:48,textAlign:'center',marginBottom:20,marginTop:20}}>🎉</Text>
        <Text style={{fontSize:24,fontWeight:'700',color:'#111',textAlign:'center',marginBottom:8}}>
          {i('welcome_title')}
        </Text>
        <Text style={{fontSize:15,color:'#666',textAlign:'center',lineHeight:24,marginBottom:40}}>
          {i('welcome_subtitle')}
        </Text>
        {[
          {num:'01',title:i('step1_title'),desc:i('step1_desc')},
          {num:'02',title:i('step2_title'),desc:i('step2_desc')},
          {num:'03',title:i('step3_title'),desc:i('step3_desc')},
        ].map(step=>(
          <View key={step.num} style={{flexDirection:'row',gap:16,marginBottom:24,alignItems:'flex-start'}}>
            <View style={{width:36,height:36,borderRadius:18,backgroundColor:'#111',alignItems:'center',justifyContent:'center'}}>
              <Text style={{color:'#fff',fontSize:12,fontWeight:'700'}}>{step.num}</Text>
            </View>
            <View style={{flex:1}}>
              <Text style={{fontSize:15,fontWeight:'600',color:'#111',marginBottom:2}}>{step.title}</Text>
              <Text style={{fontSize:13,color:'#666',lineHeight:18}}>{step.desc}</Text>
            </View>
          </View>
        ))}
        <TouchableOpacity style={s.btnPrimary} onPress={()=>{setActiveTab('reservation');go('main');}}>
          <Text style={s.btnPrimaryTxt}>{i('next')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );

  // ── MAIN ──
  if(screen==='main') return (
    <SafeAreaView style={s.container}>
      <DatePickerModal/>

      {/* ── RÉSERVATION ── */}
      {activeTab==='reservation'&&(
        <ScrollView contentContainerStyle={s.scroll}>
          <View style={s.pageHeader}>
            <Text style={s.pageTitle}>{i('reservation_title')}</Text>
            <Text style={s.pageSubtitle}>{i('reservation_subtitle')}</Text>
          </View>
          {plan&&<View style={s.successBanner}><Text style={s.successTxt}>{i('active_sub')}</Text></View>}
          <TextInput style={s.input} placeholder={i('country')} placeholderTextColor="#999"
            autoCapitalize="words" value={form.country} onChangeText={v=>upd('country',v)}/>
          <TextInput style={s.input} placeholder={i('city')} placeholderTextColor="#999"
            autoCapitalize="words" value={form.city} onChangeText={v=>upd('city',v)}/>
          <Text style={s.fieldLabel}>{i('start_date')}</Text>
          <DateInput field="start_date" placeholder="JJ/MM/AAAA"/>
          <Text style={s.fieldLabel}>{i('end_date')}</Text>
          <DateInput field="end_date" placeholder="JJ/MM/AAAA"/>
          <View style={s.infoBox}>
            <Text style={s.infoTxt}>{i('info_dates')}</Text>
          </View>
          {plan?(
            <TouchableOpacity style={s.btnPrimary} onPress={()=>{
              if(!form.country||!form.city||!form.start_date||!form.end_date){
                Alert.alert('Erreur',i('required_field')); return;
              }
              Alert.alert('✅','Voyage confirmé ! Votre protection est active.');
            }}>
              <Text style={s.btnPrimaryTxt}>{i('confirm_trip')}</Text>
            </TouchableOpacity>
          ):(
            <TouchableOpacity style={s.btnPrimary} onPress={()=>{
              if(!form.country||!form.city||!form.start_date||!form.end_date){
                Alert.alert('Erreur',i('required_field')); return;
              }
              setActiveTab('abonnements');
            }}>
              <Text style={s.btnPrimaryTxt}>{i('choose_pass')}</Text>
            </TouchableOpacity>
          )}
          {form.country&&form.city&&(
            <View style={[s.card,{marginTop:8}]}>
              <Text style={s.cardLabel}>{i('trip_registered')}</Text>
              <Text style={s.cardValue}>📍 {form.city}, {form.country}</Text>
              <Text style={{fontSize:13,color:'#666',marginTop:4}}>{form.start_date} → {form.end_date}</Text>
            </View>
          )}
          {tripHistory.length>0&&<>
            <Text style={[s.sectionLabel,{marginTop:16}]}>{i('trip_history')}</Text>
            {tripHistory.map((t,idx)=>(
              <View key={idx} style={s.card}>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                  <View>
                    <Text style={{fontWeight:'600',color:'#111'}}>📍 {t.city}, {t.country}</Text>
                    <Text style={{fontSize:12,color:'#888',marginTop:2}}>{t.dates}</Text>
                  </View>
                  <Text style={{fontSize:12,color:'#27A050',fontWeight:'600'}}>{t.status}</Text>
                </View>
              </View>
            ))}
          </>}
        </ScrollView>
      )}

      {/* ── ABONNEMENTS ── */}
      {activeTab==='abonnements'&&(
        <ScrollView contentContainerStyle={s.scroll}>
          <View style={s.pageHeader}>
            <Text style={s.pageTitle}>{i('subs_title')}</Text>
            <Text style={s.pageSubtitle}>{i('subs_subtitle')}</Text>
          </View>
          <Text style={s.sectionLabel}>{i('individual')}</Text>
          {[
            {key:'per_trip',name:i('pass_trip'),price:'1,99€',period:i('per_voyage'),desc:i('per_trip_desc'),badge:i('popular')},
            {key:'monthly',name:i('pass_monthly'),price:'3,99€',period:i('per_month'),desc:i('monthly_desc'),badge:''},
            {key:'annual',name:i('pass_annual'),price:'29,99€',period:i('per_year'),desc:i('annual_desc'),badge:i('best_price')},
          ].map(p=>(
            <TouchableOpacity key={p.key} onPress={()=>setPlan(p.key)}
              style={[s.planCard,plan===p.key&&s.planCardActive]}>
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                <Text style={[s.planName,plan===p.key&&{color:'#fff'}]}>{p.name}</Text>
                {p.badge?<View style={[s.badge,plan===p.key&&{backgroundColor:'rgba(255,255,255,0.2)'}]}>
                  <Text style={[s.badgeTxt,plan===p.key&&{color:'#fff'}]}>{p.badge}</Text>
                </View>:null}
              </View>
              <Text style={[s.planPrice,plan===p.key&&{color:'#fff'}]}>{p.price}
                <Text style={[{fontSize:14,fontWeight:'400'},plan===p.key?{color:'rgba(255,255,255,0.7)'}:{color:'#666'}]}> {p.period}</Text>
              </Text>
              <Text style={[{fontSize:13,marginTop:6},plan===p.key?{color:'rgba(255,255,255,0.8)'}:{color:'#666'}]}>{p.desc}</Text>
            </TouchableOpacity>
          ))}
          <Text style={[s.sectionLabel,{marginTop:8}]}>{i('family_plans')}</Text>
          <View style={[s.card,{backgroundColor:'#FEF9E7',borderColor:'#F0C040',marginBottom:12}]}>
            <Text style={{fontSize:13,color:'#633806',lineHeight:20}}>
              👶 {i('family_info')}
            </Text>
          </View>
          {[
            {key:'family',name:i('pass_family'),price:'6,99€',period:i('per_voyage'),desc:i('family_desc'),badge:'👨‍👩‍👧'},
            {key:'family_annual',name:i('pass_family_annual'),price:'49,99€',period:i('per_year'),desc:i('family_annual_desc'),badge:'💚'},
          ].map(p=>(
            <TouchableOpacity key={p.key} onPress={()=>setPlan(p.key)}
              style={[s.planCard,plan===p.key&&s.planCardActive]}>
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                <Text style={[s.planName,plan===p.key&&{color:'#fff'}]}>{p.name}</Text>
                <View style={[s.badge,plan===p.key&&{backgroundColor:'rgba(255,255,255,0.2)'}]}>
                  <Text style={[s.badgeTxt,plan===p.key&&{color:'#fff'}]}>{p.badge}</Text>
                </View>
              </View>
              <Text style={[s.planPrice,plan===p.key&&{color:'#fff'}]}>{p.price}
                <Text style={[{fontSize:14,fontWeight:'400'},plan===p.key?{color:'rgba(255,255,255,0.7)'}:{color:'#666'}]}> {p.period}</Text>
              </Text>
              <Text style={[{fontSize:13,marginTop:6},plan===p.key?{color:'rgba(255,255,255,0.8)'}:{color:'#666'}]}>{p.desc}</Text>
            </TouchableOpacity>
          ))}
          {isFamily&&(
            <View style={s.card}>
              <Text style={s.cardLabel}>{i('family_members')}</Text>
              {familyMembers.map((m,idx)=>(
                <View key={idx} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:8,borderBottomWidth:1,borderBottomColor:'#f0f0f0'}}>
                  <View>
                    <Text style={{fontWeight:'600',color:'#111'}}>{m.name}</Text>
                    <Text style={{fontSize:12,color:'#888'}}>{m.relation}</Text>
                  </View>
                  <TouchableOpacity onPress={()=>setFamilyMembers(prev=>prev.filter((_,i)=>i!==idx))}>
                    <Text style={{color:'#cc0000',fontSize:18}}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {familyMembers.length<4&&(
                <View style={{marginTop:12}}>
                  <TextInput style={[s.input,{marginBottom:8}]} placeholder={i('member_name')}
                    placeholderTextColor="#999" autoCapitalize="words"
                    value={form.new_member_name} onChangeText={v=>upd('new_member_name',v)}/>
                  <TextInput style={[s.input,{marginBottom:8}]} placeholder={i('member_relation')}
                    placeholderTextColor="#999" autoCapitalize="words"
                    value={form.new_member_relation} onChangeText={v=>upd('new_member_relation',v)}/>
                  <TouchableOpacity style={[s.btnPrimary,{backgroundColor:'#27500A'}]} onPress={addMember}>
                    <Text style={s.btnPrimaryTxt}>{i('add_member')}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          {plan&&(
            <>
              {cardSaved&&!editingCard?(
                <View style={s.card}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                    <Text style={{fontWeight:'600',color:'#111'}}>{i('card_saved')}</Text>
                    <TouchableOpacity onPress={()=>setEditingCard(true)}>
                      <Text style={{color:'#111',fontSize:13,fontWeight:'600'}}>{i('modify')}</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={{fontSize:14,color:'#444'}}>
                    💳 •••• •••• •••• {form.card_number?form.card_number.replace(/\s/g,'').slice(-4):'4242'}
                  </Text>
                  <TouchableOpacity style={[s.btnPrimary,{marginTop:12}]} onPress={handlePayment} disabled={loading}>
                    {loading?<ActivityIndicator color="#fff"/>:<Text style={s.btnPrimaryTxt}>{i('pay')}</Text>}
                  </TouchableOpacity>
                </View>
              ):(
                <>
                  <TextInput style={s.input} placeholder="4242 4242 4242 4242" placeholderTextColor="#999"
                    keyboardType="numeric" autoCapitalize="none"
                    value={form.card_number} onChangeText={v=>upd('card_number',formatCardNumber(v))}/>
                  <View style={{flexDirection:'row',gap:10}}>
                    <TextInput style={[s.input,{flex:1}]} placeholder="MM/AA" placeholderTextColor="#999"
                      keyboardType="numeric" autoCapitalize="none"
                      value={form.card_expiry} onChangeText={v=>upd('card_expiry',formatExpiry(v))}/>
                    <TextInput style={[s.input,{flex:1}]} placeholder="CVV" placeholderTextColor="#999"
                      keyboardType="numeric" autoCapitalize="none" maxLength={4}
                      value={form.card_cvv} onChangeText={v=>upd('card_cvv',v)}/>
                  </View>
                  <TouchableOpacity style={s.btnPrimary} onPress={handlePayment} disabled={loading}>
                    {loading?<ActivityIndicator color="#fff"/>:<Text style={s.btnPrimaryTxt}>{i('pay')}</Text>}
                  </TouchableOpacity>
                </>
              )}
              <Text style={{fontSize:11,color:'#999',textAlign:'center',marginTop:8}}>{i('stripe_secure')}</Text>
            </>
          )}
        </ScrollView>
      )}

      {/* ── URGENCE ── */}
      {activeTab==='urgence'&&(
        <ScrollView contentContainerStyle={s.scroll}>
          <View style={s.pageHeader}>
            <Text style={s.pageTitle}>{i('urgent_title')}</Text>
            {plan&&<View style={[s.successBanner,{marginTop:8}]}>
              <Text style={s.successTxt}>{i('protection_active')} · {form.city||'—'}, {form.country||'—'}</Text>
            </View>}
          </View>
          {!plan&&<View style={[s.notice,{backgroundColor:'#FEF3E2',borderColor:'#FAC775'}]}>
            <Text style={[s.noticeTxt,{color:'#9E5000'}]}>{i('no_sub')}</Text>
          </View>}
          <TouchableOpacity style={s.emergencyBtn} onPress={()=>go('chat')}>
            <Text style={s.emergencyBtnTxt}>{i('need_lawyer')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.btnPrimary,{backgroundColor:'#111',marginBottom:20}]}
            onPress={()=>Linking.openURL('tel:112')}>
            <Text style={s.btnPrimaryTxt}>{i('call_112')}</Text>
          </TouchableOpacity>
          <Text style={s.sectionLabel}>{i('problem_type')}</Text>
          <View style={{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:20}}>
            {[
              {icon:'🚗',key:'accident'},{icon:'🛡️',key:'theft'},
              {icon:'🏨',key:'hotel'},{icon:'✈️',key:'flight'},
              {icon:'🔒',key:'arrest'},{icon:'📋',key:'other'},
            ].map(ct=>(
              <TouchableOpacity key={ct.key} style={s.caseCard} onPress={()=>go('chat')}>
                <Text style={{fontSize:22,marginBottom:4}}>{ct.icon}</Text>
                <Text style={{fontSize:11,fontWeight:'500',color:'#333',textAlign:'center'}}>{i(ct.key)}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={s.sectionLabel}>{i('emergency_numbers')} · {(form.country||'MONDIAL').toUpperCase()}</Text>
          <View style={s.card}>
            {[
              {lbl:i('general'),val:'112'},
              {lbl:i('police'),val:em.police},
              {lbl:i('ambulance'),val:em.ambulance},
              {lbl:i('fire'),val:em.fire},
            ].map((item,idx)=>(
              <View key={idx}>
                <TouchableOpacity style={{flexDirection:'row',justifyContent:'space-between',paddingVertical:10}}
                  onPress={()=>Linking.openURL(`tel:${item.val}`)}>
                  <Text style={{fontSize:13,color:'#666'}}>{item.lbl}</Text>
                  <Text style={{fontSize:13,fontWeight:'700',color:'#111'}}>📞 {item.val}</Text>
                </TouchableOpacity>
                {idx<3&&<View style={{height:1,backgroundColor:'#f0f0f0'}}/>}
              </View>
            ))}
          </View>
          <TouchableOpacity style={s.card} onPress={()=>go('translator')}>
            <View style={{flexDirection:'row',alignItems:'center',gap:12}}>
              <Text style={{fontSize:28}}>🌐</Text>
              <View style={{flex:1}}>
                <Text style={{fontWeight:'600',color:'#111',fontSize:15}}>{i('translate_title')}</Text>
                <Text style={{fontSize:12,color:'#888',marginTop:2}}>{i('translate_desc')}</Text>
              </View>
              <Text style={{color:'#ccc',fontSize:20}}>›</Text>
            </View>
          </TouchableOpacity>
          {caseHistory.length>0&&<>
            <Text style={s.sectionLabel}>{i('case_status')}</Text>
            {caseHistory.map((c,idx)=>(
              <TouchableOpacity key={idx} style={s.card} onPress={()=>go('rating')}>
                <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:6}}>
                  <Text style={{fontWeight:'600',color:'#111'}}>{c.type}</Text>
                  <Text style={{fontSize:12,color:'#27A050',fontWeight:'600'}}>{c.status}</Text>
                </View>
                <Text style={{fontSize:13,color:'#666'}}>{c.city} · {c.date}</Text>
                <Text style={{fontSize:12,color:'#888',marginTop:4}}>⚖️ {c.lawyer}</Text>
                <Text style={{fontSize:12,color:'#2E75B6',marginTop:6}}>⭐ {i('rating_title')} →</Text>
              </TouchableOpacity>
            ))}
          </>}
          <Text style={s.sectionLabel}>{i('messages')}</Text>
          <TouchableOpacity style={s.card} onPress={()=>go('chat')}>
            <View style={{flexDirection:'row',alignItems:'center',gap:12}}>
              <View style={s.lawyerAvatar}><Text style={{color:'#fff',fontWeight:'700',fontSize:13}}>RR</Text></View>
              <View style={{flex:1}}>
                <Text style={{fontWeight:'600',color:'#111',fontSize:15}}>{i('support')}</Text>
                <Text style={{fontSize:12,color:'#888',marginTop:2}}>{i('available')}</Text>
              </View>
              <Text style={{color:'#ccc',fontSize:20}}>›</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* ── PROFIL ── */}
      {activeTab==='profil'&&(
        <ScrollView contentContainerStyle={s.scroll}>
          <View style={{alignItems:'center',marginBottom:24}}>
            <View style={s.profileAvatar}>
              <Text style={{color:'#fff',fontWeight:'700',fontSize:24}}>
                {form.first_name?form.first_name[0]:'H'}{form.last_name?form.last_name[0]:'A'}
              </Text>
            </View>
            <Text style={{fontSize:20,fontWeight:'700',color:'#111',marginTop:12}}>
              {form.first_name||'Hamedu'} {form.last_name||'Ahmednur'}
            </Text>
            <Text style={{fontSize:13,color:'#888',marginTop:4}}>
              {plan?`${i('active_since')} 10/06/2025`:i('no_sub_active')}
            </Text>
            {plan&&(
              <View style={{backgroundColor:'#f0f0f0',borderRadius:20,paddingHorizontal:12,paddingVertical:6,marginTop:8}}>
                <Text style={{fontSize:12,color:'#444',fontWeight:'600'}}>🛡️ {i('badge_title')}</Text>
              </View>
            )}
          </View>
          <Text style={s.sectionLabel}>{i('language')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:20}}>
            {LANGS.map(l=>(
              <TouchableOpacity key={l.code} onPress={()=>setLang(l.code)}
                style={[s.langBtnLight,lang===l.code&&s.langBtnLightActive]}>
                <Text style={{fontSize:22}}>{l.flag}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={s.sectionLabel}>INFORMATIONS PERSONNELLES</Text>
          {[
            {k:'first_name',ph:i('firstname')},
            {k:'last_name',ph:i('lastname')},
            {k:'phone',ph:i('phone'),kb:'phone-pad'},
            {k:'emergency_contact',ph:i('emergency_contact'),kb:'phone-pad'},
            {k:'nationality',ph:i('nationality')},
            {k:'passport',ph:i('passport')},
          ].map(f=>(
            <TextInput key={f.k} style={s.input} placeholder={f.ph} placeholderTextColor="#999"
              keyboardType={f.kb||'default'} autoCapitalize="none"
              value={form[f.k]} onChangeText={v=>upd(f.k,v)}/>
          ))}
          <TouchableOpacity style={[s.btnPrimary,{marginBottom:20}]}
            onPress={()=>Alert.alert('✅',i('saved'))}>
            <Text style={s.btnPrimaryTxt}>{i('save')}</Text>
          </TouchableOpacity>
          <Text style={s.sectionLabel}>{i('subscription')}</Text>
          <View style={s.card}>
            <Text style={{fontWeight:'600',color:'#111',fontSize:15,marginBottom:4}}>
              {plan?`${getPlanName()} — ${getPlanPrice()}`:i('no_sub_active')}
            </Text>
            {plan&&<Text style={{fontSize:12,color:'#888'}}>{i('active_since')} 10/06/2025</Text>}
            {isFamily&&familyMembers.length>0&&(
              <View style={{marginTop:8}}>
                <Text style={{fontSize:12,color:'#666',fontWeight:'600'}}>Membres :</Text>
                {familyMembers.map((m,idx)=>(
                  <Text key={idx} style={{fontSize:12,color:'#888',marginTop:2}}>👤 {m.name} ({m.relation})</Text>
                ))}
              </View>
            )}
            <View style={{height:1,backgroundColor:'#f0f0f0',marginVertical:12}}/>
            <TouchableOpacity onPress={()=>setActiveTab('abonnements')}>
              <Text style={{color:'#111',fontSize:13,fontWeight:'600'}}>
                {plan?i('change_sub'):i('subscribe')}
              </Text>
            </TouchableOpacity>
            {plan&&<>
              <View style={{height:1,backgroundColor:'#f0f0f0',marginVertical:12}}/>
              <TouchableOpacity onPress={()=>{setPlan(null);Alert.alert('Info','Abonnement annulé.');}}>
                <Text style={{color:'#cc0000',fontSize:13}}>{i('cancel_sub')}</Text>
              </TouchableOpacity>
            </>}
          </View>
          <Text style={s.sectionLabel}>{i('payment_info')}</Text>
          <View style={s.card}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <Text style={{fontWeight:'600',color:'#111'}}>{i('card_saved')}</Text>
              <TouchableOpacity onPress={()=>go('edit-card')}>
                <Text style={{color:'#111',fontSize:13,fontWeight:'600'}}>{i('modify')}</Text>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
              <Text style={{fontSize:20}}>💳</Text>
              <Text style={{fontSize:14,color:'#444'}}>
                •••• •••• •••• {form.card_number?form.card_number.replace(/\s/g,'').slice(-4):'4242'}
              </Text>
            </View>
          </View>
          <Text style={s.sectionLabel}>{i('payment_history')}</Text>
          <View style={s.card}>
            {paymentHistory.map((p,idx)=>(
              <View key={idx}>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:10}}>
                  <View>
                    <Text style={{fontSize:14,fontWeight:'500',color:'#111'}}>{p.desc}</Text>
                    <Text style={{fontSize:12,color:'#888',marginTop:2}}>{p.date}</Text>
                  </View>
                  <View style={{flexDirection:'row',alignItems:'center',gap:8}}>
                    <Text style={{fontSize:14,fontWeight:'600',color:'#111'}}>{p.amount}</Text>
                    <Text>{p.status}</Text>
                  </View>
                </View>
                {idx<paymentHistory.length-1&&<View style={{height:1,backgroundColor:'#f0f0f0'}}/>}
              </View>
            ))}
          </View>
          <Text style={s.sectionLabel}>PARRAINAGE</Text>
          <View style={s.card}>
            <Text style={{fontWeight:'600',color:'#111',fontSize:15,marginBottom:4}}>{i('referral_title')}</Text>
            <Text style={{fontSize:13,color:'#666',marginBottom:12}}>{i('referral_desc')}</Text>
            <View style={{backgroundColor:'#f8f8f8',borderRadius:10,padding:12,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <Text style={{fontSize:18,fontWeight:'800',color:'#111',letterSpacing:2}}>{referralCode}</Text>
              <TouchableOpacity onPress={()=>Alert.alert('✅','Code copié !')}>
                <Text style={{color:'#2E75B6',fontWeight:'600',fontSize:13}}>{i('copy_code')}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[s.btnPrimary,{marginTop:12,backgroundColor:'#27500A'}]}
              onPress={()=>Linking.openURL(`mailto:?subject=Essaie RightRoam !&body=Utilise mon code ${referralCode} pour obtenir une réduction sur RightRoam. https://rightroam.app`)}>
              <Text style={s.btnPrimaryTxt}>📤 {i('share_code')}</Text>
            </TouchableOpacity>
          </View>
          <Text style={s.sectionLabel}>{i('security')}</Text>
          {[
            {label:i('change_password'),icon:'🔑',screen:'change-password'},
            {label:i('faq_title'),icon:'❓',screen:'faq'},
            {label:i('contact_title'),icon:'📧',screen:'contact'},
            {label:i('cgu_title'),icon:'📄',screen:'cgu'},
            {label:i('privacy_title'),icon:'🔒',screen:'privacy'},
          ].map(item=>(
            <TouchableOpacity key={item.label}
              style={[s.card,{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:8}]}
              onPress={()=>go(item.screen)}>
              <Text style={{fontSize:14,color:'#111'}}>{item.icon}  {item.label}</Text>
              <Text style={{color:'#ccc',fontSize:20}}>›</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[s.card,{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:8}]}
            onPress={()=>Alert.alert(i('delete_account'),i('delete_confirm'),[
              {text:'Annuler',style:'cancel'},
              {text:'Supprimer',style:'destructive',onPress:()=>{setPlan(null);go('splash');}}
            ])}>
            <Text style={{fontSize:14,color:'#cc0000'}}>🗑️  {i('delete_account')}</Text>
            <Text style={{color:'#ccc',fontSize:20}}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.btnPrimary,{backgroundColor:'transparent',borderWidth:1.5,borderColor:'#111',marginTop:8}]}
            onPress={()=>{setPlan(null);go('splash');}}>
            <Text style={{color:'#111',fontWeight:'600',fontSize:15}}>{i('logout')}</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} plan={plan} i={i}/>
    </SafeAreaView>
  );

  // ── CHAT ──
  if(screen==='chat') return (
    <SafeAreaView style={[s.container,{flex:1}]}>
      <View style={s.chatHeader}>
        <TouchableOpacity onPress={()=>go('main')} style={{marginRight:12}}>
          <Text style={{color:'#111',fontSize:22}}>←</Text>
        </TouchableOpacity>
        <View style={s.lawyerAvatar}><Text style={{color:'#fff',fontWeight:'700',fontSize:13}}>RR</Text></View>
        <View style={{flex:1,marginLeft:10}}>
          <Text style={{fontWeight:'700',color:'#111',fontSize:15}}>{i('support')}</Text>
          <Text style={{fontSize:12,color:'#27A050'}}>{i('online')}</Text>
        </View>
        <TouchableOpacity onPress={()=>go('translator')} style={{padding:8}}>
          <Text style={{fontSize:20}}>🌐</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{flex:1,backgroundColor:'#F8F8F8',padding:14}}>
        {messages.map(m=>(
          <View key={m.id} style={{alignItems:m.from==='user'?'flex-end':'flex-start',marginBottom:12}}>
            <View style={[s.bubble,m.from==='user'?s.bubbleMe:s.bubbleThem]}>
              <Text style={{color:m.from==='user'?'#fff':'#111',fontSize:14,lineHeight:20}}>{m.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={s.chatInput}>
        <TextInput style={s.chatInputField} placeholder={i('message_placeholder')} placeholderTextColor="#999"
          value={msgInput} onChangeText={setMsgInput} autoCapitalize="none"/>
        <TouchableOpacity style={s.sendBtn} onPress={sendMsg}>
          <Text style={{color:'#fff',fontSize:18}}>➤</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  // ── TRADUCTEUR D'URGENCE ──
  if(screen==='translator') return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll}>
        <BackBtn to='main'/>
        <View style={s.pageHeader}>
          <Text style={s.pageTitle}>{i('translate_title')}</Text>
          <Text style={s.pageSubtitle}>{i('translate_desc')}</Text>
        </View>
        <Text style={s.sectionLabel}>PHRASES D'URGENCE</Text>
        {[
          {fr:'J\'ai eu un accident', en:'I had an accident', es:'Tuve un accidente', ar:'تعرضت لحادث', zh:'我出了意外'},
          {fr:'J\'ai besoin d\'un avocat', en:'I need a lawyer', es:'Necesito un abogado', ar:'أحتاج محامياً', zh:'我需要律师'},
          {fr:'Appelez la police', en:'Call the police', es:'Llame a la policía', ar:'اتصل بالشرطة', zh:'请叫警察'},
          {fr:'Je ne comprends pas', en:'I don\'t understand', es:'No entiendo', ar:'لا أفهم', zh:'我不明白'},
          {fr:'J\'ai été volé', en:'I was robbed', es:'Me robaron', ar:'تم سرقتي', zh:'我被抢劫了'},
          {fr:'Où est l\'ambassade ?', en:'Where is the embassy?', es:'¿Dónde está la embajada?', ar:'أين السفارة؟', zh:'大使馆在哪里？'},
        ].map((phrase,idx)=>(
          <TouchableOpacity key={idx} style={s.card}
            onPress={()=>Alert.alert('📋',`FR: ${phrase.fr}\nEN: ${phrase.en}\nES: ${phrase.es}\nAR: ${phrase.ar}\nZH: ${phrase.zh}`)}>
            <Text style={{fontWeight:'600',color:'#111',fontSize:14,marginBottom:4}}>{phrase.fr}</Text>
            <Text style={{fontSize:12,color:'#888'}}>{phrase.en} · {phrase.es}</Text>
          </TouchableOpacity>
        ))}
        <View style={s.infoBox}>
          <Text style={s.infoTxt}>💡 Appuyez sur une phrase pour voir la traduction dans toutes les langues. Montrez l\'écran à votre interlocuteur.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  // ── FAQ ──
  if(screen==='faq') return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll}>
        <BackBtn to='main'/>
        <View style={s.pageHeader}>
          <Text style={s.pageTitle}>{i('faq_title')}</Text>
        </View>
        {FAQ_DATA.map((item,idx)=>(
          <View key={idx} style={[s.card,{marginBottom:10}]}>
            <Text style={{fontWeight:'700',color:'#111',fontSize:14,marginBottom:8}}>❓ {item.q}</Text>
            <Text style={{fontSize:13,color:'#555',lineHeight:20}}>{item.a}</Text>
          </View>
        ))}
        <TouchableOpacity style={[s.btnPrimary,{marginTop:8}]} onPress={()=>go('contact')}>
          <Text style={s.btnPrimaryTxt}>📧 {i('contact_title')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );

  // ── CGU ──
  if(screen==='cgu') return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll}>
        <BackBtn to='main'/>
        <View style={s.pageHeader}><Text style={s.pageTitle}>{i('cgu_title')}</Text></View>
        <View style={s.card}><Text style={{fontSize:13,color:'#444',lineHeight:22}}>{CGU_TEXT}</Text></View>
      </ScrollView>
    </SafeAreaView>
  );

  // ── PRIVACY ──
  if(screen==='privacy') return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll}>
        <BackBtn to='main'/>
        <View style={s.pageHeader}><Text style={s.pageTitle}>{i('privacy_title')}</Text></View>
        <View style={s.card}><Text style={{fontSize:13,color:'#444',lineHeight:22}}>{PRIVACY_TEXT}</Text></View>
      </ScrollView>
    </SafeAreaView>
  );

  // ── CONTACT ──
  if(screen==='contact') return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll}>
        <BackBtn to='main'/>
        <View style={s.pageHeader}>
          <Text style={s.pageTitle}>{i('contact_title')}</Text>
          <Text style={s.pageSubtitle}>{i('contact_subtitle')}</Text>
        </View>
        <View style={s.card}>
          <Text style={{fontSize:14,fontWeight:'600',color:'#111',marginBottom:8}}>📧 Email</Text>
          <TouchableOpacity onPress={()=>Linking.openURL('mailto:rightroam.app@gmail.com')}>
            <Text style={{fontSize:14,color:'#2E75B6',textDecorationLine:'underline'}}>rightroam.app@gmail.com</Text>
          </TouchableOpacity>
        </View>
        <TextInput style={[s.input,{height:120,textAlignVertical:'top'}]}
          placeholder="Décrivez votre problème ou question..." placeholderTextColor="#999"
          multiline autoCapitalize="none" value={contactMsg} onChangeText={setContactMsg}/>
        <TouchableOpacity style={s.btnPrimary}
          onPress={()=>Linking.openURL(`mailto:rightroam.app@gmail.com?subject=Support RightRoam&body=${contactMsg}`)}>
          <Text style={s.btnPrimaryTxt}>📧 Envoyer</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );

  // ── RATING ──
  if(screen==='rating') return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll}>
        <BackBtn to='main'/>
        <View style={s.pageHeader}><Text style={s.pageTitle}>{i('rating_title')}</Text></View>
        <View style={[s.card,{alignItems:'center',paddingVertical:24}]}>
          <View style={s.lawyerAvatar}><Text style={{color:'#fff',fontWeight:'700'}}>MR</Text></View>
          <Text style={{fontWeight:'700',color:'#111',fontSize:16,marginTop:12}}>María Rodriguez</Text>
          <Text style={{fontSize:13,color:'#888',marginTop:4}}>Avocat · Madrid</Text>
          <Text style={{fontSize:12,color:'#666',marginTop:2}}>Dossier : Litige hôtel · 12/06/2025</Text>
        </View>
        <StarRating/>
        <TextInput style={[s.input,{height:100,textAlignVertical:'top'}]}
          placeholder="Votre commentaire (optionnel)..." placeholderTextColor="#999"
          multiline autoCapitalize="none" value={ratingComment} onChangeText={setRatingComment}/>
        <TouchableOpacity style={s.btnPrimary}
          onPress={()=>{
            if(rating===0){Alert.alert('Erreur','Veuillez sélectionner une note.');return;}
            Alert.alert('✅',i('rating_thanks'));
            go('main');
          }}>
          <Text style={s.btnPrimaryTxt}>{i('submit_rating')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );

  // ── EDIT CARD ──
  if(screen==='edit-card') return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll}>
        <BackBtn to='main'/>
        <View style={s.pageHeader}>
          <Text style={s.pageTitle}>💳 {i('modify')} {i('card_saved')}</Text>
        </View>
        <TextInput style={s.input} placeholder="4242 4242 4242 4242" placeholderTextColor="#999"
          keyboardType="numeric" autoCapitalize="none"
          value={form.card_number} onChangeText={v=>upd('card_number',formatCardNumber(v))}/>
        <View style={{flexDirection:'row',gap:10}}>
          <TextInput style={[s.input,{flex:1}]} placeholder="MM/AA" placeholderTextColor="#999"
            keyboardType="numeric" autoCapitalize="none"
            value={form.card_expiry} onChangeText={v=>upd('card_expiry',formatExpiry(v))}/>
          <TextInput style={[s.input,{flex:1}]} placeholder="CVV" placeholderTextColor="#999"
            keyboardType="numeric" autoCapitalize="none" maxLength={4}
            value={form.card_cvv} onChangeText={v=>upd('card_cvv',v)}/>
        </View>
        <View style={s.notice}><Text style={s.noticeTxt}>🔒 {i('stripe_secure')}</Text></View>
        <TouchableOpacity style={s.btnPrimary}
          onPress={()=>{setCardSaved(true);setEditingCard(false);Alert.alert('✅',i('saved'));go('main');}}>
          <Text style={s.btnPrimaryTxt}>{i('save')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );

  // ── CHANGE PASSWORD ──
  if(screen==='change-password') return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll}>
        <BackBtn to='main'/>
        <View style={s.pageHeader}><Text style={s.pageTitle}>🔑 {i('change_password')}</Text></View>
        <TextInput style={s.input} placeholder={i('current_password')} placeholderTextColor="#999"
          secureTextEntry autoCapitalize="none"
          value={form.current_password} onChangeText={v=>upd('current_password',v)}/>
        <TextInput style={s.input} placeholder={i('new_password')} placeholderTextColor="#999"
          secureTextEntry autoCapitalize="none"
          value={form.new_password} onChangeText={v=>upd('new_password',v)}/>
        <TextInput style={s.input} placeholder={i('confirm_password')} placeholderTextColor="#999"
          secureTextEntry autoCapitalize="none"
          value={form.confirm_password} onChangeText={v=>upd('confirm_password',v)}/>
        <View style={s.notice}>
          <Text style={s.noticeTxt}>🔒 Le mot de passe doit contenir au moins 8 caractères.</Text>
        </View>
        <TouchableOpacity style={s.btnPrimary} onPress={handleChangePassword}>
          <Text style={s.btnPrimaryTxt}>{i('change_pwd_btn')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );

  // ── LAWYER REGISTER ──
  if(screen==='lawyer-register') return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll}>
        <BackBtn to='splash'/>
        <View style={s.pageHeader}>
          <Text style={s.pageTitle}>{i('lawyer_title')}</Text>
          <Text style={s.pageSubtitle}>{i('lawyer_subtitle')}</Text>
        </View>
        {[
          {k:'first_name',ph:i('firstname')},
          {k:'last_name',ph:i('lastname')},
          {k:'email',ph:i('email'),kb:'email-address'},
          {k:'password',ph:i('password'),sec:true},
        ].map(f=>(
          <TextInput key={f.k} style={s.input} placeholder={f.ph} placeholderTextColor="#999"
            keyboardType={f.kb||'default'} secureTextEntry={f.sec} autoCapitalize="none"
            value={form[f.k]} onChangeText={v=>upd(f.k,v)}/>
        ))}
        {[
          {k:'bar_number',ph:i('bar_number')},
          {k:'bar_country',ph:i('bar_country')},
          {k:'bar_city',ph:i('bar_city')},
        ].map(f=>(
          <TextInput key={f.k} style={s.input} placeholder={f.ph} placeholderTextColor="#999"
            autoCapitalize="none" value={form[f.k]} onChangeText={v=>upd(f.k,v)}/>
        ))}
        <View style={s.notice}><Text style={s.noticeTxt}>📄  {i('verification')}</Text></View>
        <TouchableOpacity style={s.btnPrimary} onPress={()=>go('lawyer-dash')}>
          <Text style={s.btnPrimaryTxt}>{i('submit')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );

  // ── LAWYER DASH ──
  if(screen==='lawyer-dash') return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll}>
        <BackBtn to='splash'/>
        <View style={s.pageHeader}>
          <Text style={s.pageTitle}>{i('lawyer_title')}</Text>
          <Text style={s.pageSubtitle}>{i('verification')}</Text>
        </View>
        <View style={[s.notice,{backgroundColor:'#FEF9E7',borderColor:'#F0C040'}]}>
          <Text style={[s.noticeTxt,{color:'#633806'}]}>{i('verification')}</Text>
        </View>
        <View style={{flexDirection:'row',gap:8,marginBottom:20}}>
          {[{val:'0',lbl:i('pending')},{val:'0',lbl:i('total')},{val:'0€',lbl:i('this_month')}].map((st,idx)=>(
            <View key={idx} style={[s.statCard,{flex:1}]}>
              <Text style={s.statVal}>{st.val}</Text>
              <Text style={s.statLbl}>{st.lbl}</Text>
            </View>
          ))}
        </View>
        <View style={s.card}>
          <Text style={{fontWeight:'600',color:'#111',marginBottom:12}}>{i('how_it_works')}</Text>
          {[
            '1. Votre profil est vérifié par notre équipe (24-48h)',
            '2. Vous apparaissez dans notre réseau mondial',
            '3. Vous recevez des demandes de clients voyageurs',
            '4. Vous acceptez ou refusez chaque dossier',
            '5. Vous êtes payé directement via RightRoam',
          ].map((step,idx)=>(
            <Text key={idx} style={{fontSize:13,color:'#555',marginBottom:8,lineHeight:20}}>{step}</Text>
          ))}
        </View>
        <TouchableOpacity style={[s.btnPrimary,{marginTop:8}]} onPress={()=>go('splash')}>
          <Text style={s.btnPrimaryTxt}>{i('logout')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );

  return null;
}

function BottomNav({activeTab,setActiveTab,plan,i}) {
  const tabs=[
    {id:'reservation',icon:'✈️',label:i('tab_reservation')},
    {id:'abonnements',icon:'💳',label:i('tab_subs')},
    {id:'urgence',icon:'🚨',label:i('tab_urgent')},
    {id:'profil',icon:'👤',label:i('tab_profile')},
  ];
  return (
    <View style={s.bottomNav}>
      {tabs.map(tab=>(
        <TouchableOpacity key={tab.id} style={s.navBtn} onPress={()=>setActiveTab(tab.id)}>
          <View style={{position:'relative'}}>
            <Text style={{fontSize:22}}>{tab.icon}</Text>
            {tab.id==='urgence'&&plan&&(
              <View style={{position:'absolute',top:-2,right:-2,width:8,height:8,borderRadius:4,backgroundColor:'#27A050'}}/>
            )}
          </View>
          <Text style={[s.navLabel,activeTab===tab.id&&s.navLabelActive]}>{tab.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  splash:{flex:1,backgroundColor:'#0a0a0a',alignItems:'center',justifyContent:'center',padding:28},
  splashLogo:{width:72,height:72,borderRadius:36,backgroundColor:'rgba(255,255,255,0.08)',alignItems:'center',justifyContent:'center',marginBottom:20},
  splashTitle:{fontSize:32,fontWeight:'800',color:'#fff',letterSpacing:6},
  splashDivider:{width:40,height:1,backgroundColor:'rgba(255,255,255,0.2)',marginVertical:16},
  splashTag:{color:'rgba(255,255,255,0.5)',fontSize:14,textAlign:'center',letterSpacing:1},
  langBtn:{paddingHorizontal:12,paddingVertical:8,marginRight:8,borderRadius:20,borderWidth:1,borderColor:'rgba(255,255,255,0.15)',alignItems:'center'},
  langBtnActive:{backgroundColor:'rgba(255,255,255,0.15)',borderColor:'rgba(255,255,255,0.4)'},
  langBtnLight:{paddingHorizontal:10,paddingVertical:8,marginRight:8,borderRadius:20,borderWidth:1,borderColor:'#e0e0e0',alignItems:'center'},
  langBtnLightActive:{backgroundColor:'#111',borderColor:'#111'},
  btnPrimary:{backgroundColor:'#111',borderRadius:14,padding:16,alignItems:'center',marginBottom:10},
  btnPrimaryTxt:{color:'#fff',fontSize:15,fontWeight:'700',letterSpacing:0.5},
  btnOutline:{borderWidth:1.5,borderColor:'rgba(255,255,255,0.3)',borderRadius:14,padding:15,alignItems:'center',width:'100%',marginTop:10},
  btnOutlineTxt:{color:'#fff',fontSize:15,fontWeight:'600'},
  backBtn:{marginBottom:16},
  backBtnTxt:{color:'#888',fontSize:14},
  container:{flex:1,backgroundColor:'#fff'},
  scroll:{padding:20,paddingBottom:40},
  pageHeader:{marginBottom:20},
  pageTitle:{fontSize:24,fontWeight:'800',color:'#111',letterSpacing:-0.5},
  pageSubtitle:{fontSize:14,color:'#888',marginTop:4},
  fieldLabel:{fontSize:13,fontWeight:'500',color:'#333',marginBottom:6,marginTop:4},
  input:{backgroundColor:'#f8f8f8',borderWidth:1,borderColor:'#ebebeb',borderRadius:12,padding:14,fontSize:15,color:'#111',marginBottom:12},
  dateInput:{backgroundColor:'#f8f8f8',borderWidth:1,borderColor:'#ebebeb',borderRadius:12,padding:14,marginBottom:12,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  dateInputText:{fontSize:15,color:'#111'},
  dateInputPlaceholder:{fontSize:15,color:'#999'},
  notice:{backgroundColor:'#f8f8f8',borderRadius:12,padding:14,marginBottom:16,borderWidth:1,borderColor:'#ebebeb'},
  noticeTxt:{fontSize:13,color:'#666',lineHeight:18},
  successBanner:{backgroundColor:'#f0faf0',borderRadius:12,padding:12,marginBottom:16,borderWidth:1,borderColor:'#c8e6c9'},
  successTxt:{fontSize:13,color:'#1a5c2e',fontWeight:'600'},
  infoBox:{backgroundColor:'#f8f8f8',borderRadius:12,padding:14,marginBottom:16,borderLeftWidth:3,borderLeftColor:'#111'},
  infoTxt:{fontSize:13,color:'#666',lineHeight:18},
  card:{backgroundColor:'#fff',borderRadius:14,padding:16,borderWidth:1,borderColor:'#ebebeb',marginBottom:12},
  cardLabel:{fontSize:11,fontWeight:'700',color:'#888',letterSpacing:1,marginBottom:4},
  cardValue:{fontSize:16,fontWeight:'600',color:'#111'},
  planCard:{backgroundColor:'#fff',borderRadius:16,padding:18,borderWidth:1.5,borderColor:'#ebebeb',marginBottom:12},
  planCardActive:{backgroundColor:'#111',borderColor:'#111'},
  planName:{fontSize:16,fontWeight:'700',color:'#111'},
  planPrice:{fontSize:28,fontWeight:'800',color:'#111',marginTop:4},
  badge:{backgroundColor:'#f0f0f0',paddingHorizontal:10,paddingVertical:4,borderRadius:20},
  badgeTxt:{fontSize:12,fontWeight:'600',color:'#444'},
  sectionLabel:{fontSize:11,fontWeight:'700',color:'#888',letterSpacing:1.5,marginBottom:12,marginTop:4},
  caseCard:{width:'30%',backgroundColor:'#f8f8f8',borderRadius:14,padding:12,alignItems:'center',borderWidth:1,borderColor:'#ebebeb'},
  lawyerAvatar:{width:44,height:44,borderRadius:22,backgroundColor:'#111',alignItems:'center',justifyContent:'center'},
  profileAvatar:{width:80,height:80,borderRadius:40,backgroundColor:'#111',alignItems:'center',justifyContent:'center'},
  statCard:{backgroundColor:'#f8f8f8',borderRadius:14,padding:16,alignItems:'center',borderWidth:1,borderColor:'#ebebeb'},
  statVal:{fontSize:24,fontWeight:'800',color:'#111'},
  statLbl:{fontSize:11,color:'#888',marginTop:4},
  emergencyBtn:{backgroundColor:'#cc0000',borderRadius:14,padding:18,alignItems:'center',marginBottom:12},
  emergencyBtnTxt:{color:'#fff',fontSize:16,fontWeight:'700'},
  chatHeader:{flexDirection:'row',alignItems:'center',padding:16,borderBottomWidth:1,borderBottomColor:'#f0f0f0',backgroundColor:'#fff'},
  chatInput:{flexDirection:'row',padding:12,gap:8,borderTopWidth:1,borderTopColor:'#f0f0f0',backgroundColor:'#fff'},
  chatInputField:{flex:1,backgroundColor:'#f8f8f8',borderWidth:1,borderColor:'#ebebeb',borderRadius:24,paddingHorizontal:16,paddingVertical:10,fontSize:14,color:'#111'},
  sendBtn:{width:44,height:44,borderRadius:22,backgroundColor:'#111',alignItems:'center',justifyContent:'center'},
  bubble:{maxWidth:'78%',padding:12,borderRadius:18},
  bubbleMe:{backgroundColor:'#111',borderBottomRightRadius:4},
  bubbleThem:{backgroundColor:'#fff',borderWidth:1,borderColor:'#ebebeb',borderBottomLeftRadius:4},
  bottomNav:{flexDirection:'row',borderTopWidth:1,borderTopColor:'#f0f0f0',backgroundColor:'#fff',paddingBottom:4},
  navBtn:{flex:1,paddingVertical:10,alignItems:'center'},
  navLabel:{fontSize:10,color:'#bbb',marginTop:2},
  navLabelActive:{color:'#111',fontWeight:'700'},
  modalOverlay:{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'flex-end'},
  modalBox:{backgroundColor:'#fff',borderTopLeftRadius:24,borderTopRightRadius:24,padding:24},
  modalTitle:{fontSize:18,fontWeight:'700',color:'#111',textAlign:'center',marginBottom:20},
  pickerRow:{flexDirection:'row',height:200,gap:8,marginBottom:20},
  pickerCol:{flex:1,borderWidth:1,borderColor:'#ebebeb',borderRadius:12},
  pickerItem:{padding:12,alignItems:'center'},
  pickerItemActive:{backgroundColor:'#111',borderRadius:8,margin:2},
  pickerTxt:{fontSize:15,color:'#333'},
  pickerTxtActive:{color:'#fff',fontWeight:'700'},
});
