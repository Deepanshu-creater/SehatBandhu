import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Activity,
  AlertCircle,
  Building,
  Calendar,
  ChevronDown,
  FileText,
  Folder,
  Heart,
  Home,
  Languages,
  MapPin,
  MessageCircle,
  Pill,
  Send,
  Star,
  Stethoscope,
  Truck,
  User,
  X
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const LOGO = require('../../assets/images/finallogo.jpeg');

// Define types for our data structures
type Language = 'en' | 'hi' | 'pa';
type TabLabel = 'Home' | 'AISymptom Checker' | 'Health Records' | 'Profile';
type QuickActionLabel = 'emergency' | 'pharmacy' | 'Register' | 'symptoms';

interface ContentType {
  appName: string;
  welcome: string;
  greeting: string;
  mainContent: string;
  quickActions: Record<QuickActionLabel, string>;
  services: string;
  govtSchemes: string;
  footer: string;
  stats: {
    pharmacies: string;
    healthCenters: string;
    doctors: string;
    villages: string;
  };
  intro: string;
  features: string[];
}

// Multilingual content with proper typing
const CONTENT: Record<Language, ContentType> = {
  en: {
    appName: 'Chikitsa365',
    welcome: 'Your Health Companion',
    greeting: 'Hi, {greeting} 👋',
    mainContent: 'Connecting doctors with people in Nabha through limited resources using Anganwadi and Community Health Centers. We implement multilingual video calls and translation functionalities even in our AI symptom checker.',
    quickActions: {
      emergency: 'Emergency',
      pharmacy: 'Pharmacy',
      Register: 'Register Here',
      symptoms: 'Symptoms'
    },
    services: 'Our Services',
    govtSchemes: 'Govt. Schemes',
    footer: '© 2025 Chiktisa365 • Empowering Health for All',
    stats: {
      pharmacies: 'Pharmacies Connected',
      healthCenters: 'Health Centers',
      doctors: 'Doctors Available',
      villages: 'Villages Served'
    },
    intro: 'Revolutionizing healthcare in Nabha through technology and community partnerships. Our platform bridges the gap between rural communities and quality healthcare services.',
    features: [
      '24/7 Telemedicine Services',
      'Multilingual Support (English, Hindi, Punjabi)',
      'AI-Powered Symptom Checker',
      'Digital Health Records',
      'Medicine Delivery Service',
      'Government Scheme Integration'
    ]
  },
  hi: {
    appName: 'चिकित्सा365',
    welcome: 'आपका स्वास्थ्य साथी',
    greeting: 'नमस्ते, {greeting} 👋',
    mainContent: 'आंगनवाड़ी और सामुदायिक स्वास्थ्य केंद्रों का उपयोग करके नाभा में सीमित संसाधनों के माध्यम से डॉक्टरों को लोगों से जोड़ना। हम अपने एआई लक्षण जांचकर्ता में भी बहुभाषी वीडियो कॉल और अनुवाद कार्यक्षमताएं लागू करते हैं।',
    quickActions: {
      emergency: 'आपातकाल',
      pharmacy: 'फार्मेसी',
      Register: 'हेल्थ चेकअप',
      symptoms: 'लक्षण'
    },
    services: 'हमारी सेवाएं',
    govtSchemes: 'सरकारी योजनाएं',
    footer: '© 2025 चिकित्सा365 • सभी के लिए स्वास्थ्य सशक्तिकरण',
    stats: {
      pharmacies: 'जुड़ी फार्मेसियां',
      healthCenters: 'स्वास्थ्य केंद्र',
      doctors: 'उपलब्ध डॉक्टर',
      villages: 'सेवित गांव'
    },
    intro: 'प्रौद्योगिकी और सामुदायिक साझेदारी के माध्यम से नाभा में स्वास्थ्य सेवा में क्रांति। हमारा प्लेटफॉर्म ग्रामीण समुदायों और गुणवत्तापूर्ण स्वास्थ्य सेवाओं के बीच की खाई को पाटता है।',
    features: [
      '24/7 टेलीमेडिसिन सेवाएं',
      'बहुभाषी समर्थन (अंग्रेजी, हिंदी, पंजाबी)',
      'एआई-संचालित लक्षण जांचकर्ता',
      'डिजिटल स्वास्थ्य रिकॉर्ड',
      'दवा वितरण सेवा',
      'सरकारी योजना एकीकरण'
    ]
  },
  pa: {
    appName: 'ਚਿਕਿਤਸਾ365',
    welcome: 'ਤੁਹਾਡਾ ਸਿਹਤ ਸਾਥੀ',
    greeting: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ, {greeting} 👋',
    mainContent: 'ਅੰਗਨਵਾੜੀ ਅਤੇ ਕਮਿਊਨਿਟੀ ਹੈਲਥ ਸੈਂਟਰਾਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਨਾਭਾ ਵਿੱਚ ਸੀਮਿਤ ਸਰੋਤਾਂ ਰਾਹੀਂ ਡਾਕਟਰਾਂ ਨੂੰ ਲੋਕਾਂ ਨਾਲ ਜੋੜਨਾ। ਅਸੀਂ ਆਪਣੇ ਏਆਈ ਲੱਛਣ ਚੈਕਰ ਵਿੱਚ ਵੀ ਬਹੁ-ਭਾਸ਼ਾਈ ਵੀਡੀਓ ਕਾਲਾਂ ਅਤੇ ਅਨੁਵਾਦ ਕਾਰਜਸ਼ੀਲਤਾਵਾਂ ਨੂੰ ਲਾਗੂ ਕਰਦੇ ਹਾਂ।',
    quickActions: {
      emergency: 'ਐਮਰਜੈਂਸੀ',
      pharmacy: 'ਫਾਰਮੇਸੀ',
      Register: 'ਸਿਹਤ ਜਾਂਚ',
      symptoms: 'ਲੱਛਣ'
    },
    services: 'ਸਾਡੀਆਂ ਸੇਵਾਵਾਂ',
    govtSchemes: 'ਸਰਕਾਰੀ ਸਕੀਮਾਂ',
    footer: '© 2025 ਚਿਕਿਤਸਾ365 • ਸਾਰੇ ਲਈ ਸਿਹਤ ਸਸ਼ਕਤੀਕਰਨ',
    stats: {
      pharmacies: 'ਜੁੜੀਆਂ ਫਾਰਮੇਸੀਆਂ',
      healthCenters: 'ਸਿਹਤ ਕੇਂਦਰ',
      doctors: 'ਉਪਲਬਧ ਡਾਕਟਰ',
      villages: 'ਸੇਵਾ ਪ੍ਰਦਾਨ ਗਏ ਪਿੰਡ'
    },
    intro: 'ਟੈਕਨਾਲੌਜੀ ਅਤੇ ਕਮਿਊਨਿਟੀ ਭਾਈਵਾਲੀ ਦੁਆਰਾ ਨਾਭਾ ਵਿੱਚ ਸਿਹਤ ਸੇਵਾ ਵਿੱਚ ਕ੍ਰਾਂਤੀ। ਸਾਡਾ ਪਲੇਟਫਾਰਮ ਪੇਂਡੂ ਕਮਿਊਨਿਟੀਆਂ ਅਤੇ ਗੁਣਵੱਤਾ ਵਾਲੀਆਂ ਸਿਹਤ ਸੇਵਾਵਾਂ ਦੇ ਬੀਚ ਦੇ ਫਾਸਲੇ ਨੂੰ ਪਾਟਦਾ ਹੈ।',
    features: [
      '24/7 ਟੈਲੀਮੈਡੀਸਨ ਸੇਵਾਵਾਂ',
      'ਬਹੁ-ਭਾਸ਼ਾਈ ਸਹਾਇਤਾ (ਅੰਗਰੇਜ਼ੀ, ਹਿੰਦੀ, ਪੰਜਾਬੀ)',
      'ਏਆਈ-ਸੰਚਾਲਿਤ ਲੱਛਣ ਚੈਕਰ',
      'ਡਿਜੀਟਲ ਸਿਹਤ ਰਿਕਾਰਡ',
      'ਦਵਾਈ ਡਿਲੀਵਰੀ ਸੇਵਾ',
      'ਸਰਕਾਰੀ ਸਕੀਮ ਏਕੀਕਰਨ'
    ]
  }
};

