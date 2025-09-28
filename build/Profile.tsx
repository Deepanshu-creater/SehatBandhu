import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Updated Colorful Theme matching the health records
const THEME = {
    primary: '#2563EB',      // Blue
    primaryLight: '#60A5FA',
    primaryDark: '#1D4ED8',
    secondary: '#F0F9FF',    // Light blue background
    background: '#F8FAFC',   // Very light blue-gray
    surface: '#FFFFFF',
    accent: '#8B5CF6',       // Purple accent
    text: {
        primary: '#1E293B',  // Dark blue-gray
        secondary: '#475569', // Medium blue-gray
        tertiary: '#64748B',  // Light blue-gray
        light: '#94A3B8',     // Very light blue-gray
    },
    status: {
        success: '#10B981',   // Green for success
        warning: '#F59E0B',   // Amber for warning
        error: '#EF4444',     // Red for error
        info: '#3B82F6',      // Blue for info
        normal: '#10B981',    // Green for normal
    },
    category: {
        consultation: '#3B82F6',  // Blue
        lab: '#8B5CF6',           // Purple
        prescription: '#10B981',  // Green
        vaccination: '#F59E0B',   // Amber
        surgery: '#EF4444',       // Red
    },
    border: '#E2E8F0',
    shadow: 'rgba(15, 23, 42, 0.1)',
};

