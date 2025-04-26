import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated, ScrollView, RefreshControl } from 'react-native';
import { useAppContext } from '@/context/AppContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import Header from '@/components/Header';
import DeviceCard from '@/components/DeviceCard';
import { DeviceType } from '@/types';
import { RefreshCw as Refresh, Info } from 'lucide-react-native';
import { formatDateTime } from '@/utils/dateUtils';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const { 
    devices = [], // Provide default empty array
    geofences = [], // Provide default empty array
    isScanning = false, // Default values for boolean flags
    isSyncing = false,
    lastSyncTime,
    startScanning,
    stopScanning,
    syncWithSheets 
  } = useAppContext() || {}; // Provide default empty object if context is null
  
  const { colors } = useColorScheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [rotateAnim] = useState(new Animated.Value(0));
  
  // Animation for sync button
  const startRotateAnimation = () => {
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0);
    });
  };
  
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  // Handle manual refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    
    try {
      if (!isScanning && startScanning && stopScanning) {
        startScanning();
        setTimeout(() => {
          stopScanning();
        }, 5000);
      }
      
      if (syncWithSheets) {
        await syncWithSheets();
      }
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [isScanning, startScanning, stopScanning, syncWithSheets]);
  
  // Handle device selection
  const handleDevicePress = (device: DeviceType) => {
    if (device?.id) { // Add null check for device
      router.push({
        pathname: '/device/[id]',
        params: { id: device.id }
      });
    }
  };
  
  // Handle sync button press
  const handleSyncPress = async () => {
    if (isSyncing || !syncWithSheets) return;
    
    startRotateAnimation();
    await syncWithSheets();
  };
  
  // Get active geofence count
  const activeGeofenceCount = geofences?.filter(g => g?.active)?.length || 0;
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title="Beacon Tracker" 
        showSettings
      />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Status Section */}
        <View style={[styles.statusContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <Text style={[styles.statusLabel, { color: colors.secondaryText }]}>
                Devices
              </Text>
              <Text style={[styles.statusValue, { color: colors.text }]}>
                {devices?.length || 0}
              </Text>
            </View>
            
            <View style={styles.statusDivider} />
            
            <View style={styles.statusItem}>
              <Text style={[styles.statusLabel, { color: colors.secondaryText }]}>
                Active Geofences
              </Text>
              <Text style={[styles.statusValue, { color: colors.text }]}>
                {activeGeofenceCount}
              </Text>
            </View>
            
            <View style={styles.statusDivider} />
            
            <View style={styles.statusItem}>
              <Text style={[styles.statusLabel, { color: colors.secondaryText }]}>
                Scanning
              </Text>
              <Text 
                style={[
                  styles.statusValue, 
                  { 
                    color: isScanning ? colors.success : colors.secondaryText 
                  }
                ]}
              >
                {isScanning ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
          
          {/* Last sync time */}
          <View style={styles.syncContainer}>
            <Text style={[styles.syncText, { color: colors.secondaryText }]}>
              {lastSyncTime 
                ? `Last synced: ${formatDateTime(lastSyncTime)}` 
                : 'Not synced yet'}
            </Text>
            
            <TouchableOpacity
              onPress={handleSyncPress}
              disabled={isSyncing}
              style={styles.syncButton}
              activeOpacity={0.7}
            >
              <Animated.View style={{ transform: [{ rotate }] }}>
                <Refresh size={20} color={colors.primary} />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Devices Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Tracked Devices
          </Text>
          
          <TouchableOpacity
            onPress={() => router.push('/scan')}
            style={styles.sectionAction}
            activeOpacity={0.7}
          >
            <Text style={[styles.sectionActionText, { color: colors.primary }]}>
              Scan New
            </Text>
          </TouchableOpacity>
        </View>
        
        {devices && devices.length > 0 ? (
          devices.map(device => (
            device && (
              <DeviceCard
                key={device.id}
                device={device}
                onPress={handleDevicePress}
              />
            )
          ))
        ) : (
          <View style={[styles.emptyContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Info size={32} color={colors.secondaryText} style={styles.emptyIcon} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No devices found
            </Text>
            <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
              Tap "Scan New" to start tracking devices
            </Text>
          </View>
        )}
        
        {/* Geofences Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Active Geofences
          </Text>
          
          <TouchableOpacity
            onPress={() => router.push('/map')}
            style={styles.sectionAction}
            activeOpacity={0.7}
          >
            <Text style={[styles.sectionActionText, { color: colors.primary }]}>
              Manage
            </Text>
          </TouchableOpacity>
        </View>
        
        {geofences && geofences.filter(g => g?.active).length > 0 ? (
          geofences.filter(g => g?.active).map(geofence => (
            geofence && (
              <View 
                key={geofence.id}
                style={[styles.geofenceItem, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View 
                  style={[
                    styles.geofenceColor, 
                    { backgroundColor: geofence.color }
                  ]} 
                />
                <Text style={[styles.geofenceName, { color: colors.text }]}>
                  {geofence.name}
                </Text>
                <Text style={[styles.geofenceRadius, { color: colors.secondaryText }]}>
                  {geofence.radius}m
                </Text>
              </View>
            )
          ))
        ) : (
          <View style={[styles.emptyContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Info size={32} color={colors.secondaryText} style={styles.emptyIcon} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No active geofences
            </Text>
            <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
              Tap "Manage" to create geofence areas
            </Text>
          </View>
        )}
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
    paddingBottom: 120,
  },
  statusContainer: {
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
  },
  statusRow: {
    flexDirection: 'row',
    paddingVertical: 16,
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
  },
  statusDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E93',
    opacity: 0.3,
  },
  statusLabel: {
    fontSize: 12,
    fontFamily: 'SFProText-Regular',
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 18,
    fontFamily: 'SFProDisplay-SemiBold',
  },
  syncContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  syncText: {
    fontSize: 13,
    fontFamily: 'SFProText-Regular',
  },
  syncButton: {
    padding: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'SFProDisplay-SemiBold',
  },
  sectionAction: {
    padding: 4,
  },
  sectionActionText: {
    fontSize: 15,
    fontFamily: 'SFProText-Medium',
  },
  emptyContainer: {
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: 'SFProDisplay-SemiBold',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: 'SFProText-Regular',
    textAlign: 'center',
  },
  geofenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  geofenceColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  geofenceName: {
    fontSize: 16,
    fontFamily: 'SFProText-Medium',
    flex: 1,
  },
  geofenceRadius: {
    fontSize: 14,
    fontFamily: 'SFProText-Regular',
  },
});