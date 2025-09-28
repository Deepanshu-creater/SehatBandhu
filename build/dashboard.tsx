import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  success: '#10B981',
};

type IoniconsName = 'home' | 'medkit' | 'document-text' | 'search' | 'log-out' | 'calendar' | 'person' | 'videocam' | 'time' | 'medical' | 'alert-circle' | 'checkmark-circle' | 'download';
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

// Receipt Modal Component
interface ReceiptModalProps {
  visible: boolean;
  receiptData: ConsultationData | null;
  onClose: () => void;
  onDownload: () => void;
}

function ReceiptModal({ visible, receiptData, onClose, onDownload }: ReceiptModalProps) {
  if (!receiptData) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getConsultationTypeLabel = (type: string) => {
    return CONSULTATION_TYPES.find(t => t.id === type)?.label || type;
  };

  const getTimeSlotLabel = (slot: string) => {
    return TIME_SLOTS.find(s => s.id === slot)?.label || slot;
  };

  const getMedicineTimingLabel = (timing: string) => {
    return MEDICINE_TIMINGS.find(m => m.id === timing)?.label || timing;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={receiptStyles.overlay}>
        <View style={receiptStyles.container}>
          <ScrollView contentContainerStyle={receiptStyles.scrollContent}>
            <View style={receiptStyles.header}>
              <Text style={receiptStyles.title}>Consultation Receipt</Text>
              <TouchableOpacity onPress={onClose} style={receiptStyles.closeButton}>
                <Ionicons name="close" size={24} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>

            <View style={receiptStyles.receiptContent}>
              {/* Receipt Header */}
              <View style={receiptStyles.receiptHeader}>
                <Ionicons name="checkmark-circle" size={48} color={COLORS.success} />
                <Text style={receiptStyles.successTitle}>Booking Confirmed!</Text>
                <Text style={receiptStyles.successSubtitle}>Your consultation has been scheduled successfully</Text>
              </View>

              {/* Receipt Details */}
              <View style={receiptStyles.detailsSection}>
                <Text style={receiptStyles.sectionTitle}>Consultation Details</Text>
                
                <View style={receiptStyles.detailRow}>
                  <Text style={receiptStyles.detailLabel}>Sehat ID:</Text>
                  <Text style={receiptStyles.detailValue}>{receiptData.sehatId}</Text>
                </View>
                
                <View style={receiptStyles.detailRow}>
                  <Text style={receiptStyles.detailLabel}>Consultation Type:</Text>
                  <Text style={receiptStyles.detailValue}>{getConsultationTypeLabel(receiptData.consultationType)}</Text>
                </View>
                
                <View style={receiptStyles.detailRow}>
                  <Text style={receiptStyles.detailLabel}>Date:</Text>
                  <Text style={receiptStyles.detailValue}>{formatDate(receiptData.preferredDate)}</Text>
                </View>
                
                <View style={receiptStyles.detailRow}>
                  <Text style={receiptStyles.detailLabel}>Time Slot:</Text>
                  <Text style={receiptStyles.detailValue}>{getTimeSlotLabel(receiptData.preferredSlot)}</Text>
                </View>
                
                <View style={receiptStyles.detailRow}>
                  <Text style={receiptStyles.detailLabel}>Medicine Timing:</Text>
                  <Text style={receiptStyles.detailValue}>{getMedicineTimingLabel(receiptData.medicineTiming)}</Text>
                </View>
                
                <View style={receiptStyles.detailRow}>
                  <Text style={receiptStyles.detailLabel}>Priority:</Text>
                  <Text style={[receiptStyles.detailValue, receiptStyles.priorityValue]}>
                    {receiptData.priority.toUpperCase()}
                  </Text>
                </View>

                {receiptData.doctorPreference && (
                  <View style={receiptStyles.detailRow}>
                    <Text style={receiptStyles.detailLabel}>Doctor Preference:</Text>
                    <Text style={receiptStyles.detailValue}>{receiptData.doctorPreference}</Text>
                  </View>
                )}
              </View>

              {/* Symptoms Summary */}
              <View style={receiptStyles.symptomsSection}>
                <Text style={receiptStyles.sectionTitle}>Symptoms Summary</Text>
                <Text style={receiptStyles.symptomsText}>{receiptData.symptoms}</Text>
              </View>

              {/* Booking Info */}
              <View style={receiptStyles.bookingInfo}>
                <Text style={receiptStyles.bookingId}>Booking ID: CN-{Date.now().toString().slice(-6)}</Text>
                <Text style={receiptStyles.bookingDate}>
                  Booked on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View style={receiptStyles.actions}>
              <TouchableOpacity style={receiptStyles.closeBtn} onPress={onClose}>
                <Text style={receiptStyles.closeText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity style={receiptStyles.downloadBtn} onPress={onDownload}>
                <Ionicons name="download" size={18} color={COLORS.white} />
                <Text style={receiptStyles.downloadText}>Download Receipt</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const receiptStyles = StyleSheet.create({
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
  receiptContent: {
    marginBottom: 20,
  },
  receiptHeader: {
    alignItems: "center",
    padding: 20,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.success,
    marginTop: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
    marginTop: 4,
  },
  detailsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.textLight,
    flex: 1,
    textAlign: "right",
  },
  priorityValue: {
    fontWeight: "bold",
    color: COLORS.primary,
  },
  symptomsSection: {
    marginBottom: 20,
  },
  symptomsText: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
  },
  bookingInfo: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
  },
  bookingId: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  bookingDate: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  closeBtn: {
    flex: 1,
    backgroundColor: COLORS.textLight,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  downloadBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 8,
    gap: 8,
  },
  closeText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },
  downloadText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },
});