const Profile = () => {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [phone, setPhone] = useState('+1 123-456-7890');
  const [healthNotes, setHealthNotes] = useState('Allergic to penicillin, Asthmatic');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleSave = () => {
    setIsEditing(false);
    // Add save animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start(() => {
      Alert.alert('✅ Success', 'Profile updated successfully!');
    });
  };

  const handleEditPress = () => {
    setIsEditing(true);
    // Bounce animation when entering edit mode
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleLogout = () => {
    Alert.alert(
      '🔐 Confirm Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: () => {
            console.log('Logged out');
          }
        },
      ]
    );
  };

  // Enhanced health metrics with more detailed data
  const healthMetrics = [
    { 
      icon: 'heart', 
      label: 'Heart Rate', 
      value: '72', 
      unit: 'bpm', 
      color: THEME.category.surgery, 
      status: 'Normal',
      trend: 'stable',
      lastCheck: '2 hours ago'
    },
    { 
      icon: 'water', 
      label: 'Hydration', 
      value: '85', 
      unit: '%', 
      color: THEME.category.consultation, 
      status: 'Good',
      trend: 'up',
      lastCheck: 'Today'
    },
    { 
      icon: 'footsteps', 
      label: 'Steps', 
      value: '8,542', 
      unit: 'today', 
      color: THEME.category.prescription, 
      status: 'Active',
      trend: 'up',
      lastCheck: 'Live'
    },
    { 
      icon: 'moon', 
      label: 'Sleep', 
      value: '7.2', 
      unit: 'hours', 
      color: THEME.category.lab, 
      status: 'Adequate',
      trend: 'stable',
      lastCheck: 'Last night'
    },
  ];

  // Enhanced quick links with more options and better icons
  const quickLinks = [
    { 
      icon: 'medkit', 
      label: 'Prescriptions', 
      color: THEME.category.prescription,
      count: 3,
      onPress: () => showFeatureAlert('Prescriptions', '💊') 
    },
    { 
      icon: 'calendar', 
      label: 'Appointments', 
      color: THEME.category.consultation,
      count: 2,
      onPress: () => showFeatureAlert('Appointments', '📅') 
    },
    { 
      icon: 'chatbubbles', 
      label: 'Consult', 
      color: THEME.accent,
      count: 1,
      onPress: () => showFeatureAlert('Consult Doctor', '👨‍⚕️') 
    },
    { 
      icon: 'document-text', 
      label: 'Records', 
      color: THEME.category.lab,
      count: 12,
      onPress: () => showFeatureAlert('Health Records', '📋') 
    },
  ];

  // Recent activities with icons
  const recentActivities = [
    {
      icon: 'calendar',
      title: 'Upcoming Appointment',
      description: 'With Dr. Sarah Johnson',
      time: 'Tomorrow, 10:30 AM',
      color: THEME.category.consultation,
      type: 'appointment'
    },
    {
      icon: 'alert-circle',
      title: 'Prescription Renewal',
      description: 'Vitamin D supplements',
      time: 'Due in 3 days',
      color: THEME.category.prescription,
      type: 'prescription'
    },
    {
      icon: 'fitness',
      title: 'Lab Results Ready',
      description: 'Blood test available',
      time: '2 hours ago',
      color: THEME.category.lab,
      type: 'lab'
    }
  ];

  // Enhanced health tips
  const healthTips = [
    { 
      icon: 'water', 
      text: 'Drink 8 glasses of water daily', 
      color: THEME.category.consultation,
      progress: 0.7 
    },
    { 
      icon: 'walk', 
      text: '30 min walk improves heart health', 
      color: THEME.category.prescription,
      progress: 0.9 
    },
    { 
      icon: 'leaf', 
      text: 'Add greens to every meal', 
      color: THEME.status.success,
      progress: 0.6 
    },
    { 
      icon: 'bed', 
      text: 'Aim for 7-8 hours sleep', 
      color: THEME.category.lab,
      progress: 0.8 
    },
  ];

  const showFeatureAlert = (title: string, emoji: string) => {
    Alert.alert(
      `${emoji} ${title}`,
      'This feature is coming soon! Stay tuned for updates.',
      [{ text: 'Got it!', style: 'default' }]
    );
  };

  const ProfileTabs = () => (
    <View style={styles.tabsContainer}>
      {[
        { id: 'personal', label: 'Personal', icon: 'person' },
        { id: 'health', label: 'Health', icon: 'fitness' },
        { id: 'activities', label: 'Activities', icon: 'time' },
        { id: 'settings', label: 'Settings', icon: 'settings' }
      ].map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tab,
            activeTab === tab.id && styles.activeTab,
            { borderColor: tab.id === 'personal' ? THEME.primary : 
                         tab.id === 'health' ? THEME.category.prescription : 
                         tab.id === 'activities' ? THEME.accent :
                         THEME.category.lab }
          ]}
          onPress={() => setActiveTab(tab.id)}
        >
          <Ionicons 
            Name={tab.icon} 
            size={16} 
            color={activeTab === tab.id ? THEME.surface : 
                  tab.id === 'personal' ? THEME.primary : 
                  tab.id === 'health' ? THEME.category.prescription :
                  tab.id === 'activities' ? THEME.accent :
                  THEME.category.lab} 
          />
          <Text style={[
            styles.tabText,
            activeTab === tab.id && styles.activeTabText
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderPersonalInfo = () => (
    <Animated.View 
      style={[
        styles.section,
        { 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
        }
      ]}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Image
            source={{ uri: 'https://static.vecteezy.com/system/resources/previews/051/270/245/non_2x/cartoon-people-avatar-minimalist-human-avatar-versatile-icon-for-online-projects-an-avatar-for-the-profile-picture-of-someone-vector.jpg' }}
            style={styles.avatarImage}
          />
          <TouchableOpacity
            style={styles.editAvatarButton}
            onPress={() => showFeatureAlert('Profile Photo', '📷')}
          >
            <Ionicons name="camera" size={14} color={THEME.surface} />
          </TouchableOpacity>
        </View>
        <Text style={styles.avatarText}>{name}</Text>
        <Text style={styles.avatarSubText}>Sehat-ID: RA32123456</Text>
        <View style={styles.healthScore}>
          <Ionicons name="shield-checkmark" size={14} color={THEME.status.success} />
          <Text style={styles.healthScoreText}>Health Score: 92/100</Text>
        </View>
      </View>

      <View style={styles.fieldsContainer}>
        <View style={styles.field}>
          <View style={styles.fieldHeader}>
            <Ionicons name="person-outline" size={16} color={THEME.primary} />
            <Text style={styles.label}>Full Name</Text>
          </View>
          <TextInput
            style={[styles.input, isEditing && styles.inputEditable]}
            value={name}
            onChangeText={setName}
            editable={isEditing}
            placeholder="Enter your full name"
            placeholderTextColor={THEME.text.light}
          />
        </View>

        <View style={styles.field}>
          <View style={styles.fieldHeader}>
            <Ionicons name="mail-outline" size={16} color={THEME.primary} />
            <Text style={styles.label}>Email Address</Text>
          </View>
          <TextInput
            style={[styles.input, isEditing && styles.inputEditable]}
            value={email}
            onChangeText={setEmail}
            editable={isEditing}
            placeholder="Enter your email"
            placeholderTextColor={THEME.text.light}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.field}>
          <View style={styles.fieldHeader}>
            <Ionicons name="call-outline" size={16} color={THEME.primary} />
            <Text style={styles.label}>Phone Number</Text>
          </View>
          <TextInput
            style={[styles.input, isEditing && styles.inputEditable]}
            value={phone}
            onChangeText={setPhone}
            editable={isEditing}
            placeholder="Enter your phone number"
            placeholderTextColor={THEME.text.light}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.field}>
          <View style={styles.fieldHeader}>
            <Ionicons name="medical-outline" size={16} color={THEME.primary} />
            <Text style={styles.label}>Health Notes</Text>
          </View>
          <TextInput
            style={[styles.input, isEditing && styles.inputEditable, styles.textArea]}
            value={healthNotes}
            onChangeText={setHealthNotes}
            editable={isEditing}
            placeholder="E.g., Allergies, chronic conditions, medications..."
            placeholderTextColor={THEME.text.light}
            multiline
            numberOfLines={3}
          />
        </View>
      </View>
    </Animated.View>
  );

  const renderHealthMetrics = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Health Metrics</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>View Details</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.metricsGrid}>
        {healthMetrics.map((metric, index) => (
          <TouchableOpacity key={index} style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: `${metric.color}15` }]}>
              <Ionicons 
              Name={metric.icon} size={20} color={metric.color} />
            </View>
            <Text style={styles.metricValue}>{metric.value}</Text>
            <Text style={styles.metricUnit}>{metric.unit}</Text>
            <Text style={styles.metricLabel}>{metric.label}</Text>
            <View style={styles.metricDetails}>
              <View style={[styles.metricStatus, { backgroundColor: `${metric.color}15` }]}>
                <Text style={[styles.metricStatusText, { color: metric.color }]}>
                  {metric.status}
                </Text>
              </View>
              <Text style={styles.metricTime}>{metric.lastCheck}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderRecentActivities = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.activitiesList}>
        {recentActivities.map((activity, index) => (
          <TouchableOpacity key={index} style={styles.activityCard}>
            <View style={[styles.activityIcon, { backgroundColor: `${activity.color}15` }]}>
              <Ionicons Name={activity.icon} size={18} color={activity.color} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityDescription}>{activity.description}</Text>
              <View style={styles.activityTime}>
                <Ionicons name="time-outline" size={12} color={THEME.text.tertiary} />
                <Text style={styles.activityTimeText}>{activity.time}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.activityAction}>
              <Ionicons name="chevron-forward" size={16} color={THEME.text.tertiary} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Preferences</Text>
      <View style={styles.settingsList}>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <View style={[styles.settingIcon, { backgroundColor: `${THEME.primary}15` }]}>
              <Ionicons name="notifications-outline" size={18} color={THEME.primary} />
            </View>
            <View>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDescription}>Health reminders and updates</Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: THEME.border, true: THEME.primaryLight }}
            thumbColor={notificationsEnabled ? THEME.primary : THEME.surface}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <View style={[styles.settingIcon, { backgroundColor: `${THEME.accent}15` }]}>
              <Ionicons name="moon-outline" size={18} color={THEME.accent} />
            </View>
            <View>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Text style={styles.settingDescription}>Easy on the eyes</Text>
            </View>
          </View>
          <Switch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
            trackColor={{ false: THEME.border, true: THEME.accent }}
            thumbColor={darkModeEnabled ? THEME.accent : THEME.surface}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <View style={[styles.settingIcon, { backgroundColor: `${THEME.category.prescription}15` }]}>
              <Ionicons name="finger-print-outline" size={18} color={THEME.category.prescription} />
            </View>
            <View>
              <Text style={styles.settingLabel}>Biometric Login</Text>
              <Text style={styles.settingDescription}>Use Face ID/Touch ID</Text>
            </View>
          </View>
          <Switch
            value={biometricEnabled}
            onValueChange={setBiometricEnabled}
            trackColor={{ false: THEME.border, true: THEME.category.prescription }}
            thumbColor={biometricEnabled ? THEME.category.prescription : THEME.surface}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <View style={[styles.settingIcon, { backgroundColor: `${THEME.category.lab}15` }]}>
              <Ionicons name="language-outline" size={18} color={THEME.category.lab} />
            </View>
            <View>
              <Text style={styles.settingLabel}>Language</Text>
              <Text style={styles.settingDescription}>English (US)</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color={THEME.text.tertiary} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.background} />
      
      {/* Enhanced Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Profile</Text>
          <Text style={styles.headerSubtitle}>Manage your health account</Text>
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => showFeatureAlert('Settings', '⚙️')}
        >
          <Ionicons name="settings-outline" size={20} color={THEME.surface} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Quick Links with Count Badges */}
        <View style={styles.quickLinksContainer}>
          {quickLinks.map((link, index) => (
            <TouchableOpacity 
              key={link.label} 
              style={styles.quickLinkBtn} 
              onPress={link.onPress}
            >
              <View style={[styles.quickLinkIcon, { backgroundColor: `${link.color}15` }]}>
                <Ionicons Name={link.icon} size={20} color={link.color} />
                {link.count > 0 && (
                  <View style={[styles.quickLinkBadge, { backgroundColor: link.color }]}>
                    <Text style={styles.quickLinkBadgeText}>{link.count}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.quickLinkText}>{link.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Profile Tabs */}
        <ProfileTabs />

        {/* Tab Content */}
        {activeTab === 'personal' && renderPersonalInfo()}
        {activeTab === 'health' && renderHealthMetrics()}
        {activeTab === 'activities' && renderRecentActivities()}
        {activeTab === 'settings' && renderSettings()}

        {/* Health Tips */}
        <View style={styles.healthTipsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daily Health Tips</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.healthTipsContent}
          >
            {healthTips.map((tip, idx) => (
              <View key={idx} style={styles.healthTipCard}>
                <View style={[styles.healthTipIcon, { backgroundColor: `${tip.color}15` }]}>
                  <Ionicons Name={tip.icon} size={20} color={tip.color} />
                </View>
                <Text style={styles.healthTipText}>{tip.text}</Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${tip.progress * 100}%`,
                        backgroundColor: tip.color
                      }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, isEditing ? styles.buttonPrimary : styles.buttonEdit]}
            onPress={isEditing ? handleSave : handleEditPress}
          >
            <Ionicons 
              name={isEditing ? "checkmark-circle" : "create-outline"} 
              size={18} 
              color={isEditing ? THEME.surface : THEME.primary} 
            />
            <Text style={[styles.buttonText, isEditing && styles.buttonPrimaryText]}>
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.buttonSecondary]} 
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={18} color={THEME.status.error} />
            <Text style={styles.buttonSecondaryText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.disclaimer}>
          💡 Keep your profile updated for personalized health recommendations
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 16,
    backgroundColor: THEME.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
    shadowColor: THEME.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: THEME.text.primary,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: THEME.text.secondary,
    fontWeight: '500',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  quickLinksContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: THEME.surface,
    marginBottom: 8,
  },
  quickLinkBtn: {
    alignItems: 'center',
    flex: 1,
    padding: 8,
    position: 'relative',
  },
  quickLinkIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    position: 'relative',
  },
  quickLinkBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickLinkBadgeText: {
    color: THEME.surface,
    fontSize: 10,
    fontWeight: '700',
  },
  quickLinkText: {
    fontSize: 11,
    color: THEME.text.secondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: THEME.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: THEME.background,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeTab: {
    backgroundColor: THEME.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.text.tertiary,
    marginLeft: 6,
  },
  activeTabText: {
    color: THEME.surface,
  },
  section: {
    backgroundColor: THEME.surface,
    borderRadius: 16,
    margin: 16,
    padding: 20,
    shadowColor: THEME.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.text.primary,
  },
  seeAllText: {
    fontSize: 12,
    color: THEME.primary,
    fontWeight: '600',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: THEME.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: THEME.primary,
    position: 'relative',
    marginBottom: 12,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: THEME.status.info,
    borderRadius: 14,
    padding: 6,
    borderWidth: 2,
    borderColor: THEME.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.text.primary,
    marginBottom: 4,
  },
  avatarSubText: {
    fontSize: 13,
    color: THEME.text.tertiary,
    marginBottom: 8,
  },
  healthScore: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${THEME.status.success}15`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${THEME.status.success}30`,
  },
  healthScoreText: {
    fontSize: 12,
    color: THEME.status.success,
    fontWeight: '600',
    marginLeft: 4,
  },
  fieldsContainer: {
    marginBottom: 8,
  },
  field: {
    marginBottom: 16,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.text.primary,
    marginLeft: 6,
  },
  input: {
    backgroundColor: THEME.background,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: THEME.text.primary,
    borderWidth: 1,
    borderColor: THEME.border,
    minHeight: 46,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputEditable: {
    backgroundColor: THEME.surface,
    borderColor: THEME.primary,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: THEME.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.text.primary,
    marginBottom: 2,
  },
  metricUnit: {
    fontSize: 12,
    color: THEME.text.tertiary,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 11,
    color: THEME.text.secondary,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  metricDetails: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricStatus: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  metricStatusText: {
    fontSize: 9,
    fontWeight: '700',
  },
  metricTime: {
    fontSize: 9,
    color: THEME.text.light,
  },
  activitiesList: {
    gap: 12,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: THEME.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.text.primary,
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 12,
    color: THEME.text.secondary,
    marginBottom: 4,
  },
  activityTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityTimeText: {
    fontSize: 11,
    color: THEME.text.tertiary,
    marginLeft: 4,
  },
  activityAction: {
    padding: 4,
  },
  settingsList: {
    gap: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: THEME.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.text.primary,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 11,
    color: THEME.text.tertiary,
  },
  healthTipsSection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  healthTipsContent: {
    paddingRight: 16,
  },
  healthTipCard: {
    backgroundColor: THEME.surface,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 160,
    borderWidth: 1,
    borderColor: THEME.border,
    shadowColor: THEME.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  healthTipIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  healthTipText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.text.primary,
    marginVertical: 10,
    flex: 1,
    lineHeight: 18,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: THEME.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 12,
    borderRadius: 30,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  buttonEdit: {
    backgroundColor: THEME.surface,
    borderColor: THEME.primary,
  },
  buttonPrimary: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonSecondary: {
    backgroundColor: THEME.surface,
    borderColor: THEME.status.error,
    borderWidth: 1,
    shadowColor: THEME.status.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flex: 0.9,
    marginLeft: 12,
    marginRight: 0,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.primary,
    marginLeft: 6,
  },
  buttonPrimaryText: {
    color: THEME.surface,
  },
  buttonSecondaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.status.error, 
    marginLeft: 6,
  },
  disclaimer: {
    fontSize: 12,
    color: THEME.text.tertiary,
    textAlign: 'center',
    paddingHorizontal: 20,
  }, 
  });
export default Profile;