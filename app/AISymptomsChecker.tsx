import NetInfo from '@react-native-community/netinfo';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type Language = 'en' | 'hi' | 'pa';

interface Message {
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

// Hardcoded symptom database with multilingual support
const SYMPTOM_DATABASE: Record<Language, Record<string, {
  name: string;
  possible_conditions: Array<{
    name: string;
    accuracy: number;
    description: string;
    severity: 'Low' | 'Medium' | 'High';
    recommendations: string[];
    when_to_see_doctor: string[];
  }>;
  general_advice: string;
  emergency_warning?: string;
}>> = {
  en: {
    'headache': {
      name: 'Headache',
      possible_conditions: [
        {
          name: 'Tension Headache',
          accuracy: 85,
          description: 'Mild to moderate pain often described as a tight band around the head',
          severity: 'Low',
          recommendations: [
            'Rest in a quiet, dark room',
            'Apply cold or warm compress to forehead',
            'Practice relaxation techniques',
            'Stay hydrated'
          ],
          when_to_see_doctor: [
            'Headache persists for more than 2 days',
            'Pain becomes severe',
            'Accompanied by fever or vision changes'
          ]
        },
        {
          name: 'Migraine',
          accuracy: 75,
          description: 'Throbbing pain usually on one side, often with nausea and sensitivity to light',
          severity: 'Medium',
          recommendations: [
            'Rest in dark, quiet environment',
            'Apply cold compress',
            'Avoid strong smells and loud noises',
            'Consider OTC migraine medication'
          ],
          when_to_see_doctor: [
            'First migraine experience',
            'Symptoms different from previous migraines',
            'Lasts more than 72 hours'
          ]
        }
      ],
      general_advice: 'Most headaches are not serious. Monitor patterns and triggers.'
    },
    'fever': {
      name: 'Fever',
      possible_conditions: [
        {
          name: 'Viral Infection',
          accuracy: 80,
          description: 'Common viral illnesses causing elevated body temperature',
          severity: 'Low',
          recommendations: [
            'Rest and stay hydrated',
            'Use fever-reducing medication if needed',
            'Take lukewarm baths',
            'Wear light clothing'
          ],
          when_to_see_doctor: [
            'Fever above 103°F (39.4°C)',
            'Lasts more than 3 days',
            'Accompanied by rash or difficulty breathing'
          ]
        }
      ],
      general_advice: 'Fever helps fight infection. Focus on comfort and hydration.'
    },
    'cough': {
      name: 'Cough',
      possible_conditions: [
        {
          name: 'Common Cold',
          accuracy: 85,
          description: 'Viral infection affecting upper respiratory tract',
          severity: 'Low',
          recommendations: [
            'Drink warm fluids with honey',
            'Use humidifier',
            'Get plenty of rest',
            'Try cough drops or lozenges'
          ],
          when_to_see_doctor: [
            'Cough lasts more than 3 weeks',
            'Produces blood',
            'Accompanied by chest pain'
          ]
        }
      ],
      general_advice: 'Most coughs resolve on their own within 1-3 weeks.'
    },
    'stomach pain': {
      name: 'Stomach Pain',
      possible_conditions: [
        {
          name: 'Indigestion',
          accuracy: 80,
          description: 'Discomfort in upper abdomen often after eating',
          severity: 'Low',
          recommendations: [
            'Eat smaller meals',
            'Avoid spicy and fatty foods',
            'Stay upright after eating',
            'Try antacids if needed'
          ],
          when_to_see_doctor: [
            'Severe or persistent pain',
            'Accompanied by vomiting or fever',
            'Blood in stool'
          ]
        }
      ],
      general_advice: 'Monitor food triggers and eating habits.'
    },
    'chest pain': {
      name: 'Chest Pain',
      possible_conditions: [
        {
          name: 'Acid Reflux',
          accuracy: 70,
          description: 'Burning sensation in chest often after meals',
          severity: 'Low',
          recommendations: [
            'Avoid trigger foods',
            'Eat smaller meals',
            'Elevate head while sleeping',
            'Avoid lying down after eating'
          ],
          when_to_see_doctor: [
            'Severe chest pain',
            'Pain radiating to arm or jaw',
            'Shortness of breath'
          ]
        }
      ],
      general_advice: '⚠️ Chest pain can be serious. Seek immediate help if severe.',
      emergency_warning: 'If chest pain is severe, radiates to arm/jaw, or causes shortness of breath, seek emergency care immediately!'
    }
  },
  hi: {
    'सिरदर्द': {
      name: 'सिरदर्द',
      possible_conditions: [
        {
          name: 'तनाव सिरदर्द',
          accuracy: 85,
          description: 'हल्का से मध्यम दर्द जो अक्सर सिर के चारों ओर तंग बैंड के रूप में वर्णित किया जाता है',
          severity: 'Low',
          recommendations: [
            'शांत, अंधेरे कमरे में आराम करें',
            'माथे पर ठंडा या गर्म सेक लगाएं',
            'विश्राम तकनीकों का अभ्यास करें',
            'हाइड्रेटेड रहें'
          ],
          when_to_see_doctor: [
            'सिरदर्द 2 दिनों से अधिक समय तक बना रहे',
            'दर्द गंभीर हो जाए',
            'बुखार या दृष्टि में बदलाव के साथ'
          ]
        }
      ],
      general_advice: 'अधिकांश सिरदर्द गंभीर नहीं होते। पैटर्न और ट्रिगर्स पर नज़र रखें।'
    },
    'बुखार': {
      name: 'बुखार',
      possible_conditions: [
        {
          name: 'वायरल संक्रमण',
          accuracy: 80,
          description: 'सामान्य वायरल बीमारियाँ जो शरीर के तापमान को बढ़ाती हैं',
          severity: 'Low',
          recommendations: [
            'आराम करें और हाइड्रेटेड रहें',
            'जरूरत पड़ने पर बुखार कम करने वाली दवा लें',
            'गुनगुने पानी से स्नान करें',
            'हल्के कपड़े पहनें'
          ],
          when_to_see_doctor: [
            '103°F (39.4°C) से अधिक बुखार',
            '3 दिनों से अधिक समय तक बना रहे',
            'दाने या सांस लेने में तकलीफ के साथ'
          ]
        }
      ],
      general_advice: 'बुखार संक्रमण से लड़ने में मदद करता है। आराम और हाइड्रेशन पर ध्यान दें।'
    },
    'खांसी': {
      name: 'खांसी',
      possible_conditions: [
        {
          name: 'सामान्य सर्दी',
          accuracy: 85,
          description: 'वायरल संक्रमण जो ऊपरी श्वसन पथ को प्रभावित करता है',
          severity: 'Low',
          recommendations: [
            'शहद के साथ गर्म तरल पदार्थ पिएं',
            'ह्यूमिडिफायर का उपयोग करें',
            'भरपूर आराम करें',
            'खांसी की गोलियाँ आज़माएं'
          ],
          when_to_see_doctor: [
            'खांसी 3 सप्ताह से अधिक समय तक बनी रहे',
            'खून आए',
            'सीने में दर्द के साथ'
          ]
        }
      ],
      general_advice: 'अधिकांश खांसी 1-3 सप्ताह के भीतर अपने आप ठीक हो जाती है।'
    }
  },
  pa: {
    'ਸਿਰਦਰਦ': {
      name: 'ਸਿਰਦਰਦ',
      possible_conditions: [
        {
          name: 'ਤਣਾਅ ਸਿਰਦਰਦ',
          accuracy: 85,
          description: 'ਹਲਕਾ ਤੋਂ ਦਰਮਿਆਨਾ ਦਰਦ ਜੋ ਅਕਸਰ ਸਿਰ ਦੇ ਚਾਰਾਂ ਪਾਸੇ ਤੰਗ ਬੈਂਡ ਵਜੋਂ ਵਰਣਿਤ ਕੀਤਾ ਜਾਂਦਾ ਹੈ',
          severity: 'Low',
          recommendations: [
            'ਚੁੱਪ, ਅੰਧੇਰੇ ਕਮਰੇ ਵਿੱਚ ਆਰਾਮ ਕਰੋ',
            'ਮੱਥੇ ਤੇ ਠੰਡਾ ਜਾਂ ਗਰਮ ਸੇਕ ਲਗਾਓ',
            'ਆਰਾਮ ਦੀਆਂ ਤਕਨੀਕਾਂ ਦਾ ਅਭਿਆਸ ਕਰੋ',
            'ਹਾਈਡਰੇਟਿਡ ਰਹੋ'
          ],
          when_to_see_doctor: [
            'ਸਿਰਦਰਦ 2 ਦਿਨਾਂ ਤੋਂ ਵੱਧ ਸਮੇਂ ਤੱਕ ਰਹੇ',
            'ਦਰਦ ਗੰਭੀਰ ਹੋ ਜਾਵੇ',
            'ਬੁਖਾਰ ਜਾਂ ਦ੍ਰਿਸ਼ਟੀ ਵਿੱਚ ਬਦਲਾਅ ਦੇ ਨਾਲ'
          ]
        }
      ],
      general_advice: 'ਜ਼ਿਆਦਾਤਰ ਸਿਰਦਰਦ ਗੰਭੀਰ ਨਹੀਂ ਹੁੰਦੇ। ਪੈਟਰਨ ਅਤੇ ਟਰਿੱਗਰਾਂ ਤੇ ਨਜ਼ਰ ਰੱਖੋ।'
    },
    'ਬੁਖਾਰ': {
      name: 'ਬੁਖਾਰ',
      possible_conditions: [
        {
          name: 'ਵਾਇਰਲ ਇਨਫੈਕਸ਼ਨ',
          accuracy: 80,
          description: 'ਸਾਧਾਰਣ ਵਾਇਰਲ ਬੀਮਾਰੀਆਂ ਜੋ ਸਰੀਰ ਦੇ ਤਾਪਮਾਨ ਨੂੰ ਵਧਾਉਂਦੀਆਂ ਹਨ',
          severity: 'Low',
          recommendations: [
            'ਆਰਾਮ ਕਰੋ ਅਤੇ ਹਾਈਡਰੇਟਿਡ ਰਹੋ',
            'ਲੋੜ ਪੈਣ ਤੇ ਬੁਖਾਰ ਘਟਾਉਣ ਵਾਲੀ ਦਵਾਈ ਲਓ',
            'ਗੁਨਗੁਨੇ ਪਾਣੀ ਨਾਲ ਨਹਾਓ',
            'ਹਲਕੇ ਕੱਪੜੇ ਪਹਿਨੋ'
          ],
          when_to_see_doctor: [
            '103°F (39.4°C) ਤੋਂ ਵੱਧ ਬੁਖਾਰ',
            '3 ਦਿਨਾਂ ਤੋਂ ਵੱਧ ਸਮੇਂ ਤੱਕ ਰਹੇ',
            'ਚੱਕੱਤੇ ਜਾਂ ਸਾਹ ਲੈਣ ਵਿੱਚ ਤਕਲੀਫ ਦੇ ਨਾਲ'
          ]
        }
      ],
      general_advice: 'ਬੁਖਾਰ ਇਨਫੈਕਸ਼ਨ ਨਾਲ ਲੜਨ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ। ਆਰਾਮ ਅਤੇ ਹਾਈਡਰੇਸ਼ਨ ਤੇ ਧਿਆਨ ਦਿਓ।'
    },
    'ਖਾਂਸੀ': {
      name: 'ਖਾਂਸੀ',
      possible_conditions: [
        {
          name: 'ਸਾਧਾਰਣ ਜ਼ੁਕਾਮ',
          accuracy: 85,
          description: 'ਵਾਇਰਲ ਇਨਫੈਕਸ਼ਨ ਜੋ ਉੱਪਰੀ ਸਾਹ ਲੈਣ ਵਾਲੇ ਮਾਰਗ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕਰਦਾ ਹੈ',
          severity: 'Low',
          recommendations: [
            'ਸ਼ਹਿਦ ਨਾਲ ਗਰਮ ਤਰਲ ਪਦਾਰਥ ਪੀਓ',
            'ਹਿਊਮਿਡੀਫਾਇਰ ਦੀ ਵਰਤੋਂ ਕਰੋ',
            'ਭਰਪੂਰ ਆਰਾਮ ਕਰੋ',
            'ਖਾਂਸੀ ਦੀਆਂ ਗੋਲੀਆਂ ਅਜ਼ਮਾਓ'
          ],
          when_to_see_doctor: [
            'ਖਾਂਸੀ 3 ਹਫ਼ਤਿਆਂ ਤੋਂ ਵੱਧ ਸਮੇਂ ਤੱਕ ਰਹੇ',
            'ਖੂਨ ਆਵੇ',
            'ਛਾਤੀ ਵਿੱਚ ਦਰਦ ਦੇ ਨਾਲ'
          ]
        }
      ],
      general_advice: 'ਜ਼ਿਆਦਾਤਰ ਖਾਂਸੀ 1-3 ਹਫ਼ਤਿਆਂ ਵਿੱਚ ਆਪਣੇ ਆਪ ਠੀਕ ਹੋ ਜਾਂਦੀ ਹੈ।'
    }
  }
};

// Multilingual bot responses
const BOT_RESPONSES: Record<Language, {
  welcome: string;
  no_symptom: string;
  symptom_not_found: string;
  disclaimer: string;
  emergency: string;
  typing: string;
  loading: string;
}>= {
  en: {
    welcome: "Hello! I'm your AI symptom checker. Describe your symptoms and I'll help identify possible conditions. Remember, this is not medical advice - consult a doctor for diagnosis.",
    no_symptom: "Please describe your symptoms so I can help you better.",
    symptom_not_found: "I couldn't find specific information for that symptom. Please try describing it differently or mention specific symptoms like headache, fever, cough, etc.",
    disclaimer: "⚠️ AI-powered symptom checker • Not a substitute for medical advice",
    emergency: "🚨 EMERGENCY WARNING: If you're experiencing severe symptoms like chest pain, difficulty breathing, or loss of consciousness, seek immediate medical attention!",
    typing: "AI is analyzing...",
    loading: "🔄 Fetching symptom data..."
  },
  hi: {
    welcome: "नमस्ते! मैं आपका AI लक्षण जांचकर्ता हूं। अपने लक्षणों का वर्णन करें और मैं संभावित स्थितियों की पहचान करने में मदद करूंगा। याद रखें, यह चिकित्सा सलाह नहीं है - निदान के लिए डॉक्टर से सलाह लें।",
    no_symptom: "कृपया अपने लक्षणों का वर्णन करें ताकि मैं आपकी बेहतर मदद कर सकूं।",
    symptom_not_found: "मुझे उस लक्षण की विशिष्ट जानकारी नहीं मिल सकी। कृपया इसे अलग तरीके से वर्णन करने का प्रयास करें या सिरदर्द, बुखार, खांसी आदि जैसे विशिष्ट लक्षणों का उल्लेख करें।",
    disclaimer: "⚠️ AI-संचालित लक्षण जांचकर्ता • चिकित्सा सलाह का विकल्प नहीं",
    emergency: "🚨 आपातकालीन चेतावनी: यदि आप गंभीर लक्षणों का अनुभव कर रहे हैं जैसे सीने में दर्द, सांस लेने में तकलीफ, या चेतना खोना, तो तत्काल चिकित्सा सहायता लें!",
    typing: "AI विश्लेषण कर रहा है...",
    loading: "🔄 लक्षण डेटा प्राप्त कर रहा है..."
  },
  pa: {
    welcome: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ AI ਲੱਛਣ ਚੈਕਰ ਹਾਂ। ਆਪਣੇ ਲੱਛਣਾਂ ਦਾ ਵਰਣਨ ਕਰੋ ਅਤੇ ਮੈਂ ਸੰਭਾਵਿਤ ਸਥਿਤੀਆਂ ਦੀ ਪਛਾਣ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰਾਂਗਾ। ਯਾਦ ਰੱਖੋ, ਇਹ ਮੈਡੀਕਲ ਸਲਾਹ ਨਹੀਂ ਹੈ - ਨਿਦਾਨ ਲਈ ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਲਓ।",
    no_symptom: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਲੱਛਣਾਂ ਦਾ ਵਰਣਨ ਕਰੋ ਤਾਂ ਜੋ ਮੈਂ ਤੁਹਾਡੀ ਬਿਹਤਰ ਮਦਦ ਕਰ ਸਕਾਂ।",
    symptom_not_found: "ਮੈਨੂੰ ਉਸ ਲੱਛਣ ਦੀ ਵਿਸ਼ੇਸ਼ ਜਾਣਕਾਰੀ ਨਹੀਂ ਮਿਲ ਸਕੀ। ਕਿਰਪਾ ਕਰਕੇ ਇਸਨੂੰ ਵੱਖਰੇ ਢੰਗ ਨਾਲ ਵਰਣਨ ਕਰਨ ਦੀ ਕੋਸ਼ਿਸ਼ ਕਰੋ ਜਾਂ ਖਾਸ ਲੱਛਣਾਂ ਜਿਵੇਂ ਸਿਰਦਰਦ, ਬੁਖਾਰ, ਖਾਂਸੀ ਆਦਿ ਦਾ ਜ਼ਿਕਰ ਕਰੋ।",
    disclaimer: "⚠️ AI-ਸੰਚਾਲਿਤ ਲੱਛਣ ਚੈਕਰ • ਮੈਡੀਕਲ ਸਲਾਹ ਦਾ ਵਿਕਲਪ ਨਹੀਂ",
    emergency: "🚨 ਐਮਰਜੈਂਸੀ ਚੇਤਾਵਨੀ: ਜੇਕਰ ਤੁਸੀਂ ਗੰਭੀਰ ਲੱਛਣਾਂ ਦਾ ਅਨੁਭਵ ਕਰ ਰਹੇ ਹੋ ਜਿਵੇਂ ਛਾਤੀ ਵਿੱਚ ਦਰਦ, ਸਾਹ ਲੈਣ ਵਿੱਚ ਮੁਸ਼ਕਲ, ਜਾ ਹੋਸ਼ ਖੋ ਦੇਣਾ, ਤਾਂ ਤੁਰੰਤ ਮੈਡੀਕਲ ਸਹਾਇਤਾ ਲਓ!",
    typing: "AI ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਿਹਾ ਹੈ...",
    loading: "🔄 ਲੱਛਣ ਡੇਟਾ ਪ੍ਰਾਪਤ ਕਰ ਰਿਹਾ ਹੈ..."
  }
};

const SymptomsAPIChatBot = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [language, setLanguage] = useState<Language>('en');
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: BOT_RESPONSES[language].welcome,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  useEffect(() => {
    if (isDropdownOpen) {
      const timeout = setTimeout(() => {
        setIsDropdownOpen(false);
      }, 5000); // Auto-close after 5 seconds
      return () => clearTimeout(timeout);
    }
  }, [isDropdownOpen]);

