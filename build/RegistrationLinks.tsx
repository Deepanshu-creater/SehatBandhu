import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Animated,
  Dimensions,
  ScrollView
} from 'react-native';
import { 
  User, 
  Stethoscope, 
  ArrowRight, 
  Heart,
  Star
} from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Theme colors matching your medical app
const THEME = {
  primary: '#10B981',
  primaryLight: '#6EE7B7',
  primaryDark: '#047857',
  secondary: '#F0FDF4',
  background: '#FEFEFE',
  surface: '#FFFFFF',
  accent: '#34D399',
  text: {
    primary: '#065F46',
    secondary: '#047857',
    tertiary: '#6B7280',
    light: '#9CA3AF',
  },
  gradient: {
    patient: ['#10B981', '#34D399'],
    doctor: ['#3B82F6', '#60A5FA'],
  }
};

const RegistrationLinks = () => {
  const router = useRouter();
  const [patientScale] = useState(new Animated.Value(1));
  const [doctorScale] = useState(new Animated.Value(1));

  const animatePress = (scale: Animated.Value) => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePatientPress = () => {
    animatePress(patientScale);
    setTimeout(() => router.push('/Patient-register' as any), 200);
  };

  const handleDoctorPress = () => {
    animatePress(doctorScale);
    setTimeout(() => router.push('/Doctor-register' as any), 200);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Heart size={32} color={THEME.primary} />
          <Text style={styles.title}>Join Our Healthcare Community</Text>
          <Text style={styles.subtitle}>Choose your role to get started</Text>
        </View>

        <View style={styles.cardsContainer}>
          {/* Patient Registration Card */}
          <Animated.View style={{ transform: [{ scale: patientScale }] }}>
            <TouchableOpacity 
              style={[styles.card, styles.patientCard]}
              onPress={handlePatientPress}
              activeOpacity={0.9}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: `${THEME.primary}20` }]}>
                  <User size={32} color={THEME.primary} />
                </View>
                <View style={styles.badge}>
                  <Star size={12} color="#FFFFFF" fill="#FFFFFF" />
                  <Text style={styles.badgeText}>Most Popular</Text>
                </View>
              </View>
              
              <Text style={styles.cardTitle}>Patient</Text>
              <Text style={styles.cardDescription}>
                Book appointments, track health records, and connect with healthcare providers
              </Text>
              
              <View style={styles.features}>
                <View style={styles.feature}>
                  <View style={[styles.featureDot, { backgroundColor: THEME.primary }]} />
                  <Text style={styles.featureText}>Easy appointment booking</Text>
                </View>
                <View style={styles.feature}>
                  <View style={[styles.featureDot, { backgroundColor: THEME.primary }]} />
                  <Text style={styles.featureText}>Health record tracking</Text>
                </View>
                <View style={styles.feature}>
                  <View style={[styles.featureDot, { backgroundColor: THEME.primary }]} />
                  <Text style={styles.featureText}>24/7 doctor access</Text>
                </View>
              </View>
              
              <View style={styles.cardFooter}>
                <Text style={styles.ctaText}>Get Started</Text>
                <ArrowRight size={20} color={THEME.primary} />
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Doctor Registration Card */}
          <Animated.View style={{ transform: [{ scale: doctorScale }] }}>
            <TouchableOpacity 
              style={[styles.card, styles.doctorCard]}
              onPress={handleDoctorPress}
              activeOpacity={0.9}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: '#3B82F620' }]}>
                  <Stethoscope size={32} color="#3B82F6" />
                </View>
                <View style={[styles.badge, { backgroundColor: '#3B82F6' }]}>
                  <Text style={styles.badgeText}>Professional</Text>
                </View>
              </View>
              
              <Text style={[styles.cardTitle, { color: '#1E40AF' }]}>Healthcare Provider</Text>
              <Text style={styles.cardDescription}>
                Manage your practice, connect with patients, and grow your medical career
              </Text>
              
              <View style={styles.features}>
                <View style={styles.feature}>
                  <View style={[styles.featureDot, { backgroundColor: '#3B82F6' }]} />
                  <Text style={styles.featureText}>Patient management</Text>
                </View>
                <View style={styles.feature}>
                  <View style={[styles.featureDot, { backgroundColor: '#3B82F6' }]} />
                  <Text style={styles.featureText}>Appointment scheduling</Text>
                </View>
                <View style={styles.feature}>
                  <View style={[styles.featureDot, { backgroundColor: '#3B82F6' }]} />
                  <Text style={styles.featureText}>Medical records access</Text>
                </View>
                <View style={styles.feature}>
                  <View style={[styles.featureDot, { backgroundColor: '#3B82F6' }]} />
                  <Text style={styles.featureText}>E-prescription system</Text>
                </View>
              </View>
              
              <View style={styles.cardFooter}>
                <Text style={[styles.ctaText, { color: '#3B82F6' }]}>Join as Provider</Text>
                <ArrowRight size={20} color="#3B82F6" />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text 
              style={styles.loginLink}
              onPress={() => router.push('/Login' as any)}
            >
              Sign In
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40, // Extra padding at bottom
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 10,
  },
  title: {
    fontSize: 24, // Slightly smaller for better fit
    fontWeight: '700',
    color: THEME.text.primary,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: THEME.text.tertiary,
    textAlign: 'center',
    lineHeight: 22,
  },
  cardsContainer: {
    gap: 20,
    minHeight: screenHeight * 0.7, // Ensure enough space for scrolling
  },
  card: {
    backgroundColor: THEME.surface,
    borderRadius: 20, // Slightly smaller radius
    padding: 20, // Reduced padding
    marginBottom: 16,
    shadowColor: THEME.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 280, // Minimum height for consistency
  },
  patientCard: {
    borderColor: `${THEME.primary}20`,
  },
  doctorCard: {
    borderColor: '#3B82F620',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    width: 56, // Slightly smaller
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: THEME.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 20, // Slightly smaller
    fontWeight: '700',
    color: THEME.text.primary,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: THEME.text.tertiary,
    lineHeight: 20,
    marginBottom: 16,
  },
  features: {
    gap: 10, // Reduced gap
    marginBottom: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  featureText: {
    fontSize: 13, // Slightly smaller
    color: THEME.text.secondary,
    fontWeight: '500',
    flex: 1,
    flexWrap: 'wrap',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: THEME.secondary,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.primary,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: THEME.text.tertiary,
  },
  loginLink: {
    color: THEME.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default RegistrationLinks;