import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');
const isMobile = width < 768;

// Theme Colors
const COLORS = {
  primary: '#3B82F6', // Professional blue
  primaryDark: '#2563EB',
  primaryLight: '#DBEAFE',
  white: '#FFFFFF',
  background: '#F9FAFB',
  text: '#1F2937',
  textLight: '#6B7280',
  border: '#E5E7EB',
  danger: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B'
};

// Mock data for patients in queue
const initialPatients: Patient[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    age: 42,
    condition: 'Diabetes Follow-up',
    status: 'waiting',
    appointmentTime: '10:00 AM'
  },
  {
    id: '2',
    name: 'Priya Patel',
    age: 35,
    condition: 'Hypertension',
    status: 'waiting',
    appointmentTime: '10:30 AM'
  },
  {
    id: '3',
    name: 'Amit Kumar',
    age: 28,
    condition: 'Fever & Cough',
    status: 'waiting',
    appointmentTime: '11:00 AM'
  }
];

// Mock data for prescriptions
const initialPrescriptions: Prescription[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Rahul Sharma',
    medications: [
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
      { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once at bedtime' }
    ],
    instructions: 'Take with food. Follow up in 3 months.'
  }
];

interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  status: 'waiting' | 'in-consultation';
  appointmentTime: string;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  medications: Medication[];
  instructions: string;
}

