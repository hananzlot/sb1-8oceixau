import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { Battery, SignalHigh, Clock, Map as MapIcon } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DeviceType } from '@/types';
import { formatDistanceToNow } from '@/utils/dateUtils';

interface DeviceCardProps {
  device: DeviceType;
  onPress: (device: DeviceType) => void;
}

const DeviceCard = ({ device, onPress }: DeviceCardProps) => {
  const { colors } = useColorScheme();
  const [scaleAnim] = useState(new Animated.Value(1));
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return colors.success;
      case 'inactive':
        return colors.warning;
      case 'out_of_range':
        return colors.error;
      default:
        return colors.mediumGray;
    }
  };
  
  const handlePress = () => {
    // Animate card on press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    onPress(device);
  };
  
  const lastSeenText = formatDistanceToNow(device.lastSeen);
  const statusColor = getStatusColor(device.status);
  
  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.card,
          borderColor: colors.border,
          transform: [{ scale: scaleAnim }] 
        }
      ]}
    >
      <TouchableOpacity 
        style={styles.touchable}
        activeOpacity={0.7} 
        onPress={handlePress}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.text }]}>{device.name}</Text>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          </View>
          <Text style={[styles.macAddress, { color: colors.secondaryText }]}>
            {device.macAddress}
          </Text>
        </View>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <SignalHigh size={18} color={colors.primary} style={styles.icon} />
            <Text style={[styles.infoText, { color: colors.secondaryText }]}>
              {device.status === 'active' ? 'Connected' : device.status === 'inactive' ? 'Inactive' : 'Out of Range'}
            </Text>
          </View>
          
          {device.batteryLevel && (
            <View style={styles.infoItem}>
              <Battery size={18} color={
                device.batteryLevel > 70 ? colors.success :
                device.batteryLevel > 30 ? colors.warning :
                colors.error
              } style={styles.icon} />
              <Text style={[styles.infoText, { color: colors.secondaryText }]}>
                {device.batteryLevel}%
              </Text>
            </View>
          )}
          
          <View style={styles.infoItem}>
            <Clock size={18} color={colors.primary} style={styles.icon} />
            <Text style={[styles.infoText, { color: colors.secondaryText }]}>
              {lastSeenText}
            </Text>
          </View>
          
          {device.inGeofence && (
            <View style={styles.infoItem}>
              <MapIcon size={18} color={colors.primary} style={styles.icon} />
              <Text style={[styles.infoText, { color: colors.secondaryText }]}>
                {device.inGeofence}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
  },
  touchable: {
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: 'SFProDisplay-SemiBold',
    marginRight: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  macAddress: {
    fontSize: 14,
    fontFamily: 'SFProText-Regular',
  },
  infoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
    minWidth: 80,
  },
  icon: {
    marginRight: 6,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'SFProText-Regular',
  },
});

export default memo(DeviceCard);