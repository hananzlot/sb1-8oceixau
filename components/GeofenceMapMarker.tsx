import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Marker, Circle } from 'react-native-maps';
import { GeofenceType } from '@/types';

interface GeofenceMapMarkerProps {
  geofence: GeofenceType;
  onPress?: (geofence: GeofenceType) => void;
}

const GeofenceMapMarker = ({ geofence, onPress }: GeofenceMapMarkerProps) => {
  const handlePress = () => {
    if (onPress) {
      onPress(geofence);
    }
  };
  
  // Adjust opacity based on active state
  const circleOpacity = geofence.active ? 0.3 : 0.1;
  const strokeOpacity = geofence.active ? 0.8 : 0.3;
  
  return (
    <>
      <Marker
        coordinate={geofence.coordinates}
        title={geofence.name}
        onPress={handlePress}
        pinColor={geofence.color}
      />
      <Circle
        center={geofence.coordinates}
        radius={geofence.radius}
        fillColor={`${geofence.color}${Math.round(circleOpacity * 255).toString(16).padStart(2, '0')}`}
        strokeColor={geofence.color}
        strokeWidth={2}
        strokeOpacity={strokeOpacity}
      />
    </>
  );
};

const styles = StyleSheet.create({});

export default memo(GeofenceMapMarker);