// Consultation Booking Modal Component
interface ConsultationBookingModalProps {
  visible: boolean;
  onClose: () => void;
  onBookingSuccess: (data: ConsultationData) => void;
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
  onBookingSuccess,
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

    // Directly call onBookingSuccess without opening website
    onBookingSuccess(formData);
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

            {/* Rest of the form content remains exactly the same */}
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
                <Text style={modalStyles.submitText}>Get Receipt</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  // ... (keep all the existing modalStyles the same)
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

// Consultation Card Component
interface ConsultationCardProps {
  consultation: ConsultationData & { bookingId: string; bookingDate: Date };
  onDownload: (consultation: ConsultationData & { bookingId: string; bookingDate: Date }) => void;
}

function ConsultationCard({ consultation, onDownload }: ConsultationCardProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getConsultationTypeLabel = (type: string) => {
    return CONSULTATION_TYPES.find(t => t.id === type)?.label || type;
  };

  return (
    <View style={consultationCardStyles.card}>
      <View style={consultationCardStyles.cardHeader}>
        <Text style={consultationCardStyles.bookingId}>{consultation.bookingId}</Text>
        <Text style={consultationCardStyles.date}>{formatDate(consultation.bookingDate)}</Text>
      </View>
      
      <View style={consultationCardStyles.cardBody}>
        <View style={consultationCardStyles.detailRow}>
          <Text style={consultationCardStyles.detailLabel}>Type:</Text>
          <Text style={consultationCardStyles.detailValue}>{getConsultationTypeLabel(consultation.consultationType)}</Text>
        </View>
        
        <View style={consultationCardStyles.detailRow}>
          <Text style={consultationCardStyles.detailLabel}>Scheduled:</Text>
          <Text style={consultationCardStyles.detailValue}>
            {formatDate(consultation.preferredDate)} • {TIME_SLOTS.find(s => s.id === consultation.preferredSlot)?.label.split(': ')[1]}
          </Text>
        </View>
        
        <View style={consultationCardStyles.detailRow}>
          <Text style={consultationCardStyles.detailLabel}>Priority:</Text>
          <Text style={[
            consultationCardStyles.detailValue,
          ]}>
            {consultation.priority.toUpperCase()}
          </Text>
        </View>
      </View>
      
      <View style={consultationCardStyles.cardFooter}>
        <TouchableOpacity 
          style={consultationCardStyles.downloadButton}
          onPress={() => onDownload(consultation)}
        >
          <Ionicons name="download" size={16} color={COLORS.primary} />
          <Text style={consultationCardStyles.downloadText}>Download Receipt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const consultationCardStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  date: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  cardBody: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '500',
  },
  priorityLow: {
    color: '#22C55E',
  },
  priorityNormal: {
    color: '#F59E0B',
  },
  priorityHigh: {
    color: '#EF4444',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 6,
    backgroundColor: COLORS.primaryLight,
  },
  downloadText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [symptomInput, setSymptomInput] = useState('');
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState<ConsultationData | null>(null);
  const [bookedConsultations, setBookedConsultations] = useState<(ConsultationData & { bookingId: string; bookingDate: Date })[]>([]);

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

  const handleBookingSuccess = (consultationData: ConsultationData) => {
    const newConsultation = {
      ...consultationData,
      bookingId: `CN-${Date.now().toString().slice(-6)}`,
      bookingDate: new Date()
    };
    
    setBookedConsultations(prev => [newConsultation, ...prev]);
    setCurrentReceipt(consultationData);
    setShowConsultationModal(false);
    setShowReceiptModal(true);
  };

  const handleDownloadReceipt = () => {
    Alert.alert("Success", "Receipt downloaded successfully!");
    setShowReceiptModal(false);
  };

  const handleDownloadConsultationReceipt = (consultation: ConsultationData & { bookingId: string; bookingDate: Date }) => {
    Alert.alert("Download", `Receipt for ${consultation.bookingId} downloaded successfully!`);
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

  const renderUpcomingConsultations = () => {
    if (bookedConsultations.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="calendar" size={48} color={COLORS.textLight} />
          <Text style={styles.emptyStateText}>No upcoming consultations</Text>
          <Text style={styles.emptyStateSubtext}>Book your first consultation to get started</Text>
        </View>
      );
    }

    return (
      <View style={styles.consultationsSection}>
        <Text style={styles.sectionTitle}>Upcoming Consultations</Text>
        {bookedConsultations.map((consultation, index) => (
          <ConsultationCard
            key={consultation.bookingId}
            consultation={consultation}
            onDownload={handleDownloadConsultationReceipt}
          />
        ))}
      </View>
    );
  };

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

          {/* Upcoming Consultations */}
          {renderUpcomingConsultations()}

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
          onBookingSuccess={handleBookingSuccess}
        />

        {/* Receipt Modal */}
        <ReceiptModal
          visible={showReceiptModal}
          receiptData={currentReceipt}
          onClose={() => setShowReceiptModal(false)}
          onDownload={handleDownloadReceipt}
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
    marginBottom: 20,
  },
  consultationsSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
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
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 20,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 4,
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