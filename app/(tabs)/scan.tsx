import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { useAppContext } from '@/context/AppContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import Header from '@/components/Header';
import ScanButton from '@/components/ScanButton';
import DeviceNamingModal from '@/components/DeviceNamingModal';
import { BluetoothDevice } from '@/utils/bluetoothUtils';
import { Laptop, Tag, SignalHigh, CircleAlert as AlertCircle } from 'lucide-react-native';
import BluetoothUtils from '@/utils/bluetoothUtils';

export default function ScanScreen() {
  const { 
    isScanning, 
    startScanning, 
    stopScanning,
    namedDevices,
    addNamedDevice,
  } = useAppContext();
  const { colors } = useColorScheme();
  const [foundDevices, setFoundDevices] = useState<BluetoothDevice[]>([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<BluetoothDevice | null>(null);
  const [namingModalVisible, setNamingModalVisible] = useState(false);
  
  useEffect(() => {
    checkBluetooth();
  }, []);
  
  const checkBluetooth = async () => {
    try {
      const available = await BluetoothUtils.isAvailable();
      if (!available) {
        console.log('Bluetooth not available');
        return;
      }
      
      const granted = await BluetoothUtils.requestPermissions();
      setPermissionGranted(granted);
    } catch (error) {
      console.error('Error checking Bluetooth:', error);
    }
  };
  
  const handleDeviceFound = (device: BluetoothDevice) => {
    if (!device) return; // Guard against null devices
    
    setFoundDevices(prev => {
      const exists = prev.some(d => d.id === device.id);
      if (!exists) {
        return [...prev, device];
      }
      return prev;
    });
  };
  
  const toggleScanning = async () => {
    if (isScanning) {
      stopScanning();
      await BluetoothUtils.stopScan();
    } else {
      setFoundDevices([]);
      startScanning();
      try {
        await BluetoothUtils.startScan(handleDeviceFound);
      } catch (error) {
        console.error('Error starting scan:', error);
        stopScanning();
      }
    }
  };
  
  const handleAddDevice = (device: BluetoothDevice) => {
    if (!device) return; // Guard against null devices
    setSelectedDevice(device);
    setNamingModalVisible(true);
  };
  
  const handleSaveName = (name: string) => {
    if (selectedDevice) {
      addNamedDevice(selectedDevice.id, name);
    }
  };
  
  const renderDeviceIcon = (device: BluetoothDevice) => {
    // Safe access to device name with null check
    const name = device?.name ? device.name.toLowerCase() : '';
    
    if (name.includes('macbook') || name.includes('laptop')) {
      return <Laptop size={24} color={colors.primary} />;
    } else if (name.includes('airtag') || name.includes('tag')) {
      return <Tag size={24} color={colors.primary} />;
    } else {
      return <SignalHigh size={24} color={colors.primary} />;
    }
  };
  
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Scan Devices" />
        <View style={styles.centerContainer}>
          <AlertCircle size={48} color={colors.warning} style={styles.webIcon} />
          <Text style={[styles.webTitle, { color: colors.text }]}>
            Bluetooth Not Available
          </Text>
          <Text style={[styles.webText, { color: colors.secondaryText }]}>
            Bluetooth scanning is not supported in web browsers. Please use a mobile device to access this feature.
          </Text>
        </View>
      </View>
    );
  }
  
  if (!permissionGranted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Scan Devices" />
        <View style={styles.centerContainer}>
          <AlertCircle size={48} color={colors.warning} style={styles.webIcon} />
          <Text style={[styles.webTitle, { color: colors.text }]}>
            Bluetooth Permission Required
          </Text>
          <Text style={[styles.webText, { color: colors.secondaryText }]}>
            This app needs Bluetooth permission to scan for nearby devices.
          </Text>
          <TouchableOpacity
            style={[styles.permissionButton, { backgroundColor: colors.primary }]}
            onPress={checkBluetooth}
          >
            <Text style={styles.permissionButtonText}>
              Grant Permission
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Scan Devices" />
      
      <View style={styles.contentContainer}>
        <FlatList
          data={foundDevices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            if (!item) return null; // Guard against null items
            const isNamed = namedDevices.some(d => d.macAddress === item.id);
            
            return (
              <View 
                style={[
                  styles.deviceItem, 
                  { 
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  }
                ]}
              >
                <View style={styles.deviceInfo}>
                  {renderDeviceIcon(item)}
                  <View style={styles.deviceDetails}>
                    <Text style={[styles.deviceName, { color: colors.text }]}>
                      {item.name || `Device ${item.id.substring(12)}`}
                    </Text>
                    <Text style={[styles.deviceId, { color: colors.secondaryText }]}>
                      {item.id}
                    </Text>
                    {item.rssi && (
                      <Text style={[styles.rssi, { color: colors.secondaryText }]}>
                        Signal: {item.rssi} dBm
                      </Text>
                    )}
                  </View>
                </View>
                
                {!isNamed && (
                  <TouchableOpacity
                    style={[
                      styles.addButton,
                      { backgroundColor: colors.primary }
                    ]}
                    onPress={() => handleAddDevice(item)}
                  >
                    <Text style={styles.addButtonText}>Name</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
          contentContainerStyle={styles.deviceList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              {isScanning ? (
                <>
                  <Text style={[styles.emptyTitle, { color: colors.text }]}>
                    Scanning for devices...
                  </Text>
                  <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
                    This may take a few moments
                  </Text>
                </>
              ) : (
                <>
                  <Text style={[styles.emptyTitle, { color: colors.text }]}>
                    No devices found
                  </Text>
                  <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
                    Tap the scan button to search for nearby devices
                  </Text>
                </>
              )}
            </View>
          }
        />
        
        <View style={styles.scanButtonContainer}>
          <ScanButton 
            isScanning={isScanning} 
            onPress={toggleScanning} 
          />
        </View>
      </View>
      
      <DeviceNamingModal
        visible={namingModalVisible}
        onClose={() => {
          setNamingModalVisible(false);
          setSelectedDevice(null);
        }}
        onSave={handleSaveName}
        macAddress={selectedDevice?.id || ''}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  deviceList: {
    padding: 16,
    paddingBottom: 100,
  },
  deviceItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deviceDetails: {
    marginLeft: 12,
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  deviceId: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  rssi: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 16,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  scanButtonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  webIcon: {
    marginBottom: 24,
  },
  webTitle: {
    fontSize: 22,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
    textAlign: 'center',
  },
  webText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  permissionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});