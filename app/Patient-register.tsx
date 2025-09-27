import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

type RegistrationType = 'self' | 'asha' | 'health-centre';

export default function PatientRegister() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<RegistrationType>('self');
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [formData, setFormData] = useState({
    // Common fields
    fullName: '',
    phoneNumber: '',
    age: '',
    gender: '',
    village: '',
    abhaId: '',
    aadhaarNumber: '', // Made mandatory
    dateOfBirth: '',
    
    // ASHA-specific fields
    ashaWorkerId: '',
    ashaWorkerName: '',
    
    // Health Centre-specific fields
    healthCentreId: '',
    healthCentreName: '',
    registrationDate: '',
  });

  const genderOptions = ['Male', 'Female', 'Other'];

  const handleDateSelect = (type: 'dob' | 'registration', day: string, month: string, year: string) => {
    const dateStr = `${day}/${month}/${year}`;
    if (type === 'dob') {
      handleChange('dateOfBirth', dateStr);
    } else {
      handleChange('registrationDate', dateStr);
    }
    setShowDateModal(false);
  };

  const handleSubmit = () => {
    // Basic validation based on registration type
    let isValid = true;
    let errorMessage = '';

    if (!formData.fullName || !formData.phoneNumber || !formData.village || !formData.aadhaarNumber) {
      isValid = false;
      errorMessage = 'Please fill in all required fields';
    }

    if (activeTab === 'asha' && (!formData.ashaWorkerId || !formData.ashaWorkerName)) {
      isValid = false;
      errorMessage = 'Please provide ASHA worker details';
    }

    if (activeTab === 'health-centre' && (!formData.healthCentreId || !formData.healthCentreName)) {
      isValid = false;
      errorMessage = 'Please select a health centre';
    }

    if (!isValid) {
      Alert.alert('Error', errorMessage);
      return;
    }

    // Submit data based on registration type
    const submissionData = {
      ...formData,
      registrationType: activeTab,
      timestamp: new Date().toISOString()
    };

    console.log('Registration Data:', submissionData);
    Alert.alert('Success', `Registration submitted via ${getRegistrationTypeLabel(activeTab)}!`);
    router.back();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getRegistrationTypeLabel = (type: RegistrationType) => {
    switch (type) {
      case 'self': return 'Self Registration';
      case 'asha': return 'ASHA Worker';
      case 'health-centre': return 'Health Centre';
      default: return '';
    }
  };

  const DateInputModal = ({ visible, onClose, onSelect }: { 
    visible: boolean, 
    onClose: () => void, 
    onSelect: (day: string, month: string, year: string) => void 
  }) => {
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    return (
      <Modal visible={visible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Date</Text>
          
          <View style={styles.dateInputRow}>
            <View style={styles.dateInputContainer}>
              <Text style={styles.dateInputLabel}>Day</Text>
              <TextInput
                style={styles.dateInput}
                placeholder="DD"
                keyboardType="numeric"
                maxLength={2}
                value={day}
                onChangeText={setDay}
              />
            </View>
            
            <View style={styles.dateInputContainer}>
              <Text style={styles.dateInputLabel}>Month</Text>
              <TextInput
                style={styles.dateInput}
                placeholder="MM"
                keyboardType="numeric"
                maxLength={2}
                value={month}
                onChangeText={setMonth}
              />
            </View>
            
            <View style={styles.dateInputContainer}>
              <Text style={styles.dateInputLabel}>Year</Text>
              <TextInput
                style={styles.dateInput}
                placeholder="YYYY"
                keyboardType="numeric"
                maxLength={4}
                value={year}
                onChangeText={setYear}
              />
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.modalButton}
            onPress={() => onSelect(day, month, year)}
          >
            <Text style={styles.modalButtonText}>Confirm Date</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.modalCancel} onPress={onClose}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  const renderCommonFields = () => (
    <>
      <Text style={styles.label}>Full Name <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your full name"
        value={formData.fullName}
        onChangeText={(text) => handleChange('fullName', text)}
      />

      <Text style={styles.label}>Phone Number <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
        value={formData.phoneNumber}
        onChangeText={(text) => handleChange('phoneNumber', text)}
        maxLength={10}
      />

      <Text style={styles.label}>Village/Area <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your village name"
        value={formData.village}
        onChangeText={(text) => handleChange('village', text)}
      />

      <Text style={styles.label}>Aadhaar Number <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your 12-digit Aadhaar number"
        keyboardType="numeric"
        value={formData.aadhaarNumber}
        onChangeText={(text) => handleChange('aadhaarNumber', text)}
        maxLength={12}
      />

      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            placeholder="Age"
            keyboardType="numeric"
            value={formData.age}
            onChangeText={(text) => handleChange('age', text)}
          />
        </View>

        <View style={styles.halfInput}>
          <Text style={styles.label}>Gender</Text>
          <TouchableOpacity 
            style={styles.input}
            onPress={() => setShowGenderModal(true)}
          >
            <Text style={formData.gender ? styles.inputText : styles.placeholderText}>
              {formData.gender || 'Select Gender'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.label}>Date of Birth</Text>
      <TouchableOpacity 
        style={styles.input}
        onPress={() => setShowDateModal(true)}
      >
        <Text style={formData.dateOfBirth ? styles.inputText : styles.placeholderText}>
          {formData.dateOfBirth || 'Select Date of Birth'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>ABHA ID (Optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your ABHA number"
        value={formData.abhaId}
        onChangeText={(text) => handleChange('abhaId', text)}
      />
    </>
  );

  const renderAshaFields = () => (
    <>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}>
          <Text style={styles.sectionIconText}>👩‍⚕️</Text>
        </View>
        <Text style={styles.sectionTitle}>ASHA Worker Details</Text>
      </View>
      
      <Text style={styles.label}>ASHA Worker ID <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="Enter ASHA worker ID"
        value={formData.ashaWorkerId}
        onChangeText={(text) => handleChange('ashaWorkerId', text)}
      />

      <Text style={styles.label}>ASHA Worker Name <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="Enter ASHA worker name"
        value={formData.ashaWorkerName}
        onChangeText={(text) => handleChange('ashaWorkerName', text)}
      />
    </>
  );

  const renderHealthCentreFields = () => (
    <>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}>
          <Text style={styles.sectionIconText}>🏥</Text>
        </View>
        <Text style={styles.sectionTitle}>Health Centre Details</Text>
      </View>
      
      <Text style={styles.label}>Health Centre <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="Select health centre"
        value={formData.healthCentreName}
        onChangeText={(text) => handleChange('healthCentreName', text)}
      />

      <Text style={styles.label}>Health Centre ID <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="Health centre ID"
        value={formData.healthCentreId}
        onChangeText={(text) => handleChange('healthCentreId', text)}
      />

      <Text style={styles.label}>Registration Date</Text>
      <TouchableOpacity 
        style={styles.input}
        onPress={() => setShowDateModal(true)}
      >
        <Text style={formData.registrationDate ? styles.inputText : styles.placeholderText}>
          {formData.registrationDate || 'Select Registration Date'}
        </Text>
      </TouchableOpacity>
    </>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Patient Registration</Text>
          <View style={styles.backButton} />
        </View>
        
        {/* Registration Type Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'self' && styles.activeTab]}
            onPress={() => setActiveTab('self')}
          >
            <Text style={[styles.tabText, activeTab === 'self' && styles.activeTabText]}>Self</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'asha' && styles.activeTab]}
            onPress={() => setActiveTab('asha')}
          >
            <Text style={[styles.tabText, activeTab === 'asha' && styles.activeTabText]}>ASHA</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'health-centre' && styles.activeTab]}
            onPress={() => setActiveTab('health-centre')}
          >
            <Text style={[styles.tabText, activeTab === 'health-centre' && styles.activeTabText]}>Health Centre</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.registrationBadge}>
          <Text style={styles.registrationType}>
            {getRegistrationTypeLabel(activeTab)}
          </Text>
        </View>

        <View style={styles.form}>
          {renderCommonFields()}
          
          {activeTab === 'asha' && renderAshaFields()}
          {activeTab === 'health-centre' && renderHealthCentreFields()}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Complete Registration</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} style={styles.backButtonContainer}>
            <Text style={styles.backText}>Back to Home</Text>
          </TouchableOpacity>
        </View>

        {/* Gender Selection Modal */}
        <Modal visible={showGenderModal} transparent animationType="slide">
          <TouchableWithoutFeedback onPress={() => setShowGenderModal(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Gender</Text>
            {genderOptions.map((gender) => (
              <TouchableOpacity
                key={gender}
                style={styles.modalOption}
                onPress={() => {
                  handleChange('gender', gender);
                  setShowGenderModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>{gender}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalCancel} onPress={() => setShowGenderModal(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Date Selection Modal */}
        <DateInputModal
          visible={showDateModal}
          onClose={() => setShowDateModal(false)}
          onSelect={(day, month, year) => {
            if (activeTab === 'health-centre') {
              handleDateSelect('registration', day, month, year);
            } else {
              handleDateSelect('dob', day, month, year);
            }
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6bac86ff', // Very light green background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: '#27ae60', // Green header
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  backButtonText: {
    fontSize: 20,
    color: '#27ae60',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
    marginBottom: 15,
    backgroundColor: '#e8f5e9', // Light green
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#27ae60', // Green for active tab
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#388e3c', // Dark green
  },
  activeTabText: {
    color: '#fff', // White for active tab text
  },
  registrationBadge: {
    backgroundColor: '#e8f5e9', // Light green
    padding: 10,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  registrationType: {
    textAlign: 'center',
    fontSize: 16,
    color: '#2e7d32', // Dark green
    fontWeight: '600',
  },
  form: {
    marginHorizontal: 20,
    marginBottom: 40,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sectionIconText: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#34495e',
  },
  required: {
    color: '#e53935', // Red for asterisk
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  placeholderText: {
    fontSize: 16,
    color: '#95a5a6',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  submitButton: {
    backgroundColor: '#27ae60',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
    elevation: 2,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButtonContainer: {
    alignItems: 'center',
    padding: 10,
  },
  backText: {
    color: '#27ae60',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#2c3e50',
  },
  modalOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
  },
  modalCancel: {
    marginTop: 15,
    padding: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: '600',
  },
  dateInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateInputContainer: {
    width: '30%',
  },
  dateInputLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: '#34495e',
    fontWeight: '600',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#27ae60',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});