  // Smart symptom matching function
  const findSymptomMatch = (userInput: string): string | null => {
    const input = userInput.toLowerCase().trim();
    
    // Symptom mapping for different languages
    const symptomKeywords: Record<Language, Record<string, string[]>> = {
      en: {
        'headache': ['headache', 'head pain', 'head ache', 'migraine'],
        'fever': ['fever', 'temperature', 'hot', 'burning up'],
        'cough': ['cough', 'coughing', 'hack', 'chest cough'],
        'stomach pain': ['stomach pain', 'abdominal pain', 'belly ache', 'tummy pain'],
        'chest pain': ['chest pain', 'heart pain', 'chest discomfort'],
        'nausea': ['nausea', 'sick', 'queasy', 'feel like vomiting'],
        'dizziness': ['dizziness', 'lightheaded', 'vertigo', 'spinning'],
        'fatigue': ['fatigue', 'tired', 'exhausted', 'weakness'],
        'back pain': ['back pain', 'backache', 'spine pain'],
        'sore throat': ['sore throat', 'throat pain', 'difficulty swallowing'],
        'rash': ['rash', 'skin irritation', 'red spots', 'hives'],
        'shortness of breath': ['shortness of breath', 'breathing difficulty', 'can\'t breathe'],
        'joint pain': ['joint pain', 'arthritis', 'knee pain', 'hip pain'],
        'diarrhea': ['diarrhea', 'loose motion', 'watery stool'],
        'constipation': ['constipation', 'can\'t pass stool', 'bowel problem']
      },
      hi: {
        'सिरदर्द': ['सिरदर्द', 'सिर में दर्द', 'माइग्रेन', 'सिर का दर्द'],
        'बुखार': ['बुखार', 'ताप', 'गर्मी', 'ज्वर'],
        'खांसी': ['खांसी', 'कफ', 'छाती में खांसी'],
        'पेट दर्द': ['पेट दर्द', 'पेट में दर्द', 'उदर शूल', 'पेट का दर्द']
      },
      pa: {
        'ਸਿਰਦਰਦ': ['ਸਿਰਦਰਦ', 'ਸਿਰ ਦਾ ਦਰਦ', 'ਮਾਈਗ੍ਰੇਨ'],
        'ਬੁਖਾਰ': ['ਬੁਖਾਰ', 'ਤਾਪ', 'ਗਰਮੀ'],
        'ਖਾਂਸੀ': ['ਖਾਂਸੀ', 'ਕਫ', 'ਛਾਤੀ ਵਿੱਚ ਖਾਂਸੀ']
      }
    };

    const currentLangKeywords = symptomKeywords[language];
    
    for (const [symptomKey, keywords] of Object.entries(currentLangKeywords)) {
      if (keywords.some(keyword => input.includes(keyword))) {
        return symptomKey;
      }
    }
    
    return null;
  };

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const symptomKey = findSymptomMatch(userMessage);
      
