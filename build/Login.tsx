import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Login() {
  const router = useRouter();
  const [isDoctor, setIsDoctor] = useState(false);
  const [credentials, setCredentials] = useState({
    SehatId: '',
    dob: '',
    medicalRegNumber: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const toggleLoginType = () => setIsDoctor(previousState => !previousState);

  const handleLogin = async () => {
    if (isDoctor) {
      if (!credentials.medicalRegNumber || !credentials.email) {
        Alert.alert('Error', 'Please enter both Medical Registration Number and email');
        return;
      }
    } else {
      if (!credentials.SehatId || !credentials.dob) {
        Alert.alert('Error', 'Please enter both Sehat ID and date of birth');
        return;
      }
    }

    setIsLoading(true);

    // Simulate API call - Replace with actual authentication
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', 'Login successful!');
      if(isDoctor) {
        router.replace('/Doctor-dashboard');
      }
      else{
      router.replace('/dashboard');}
    }, 1500);
  };

  const handleForgotCredentials = () => {
    Alert.alert('Info', 'Please contact your administrator for assistance');
  };

  const handleCreateAccount = () => {
    router.push('/Patient-register');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
      </View>

      {/* Login Type Toggle */}
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>Login as Patient</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isDoctor ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleLoginType}
          value={isDoctor}
        />
        <Text style={styles.toggleLabel}>Login as Doctor</Text>
      </View>

      {/* Login Form */}
      <View style={styles.form}>
        {isDoctor ? (
          <>
            <Text style={styles.label}>Medical Registration Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your registration number"
              keyboardType="default"
              value={credentials.medicalRegNumber}
              onChangeText={(text) => setCredentials({...credentials, medicalRegNumber: text})}
              autoCapitalize="none"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              value={credentials.email}
              onChangeText={(text) => setCredentials({...credentials, email: text})}
              autoCapitalize="none"
            />
          </>
        ) : (
          <>
            <Text style={styles.label}>Sehat ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your Sehat ID"
              keyboardType="default"
              value={credentials.SehatId}
              onChangeText={(text) => setCredentials({...credentials, SehatId: text})}
              autoCapitalize="none"
            />

            <Text style={styles.label}>Date of Birth</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your date of birth (DD/MM/YYYY)"
              keyboardType="numbers-and-punctuation"
              value={credentials.dob}
              onChangeText={(text) => setCredentials({...credentials, dob: text})}
              autoCapitalize="none"
            />
          </>
        )}

        {/* Forgot Credentials */}
        <TouchableOpacity onPress={handleForgotCredentials} style={styles.forgotCredentials}>
          <Text style={styles.forgotCredentialsText}>Forgot your credentials?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity 
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Create Account - Only show for patients */}
        {!isDoctor && (
          <TouchableOpacity onPress={handleCreateAccount} style={styles.createAccountButton}>
            <Text style={styles.createAccountText}>
              {"Don't have an account? "}
              <Text style={styles.createAccountHighlight}>Create one</Text>
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b2ebcaff',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#34495e',
    marginHorizontal: 10,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 8,
  },
  input: {
  borderWidth: 1,
  borderColor: '#bdc3c7',
  borderRadius: 8,
  padding: 16,
  marginBottom: 20,
  fontSize: 16,
  backgroundColor: '#f3f3eaff', // Changed from '#f8f9fa'
},
  forgotCredentials: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotCredentialsText: {
    color: '#3498db',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#27ae60',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonDisabled: {
    backgroundColor: '#95a5a6',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#bdc3c7',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  createAccountButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  createAccountText: {
    color: '#7f8c8d',
    fontSize: 16,
  },
  createAccountHighlight: {
    color: '#3498db',
    fontWeight: 'bold',
  },
});