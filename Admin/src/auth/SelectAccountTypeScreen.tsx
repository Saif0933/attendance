import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../../src/navigation/Stack';
import { useTheme } from '../../../src/theme/ThemeContext';

const { width } = Dimensions.get('window');

// 1. Define the Interface for the Props
interface RoleCardProps {
  headerColor: string;
  iconName: string;
  title: string;
  description: string;
  buttonLabel: string;
  onPress: () => void;
}

const SelectAccountTypeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors);

  const handleManagerSelect = () => {
    navigation.navigate('RegisterBusinessScreen');
  };

  const handleEmployeeSelect = () => {
    // Navigate to Employee logic or screen
    console.log("Employee Selected");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Account Type</Text>
        <View style={{ width: 26 }} /> 
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Headings */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>How would you like to continue?</Text>
          <Text style={styles.subtitle}>
            Choose the role that best describes your daily activities in the app.
          </Text>
        </View>

        {/* Manager Card */}
        <RoleCard
          headerColor="#3A5A40"
          iconName="briefcase"
          title="Business / Manager"
          description="Manage your team, approve timesheets, and access detailed productivity reports and analytics."
          buttonLabel="Select Manager"
          onPress={handleManagerSelect}
        />

        {/* Employee Card */}
        <RoleCard
          headerColor="#C49A80"
          iconName="user-alt"
          title="Employee"
          description="Clock in securely with biometrics, view assigned tasks, and track your earnings in real-time."
          buttonLabel="Select Employee"
          onPress={handleEmployeeSelect}
        />

        <View style={{ height: 20 }} />

      </ScrollView>

      {/* Bottom Footer Section */}
      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.continueButtonWrapper} activeOpacity={0.8}>
          <LinearGradient
            colors={[colors.primary, colors.secondary, colors.secondary]}
            style={styles.continueButton}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          By continuing, you agree to our Terms of Service.
        </Text>
      </View>
    </SafeAreaView>
  );
};

// 2. Apply the interface to the component
const RoleCard: React.FC<RoleCardProps> = ({ headerColor, iconName, title, description, buttonLabel, onPress }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  
  return (
    <View style={styles.cardContainer}>
      {/* Card Header (Color Block) */}
      <View style={[styles.cardHeader, { backgroundColor: headerColor }]}>
        
        {/* Floating Icon Badge */}
        <View style={styles.iconBadge}>
          <FontAwesome5 name={iconName} size={20} color={colors.primary} />
        </View>
      </View>

      {/* Card Body */}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
        
        <TouchableOpacity style={styles.selectButton} onPress={onPress}>
          <Text style={styles.selectButtonText}>{buttonLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  backButton: {
    padding: 4, 
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  // Title Section
  titleSection: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  
  // Card Styles
  cardContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    height: 140, 
    width: '100%',
    position: 'relative',
  },
  iconBadge: {
    position: 'absolute',
    bottom: 15,
    left: 20,
    width: 44,
    height: 44,
    backgroundColor: colors.surface,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardBody: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  selectButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  selectButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 13,
  },

  // Footer / Bottom Section
  footerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  continueButtonWrapper: {
    marginBottom: 15,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  continueButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footerText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 12,
  },
});

export default SelectAccountTypeScreen;