      if (!symptomKey) {
        return BOT_RESPONSES[language].symptom_not_found;
      }

      const symptomData = SYMPTOM_DATABASE[language][symptomKey];
      
      if (!symptomData) {
        return BOT_RESPONSES[language].symptom_not_found;
      }

      let response = `**${symptomData.name} Analysis**\n\n`;
      
      response += `**Possible Conditions:**\n`;
      symptomData.possible_conditions.forEach((condition, index) => {
        response += `• **${condition.name}** (${condition.accuracy}% accuracy)\n`;
        response += `  ${condition.description}\n`;
        response += `  **Severity:** ${condition.severity}\n`;
        
        response += `  **Recommendations:**\n`;
        condition.recommendations.forEach(rec => {
          response += `  ✓ ${rec}\n`;
        });
        
        response += `  **When to see a doctor:**\n`;
        condition.when_to_see_doctor.forEach(when => {
          response += `  ⚠️ ${when}\n`;
        });
        
        response += '\n';
      });

      response += `**General Advice:**\n${symptomData.general_advice}\n\n`;
      
      if (symptomData.emergency_warning) {
        response += `🚨 **EMERGENCY WARNING:** ${symptomData.emergency_warning}\n\n`;
      }

      response += BOT_RESPONSES[language].disclaimer;

