import {
    Activity,
    Calendar,
    Clock,
    Download,
    Droplet,
    Edit3,
    FileText,
    Filter,
    Heart,
    Pill,
    Plus,
    Search,
    Share2,
    Stethoscope,
    Thermometer,
    User
} from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
    Dimensions,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Updated Colorful Theme with better contrast
const THEME = {
    primary: '#2563EB',      // Blue instead of green
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

// Types (unchanged)
interface HealthRecord {
    id: string;
    type: 'consultation' | 'lab' | 'prescription' | 'vaccination' | 'surgery';
    title: string;
    doctor: string;
    date: string;
    time?: string;
    status: 'completed' | 'active' | 'pending' | 'cancelled';
    notes?: string;
    priority?: 'routine' | 'important' | 'urgent';
}

interface Medication {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate: string;
    doctor: string;
    status: 'active' | 'completed' | 'discontinued';
}

interface Vital {
    id: string;
    type: 'blood_pressure' | 'heart_rate' | 'temperature' | 'oxygen';
    value: string;
    unit: string;
    date: string;
    time: string;
    status: 'normal' | 'low' | 'high' | 'critical';
}

// Enhanced Mock Data (unchanged)
const healthRecordsData = {
    recent: [
        {
            id: '1',
            type: 'consultation' as const,
            title: 'General Checkup',
            doctor: 'Dr. Sarah Johnson',
            date: '2024-01-15',
            time: '10:30 AM',
            status: 'completed' as const,
            notes: 'Routine annual checkup. All vitals normal. Blood pressure 120/80, heart rate 72 bpm.',
            priority: 'routine' as const
        },
        {
            id: '2',
            type: 'lab' as const,
            title: 'Blood Test Results',
            doctor: 'LabCorp Diagnostics',
            date: '2024-01-10',
            time: '09:00 AM',
            status: 'completed' as const,
            notes: 'Complete blood count and lipid profile. All parameters within normal range.',
            priority: 'important' as const
        },
        {
            id: '3',
            type: 'prescription' as const,
            title: 'Medication Renewal',
            doctor: 'Dr. Michael Chen',
            date: '2024-01-08',
            time: '02:15 PM',
            status: 'active' as const,
            notes: 'Vitamin D supplements - 3 months. Take one tablet daily with food.',
            priority: 'routine' as const
        }
    ] as HealthRecord[],
    medicalHistory: [
        {
            id: '4',
            type: 'vaccination' as const,
            title: 'Flu Vaccination',
            doctor: 'Community Health Center',
            date: '2023-12-15',
            status: 'completed' as const,
            notes: 'Seasonal influenza vaccine administered. No adverse reactions reported.'
        },
        {
            id: '5',
            type: 'surgery' as const,
            title: 'Appendectomy',
            doctor: 'Dr. Robert Wilson',
            date: '2022-08-20',
            status: 'completed' as const,
            notes: 'Emergency appendectomy surgery. Recovery period: 6 weeks.'
        },
        {
            id: '6',
            type: 'consultation' as const,
            title: 'Dermatology Consultation',
            doctor: 'Dr. Emily Davis',
            date: '2023-11-05',
            status: 'completed' as const,
            notes: 'Skin allergy treatment prescribed. Follow-up in 3 months.'
        }
    ] as HealthRecord[],
    medications: [
        {
            id: '7',
            name: 'Atorvastatin',
            dosage: '20mg',
            frequency: 'Once daily',
            startDate: '2024-01-01',
            endDate: '2024-06-01',
            doctor: 'Dr. Sarah Johnson',
            status: 'active' as const
        },
        {
            id: '8',
            name: 'Vitamin D3',
            dosage: '1000 IU',
            frequency: 'Once daily',
            startDate: '2024-01-08',
            endDate: '2024-04-08',
            doctor: 'Dr. Michael Chen',
            status: 'active' as const
        },
        {
            id: '9',
            name: 'Metformin',
            dosage: '500mg',
            frequency: 'Twice daily',
            startDate: '2023-11-15',
            endDate: '2024-05-15',
            doctor: 'Dr. Emily Davis',
            status: 'active' as const
        }
    ] as Medication[],
    vitals: [
        {
            id: '10',
            type: 'blood_pressure' as const,
            value: '120/80',
            unit: 'mmHg',
            date: '2024-01-15',
            time: '10:30 AM',
            status: 'normal' as const
        },
        {
            id: '11',
            type: 'heart_rate' as const,
            value: '72',
            unit: 'bpm',
            date: '2024-01-15',
            time: '10:30 AM',
            status: 'normal' as const
        },
        {
            id: '12',
            type: 'temperature' as const,
            value: '98.6',
            unit: '°F',
            date: '2024-01-15',
            time: '10:30 AM',
            status: 'normal' as const
        },
        {
            id: '13',
            type: 'oxygen' as const,
            value: '98',
            unit: '%',
            date: '2024-01-15',
            time: '10:30 AM',
            status: 'normal' as const
        }
    ] as Vital[]
};

const recordTypeConfig = {
    consultation: { icon: Stethoscope, color: THEME.category.consultation, label: 'Consultation' },
    lab: { icon: FileText, color: THEME.category.lab, label: 'Lab Test' },
    prescription: { icon: Pill, color: THEME.category.prescription, label: 'Prescription' },
    vaccination: { icon: Activity, color: THEME.category.vaccination, label: 'Vaccination' },
    surgery: { icon: Heart, color: THEME.category.surgery, label: 'Surgery' }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'completed': return '✅';
        case 'active': return '🟢';
        case 'pending': return '🟡';
        case 'cancelled': return '❌';
        default: return '📋';
    }
};

