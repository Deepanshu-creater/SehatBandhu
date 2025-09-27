import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isMobile = screenWidth < 768;

// Theme Colors
const COLORS = {
  primary: '#10B981',
  primaryDark: '#059669',
  primaryLight: '#D1FAE5',
  white: '#FFFFFF',
  background: '#F9FAFB',
  text: '#1F2937',
  textLight: '#6B7280',
  border: '#E5E7EB',
  danger: '#EF4444',
  warning: '#F59E0B',
};

type IoniconsName = 'home' | 'medkit' | 'document-text' | 'search' | 'log-out' | 'calendar' | 'person' | 'videocam' | 'time' | 'medical' | 'alert-circle';
type FontAwesome5Name = 'hospital' | 'user-md';
type TabType = 'dashboard' | 'prescription' | 'healthRecord' | 'consult';

interface NavItem {
  id: TabType;
  label: string;
  icon: IoniconsName | FontAwesome5Name;
  isFontAwesome?: boolean;
  isFeatured?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Home', icon: 'home' },
  { id: 'prescription', label: 'Prescriptions', icon: 'medkit' },
  { id: 'healthRecord', label: 'Records', icon: 'document-text' },
  { id: 'consult', label: 'Book Consult', icon: 'videocam', isFeatured: true },
];

// Consultation Types
const CONSULTATION_TYPES = [
  { id: 'general', label: 'General Consultation', icon: 'person' },
  { id: 'specialist', label: 'Specialist Consultation', icon: 'user-md' },
  { id: 'followup', label: 'Follow-up Visit', icon: 'medical' },
  { id: 'emergency', label: 'Emergency', icon: 'alert-circle' },
];

const TIME_SLOTS = [
  { id: '1', label: 'Slot 1: 9:00 AM - 11:00 AM' },
  { id: '2', label: 'Slot 2: 2:00 PM - 4:00 PM' },
  { id: '3', label: 'Slot 3: 6:00 PM - 8:00 PM' },
];

const MEDICINE_TIMINGS = [
  { id: 'morning', label: 'Morning (Before Breakfast)' },
  { id: 'afternoon', label: 'Afternoon (After Lunch)' },
  { id: 'evening', label: 'Evening (Before Dinner)' },
  { id: 'bedtime', label: 'Bedtime' },
  { id: 'as_needed', label: 'As Needed' },
];

// Consultation Booking Modal Component
interface ConsultationBookingModalProps {
  visible: boolean;
  onClose: () => void;
  onStartConsultation: (data: ConsultationData) => void;
}

interface ConsultationData {
  sehatId: string;
  consultationType: string;
  preferredDate: Date;
  preferredSlot: string;
  medicineTiming: string;
  symptoms: string;
  priority: string;
  doctorPreference: string;
}