// Theme configuration
const THEME = {
  primary: '#2563eb',
  secondary: '#7c3aed',
  accent: '#d97706',
  background: '#d2e1c1ff',
  text: {
    primary: '#1e293b',
    secondary: '#475569',
    light: '#64748b'
  }
};

// Heading style configurations
interface HeadingStyle {
  textAlign: 'center' | 'left' | 'right';
  fontSize: number;
  fontWeight: 'normal' | 'bold' | '600' | '700';
  color: string;
  marginVertical: number;
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize';
}

const HEADING_STYLES: Record<string, HeadingStyle> = {
  main: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    marginVertical: 8,
    textTransform: 'uppercase'
  },
  section: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#2563eb',
    marginVertical: 16,
  },
  subSection: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#475569',
    marginVertical: 12,
  }
};

interface TaskbarItem {
  label: TabLabel;
  icon: React.ComponentType<any>;
}

interface QuickAction {
  label: QuickActionLabel;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

interface Service {
  label: string;
  icon: React.ComponentType<any>;
  description: string;
  color: string;
  glassColor: string;
}

interface GovtScheme {
  title: string;
  desc: string;
  action?: () => void;
}
// Chat Message Interface
interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}
interface HealthTip {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: string;
}
interface ChatSupportModalProps {
  visible: boolean;
  onClose: () => void;
  language: Language;
}