      return response;

    } catch (error) {
      console.error('Error generating response:', error);
      return 'Sorry, I encountered an error. Please try again.';
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage: Message = {
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    const previousInput = inputValue;
    setInputValue('');
    
    const botResponse = await generateBotResponse(previousInput);
    const botMessage: Message = {
      type: 'bot',
      content: botResponse,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, botMessage]);
  };

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (!line.trim()) {
        return <View key={index} style={styles.lineBreak} />;
      }
      
      if (line.startsWith('•') || line.startsWith('✓') || line.startsWith('⚠️')) {
        return (
          <Text key={index} style={styles.messageBullet}>
            {line}
          </Text>
        );
      }
      
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <Text key={index} style={styles.messageHeading}>
            {line.replace(/\*\*/g, '')}
          </Text>
        );
      }
      
      if (line.includes('🚨')) {
        return (
          <Text key={index} style={styles.emergencyText}>
            {line}
          </Text>
        );
      }
      
      return (
        <Text key={index} style={styles.messageText}>
          {line}
        </Text>
      );
    });
  };

  const clearChat = () => {
    setMessages([
      {
        type: 'bot',
        content: BOT_RESPONSES[language].welcome,
        timestamp: new Date(),
      },
    ]);
  };

  const changeLanguage = (newLang: Language) => {
    setLanguage(newLang);
    clearChat();
  };

  const chatWindowTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [screenHeight, 0],
  });

  if (!isOpen) {
    return (
      <TouchableOpacity
        style={styles.chatToggle}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.8}
      >
        <View style={styles.toggleInner}>
          <Text style={styles.toggleIcon}>🩺</Text>
          <Text style={styles.toggleText}>Symptom Check</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: chatWindowTranslateY }] }]}>
      <View style={styles.chatWindow}>
        {/* Header */}
        <View style={styles.chatHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AI</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>Symptom Checker</Text>
              <Text style={[styles.status, isOnline ? styles.online : styles.offline]}>
                {isOnline ? '🟢 Online' : '🔴 Offline'} • {language.toUpperCase()}
              </Text>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            {/* Language Dropdown */}
            <View style={styles.dropdownContainer}>
              <TouchableOpacity 
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                style={styles.dropdownTrigger}
              >
                <Text style={styles.dropdownTriggerText}>
                  {language.toUpperCase()} ▼
                </Text>
              </TouchableOpacity>
              
              {isDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  <TouchableOpacity 
                    onPress={() => {
                      changeLanguage('en');
                      setIsDropdownOpen(false);
                    }} 
                    style={[styles.dropdownItem, language === 'en' && styles.dropdownItemActive]}
                  >
                    <Text style={styles.dropdownItemText}>English (EN)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => {
                      changeLanguage('hi');
                      setIsDropdownOpen(false);
                    }} 
                    style={[styles.dropdownItem, language === 'hi' && styles.dropdownItemActive]}
                  >
                    <Text style={styles.dropdownItemText}>हिन्दी (HI)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => {
                      changeLanguage('pa');
                      setIsDropdownOpen(false);
                    }} 
                    style={[styles.dropdownItem, language === 'pa' && styles.dropdownItemActive]}
                  >
                    <Text style={styles.dropdownItemText}>ਪੰਜਾਬੀ (PA)</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <TouchableOpacity onPress={clearChat} style={styles.iconButton}>
              <Text style={styles.iconText}>🔄</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsOpen(false)} style={styles.iconButton}>
              <Text style={styles.iconText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          style={styles.chatMessages}
          ref={scrollViewRef}
          contentContainerStyle={styles.chatMessagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message, index) => (
            <View key={index} style={[
              styles.messageContainer, 
              message.type === 'user' ? styles.userContainer : styles.botContainer
            ]}>
              <View style={[
                styles.messageBubble,
                message.type === 'user' ? styles.userBubble : styles.botBubble
              ]}>
                {formatMessage(message.content)}
              </View>
              <Text style={[
                styles.timestamp,
                message.type === 'user' ? styles.userTimestamp : styles.botTimestamp
              ]}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          ))}
          
          {isTyping && (
            <View style={[styles.messageContainer, styles.botContainer]}>
              <View style={[styles.messageBubble, styles.botBubble]}>
                <View style={styles.typingIndicator}>
                  <Text style={styles.typingText}>{BOT_RESPONSES[language].typing}</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder={
                language === 'en' ? "Describe your symptoms (e.g., headache, fever)..." :
                language === 'hi' ? "अपने लक्षणों का वर्णन करें (जैसे, सिरदर्द, बुखार)..." :
                "ਆਪਣੇ ਲੱਛਣਾਂ ਦਾ ਵਰਣਨ ਕਰੋ (ਜਿਵੇਂ, ਸਿਰਦਰਦ, ਬੁਖਾਰ)..."
              }
              placeholderTextColor="#94a3b8"
              multiline
              maxLength={200}
              editable={!isLoading}
              onSubmitEditing={handleSendMessage}
            />
          </View>
          
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            style={[
              styles.sendButton, 
              (!inputValue.trim() || isLoading) && styles.sendButtonDisabled
            ]}
          >
            <Text style={styles.sendIcon}>{isLoading ? '⏳' : '➤'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.disclaimer}>
          {BOT_RESPONSES[language].disclaimer}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  chatWindow: {
    flex: 1,
    backgroundColor: '#f0f9f4',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#10b981',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  status: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  online: {
    color: '#d1fae5',
  },
  offline: {
    color: '#fecaca',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownContainer: {
    position: 'relative',
    marginRight: 8,
  },
  dropdownTrigger: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  dropdownTriggerText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  dropdownItemActive: {
    backgroundColor: '#10b981',
  },
  dropdownItemText: {
    fontSize: 12,
    color: '#1f2937',
    fontWeight: '500',
  },
  iconButton: {
    padding: 10,
    marginLeft: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconText: {
    fontSize: 16,
    color: '#fff',
  },
  chatMessages: {
    flex: 1,
    paddingBottom: 8,
  },
  chatMessagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  botContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    padding: 14,
    borderRadius: 18,
    maxWidth: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: '#10b981',
    borderBottomRightRadius: 6,
  },
  botBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1f2937',
  },
  messageHeading: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1f2937',
  },
  messageBullet: {
    fontSize: 14,
    marginVertical: 2,
    lineHeight: 20,
    color: '#1f2937',
  },
  emergencyText: {
    fontSize: 14,
    color: '#b91c1c',
    fontWeight: '700',
    marginVertical: 4,
  },
  lineBreak: {
    height: 8,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
  },
  userTimestamp: {
    color: '#d1fae5',
  },
  botTimestamp: {
    color: '#94a3b8',
    marginLeft: 8,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    fontStyle: 'italic',
    color: '#6b7280',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  inputWrapper: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#d1fae5',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textInput: {
    fontSize: 15,
    maxHeight: 100,
    color: '#1f2937',
    padding: 0,
    margin: 0,
  },
  sendButton: {
    backgroundColor: '#10b981',
    borderRadius: 24,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: '#d1fae5',
    opacity: 0.5,
  },
  sendIcon: {
    fontSize: 18,
    color: '#fff',
  },
  disclaimer: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    padding: 8,
    paddingBottom: 16,
  },
  chatToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  toggleInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleIcon: {
    fontSize: 20,
    marginRight: 8,
    color: '#10b981',
  },
  toggleText: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: 'bold',
  },
});

export default SymptomsAPIChatBot;