function ConsultationBookingModal({
  visible,
  onClose,
  onStartConsultation,
}: ConsultationBookingModalProps) {
  const [formData, setFormData] = useState<ConsultationData>({
    sehatId: '',
    consultationType: 'general',
    preferredDate: new Date(),
    preferredSlot: '1',
    medicineTiming: 'morning',
    symptoms: '',
    priority: 'normal',
    doctorPreference: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleInputChange = (field: keyof ConsultationData, value: string | Date) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleInputChange('preferredDate', selectedDate);
    }
  };

  const handleSubmit = () => {
    if (!formData.sehatId.trim()) {
      Alert.alert("Error", "Please enter your Sehat ID");
      return;
    }
    if (!formData.symptoms.trim()) {
      Alert.alert("Error", "Please describe your symptoms");
      return;
    }

    const websiteUrl = 'https://video-one-livid.vercel.app/';
    Linking.openURL(websiteUrl)
      .then(() => {
        console.log('Opened consultation website successfully');
        onStartConsultation(formData);
      })
      .catch((err) => {
        console.error('Error opening website:', err);
        Alert.alert("Error", "Could not open the consultation website");
      });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          <ScrollView contentContainerStyle={modalStyles.scrollContent}>
            <View style={modalStyles.header}>
              <Text style={modalStyles.title}>Book Video Consultation</Text>
              <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
                <Ionicons name="close" size={24} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>

            {/* Sehat ID */}
            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.label}>Sehat ID *</Text>
              <TextInput
                style={modalStyles.input}
                placeholder="Enter your Sehat ID"
                value={formData.sehatId}
                onChangeText={(text) => handleInputChange('sehatId', text)}
              />
            </View>

            {/* Consultation Type */}
            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.label}>Consultation Type</Text>
              <View style={modalStyles.optionGroup}>
                {CONSULTATION_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      modalStyles.optionButton,
                      formData.consultationType === type.id && modalStyles.optionButtonSelected
                    ]}
                    onPress={() => handleInputChange('consultationType', type.id)}
                  >
                    <Ionicons 
                      name={type.icon as IoniconsName} 
                      size={16} 
                      color={formData.consultationType === type.id ? COLORS.white : COLORS.primary} 
                    />
                    <Text style={[
                      modalStyles.optionText,
                      formData.consultationType === type.id && modalStyles.optionTextSelected
                    ]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Preferred Date */}
            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.label}>Preferred Date</Text>
              <TouchableOpacity 
                style={modalStyles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar" size={20} color={COLORS.primary} />
                <Text style={modalStyles.dateText}>{formatDate(formData.preferredDate)}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={formData.preferredDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}
            </View>

            {/* Time Slot */}
            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.label}>Preferred Time Slot</Text>
              <View style={modalStyles.optionGroup}>
                {TIME_SLOTS.map((slot) => (
                  <TouchableOpacity
                    key={slot.id}
                    style={[
                      modalStyles.slotButton,
                      formData.preferredSlot === slot.id && modalStyles.slotButtonSelected
                    ]}
                    onPress={() => handleInputChange('preferredSlot', slot.id)}
                  >
                    <Text style={[
                      modalStyles.slotText,
                      formData.preferredSlot === slot.id && modalStyles.slotTextSelected
                    ]}>
                      {slot.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Medicine Timing */}
            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.label}>Preferred Medicine Timing</Text>
              <View style={modalStyles.pickerContainer}>
                {MEDICINE_TIMINGS.map((timing) => (
                  <TouchableOpacity
                    key={timing.id}
                    style={[
                      modalStyles.timingButton,
                      formData.medicineTiming === timing.id && modalStyles.timingButtonSelected
                    ]}
                    onPress={() => handleInputChange('medicineTiming', timing.id)}
                  >
                    <Ionicons 
                      name="time" 
                      size={14} 
                      color={formData.medicineTiming === timing.id ? COLORS.white : COLORS.primary} 
                    />
                    <Text style={[
                      modalStyles.timingText,
                      formData.medicineTiming === timing.id && modalStyles.timingTextSelected
                    ]}>
                      {timing.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Symptoms */}
            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.label}>Symptoms Description *</Text>
              <TextInput
                style={[modalStyles.input, modalStyles.textArea]}
                placeholder="Describe your symptoms in detail..."
                value={formData.symptoms}
                onChangeText={(text) => handleInputChange('symptoms', text)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Priority */}
            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.label}>Priority Level</Text>
              <View style={modalStyles.priorityGroup}>
                <TouchableOpacity
                  style={[
                    modalStyles.priorityButton,
                    formData.priority === 'low' && modalStyles.priorityButtonLow
                  ]}
                  onPress={() => handleInputChange('priority', 'low')}
                >
                  <Text style={modalStyles.priorityText}>Low</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    modalStyles.priorityButton,
                    formData.priority === 'normal' && modalStyles.priorityButtonNormal
                  ]}
                  onPress={() => handleInputChange('priority', 'normal')}
                >
                  <Text style={modalStyles.priorityText}>Normal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    modalStyles.priorityButton,
                    formData.priority === 'high' && modalStyles.priorityButtonHigh
                  ]}
                  onPress={() => handleInputChange('priority', 'high')}
                >
                  <Text style={modalStyles.priorityText}>High</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Doctor Preference */}
            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.label}>Doctor Preference (Optional)</Text>
              <TextInput
                style={modalStyles.input}
                placeholder="Specific doctor or specialty"
                value={formData.doctorPreference}
                onChangeText={(text) => handleInputChange('doctorPreference', text)}
              />
            </View>

            {/* Actions */}
            <View style={modalStyles.actions}>
              <TouchableOpacity style={modalStyles.cancelBtn} onPress={onClose}>
                <Text style={modalStyles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={modalStyles.submitBtn} onPress={handleSubmit}>
                <Ionicons name="videocam" size={18} color={COLORS.white} />
                <Text style={modalStyles.submitText}>Start Consultation</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  container: {
    width: "100%",
    maxWidth: 500,
    maxHeight: "90%",
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  optionGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    flex: 1,
    minWidth: "48%",
  },
  optionButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
  },
  optionText: {
    fontSize: 12,
    color: COLORS.primary,
    marginLeft: 6,
    fontWeight: "500",
  },
  optionTextSelected: {
    color: COLORS.white,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: COLORS.white,
  },
  dateText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.text,
  },
  pickerContainer: {
    gap: 8,
  },
  slotButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  slotButtonSelected: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  slotText: {
    fontSize: 12,
    color: COLORS.text,
    textAlign: "center",
  },
  slotTextSelected: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  timingButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  timingButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
  },
  timingText: {
    fontSize: 12,
    color: COLORS.text,
    marginLeft: 6,
  },
  timingTextSelected: {
    color: COLORS.white,
    fontWeight: "500",
  },
  priorityGroup: {
    flexDirection: "row",
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: "center",
  },
  priorityButtonLow: {
    backgroundColor: "#DCFCE7",
    borderColor: "#22C55E",
  },
  priorityButtonNormal: {
    backgroundColor: "#FEF9C3",
    borderColor: "#EAB308",
  },
  priorityButtonHigh: {
    backgroundColor: "#FEE2E2",
    borderColor: "#EF4444",
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: COLORS.danger,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 8,
    gap: 8,
  },
  cancelText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },
  submitText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },
});

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [symptomInput, setSymptomInput] = useState('');
  const [showConsultationModal, setShowConsultationModal] = useState(false);

  const handleLogout = () => {
    router.replace('/');
  };

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleSymptomCheck = () => {
    if (symptomInput.trim()) {
      alert(`Analyzing symptoms: ${symptomInput}`);
      setSymptomInput('');
    }
  };

  const handleStartConsultation = (consultationData: ConsultationData) => {
    console.log("Consultation Data:", consultationData);
    Alert.alert("Success", "Consultation booked successfully!");
    setShowConsultationModal(false);
  };

  const renderBottomNav = () => (
    <View style={styles.bottomNav}>
      {NAV_ITEMS.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.navItem, 
            activeTab === item.id && styles.activeNavItem,
            item.isFeatured && styles.featuredNavItem
          ]}
          onPress={() => handleTabPress(item.id)}
        >
          <View style={[item.isFeatured && styles.featuredIconContainer]}>
            <Ionicons
              name={item.icon as IoniconsName}
              size={22}
              color={activeTab === item.id ? COLORS.white : item.isFeatured ? COLORS.warning : COLORS.textLight}
            />
          </View>
          <Text style={[
            styles.navText, 
            activeTab === item.id && styles.activeNavText,
            item.isFeatured && styles.featuredNavText
          ]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // ... (rest of the component remains the same, including renderTabContent and other functions)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Patient Portal</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={22} color={COLORS.white} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: 'https://placehold.co/56x56/D1FAE5/10B981?text=P' }}
                style={styles.profileImage}
              />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Rahul Sharma</Text>
              <Text style={styles.profileId}>Patient ID: P-2023-7894</Text>
              <Text style={styles.profileContact}>Age: 42 | Blood Type: O+</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActions}>
              <TouchableOpacity 
                style={[styles.quickActionButton, styles.featuredAction]} 
                onPress={() => setShowConsultationModal(true)}
              >
                <Ionicons name="videocam" size={28} color={COLORS.warning} />
                <Text style={styles.quickActionText}>Book Consultation</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton} onPress={() => setActiveTab('prescription')}>
                <Ionicons name="medkit" size={24} color={COLORS.primary} />
                <Text style={styles.quickActionText}>Prescriptions</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton} onPress={() => setActiveTab('healthRecord')}>
                <Ionicons name="document-text" size={24} color={COLORS.primary} />
                <Text style={styles.quickActionText}>Health Records</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Health Summary */}
          <View style={styles.healthSection}>
            <Text style={styles.sectionTitle}>Health Summary</Text>
            <View style={styles.healthCards}>
              <View style={styles.healthCard}>
                <Text style={styles.healthCardValue}>120/80</Text>
                <Text style={styles.healthCardLabel}>Blood Pressure</Text>
                <Text style={styles.healthCardStatus}>Normal</Text>
              </View>
              <View style={styles.healthCard}>
                <Text style={styles.healthCardValue}>98</Text>
                <Text style={styles.healthCardLabel}>Heart Rate</Text>
                <Text style={styles.healthCardStatus}>Normal</Text>
              </View>
              <View style={styles.healthCard}>
                <Text style={styles.healthCardValue}>5.2%</Text>
                <Text style={styles.healthCardLabel}>HbA1c</Text>
                <Text style={styles.healthCardStatus}>Controlled</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* AI Symptom Checker Footer */}
        <View style={styles.symptomFooter}>
          <View style={styles.symptomInputContainer}>
            <TextInput
              style={styles.symptomInput}
              placeholder="Describe your symptoms..."
              value={symptomInput}
              onChangeText={setSymptomInput}
              placeholderTextColor={COLORS.textLight}
            />
            <TouchableOpacity style={styles.symptomButton} onPress={handleSymptomCheck}>
              <Ionicons name="search" size={18} color={COLORS.white} />
              <Text style={styles.symptomButtonText}>Analyze</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.symptomDisclaimer}>
            AI symptom checker for preliminary advice only. Consult a doctor for medical diagnosis.
          </Text>
        </View>

        {/* Bottom Navigation */}
        {isMobile && renderBottomNav()}

        {/* Consultation Booking Modal */}
        <ConsultationBookingModal
          visible={showConsultationModal}
          onClose={() => setShowConsultationModal(false)}
          onStartConsultation={handleStartConsultation}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mainContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLORS.primaryDark,
  },
  logoutText: {
    marginLeft: 6,
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 12,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImageContainer: {
    marginRight: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 30,
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  profileId: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  profileContact: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  quickActionsSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  healthSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuredAction: {
    borderWidth: 2,
    borderColor: COLORS.warning,
    shadowColor: COLORS.warning,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  quickActionText: {
    fontSize: 12,
    color: COLORS.text,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  healthCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  healthCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  healthCardValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  healthCardLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  healthCardStatus: {
    fontSize: 10,
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
  symptomFooter: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  symptomInputContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  symptomInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    fontSize: 14,
  },
  symptomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  symptomButtonText: {
    color: COLORS.white,
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  symptomDisclaimer: {
    fontSize: 10,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderTopWidth: 1,
    borderTopColor: COLORS.primaryDark,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    position: 'relative',
  },
  activeNavItem: {
    backgroundColor: COLORS.primaryDark,
  },
  featuredNavItem: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  featuredIconContainer: {
    padding: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  navText: {
    fontSize: 10,
    color: COLORS.textLight,
    marginTop: 4,
  },
  activeNavText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  featuredNavText: {
    color: COLORS.warning,
    fontWeight: '700',
  },
});