interface StatItem {
  icon: React.ComponentType<any>;
  value: number;
  label: string;
  color: string;
}

const TASKBAR_ITEMS: TaskbarItem[] = [
  { label: 'Home', icon: Home },
  { label: 'AISymptom Checker', icon: Stethoscope },
  { label: 'Health Records', icon: Folder },
  { label: 'Profile', icon: User },
];

// Professional color scheme - Blue, Green, White theme
const QUICK_ACTIONS: QuickAction[] = [
   { 
    label: 'Register', 
    icon: User, 
    color: '#6689d4ff', // Blue for health
    description: 'Join today'
  },
  { 
    label: 'symptoms', 
    icon: Activity, 
    color: '#926ecfff', // Purple for AI features
    description: 'AI symptom analysis'
  },
  { 
    label: 'pharmacy', 
    icon: Pill, 
    color: '#489980ff', // Green for pharmacy
    description: 'Medicine delivery'
  },
  { 
    label: 'emergency', 
    icon: AlertCircle, 
    color: '#e86a6aff', // Red for emergency
    description: 'Immediate medical assistance'
  },
];

const SERVICES: Service[] = [
  { 
    label: 'Prescription', 
    icon: FileText, 
    description: 'Digital prescriptions',
    color: '#2563eb',
    glassColor: 'rgba(37, 99, 235, 0.15)'
  },
  { 
    label: 'Pharmacy', 
    icon: Truck, 
    description: 'Nearby stores',
    color: '#059669',
    glassColor: 'rgba(5, 150, 105, 0.15)'
  },
  { 
    label: 'Appointment', 
    icon: Calendar, 
    description: 'Doctor booking',
    color: '#7c3aed',
    glassColor: 'rgba(124, 58, 237, 0.15)'
  },
  { 
    label: 'Chat Support', 
    icon: MessageCircle, 
    description: '24/7 help',
    color: '#d97706',
    glassColor: 'rgba(217, 119, 6, 0.15)'
  },
];

