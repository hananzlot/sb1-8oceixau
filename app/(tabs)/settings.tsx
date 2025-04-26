import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TextInput, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import Header from '@/components/Header';
import { Sliders, Moon, Battery, BellRing, Upload, ArrowRight, Info } from 'lucide-react-native';
import { useAppContext } from '@/context/AppContext';

export default function SettingsScreen() {
  const { colors } = useColorScheme();
  const { syncWithSheets, isSyncing } = useAppContext();
  
  // Settings state
  const [darkMode, setDarkMode] = useState<'system' | 'always' | 'never'>('system');
  const [scanInterval, setScanInterval] = useState(30);
  const [batteryOptimization, setBatteryOptimization] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [bluetoothAutoConnect, setBluetoothAutoConnect] = useState(true);
  
  // Google Sheets config
  const [sheetsEnabled, setSheetsEnabled] = useState(true);
  const [sheetId, setSheetId] = useState('');
  const [syncInterval, setSyncInterval] = useState(15);
  
  // Handle Google Sheets setup
  const handleSheetsSetup = () => {
    // In a real app, this would open OAuth flow or API key setup
    Alert.alert(
      'Google Sheets Setup',
      'This would launch the Google authentication process in a real app.',
      [{ text: 'OK' }]
    );
  };
  
  // Handle manual sync
  const handleManualSync = async () => {
    try {
      await syncWithSheets();
      Alert.alert('Success', 'Data synchronized with Google Sheets');
    } catch (error) {
      Alert.alert('Error', 'Failed to synchronize data');
    }
  };
  
  // Render settings section
  const renderSection = (title: string, icon: React.ReactNode, children: React.ReactNode) => (
    <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          {icon}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {title}
          </Text>
        </View>
      </View>
      {children}
    </View>
  );
  
  // Render settings row with switch
  const renderSwitchRow = (
    label: string, 
    value: boolean, 
    onValueChange: (value: boolean) => void,
    description?: string
  ) => (
    <View style={[styles.settingsRow, { borderBottomColor: colors.border }]}>
      <View style={styles.settingsLabelContainer}>
        <Text style={[styles.settingsLabel, { color: colors.text }]}>
          {label}
        </Text>
        {description && (
          <Text style={[styles.settingsDescription, { color: colors.secondaryText }]}>
            {description}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.lightGray, true: colors.primary }}
        thumbColor={Platform.OS === 'ios' ? undefined : 'white'}
        ios_backgroundColor={colors.lightGray}
      />
    </View>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Settings" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* App Appearance */}
        {renderSection('Appearance', <Moon size={22} color={colors.primary} />, (
          <>
            <TouchableOpacity
              style={[styles.settingsRow, { borderBottomColor: colors.border }]}
              onPress={() => setDarkMode('system')}
            >
              <Text style={[styles.settingsLabel, { color: colors.text }]}>
                Dark Mode
              </Text>
              <View style={styles.pickerOption}>
                <Text style={[styles.pickerValue, { color: colors.primary }]}>
                  {darkMode === 'system' ? 'System' : darkMode === 'always' ? 'Always' : 'Never'}
                </Text>
                <ArrowRight size={16} color={colors.primary} />
              </View>
            </TouchableOpacity>
          </>
        ))}
        
        {/* Bluetooth & Scanning */}
        {renderSection('Bluetooth & Scanning', <Sliders size={22} color={colors.primary} />, (
          <>
            <View style={[styles.settingsRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.settingsLabel, { color: colors.text }]}>
                Scan Interval
              </Text>
              <View style={styles.pickerOption}>
                <Text style={[styles.pickerValue, { color: colors.primary }]}>
                  {scanInterval} seconds
                </Text>
                <ArrowRight size={16} color={colors.primary} />
              </View>
            </View>
            
            {renderSwitchRow(
              'Auto-Connect to Devices',
              bluetoothAutoConnect,
              setBluetoothAutoConnect,
              'Automatically connect to known devices when in range'
            )}
          </>
        ))}
        
        {/* Power & Battery */}
        {renderSection('Power & Battery', <Battery size={22} color={colors.primary} />, (
          <>
            {renderSwitchRow(
              'Battery Optimization',
              batteryOptimization,
              setBatteryOptimization,
              'Reduce scanning frequency when battery is low'
            )}
          </>
        ))}
        
        {/* Notifications */}
        {renderSection('Notifications', <BellRing size={22} color={colors.primary} />, (
          <>
            {renderSwitchRow(
              'Enable Notifications',
              notificationsEnabled,
              setNotificationsEnabled
            )}
            
            {renderSwitchRow(
              'Haptic Feedback',
              hapticFeedback,
              setHapticFeedback,
              'Vibrate when devices are detected'
            )}
          </>
        ))}
        
        {/* Google Sheets Integration */}
        {renderSection('Google Sheets', <Upload size={22} color={colors.primary} />, (
          <>
            {renderSwitchRow(
              'Sync with Google Sheets',
              sheetsEnabled,
              setSheetsEnabled
            )}
            
            {sheetsEnabled && (
              <>
                <View style={[styles.settingsRow, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.settingsLabel, { color: colors.text }]}>
                    Sheet ID
                  </Text>
                  <TextInput
                    style={[styles.textInput, { color: colors.text, borderColor: colors.border }]}
                    value={sheetId}
                    onChangeText={setSheetId}
                    placeholder="Enter Sheet ID"
                    placeholderTextColor={colors.secondaryText}
                  />
                </View>
                
                <View style={[styles.settingsRow, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.settingsLabel, { color: colors.text }]}>
                    Sync Interval
                  </Text>
                  <View style={styles.pickerOption}>
                    <Text style={[styles.pickerValue, { color: colors.primary }]}>
                      {syncInterval} mins
                    </Text>
                    <ArrowRight size={16} color={colors.primary} />
                  </View>
                </View>
                
                <View style={styles.sheetsButtons}>
                  <TouchableOpacity
                    style={[styles.setupButton, { backgroundColor: colors.primary }]}
                    onPress={handleSheetsSetup}
                  >
                    <Text style={styles.buttonText}>Setup Google Sheets</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.syncButton, { backgroundColor: colors.secondary }]}
                    onPress={handleManualSync}
                    disabled={isSyncing}
                  >
                    <Text style={styles.buttonText}>
                      {isSyncing ? 'Syncing...' : 'Sync Now'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </>
        ))}
        
        {/* About */}
        {renderSection('About', <Info size={22} color={colors.primary} />, (
          <View style={styles.aboutContainer}>
            <Text style={[styles.aboutTitle, { color: colors.text }]}>
              Beacon Tracker Pro
            </Text>
            <Text style={[styles.aboutVersion, { color: colors.secondaryText }]}>
              Version 1.0.0
            </Text>
            <Text style={[styles.aboutCopyright, { color: colors.secondaryText }]}>
              © 2025 StackBlitz, Inc.
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'SFProDisplay-SemiBold',
    marginLeft: 10,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingsLabelContainer: {
    flex: 1,
  },
  settingsLabel: {
    fontSize: 16,
    fontFamily: 'SFProText-Regular',
  },
  settingsDescription: {
    fontSize: 12,
    fontFamily: 'SFProText-Regular',
    marginTop: 2,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerValue: {
    fontSize: 16,
    fontFamily: 'SFProText-Regular',
    marginRight: 6,
  },
  textInput: {
    height: 36,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    width: 150,
    fontSize: 14,
    fontFamily: 'SFProText-Regular',
  },
  sheetsButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  setupButton: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  syncButton: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'SFProText-Medium',
  },
  aboutContainer: {
    padding: 16,
    alignItems: 'center',
  },
  aboutTitle: {
    fontSize: 17,
    fontFamily: 'SFProDisplay-Bold',
    marginBottom: 4,
  },
  aboutVersion: {
    fontSize: 14,
    fontFamily: 'SFProText-Regular',
    marginBottom: 8,
  },
  aboutCopyright: {
    fontSize: 12,
    fontFamily: 'SFProText-Regular',
  },
});