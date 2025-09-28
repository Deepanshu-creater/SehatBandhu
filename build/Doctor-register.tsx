import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function DoctorRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    qualification: '',
    specialization: '',
    registrationNumber: '',
    phoneNumber: '',
    email: '',
    hospital: '',
    experience: '',
  });

  const handleSubmit = () => {
    // Basic validation
    if (!formData.fullName || !formData.qualification || !formData.registrationNumber || !formData.phoneNumber) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Here you would typically send the data to your backend API
    console.log('Doctor Registration Data:', formData);
    
    Alert.alert('Success', 'Registration submitted for verification!');
    router.back();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
          <Text style={styles.title}>Doctor Registration</Text>
          <View style={styles.backButton} />
        </View>
        
        <Text style={styles.subtitle}>Join our network of healthcare providers</Text>
        
        <View style={styles.form}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Text style={styles.sectionIconText}>👨‍⚕️</Text>
            </View>
            <Text style={styles.sectionTitle}>Professional Information</Text>
          </View>

          <Text style={styles.label}>Full Name <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Dr. Full Name"
            value={formData.fullName}
            onChangeText={(text) => handleChange('fullName', text)}
          />

          <Text style={styles.label}>Medical Qualification <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="MBBS, MD, BDS, etc."
            value={formData.qualification}
            onChangeText={(text) => handleChange('qualification', text)}
          />

          <Text style={styles.label}>Specialization</Text>
          <TextInput
            style={styles.input}
            placeholder="Cardiology, Pediatrics, etc."
            value={formData.specialization}
            onChangeText={(text) => handleChange('specialization', text)}
          />

          <Text style={styles.label}>Medical Registration Number <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="State Medical Council Registration No."
            value={formData.registrationNumber}
            onChangeText={(text) => handleChange('registrationNumber', text)}
          />

          <Text style={styles.label}>Years of Experience</Text>
          <TextInput
            style={styles.input}
            placeholder="Number of years"
            keyboardType="numeric"
            value={formData.experience}
            onChangeText={(text) => handleChange('experience', text)}
          />

          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Text style={styles.sectionIconText}>📞</Text>
            </View>
            <Text style={styles.sectionTitle}>Contact Information</Text>
          </View>

          <Text style={styles.label}>Phone Number <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Contact number"
            keyboardType="phone-pad"
            value={formData.phoneNumber}
            onChangeText={(text) => handleChange('phoneNumber', text)}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email address"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
          />

          <Text style={styles.label}>Hospital/Clinic</Text>
          <TextInput
            style={styles.input}
            placeholder="Current workplace"
            value={formData.hospital}
            onChangeText={(text) => handleChange('hospital', text)}
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit for Verification</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} style={styles.backButtonContainer}>
            <Text style={styles.backText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff', // Very light blue background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: '#2980b9', // Blue header
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
    color: '#2980b9',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#7f8c8d',
    marginVertical: 15,
  },
  form: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e3f2fd',
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
    color: '#e53935',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#2980b9',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
    elevation: 2,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButtonContainer: {
    alignItems: 'center',
    padding: 10,
  },
  backText: {
    color: '#2980b9',
    fontSize: 16,
    fontWeight: '600',
  },
});