const GOVT_SCHEMES: GovtScheme[] = [
  { title: 'Ayushman Bharat', desc: 'Free health insurance for families.', action: () => Linking.openURL('https://www.pmjay.gov.in/') },
  { title: 'PM National Dialysis', desc: 'Subsidized dialysis for kidney patients.', action:() => Linking.openURL('https://pmjay.gov.in/') },
  { title: 'National Health Mission', desc: 'Improving healthcare infrastructure.' , action:() => Linking.openURL('https://pmjay.gov.in/')},
  { title: 'Janani Shishu Suraksha', desc: 'Free delivery and newborn care.', action:() => Linking.openURL('https://pmjay.gov.in/') },
];

// Health Tips Data
const HEALTH_TIPS: HealthTip[] = [
  {
    id: '1',
    title: 'Stay Hydrated',
    description: 'Drink at least 8 glasses of water daily for better health',
    icon: Activity,
    category: 'Daily Care'
  },
  {
    id: '2',
    title: 'Regular Exercise',
    description: '30 minutes of daily exercise improves cardiovascular health',
    icon: Heart,
    category: 'Fitness'
  },
  {
    id: '3',
    title: 'Balanced Diet',
    description: 'Include fruits and vegetables in every meal',
    icon: Pill,
    category: 'Nutrition'
  },
  {
    id: '4',
    title: 'Adequate Sleep',
    description: '7-8 hours of sleep boosts immune system',
    icon: Activity,
    category: 'Wellness'
  }
];

// Statistics data
const STATS_DATA: StatItem[] = [
  { icon: Pill, value: 45, label: 'pharmacies', color: '#489980ff' },
  { icon: Building, value: 12, label: 'healthCenters', color: '#2563eb' },
  { icon: User, value: 28, label: 'doctors', color: '#7c3aed' },
  { icon: MapPin, value: 35, label: 'villages', color: '#d97706' }
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function getGreetingTranslated(language: Language): string {
  const hour = new Date().getHours();
  if (language === 'hi') {
    if (hour < 12) return 'शुभ प्रभात';
    if (hour < 17) return 'नमस्कार';
    return 'शुभ संध्या';
  }
  if (language === 'pa') {
    if (hour < 12) return 'ਸ਼ੁਭ ਸਵੇਰ';
    if (hour < 17) return 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ';
    return 'ਸ਼ੁਭ ਸੰਝਾ';
  }
  return getGreeting();
}

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 2000 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(animatedValue, {
        toValue: value,
        duration: duration,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          animatedValue.addListener(({ value }) => {
            setCount(Math.floor(value));
          });
        }
      });
    }, 500); // Delay start for better visual effect

    return () => {
      animatedValue.removeAllListeners();
      clearTimeout(timer);
    };
  }, [value, duration]);

  return <Text style={styles.counterText}>{count}+</Text>;
};

// Statistics Component
// Statistics Component - Improved Design
const StatisticsSection = ({ language }: { language: Language }) => {
  return (
    <View style={styles.statsContainer}>
      <LinearGradient
        colors={['#98ce87ff', '#b4d691ff']}
        style={styles.statsGradient}
      >
        <Text style={styles.statsTitle}>Our Network Reach</Text>
        <View style={styles.statsGrid}>
          {STATS_DATA.map((stat, index) => (
            <View key={stat.label} style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor:  '#efebdcff' }]}>
                <stat.icon size={20} color={stat.color} />
              </View>
              <AnimatedCounter value={stat.value} duration={2000 + index * 300} />
              <Text style={styles.statLabel}>
                {CONTENT[language].stats[stat.label as keyof typeof CONTENT[Language]['stats']]}
              </Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </View>
  );
};

// Features List Component
const FeaturesList = ({ features }: { features: string[] }) => {
  return (
    <View style={styles.featuresContainer}>
      {features.map((feature, index) => (
        <View key={index} style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Star size={16} color="#2563eb" fill="#2563eb" />
          </View>
          <Text style={styles.featureText}>{feature}</Text>
        </View>
      ))}
    </View>
  );
};

