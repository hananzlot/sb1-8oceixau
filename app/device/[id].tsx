import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import Header from '@/components/Header';
import { AlertCircle, Battery, SignalHigh, MapPin, Clock, Check, X, Trash2 } from 'lucide-react-native';
import { formatDateTime } from '@/utils/dateUtils';
import { HistoryEntry } from '@/types';

export default function DeviceDetailScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useColorScheme();
  const { devices, removeDevice, updateDevice, triggerHapticFeedback } = useAppContext();
  const router = useRouter();
  const [tab, setTab] = useState<'info' | 'history'>('info');
  
  // Find the device by ID
  const device = devices.find(d => d.id === id);
  
  // Handle if device not found
  if (!device) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Device Details" showBack />
        <View style={styles.notFoundContainer}>
          <AlertCircle size={48} color={colors.error} style={styles.notFoundIcon} />
          <Text style={[styles.notFoundTitle, { color: colors.text }]}>
            Device Not Found
          </Text>
          <Text style={[styles.notFoundText, { color: colors.secondaryText }]}>
            The requested device couldn't be found.
          </Text>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  // Get battery color based on level
  const getBatteryColor = () => {
    if (!device.batteryLevel) return colors.secondaryText;
    if (device.batteryLevel > 70) return colors.success;
    if (device.batteryLevel > 30) return colors.warning;
    return colors.error;
  };
  
  // Get status color based on device status
  const getStatusColor = () => {
    switch (device.status) {
      case 'active':
        return colors.success;
      case 'inactive':
        return colors.warning;
      case 'out_of_range':
        return colors.error;
      default:
        return colors.secondaryText;
    }
  };
  
  // Get event icon for history entry
  const getEventIcon = (event: string) => {
    switch (event) {
      case 'enter':
        return <Check size={16} color={colors.success} />;
      case 'exit':
        return <X size={16} color={colors.error} />;
      default:
        return <SignalHigh size={16} color={colors.primary} />;
    }
  };
  
  // Handle device deletion
  const handleDeleteDevice = () => {
    triggerHapticFeedback('error');
    removeDevice(device.id);
    router.back();
  };
  
  // Render device history item
  const renderHistoryItem = ({ item }: { item: HistoryEntry }) => (
    <View style={[styles.historyItem, { borderBottomColor: colors.border }]}>
      <View style={styles.historyEventContainer}>
        {getEventIcon(item.event)}
        <Text style={[styles.historyEvent, { color: colors.text }]}>
          {item.event === 'enter' ? 'Entered' : item.event === 'exit' ? 'Exited' : 'Detected'}
        </Text>
      </View>
      
      <View style={styles.historyDetails}>
        <Text style={[styles.historyLocation, { color: colors.text }]}>
          {item.geofence}
        </Text>
        <Text style={[styles.historyTime, { color: colors.secondaryText }]}>
          {formatDateTime(item.timestamp)}
        </Text>
      </View>
    </View>
  );
  
  // Create tabs for info and history
  const renderTabs = () => (
    <View style={[styles.tabContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <TouchableOpacity
        style={[
          styles.tab,
          tab === 'info' && [styles.activeTab, { borderBottomColor: colors.primary }]
        ]}
        onPress={() => setTab('info')}
      >
        <Text 
          style={[
            styles.tabText, 
            { color: tab === 'info' ? colors.primary : colors.secondaryText }
          ]}
        >
          Info
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.tab,
          tab === 'history' && [styles.activeTab, { borderBottomColor: colors.primary }]
        ]}
        onPress={() => setTab('history')}
      >
        <Text 
          style={[
            styles.tabText, 
            { color: tab === 'history' ? colors.primary : colors.secondaryText }
          ]}
        >
          History
        </Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title={device.name}
        showBack
        rightAction={
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteDevice}
          >
            <Trash2 size={20} color={colors.error} />
          </TouchableOpacity>
        }
      />
      
      {/* Device header */}
      <View style={[styles.deviceHeader, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.deviceMac, { color: colors.secondaryText }]}>
          {device.macAddress}
        </Text>
        
        <View style={[styles.statusTag, { backgroundColor: getStatusColor() + '20' }]}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {device.status === 'active' ? 'Active' : device.status === 'inactive' ? 'Inactive' : 'Out of Range'}
          </Text>
        </View>
      </View>
      
      {renderTabs()}
      
      {tab === 'info' ? (
        <ScrollView style={styles.infoContainer}>
          {/* Info rows */}
          <View style={[styles.infoSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {device.batteryLevel && (
              <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                <View style={styles.infoIconContainer}>
                  <Battery size={20} color={getBatteryColor()} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>
                    Battery Level
                  </Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {device.batteryLevel}%
                  </Text>
                </View>
              </View>
            )}
            
            <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
              <View style={styles.infoIconContainer}>
                <SignalHigh size={20} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>
                  Status
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {device.status === 'active' ? 'Connected' : device.status === 'inactive' ? 'Inactive' : 'Out of Range'}
                </Text>
              </View>
            </View>
            
            {device.inGeofence && (
              <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                <View style={styles.infoIconContainer}>
                  <MapPin size={20} color={colors.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>
                    Current Location
                  </Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {device.inGeofence}
                  </Text>
                </View>
              </View>
            )}
            
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Clock size={20} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>
                  Last Seen
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {formatDateTime(device.lastSeen)}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Actions section */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/map')}
            >
              <MapPin size={18} color="white" style={styles.actionIcon} />
              <Text style={styles.actionText}>View on Map</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.historyContainer}>
          <Text style={[styles.historyTitle, { color: colors.text }]}>
            Activity History
          </Text>
          
          {device.history.length > 0 ? (
            <FlatList
              data={device.history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())}
              renderItem={renderHistoryItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={[
                styles.historyList, 
                { backgroundColor: colors.card, borderColor: colors.border }
              ]}
            />
          ) : (
            <View style={[styles.emptyHistory, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.emptyHistoryText, { color: colors.secondaryText }]}>
                No history available for this device
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  notFoundIcon: {
    marginBottom: 16,
  },
  notFoundTitle: {
    fontSize: 20,
    fontFamily: 'SFProDisplay-SemiBold',
    marginBottom: 8,
  },
  notFoundText: {
    fontSize: 16,
    fontFamily: 'SFProText-Regular',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'SFProText-Medium',
  },
  deviceHeader: {
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
  },
  deviceMac: {
    fontSize: 15,
    fontFamily: 'SFProText-Regular',
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'SFProText-Medium',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 15,
    fontFamily: 'SFProText-Medium',
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  infoSection: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  infoIconContainer: {
    width: 40,
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    fontFamily: 'SFProText-Regular',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'SFProText-Medium',
  },
  actionsContainer: {
    marginTop: 24,
    marginBottom: 40,
  },
  actionButton: {
    flexDirection: 'row',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  actionIcon: {
    marginRight: 8,
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'SFProText-SemiBold',
  },
  deleteButton: {
    padding: 4,
  },
  historyContainer: {
    flex: 1,
    padding: 16,
  },
  historyTitle: {
    fontSize: 17,
    fontFamily: 'SFProDisplay-SemiBold',
    marginBottom: 12,
  },
  historyList: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  historyItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  historyEventContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  historyEvent: {
    fontSize: 14,
    fontFamily: 'SFProText-Medium',
    marginLeft: 6,
  },
  historyDetails: {
    flex: 1,
  },
  historyLocation: {
    fontSize: 15,
    fontFamily: 'SFProText-Medium',
    marginBottom: 2,
  },
  historyTime: {
    fontSize: 13,
    fontFamily: 'SFProText-Regular',
  },
  emptyHistory: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  emptyHistoryText: {
    fontSize: 15,
    fontFamily: 'SFProText-Regular',
    textAlign: 'center',
  },
});