export default function DoctorDashboard() {
  const [medicalId, setMedicalId] = useState<string>('');
  const [roomNo, setRoomNo] = useState<string>('');
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(initialPrescriptions);
  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [isConsultationActive, setIsConsultationActive] = useState<boolean>(false);
  const [newMedication, setNewMedication] = useState<Medication>({ name: '', dosage: '', frequency: '' });
  const [instructions, setInstructions] = useState<string>('');

  const openVideoConsultation = async () => {
    const videoUrl = 'https://video-one-livid.vercel.app/';
    
    try {
      // Check if the link can be opened
      const supported = await Linking.canOpenURL(videoUrl);
      
      if (supported) {
        await Linking.openURL(videoUrl);
      } else {
        Alert.alert('Error', `Cannot open the video consultation link: ${videoUrl}`);
      }
    } catch (error) {
      console.error('Error opening video consultation:', error);
      Alert.alert('Error', 'Failed to open video consultation');
    }
  };

  const handleStartConsultation = () => {
    if (!medicalId.trim() || !roomNo.trim()) {
      Alert.alert('Error', 'Please enter your Medical ID and Room Number');
      return;
    }

    if (!activePatient) {
      Alert.alert('Error', 'Please select a patient from the queue');
      return;
    }

    // Open the video consultation link
    openVideoConsultation();
    
    setIsConsultationActive(true);
    // Update patient status to in-consultation
    setPatients(prev => 
      prev.map(p => 
        p.id === activePatient.id ? { ...p, status: 'in-consultation' } : p
      )
    );
    Alert.alert('Success', 'Consultation started successfully! Video consultation opened.');
  };

  const handleEndConsultation = () => {
    setIsConsultationActive(false);
    if (activePatient) {
      // Remove patient from queue
      setPatients(prev => prev.filter(p => p.id !== activePatient.id));
      setActivePatient(null);
      Alert.alert('Success', 'Consultation ended successfully!');
    } else {
      Alert.alert('Error', 'No active patient selected');
    }
  };

  const handleAddMedication = () => {
    if (!newMedication.name.trim() || !newMedication.dosage.trim() || !newMedication.frequency.trim()) {
      Alert.alert('Error', 'Please fill all medication fields');
      return;
    }

    // In a real app, this would update the prescription for the active patient
    Alert.alert('Success', 'Medication added to prescription');
    setNewMedication({ name: '', dosage: '', frequency: '' });
  };

  const handleSavePrescription = () => {
    if (!instructions.trim()) {
      Alert.alert('Error', 'Please add instructions for the patient');
      return;
    }

    if (!activePatient) {
      Alert.alert('Error', 'No active patient selected');
      return;
    }

    // In a real app, this would save the prescription to database
    const newPrescription = {
      id: Date.now().toString(),
      patientId: activePatient.id,
      patientName: activePatient.name,
      medications: [newMedication],
      instructions
    };

    setPrescriptions(prev => [...prev, newPrescription]);
    Alert.alert('Success', 'Prescription saved successfully!');
    setInstructions('');
    setNewMedication({ name: '', dosage: '', frequency: '' });
  };

  const renderPatientQueue = () => (
    <View style={styles.queueContainer}>
      <Text style={styles.sectionTitle}>Patient Queue</Text>
      {patients.length === 0 ? (
        <Text style={styles.emptyText}>No patients in queue</Text>
      ) : (
        patients.map(patient => (
          <TouchableOpacity
            key={patient.id}
            style={[
              styles.patientCard,
              activePatient?.id === patient.id && styles.activePatientCard
            ]}
            onPress={() => setActivePatient(patient)}
          >
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>{patient.name}</Text>
              <Text style={styles.patientDetails}>Age: {patient.age} | {patient.condition}</Text>
              <Text style={styles.appointmentTime}>{patient.appointmentTime}</Text>
            </View>
            <View style={[
              styles.statusIndicator,
              patient.status === 'waiting' ? styles.statusWaiting : styles.statusInProgress
            ]}>
              <Text style={styles.statusText}>
                {patient.status === 'waiting' ? 'Waiting' : 'In Consultation'}
              </Text>
            </View>
          </TouchableOpacity>
        ))
        )}   
    </View>
  );

  const renderPrescriptionBox = () => (
    <View style={styles.prescriptionContainer}>
      <Text style={styles.sectionTitle}>Prescription</Text>
      
      {activePatient ? (
        <>
          <View style={styles.patientHeader}>
            <Text style={styles.patientName}>Prescription for {activePatient.name}</Text>
            <Text style={styles.patientCondition}>{activePatient.condition}</Text>
          </View>

          <Text style={styles.subSectionTitle}>Add Medication</Text>
          <View style={styles.medicationForm}>
            <TextInput
              style={styles.input}
              placeholder="Medication Name"
              value={newMedication.name}
              onChangeText={(text) => setNewMedication({...newMedication, name: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Dosage (e.g., 500mg)"
              value={newMedication.dosage}
              onChangeText={(text) => setNewMedication({...newMedication, dosage: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Frequency (e.g., Twice daily)"
              value={newMedication.frequency}
              onChangeText={(text) => setNewMedication({...newMedication, frequency: text})}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddMedication}>
              <Text style={styles.addButtonText}>Add Medication</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subSectionTitle}>Instructions</Text>
          <TextInput
            style={[styles.input, styles.instructionsInput]}
            placeholder="Enter instructions for the patient"
            multiline
            numberOfLines={4}
            value={instructions}
            onChangeText={setInstructions}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSavePrescription}>
            <Text style={styles.saveButtonText}>Save Prescription</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.emptyText}>Select a patient to create prescription</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <FontAwesome5 name="user-md" size={24} color={COLORS.white} />
          <Text style={styles.headerTitle}>Doctor Dashboard</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.doctorName}>Dr. Anil Kumar</Text>
          <Text style={styles.doctorId}>ID: DOC-2023-5678</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Consultation Panel */}
          <View style={styles.consultationPanel}>
            <Text style={styles.sectionTitle}>Start Video Consultation</Text>
            
            <View style={styles.consultationForm}>
              <TextInput
                style={styles.input}
                placeholder="Medical Registration ID"
                value={medicalId}
                onChangeText={setMedicalId}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Room Number"
                value={roomNo}
                onChangeText={setRoomNo}
              />
              
              <TouchableOpacity 
                style={[
                  styles.consultButton,
                  isConsultationActive ? styles.endButton : styles.startButton,
                  (!medicalId.trim() || !roomNo.trim() || !activePatient) && styles.disabledButton
                ]}
                onPress={isConsultationActive ? handleEndConsultation : handleStartConsultation}
                disabled={!isConsultationActive && (!medicalId.trim() || !roomNo.trim() || !activePatient)}
              >
                <Ionicons 
                  name={isConsultationActive ? "videocam-off" : "videocam"} 
                  size={20} 
                  color={COLORS.white} 
                />
                <Text style={styles.consultButtonText}>
                  {isConsultationActive ? 'End Consultation' : 'Start Consultation'}
                </Text>
              </TouchableOpacity>

              {isConsultationActive && (
                <View style={styles.videoPlaceholder}>
                  <Ionicons name="videocam" size={50} color={COLORS.primary} />
                  <Text style={styles.videoText}>Video Consultation Active</Text>
                  <Text style={styles.patientVideoText}>
                    with {activePatient?.name}
                  </Text>
                  <TouchableOpacity 
                    style={styles.openVideoButton}
                    onPress={openVideoConsultation}
                  >
                    <Text style={styles.openVideoButtonText}>Open Video Consultation</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* Right Side Panel */}
          <View style={styles.rightPanel}>
            {renderPatientQueue()}
            {renderPrescriptionBox()}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primaryDark,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: 10,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  doctorId: {
    fontSize: 12,
    color: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexDirection: isMobile ? 'column' : 'row',
    padding: 16,
  },
  consultationPanel: {
    flex: isMobile ? undefined : 1,
    marginBottom: isMobile ? 16 : 0,
    marginRight: isMobile ? 0 : 16,
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  rightPanel: {
    flex: isMobile ? undefined : 1,
    flexDirection: 'column',
  },
  queueContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  prescriptionContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  consultationForm: {
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  instructionsInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  consultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  startButton: {
    backgroundColor: COLORS.success,
  },
  endButton: {
    backgroundColor: COLORS.danger,
  },
  disabledButton: {
    backgroundColor: COLORS.textLight,
    opacity: 0.6,
  },
  consultButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  videoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
  },
  videoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 12,
  },
  patientVideoText: {
    fontSize: 16,
    color: COLORS.text,
    marginTop: 4,
  },
  openVideoButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  openVideoButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  patientCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: COLORS.background,
  },
  activePatientCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  patientDetails: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  appointmentTime: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 4,
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusWaiting: {
    backgroundColor: COLORS.warning,
  },
  statusInProgress: {
    backgroundColor: COLORS.success,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  patientHeader: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  patientCondition: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  medicationForm: {
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: COLORS.success,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textLight,
    fontStyle: 'italic',
    marginVertical: 20,
  },
});