// Centered Heading Component
const CenteredHeading = ({ 
  title, 
  type = 'section',
  style = {} 
}: { 
  title: string; 
  type?: 'main' | 'section' | 'subSection';
  style?: any;
}) => {
  const headingStyle = HEADING_STYLES[type];
  
  return (
    <View style={[styles.centeredHeadingContainer, style]}>
      <Text style={[styles.centeredHeading, headingStyle]}>
        {title}
      </Text>
      {/* Optional decorative line */}
      <View style={[
        styles.headingUnderline,
        { backgroundColor: headingStyle.color }
      ]} />
    </View>
  );
};

// Chat Support Modal Component
const ChatSupportModal : React.FC<ChatSupportModalProps> = ({ 
  visible, 
  onClose 
}: { 
  visible: boolean; 
  onClose: () => void;
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! Welcome to Chiktisa365 Chat Support. How can I help you today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);

  const sendMessage = () => {
    if (message.trim() === '') return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');

    // Simulate bot response after 1 second
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your message. Your query has been submitted to our support team. We will get back to you shortly.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.chatContainer}>
        {/* Chat Header */}
        <View style={styles.chatHeader}>
          <View style={styles.chatHeaderInfo}>
            <MessageCircle size={24} color="#d97706" />
            <Text style={styles.chatHeaderTitle}>Chat Support</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Messages List */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContainer}
          renderItem={({ item }) => (
            <View style={[
              styles.messageBubble,
              item.isUser ? styles.userMessage : styles.botMessage
            ]}>
              <Text style={[
                styles.messageText,
                item.isUser ? styles.userMessageText : styles.botMessageText
              ]}>
                {item.text}
              </Text>
              <Text style={styles.messageTime}>
                {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          )}
        />

        {/* Message Input */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputContainer}
        >
          <TextInput
            style={styles.textInput}
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message here..."
            placeholderTextColor="#94a3b8"
            multiline
          />
          <TouchableOpacity 
            style={styles.sendButton} 
            onPress={sendMessage}
            disabled={message.trim() === ''}
          >
            <Send size={20} color="#fff" />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default function TelemedicineHome() {
  const [activeTab, setActiveTab] = useState<TabLabel>('Home');
  const [language, setLanguage] = useState<Language>('en');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [currentSchemeIndex, setCurrentSchemeIndex] = useState(0);
  const [showChatSupport, setShowChatSupport] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const schemesFlatListRef = useRef<FlatList>(null);
  const router = useRouter();
  

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (GOVT_SCHEMES.length > 0) {
        currentIndex = (currentIndex + 1) % GOVT_SCHEMES.length;
        flatListRef.current?.scrollToIndex({
          index: currentIndex,
          animated: true,
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const content = CONTENT[language];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // Auto carousel for government schemes
  useEffect(() => {
    const interval = setInterval(() => {
      if (GOVT_SCHEMES.length > 0) {
        const nextIndex = (currentSchemeIndex + 1) % GOVT_SCHEMES.length;
        setCurrentSchemeIndex(nextIndex);
        schemesFlatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [currentSchemeIndex]);

  const handleTabPress = (tabLabel: TabLabel) => {
    setActiveTab(tabLabel);
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

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setShowLanguageDropdown(false);
  };

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  const LanguageDropdown = () => (
    <Modal
      visible={showLanguageDropdown}
      transparent
      animationType="fade"
      onRequestClose={() => setShowLanguageDropdown(false)}
    >
      <TouchableOpacity 
        style={styles.dropdownOverlay}
        onPress={() => setShowLanguageDropdown(false)}
      >
        <View style={styles.dropdownContainer}>
          {(['en', 'hi', 'pa'] as Language[]).map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[
                styles.dropdownItem,
                language === lang && styles.dropdownItemActive
              ]}
              onPress={() => handleLanguageSelect(lang)}
            >
              <Text style={styles.dropdownText}>
                {lang === 'en' ? 'English' : lang === 'hi' ? 'हिन्दी' : 'ਪੰਜਾਬੀ'}
              </Text>
              {language === lang && <View style={styles.selectedIndicator} />}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.headerLeft}>
          <Image source={LOGO} style={styles.logo} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.appName}>{content.appName}</Text>
            <Text style={styles.welcomeText}>{content.welcome}</Text>
          </View>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.languageSelector}
            onPress={() => setShowLanguageDropdown(true)}
          >
            <Languages size={20} color="#fff" />
            <Text style={styles.languageText}>
              {language === 'en' ? 'EN' : language === 'hi' ? 'HI' : 'PA'}
            </Text>
            <ChevronDown size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Content */}
      <Animated.ScrollView 
        contentContainerStyle={styles.scrollContent}
        style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Greeting Section */}
        <View style={styles.enhancedGreetingSection}>
          <View style={styles.greetingRow}>
            <Text style={styles.greetingText}>
              {content.greeting.replace('{greeting}', getGreetingTranslated(language))}
            </Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push('/Login')}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
          
          {/* Main Content Section */}
        <View style={styles.mainContentSection}>
          <CenteredHeading 
            title="Healthcare Revolution in Nabha" 
            type="section"
          />
          <Text style={styles.mainContentText}>
            {content.mainContent}
          </Text>
          <View style={styles.featureHighlights}>
          </View>
        </View>

          {/* Statistics Section with Animated Counting */}
          <StatisticsSection language={language} />

          {/* Features List */}
          <View style={styles.featuresSection}>
            <Text style={styles.featuresTitle}>Key Features</Text>
            <FeaturesList features={content.features} />
          </View>
        </View>

        {/* Quick Actions - 4 Boxes */}
        <CenteredHeading title="Quick Actions" type="section" />
        <View style={styles.quickActionsGrid}>
          {QUICK_ACTIONS.map((action) => (
            <AnimatedTouchable 
              key={action.label}
              style={[
                styles.quickActionCard,
                { 
                  backgroundColor: action.color,
                  transform: [{ scale: scaleAnim }]
                }
              ]}
              activeOpacity={0.8}
              onPress={() => {
                if (action.label === 'symptoms') {
                  router.push('/AISymptomsChecker');
                }
                if (action.label === 'Register') {
                  router.push('/RegistrationLinks');
                }
                if (action.label === 'pharmacy') {
                  Linking.openURL('https://multi-language-pharm-ns5y.bolt.host');
                }
              }}
            >
              <View style={styles.actionIconContainer}>
                <action.icon size={24} color="#fff" />
              </View>
              <Text style={styles.quickActionText}>{content.quickActions[action.label]}</Text>
              <Text style={styles.quickActionDesc}>{action.description}</Text>
            </AnimatedTouchable>
          ))}
        </View>

        {/* Government Schemes */}
         <CenteredHeading title={content.govtSchemes} type="section" />
        <FlatList
          ref={schemesFlatListRef}
          horizontal
          pagingEnabled
          data={GOVT_SCHEMES}
          keyExtractor={item => item.title}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.schemesCarouselContent}
          renderItem={({ item }) => (
            <View style={styles.schemeCard}>
              <LinearGradient
                colors={['#48693fff', '#639e68ff']}
                style={styles.schemeGradient}
              >
                <Text style={styles.schemeCardTitle}>{item.title}</Text>
                <Text style={styles.schemeCardDesc}>{item.desc}</Text>
                <View style={styles.schemeIndicator}>
                  {GOVT_SCHEMES.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.indicatorDot,
                        index === currentSchemeIndex && styles.indicatorDotActive
                      ]}
                    />
                  ))}
                </View>
              </LinearGradient>
            </View>
          )}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / (screenWidth - 40));
            setCurrentSchemeIndex(index);
          }}
        />

        {/* Health Tips Section - INTEGRATED */}
        <CenteredHeading 
          title={language === 'en' 
            ? "Daily Health Tips" 
            : language === 'hi' 
            ? "दैनिक स्वास्थ्य टिप्स" 
            : "ਰੋਜ਼ਾਨਾ ਸਿਹਤ ਸੁਝਾਅ"} 
          type="section" 
        />
        <FlatList
          horizontal
          data={HEALTH_TIPS}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}
          renderItem={({ item }) => (
            <View style={styles.healthTipCard}>
              <View style={styles.healthTipHeader}>
                <View style={styles.healthTipIcon}>
                  <item.icon size={20} color="#2563eb" />
                </View>
                <View>
                  <Text style={styles.healthTipCategory}>{item.category}</Text>
                  <Text style={styles.healthTipTitle}>{item.title}</Text>
                </View>
              </View>
              <Text style={styles.healthTipDesc}>{item.description}</Text>
            </View>
          )}
        />

        {/* Services - 4 Boxes */}
        <CenteredHeading title={content.services} type="section" />
        <View style={styles.servicesGrid}>
          {SERVICES.map((service) => (
            <AnimatedTouchable 
              key={service.label}
              style={[
                styles.serviceCard,
                { transform: [{ scale: scaleAnim }] }
              ]}
              activeOpacity={0.9}
              onPress={() => {
                if (service.label === 'Pharmacy') {
                  Linking.openURL('https://multi-language-pharm-ns5y.bolt.host');
                }
                if (service.label === 'Appointment') {
                  router.push('/Login'); 
                }
                if (service.label === 'Prescription') {
                  router.push('/Health-records'); 
                }
                if (service.label === 'Chat Support') {
                  setShowChatSupport(true);
                }
              }}
            >
              <View style={[styles.serviceBackground, { backgroundColor: service.glassColor }]} />
              <View style={styles.serviceContent}>
                <View style={styles.serviceIconContainer}>
                  <service.icon size={28} color={service.color} />
                </View>
                <Text style={styles.serviceText}>{service.label}</Text>
                <Text style={styles.serviceDesc}>{service.description}</Text>
              </View>
            </AnimatedTouchable>
          ))}
        </View>

        {/* Fixed Footer at Bottom */}
        <View style={styles.footerSpacer} />
        <View style={styles.footer}>
          <Text style={styles.footerText}>{content.footer}</Text>
        </View>
      </Animated.ScrollView>

      {/* Taskbar */}
      <View style={styles.taskbar}>
        {TASKBAR_ITEMS.map(tab => (
          <TouchableOpacity
            key={tab.label}
            style={styles.taskbarItem}
            onPress={() => {
              handleTabPress(tab.label);
              if (tab.label === (language === 'en' ? 'AISymptom Checker' : language === 'hi' ? 'एआई लक्षण जांच' : 'ਏਆਈ ਲੱਛਣ ਚੈਕਰ')) {
                router.push('/AISymptomsChecker');
              }
              if (tab.label === (language === 'en' ? 'Health Records' : language === 'hi' ? 'स्वास्थ्य रिकॉर्ड' : 'ਸਿਹਤ ਰਿਕਾਰਡ')) {
                router.push('/Health-records');
              }
              if (tab.label === (language === 'en' ? 'Profile' : language === 'hi' ? 'प्रोफाइल' : 'ਪ੍ਰੋਫਾਈਲ')) {
                router.push('/Profile');
              }
            }}
          >
            <tab.icon
              size={24}
              color={activeTab === tab.label ? '#3e5da1ff' : '#64748b'}
            />
            <Text style={[
              styles.taskbarText,
              activeTab === tab.label && styles.taskbarTextActive
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chat Support Modal */}
      <ChatSupportModal 
        visible={showChatSupport} 
        onClose={() => setShowChatSupport(false)}
        language={language}
      />

      <LanguageDropdown />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#ffffffff',
    padding: 0,
  },
  header: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 16,
     backgroundColor: '#19b73eff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: { 
    width: 40, 
    height: 40, 
    borderRadius: 8,
    marginRight: 12,
  },
  headerTextContainer: {
    flexDirection: 'column',
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffffff',
  },
  welcomeText: {
    fontSize: 12,
    color:  '#ffffffff',
    marginTop: 2,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5582cbff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  languageText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  scrollContent: { 
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  // Enhanced Greeting Section
  enhancedGreetingSection: {
    paddingVertical: 20,
    paddingHorizontal: 8,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    flex: 1,
  },
  loginButton: {
    backgroundColor: '#63e044ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    elevation: 2,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  introContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  introText: {
    fontSize: 16,
    color: '#ffffffff',
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: '500',
  },
  // Statistics Section
  // Enhanced Statistics Styles
statsContainer: {
  borderRadius: 20,
  marginBottom: 20,
  elevation: 6,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 10,
  overflow: 'hidden',
},
statsGradient: {
  padding: 20,
},
statsTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#1e293b',
  textAlign: 'center',
  marginBottom: 16,
  textTransform: 'uppercase',
  letterSpacing: 1,
},
statsGrid: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 8,
},
statItem: {
  width: '48%', // Two items per row
  alignItems: 'center',
  paddingVertical: 12,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: 16,
  marginBottom: 8,
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
},
statIconContainer: {
  width: 40,
  height: 40,
  borderRadius: 20,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 8,
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
},
counterText: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#2563eb',
  marginBottom: 2,
},
statLabel: {
  fontSize: 11,
  color: '#64748b',
  textAlign: 'center',
  fontWeight: '600',
  lineHeight: 14,
},
  // Features Section
  featuresSection: {
    backgroundColor:  '#efebdcff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 16,
  },
  featuresContainer: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
    flex: 1,
  },
  // Centered Heading Styles
  centeredHeadingContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  centeredHeading: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  headingUnderline: {
    height: 3,
    width: 60,
    borderRadius: 2,
    marginTop: 8,
    opacity: 0.7,
  },
  // Main Content Section Styles
  mainContentSection: {
    backgroundColor: '#efebdcff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 15,
    borderLeftColor: '#b2e1abff',
  },
  mainContentText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  featureHighlights: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureitem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  featuretext: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  quickActionCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  quickActionDesc: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
  // Government Schemes Styles
  schemesCarouselContent: {
    paddingHorizontal: 4,
    marginBottom: 24,
  },
  schemeCard: {
    width: screenWidth - 40,
    height: 140,
    marginHorizontal: 8,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#aaba6dff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  schemeGradient: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',
  },
  schemeCardTitle: {
    color: '#b6e16bff',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 8,
  },
  schemeCardDesc: {
    color: 'rgba(247, 250, 252, 0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
  schemeIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(247, 250, 252, 0.4)',
  },
  indicatorDotActive: {
    backgroundColor: '#f7fafc',
    width: 12,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 18,
    marginBottom: 16,
    marginTop: 8,
  },
  serviceCard: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 24,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    marginBottom: 18,
  },
  serviceBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
  },
  serviceContent: {
    alignItems: 'center',
    zIndex: 2,
  },
  serviceIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceText: {
    color: '#1e293b',
    fontWeight: '800',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
  },
  serviceDesc: {
    color: '#475569',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  // Health Tips Styles
  healthTipCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 10,
    width: 260,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 8,
  },
  healthTipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  healthTipIcon: {
    width: 40,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  healthTipCategory: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  healthTipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 6,
  },
  healthTipDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  carouselContent: {
    paddingHorizontal: 4,
    gap: 12,
    marginBottom: 24,
  },
  footerSpacer: {
    marginTop: 15,
    height: 40,
  },
  // Fixed Footer Styles
  footer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    marginTop: 15,
    backgroundColor: '#d2e1c1ff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#96eb7fff',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  footerText: {
    color: '#0d809cff',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  taskbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#19b73eff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  taskbarItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  taskbarText: {
    fontSize: 10,
    color: '#ffffffff',
    marginTop: 4,
    textAlign: 'center',
  },
  taskbarTextActive: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    minWidth: 120,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  dropdownItemActive: {
    backgroundColor: '#f1f5f9',
  },
  dropdownText: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563eb',
  },
  // Chat Support Styles
  chatContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chatHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chatHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  closeButton: {
    padding: 4,
  },
  messagesContainer: {
    flexGrow: 1,
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2563eb',
    borderBottomRightRadius: 4,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: '#1e293b',
  },
  messageTime: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    fontSize: 14,
    color: '#1e293b',
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
});