export default function HealthRecords() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [activeTab, setActiveTab] = useState('all');
    const [addRecordModal, setAddRecordModal] = useState(false);

    const tabs = useMemo(() => [
        { id: 'all', label: 'All Records', icon: '📋', count: healthRecordsData.recent.length + healthRecordsData.medicalHistory.length, color: THEME.primary },
        { id: 'medical', label: 'Medical History', icon: '🏥', count: healthRecordsData.medicalHistory.length, color: THEME.category.consultation },
        { id: 'medications', label: 'Medications', icon: '💊', count: healthRecordsData.medications.length, color: THEME.category.prescription },
        { id: 'vitals', label: 'Vitals', icon: '❤️', count: healthRecordsData.vitals.length, color: THEME.category.surgery }
    ], []);

    const filters = useMemo(() => [
        { id: 'all', label: 'All Records', count: healthRecordsData.recent.length, color: THEME.primary },
        { id: 'consultation', label: 'Consultations', count: healthRecordsData.recent.filter(r => r.type === 'consultation').length, color: THEME.category.consultation },
        { id: 'lab', label: 'Lab Tests', count: healthRecordsData.recent.filter(r => r.type === 'lab').length, color: THEME.category.lab },
        { id: 'prescription', label: 'Prescriptions', count: healthRecordsData.recent.filter(r => r.type === 'prescription').length, color: THEME.category.prescription },
        { id: 'vaccination', label: 'Vaccinations', count: healthRecordsData.medicalHistory.filter(r => r.type === 'vaccination').length, color: THEME.category.vaccination }
    ], []);

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'completed': return THEME.status.success;
            case 'active': return THEME.status.info;
            case 'pending': return THEME.status.warning;
            case 'cancelled': return THEME.status.error;
            case 'normal': return THEME.status.normal;
            case 'high': return THEME.status.warning;
            case 'low': return THEME.status.warning;
            case 'critical': return THEME.status.error;
            default: return THEME.text.tertiary;
        }
    };

    const getVitalIcon = (type: string) => {
        switch (type) {
            case 'blood_pressure': return <Droplet size={16} color={THEME.category.surgery} />;
            case 'heart_rate': return <Heart size={16} color={THEME.category.surgery} />;
            case 'temperature': return <Thermometer size={16} color={THEME.category.vaccination} />;
            case 'oxygen': return <Activity size={16} color={THEME.category.prescription} />;
            default: return <Activity size={16} color={THEME.primary} />;
        }
    };

    const renderRecordCard = (item: HealthRecord, showType = false) => {
        const TypeIcon = recordTypeConfig[item.type].icon;
        const typeConfig = recordTypeConfig[item.type];
        
        return (
            <View key={item.id} style={styles.recordCard}>
                <View style={styles.cardHeader}>
                    <View style={styles.cardTitleSection}>
                        <View style={styles.typeHeader}>
                            <View style={[styles.typeIndicator, { backgroundColor: `${typeConfig.color}15` }]}>
                                <TypeIcon size={14} color={typeConfig.color} />
                            </View>
                            {showType && (
                                <Text style={[styles.typeLabel, { color: typeConfig.color }]}>
                                    {typeConfig.label}
                                </Text>
                            )}
                        </View>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text style={styles.cardSubtitle}>with {item.doctor}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}15` }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                            {getStatusIcon(item.status)} {item.status}
                        </Text>
                    </View>
                </View>
                
                <View style={styles.cardDetails}>
                    <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                            <Calendar size={12} color={THEME.text.tertiary} />
                            <Text style={styles.detailText}>{item.date}</Text>
                        </View>
                        {item.time && (
                            <View style={styles.detailItem}>
                                <Clock size={12} color={THEME.text.tertiary} />
                                <Text style={styles.detailText}>{item.time}</Text>
                            </View>
                        )}
                    </View>
                    
                    {item.priority && (
                        <View style={[styles.priorityBadge, { 
                            backgroundColor: item.priority === 'urgent' ? `${THEME.status.error}15` : 
                                           item.priority === 'important' ? `${THEME.status.warning}15` : `${THEME.primary}15`,
                            borderColor: item.priority === 'urgent' ? THEME.status.error : 
                                       item.priority === 'important' ? THEME.status.warning : THEME.primary
                        }]}>
                            <Text style={[styles.priorityText, { 
                                color: item.priority === 'urgent' ? THEME.status.error : 
                                     item.priority === 'important' ? THEME.status.warning : THEME.primary
                            }]}>
                                {item.priority.toUpperCase()}
                            </Text>
                        </View>
                    )}
                </View>
                
                {item.notes && (
                    <View style={styles.notesSection}>
                        <Text style={styles.notesLabel}>Notes:</Text>
                        <Text style={styles.notesText} numberOfLines={2}>{item.notes}</Text>
                    </View>
                )}
                
                <View style={styles.cardActions}>
                    <TouchableOpacity style={[styles.actionButton, { backgroundColor: `${THEME.primary}10` }]}>
                        <Download size={14} color={THEME.primary} />
                        <Text style={[styles.actionText, { color: THEME.primary }]}>Download</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, { backgroundColor: `${THEME.accent}10` }]}>
                        <Share2 size={14} color={THEME.accent} />
                        <Text style={[styles.actionText, { color: THEME.accent }]}>Share</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, { backgroundColor: `${THEME.status.warning}10` }]}>
                        <Edit3 size={14} color={THEME.status.warning} />
                        <Text style={[styles.actionText, { color: THEME.status.warning }]}>Edit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderMedicationCard = (med: Medication) => (
        <View key={med.id} style={styles.medicationCard}>
            <View style={styles.medHeader}>
                <View style={styles.medInfo}>
                    <View style={[styles.medIcon, { backgroundColor: `${THEME.category.prescription}15` }]}>
                        <Pill size={16} color={THEME.category.prescription} />
                    </View>
                    <Text style={styles.medName}>{med.name}</Text>
                </View>
                <View style={[styles.medStatus, { backgroundColor: `${getStatusColor(med.status)}15` }]}>
                    <Text style={[styles.medStatusText, { color: getStatusColor(med.status) }]}>
                        {med.status.toUpperCase()}
                    </Text>
                </View>
            </View>
            
            <View style={styles.medDetails}>
                <Text style={styles.medDosage}>{med.dosage} • {med.frequency}</Text>
                <View style={styles.medDoctor}>
                    <User size={12} color={THEME.text.tertiary} />
                    <Text style={styles.medDoctorText}>Prescribed by {med.doctor}</Text>
                </View>
            </View>
            
            <View style={styles.medDates}>
                <View style={styles.dateItem}>
                    <Text style={styles.dateLabel}>Start:</Text>
                    <Text style={styles.dateValue}>{med.startDate}</Text>
                </View>
                <View style={styles.dateItem}>
                    <Text style={styles.dateLabel}>End:</Text>
                    <Text style={styles.dateValue}>{med.endDate}</Text>
                </View>
            </View>
        </View>
    );

    const renderVitalCard = (vital: Vital) => (
        <View key={vital.id} style={styles.vitalCard}>
            <View style={styles.vitalHeader}>
                <View style={[styles.vitalIcon, { backgroundColor: `${getVitalColor(vital.type)}15` }]}>
                    {getVitalIcon(vital.type)}
                </View>
                <Text style={styles.vitalType}>
                    {vital.type.replace('_', ' ').toUpperCase()}
                </Text>
            </View>
            <Text style={styles.vitalValue}>{vital.value} <Text style={styles.vitalUnit}>{vital.unit}</Text></Text>
            <View style={styles.vitalDetails}>
                <View style={styles.vitalTime}>
                    <Clock size={10} color={THEME.text.light} />
                    <Text style={styles.vitalDate}>{vital.date} • {vital.time}</Text>
                </View>
                <View style={[styles.vitalStatus, { backgroundColor: `${getStatusColor(vital.status)}15` }]}>
                    <Text style={[styles.vitalStatusText, { color: getStatusColor(vital.status) }]}>
                        {vital.status.toUpperCase()}
                    </Text>
                </View>
            </View>
        </View>
    );

    const getVitalColor = (type: string) => {
        switch (type) {
            case 'blood_pressure': return THEME.category.surgery;
            case 'heart_rate': return THEME.category.surgery;
            case 'temperature': return THEME.category.vaccination;
            case 'oxygen': return THEME.category.prescription;
            default: return THEME.primary;
        }
    };

    const filteredRecords = useMemo(() => {
        let records = [...healthRecordsData.recent, ...healthRecordsData.medicalHistory];
        
        if (selectedFilter !== 'all') {
            records = records.filter(record => record.type === selectedFilter);
        }
        
        if (searchQuery) {
            records = records.filter(record => 
                record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                record.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                record.notes?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        return records;
    }, [selectedFilter, searchQuery]);

    const getCurrentData = () => {
        switch (activeTab) {
            case 'medical':
                return healthRecordsData.medicalHistory;
            case 'medications':
                return healthRecordsData.medications;
            case 'vitals':
                return healthRecordsData.vitals;
            default:
                return filteredRecords;
        }
    };

    const renderContent = () => {
        const data = getCurrentData();
        
        if (data.length === 0) {
            return (
                <View style={styles.emptyState}>
                    <View style={styles.emptyStateIconContainer}>
                        <Text style={styles.emptyStateIcon}>📋</Text>
                    </View>
                    <Text style={styles.emptyStateTitle}>No Records Found</Text>
                    <Text style={styles.emptyStateText}>
                        {searchQuery ? 'Try adjusting your search terms' : 'Your records will appear here once added.'}
                    </Text>
                </View>
            );
        }

        switch (activeTab) {
            case 'medications':
                return (
                    <ScrollView 
                        style={styles.medicationsContainer}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.medicationsContent}
                    >
                        {data.map((item: any) => renderMedicationCard(item))}
                    </ScrollView>
                );
            case 'vitals':
                return (
                    <ScrollView 
                        style={styles.vitalsContainer}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.vitalsContent}
                    >
                        <View style={styles.vitalsGrid}>
                            {data.map((item: any) => renderVitalCard(item))}
                        </View>
                    </ScrollView>
                );
            default:
                return (
                    <ScrollView 
                        style={styles.recordsContainer}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.recordsContent}
                    >
                        {data.map((item: any) => renderRecordCard(item, activeTab === 'all'))}
                    </ScrollView>
                );
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={THEME.background} />
            
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Health Records</Text>
                    <Text style={styles.headerSubtitle}>Your complete medical history</Text>
                </View>
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => setAddRecordModal(true)}
                >
                    <Plus size={20} color={THEME.surface} />
                </TouchableOpacity>
            </View>

            {/* Search and Filter Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Search size={16} color={THEME.text.tertiary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search records, doctors, notes..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor={THEME.text.light}
                    />
                </View>
                <TouchableOpacity 
                    style={styles.filterButton}
                    onPress={() => setFilterModalVisible(true)}
                >
                    <Filter size={16} color={THEME.primary} />
                    {selectedFilter !== 'all' && <View style={styles.filterBadge} />}
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.id}
                        style={[
                            styles.tab, 
                            activeTab === tab.id && styles.activeTab,
                            { borderColor: tab.color }
                        ]}
                        onPress={() => setActiveTab(tab.id)}
                    >
                        <Text style={styles.tabIcon}>{tab.icon}</Text>
                        <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                            {tab.label}
                        </Text>
                        <View style={[
                            styles.tabCount, 
                            activeTab === tab.id && styles.activeTabCount,
                            { backgroundColor: activeTab === tab.id ? 'rgba(255,255,255,0.3)' : `${tab.color}15` }
                        ]}>
                            <Text style={[
                                styles.tabCountText,
                                { color: activeTab === tab.id ? THEME.surface : tab.color }
                            ]}>
                                {tab.count}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Content Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        {activeTab === 'all' ? 'All Medical Records' :
                         activeTab === 'medical' ? 'Medical History' :
                         activeTab === 'medications' ? 'Current Medications' : 'Vital Signs'}
                    </Text>
                    <Text style={styles.sectionCount}>
                        {getCurrentData().length} {getCurrentData().length === 1 ? 'record' : 'records'}
                    </Text>
                </View>
                
                {/* Scrollable Content Area */}
                <View style={styles.contentArea}>
                    {renderContent()}
                </View>
            </View>

            {/* Filter Modal */}
            <Modal
                visible={filterModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setFilterModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Filter Records</Text>
                            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                                <Text style={styles.modalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <ScrollView style={styles.filterOptionsContainer}>
                            {filters.map((filter) => (
                                <TouchableOpacity
                                    key={filter.id}
                                    style={[
                                        styles.filterOption,
                                        selectedFilter === filter.id && styles.filterOptionSelected,
                                        { borderColor: filter.color }
                                    ]}
                                    onPress={() => setSelectedFilter(filter.id)}
                                >
                                    <View style={[styles.filterColorIndicator, { backgroundColor: filter.color }]} />
                                    <Text style={[
                                        styles.filterOptionText,
                                        selectedFilter === filter.id && styles.filterOptionTextSelected
                                    ]}>
                                        {filter.label}
                                    </Text>
                                    <View style={[styles.filterCount, { backgroundColor: `${filter.color}15` }]}>
                                        <Text style={[styles.filterCountText, { color: filter.color }]}>
                                            {filter.count}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <View style={styles.modalActions}>
                            <TouchableOpacity 
                                style={styles.modalButtonSecondary}
                                onPress={() => {
                                    setSelectedFilter('all');
                                    setFilterModalVisible(false);
                                }}
                            >
                                <Text style={styles.modalButtonTextSecondary}>Reset</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.modalButtonPrimary}
                                onPress={() => setFilterModalVisible(false)}
                            >
                                <Text style={styles.modalButtonTextPrimary}>Apply Filters</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Add Record Modal */}
            <Modal
                visible={addRecordModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setAddRecordModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add New Record</Text>
                            <TouchableOpacity onPress={() => setAddRecordModal(false)}>
                                <Text style={styles.modalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.comingSoonContainer}>
                            <Text style={styles.comingSoonText}>
                                📋 Record Management Coming Soon
                            </Text>
                            <Text style={styles.comingSoonSubtext}>
                                You'll be able to add new health records, upload documents, and track your medical history.
                            </Text>
                        </View>

                        <TouchableOpacity 
                            style={styles.modalButtonPrimary}
                            onPress={() => setAddRecordModal(false)}
                        >
                            <Text style={styles.modalButtonTextPrimary}>Got it!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 50 : 30,
        paddingBottom: 12,
        backgroundColor: THEME.surface,
        borderBottomWidth: 1,
        borderBottomColor: THEME.border,
        shadowColor: THEME.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    headerContent: {
        flex: 1,
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
    addButton: {
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
    searchContainer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: THEME.surface,
        borderBottomWidth: 1,
        borderBottomColor: THEME.border,
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: THEME.background,
        borderRadius: 12,
        paddingHorizontal: 12,
        marginRight: 12,
        borderWidth: 1,
        borderColor: THEME.border,
        shadowColor: THEME.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 8,
        fontSize: 14,
        color: THEME.text.primary,
        fontWeight: '500',
    },
    filterButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: THEME.background,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: THEME.border,
        position: 'relative',
        shadowColor: THEME.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    filterBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: THEME.primary,
    },
    tabsContainer: {
        backgroundColor: THEME.surface,
        borderBottomWidth: 1,
        borderBottomColor: THEME.border,
        paddingHorizontal: 16,
        paddingVertical: 12,
        maxHeight: 56,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 8,
        borderRadius: 16,
        backgroundColor: THEME.background,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    activeTab: {
        backgroundColor: THEME.primary,
        borderColor: THEME.primary,
    },
    tabIcon: {
        fontSize: 14,
        marginRight: 6,
    },
    tabText: {
        fontSize: 12,
        fontWeight: '600',
        color: THEME.text.tertiary,
        marginRight: 6,
    },
    activeTabText: {
        color: THEME.surface,
    },
    tabCount: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    activeTabCount: {
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    tabCountText: {
        fontSize: 10,
        fontWeight: '700',
    },
    
    // Section Styles
    section: {
        flex: 1,
        padding: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: THEME.text.primary,
    },
    sectionCount: {
        fontSize: 12,
        color: THEME.text.tertiary,
        fontWeight: '600',
    },
    
    // Content Area
    contentArea: {
        flex: 1,
    },
    
    // Scrollable Containers
    recordsContainer: {
        flex: 1,
    },
    recordsContent: {
        gap: 12,
        paddingBottom: 20,
    },
    medicationsContainer: {
        flex: 1,
    },
    medicationsContent: {
        gap: 12,
        paddingBottom: 20,
    },
    vitalsContainer: {
        flex: 1,
    },
    vitalsContent: {
        paddingBottom: 20,
    },
    
    // Record Card Styles
    recordCard: {
        backgroundColor: THEME.surface,
        borderRadius: 16,
        padding: 16,
        shadowColor: THEME.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: THEME.border,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    cardTitleSection: {
        flex: 1,
        marginRight: 8,
    },
    typeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    typeIndicator: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 6,
    },
    typeLabel: {
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: THEME.text.primary,
        marginBottom: 2,
    },
    cardSubtitle: {
        fontSize: 12,
        color: THEME.text.secondary,
        fontWeight: '500',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        minWidth: 70,
        alignItems: 'center',
        borderWidth: 1,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    cardDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    detailText: {
        fontSize: 11,
        color: THEME.text.tertiary,
        fontWeight: '500',
    },
    priorityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        borderWidth: 1,
    },
    priorityText: {
        fontSize: 9,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    notesSection: {
        marginBottom: 12,
        padding: 10,
        backgroundColor: THEME.background,
        borderRadius: 10,
        borderLeftWidth: 3,
        borderLeftColor: THEME.primary,
    },
    notesLabel: {
        fontSize: 10,
        color: THEME.text.secondary,
        fontWeight: '600',
        marginBottom: 2,
    },
    notesText: {
        fontSize: 11,
        color: THEME.text.secondary,
        lineHeight: 16,
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: THEME.border,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    actionText: {
        fontSize: 11,
        fontWeight: '600',
    },
    
    // Medication Card Styles
    medicationCard: {
        backgroundColor: THEME.surface,
        borderRadius: 16,
        padding: 16,
        shadowColor: THEME.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: THEME.border,
    },
    medHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    medInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    medIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    medName: {
        fontSize: 16,
        fontWeight: '700',
        color: THEME.text.primary,
        flex: 1,
    },
    medStatus: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        borderWidth: 1,
    },
    medStatusText: {
        fontSize: 9,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    medDetails: {
        marginBottom: 12,
        gap: 6,
    },
    medDosage: {
        fontSize: 14,
        color: THEME.text.secondary,
        fontWeight: '600',
    },
    medDoctor: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    medDoctorText: {
        fontSize: 12,
        color: THEME.text.tertiary,
    },
    medDates: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    dateItem: {
        flex: 1,
        backgroundColor: THEME.background,
        padding: 8,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: THEME.border,
    },
    dateLabel: {
        fontSize: 9,
        color: THEME.text.tertiary,
        fontWeight: '600',
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    dateValue: {
        fontSize: 11,
        color: THEME.text.primary,
        fontWeight: '600',
    },
    
    // Vital Card Styles
    vitalCard: {
        width: (screenWidth - 40) / 2,
        backgroundColor: THEME.surface,
        borderRadius: 12,
        padding: 12,
        shadowColor: THEME.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: THEME.border,
        marginBottom: 12,
    },
    vitalsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    vitalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 6,
    },
    vitalIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    vitalType: {
        fontSize: 9,
        color: THEME.text.secondary,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    vitalValue: {
        fontSize: 20,
        fontWeight: '800',
        color: THEME.text.primary,
        marginBottom: 6,
    },
    vitalUnit: {
        fontSize: 12,
        color: THEME.text.tertiary,
        fontWeight: '600',
    },
    vitalDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    vitalTime: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        flex: 1,
    },
    vitalDate: {
        fontSize: 10,
        color: THEME.text.light,
    },
    vitalStatus: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        marginLeft: 4,
        borderWidth: 1,
    },
    vitalStatusText: {
        fontSize: 8,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    
    // Empty State Styles
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        gap: 12,
    },
    emptyStateIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: THEME.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    emptyStateIcon: {
        fontSize: 30,
    },
    emptyStateTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: THEME.text.primary,
    },
    emptyStateText: {
        fontSize: 12,
        color: THEME.text.secondary,
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 16,
    },
    
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modalContent: {
        width: '100%',
        backgroundColor: THEME.surface,
        borderRadius: 16,
        padding: 16,
        maxHeight: '80%',
        shadowColor: THEME.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: THEME.text.primary,
    },
    modalClose: {
        fontSize: 20,
        color: THEME.text.tertiary,
        fontWeight: '600',
    },
    filterOptionsContainer: {
        maxHeight: 300,
    },
    filterOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 10,
        backgroundColor: THEME.background,
        marginBottom: 6,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    filterOptionSelected: {
        backgroundColor: `${THEME.primary}08`,
        borderColor: THEME.primary,
    },
    filterColorIndicator: {
        width: 4,
        height: 20,
        borderRadius: 2,
        marginRight: 8,
    },
    filterOptionText: {
        fontSize: 14,
        color: THEME.text.primary,
        fontWeight: '600',
        flex: 1,
    },
    filterOptionTextSelected: {
        color: THEME.primary,
    },
    filterCount: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        marginLeft: 6,
    },
    filterCountText: {
        fontSize: 11,
        fontWeight: '700',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
        marginTop: 16,
    },
    modalButtonPrimary: {
        backgroundColor: THEME.primary,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: THEME.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    modalButtonTextPrimary: {
        color: THEME.surface,
        fontWeight: '700',
        fontSize: 14,
    },
    modalButtonSecondary: {
        backgroundColor: THEME.background,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: THEME.border,
    },
    modalButtonTextSecondary: {
        color: THEME.primary,
        fontWeight: '700',
        fontSize: 14,
    },
    comingSoonContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    comingSoonText: {
        fontSize: 16,
        fontWeight: '700',
        color: THEME.text.primary,
        textAlign: 'center',
        marginBottom: 8,
    },
    comingSoonSubtext: {
        fontSize: 12,
        color: THEME.text.secondary,
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 16,
    },
});