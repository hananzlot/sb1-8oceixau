import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { useAppContext } from '@/context/AppContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import Header from '@/components/Header';
import { CirclePlus as PlusCircle, Map as MapIcon, Minus, Plus, CircleAlert as AlertCircle } from 'lucide-react-native';
import { GeofenceType } from '@/types';
import * as Location from 'expo-location';
import GeofenceMapMarker from '@/components/GeofenceMapMarker';

let MapView: any = () => null;
let PROVIDER_GOOGLE: any = null;
let Circle: any = () => null;
let Marker: any = () => null;

if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
  Circle = Maps.Circle;
  Marker = Maps.Marker;
}

const INITIAL_REGION = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function MapScreen() {
  const { geofences, addGeofence, removeGeofence, updateGeofence } = useAppContext();
  const { colors } = useColorScheme();
  const [location, setLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const mapRef = useRef(null);
  
  useEffect(() => {
    const getLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
      
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        const newLocation = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        };
        setLocation(newLocation);
        
        if (mapRef.current && newLocation && Platform.OS !== 'web') {
          mapRef.current.animateToRegion({
            ...newLocation,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      }
    };
    
    getLocationPermission();
  }, []);

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Geofence Map" />
        <View style={styles.webMapContainer}>
          {location ? (
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyD1kPT_peI9KIjBLoVb_iSIn-J7_-TNX3w&q=${location.latitude},${location.longitude}&zoom=15`}
              style={styles.webMap}
              frameBorder="0"
              allowFullScreen
            />
          ) : (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, { color: colors.text }]}>
                Loading map...
              </Text>
            </View>
          )}
          <Text style={[styles.webDisclaimer, { color: colors.secondaryText }]}>
            Note: Geofence creation and management is only available in the mobile app
          </Text>
        </View>
      </View>
    );
  }

  if (!locationPermission) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Geofence Map" />
        <View style={styles.centerContainer}>
          <AlertCircle size={48} color={colors.warning} style={styles.webIcon} />
          <Text style={[styles.webTitle, { color: colors.text }]}>
            Location Permission Required
          </Text>
          <Text style={[styles.webText, { color: colors.secondaryText }]}>
            This app needs location permission to display maps and create geofences.
          </Text>
          <TouchableOpacity
            style={[styles.permissionButton, { backgroundColor: colors.primary }]}
            onPress={async () => {
              const { status } = await Location.requestForegroundPermissionsAsync();
              setLocationPermission(status === 'granted');
            }}
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
      <Header title="Geofence Map" />
      {Platform.OS !== 'web' && location && MapView && (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            ...location,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation
          showsMyLocationButton
        >
          {geofences?.map(geofence => (
            <GeofenceMapMarker
              key={geofence.id}
              geofence={geofence}
            />
          ))}
        </MapView>
      )}
      
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={() => {
          // Handle adding new geofence
        }}
      >
        <PlusCircle color="white" size={24} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  webMapContainer: {
    flex: 1,
    padding: 16,
    position: 'relative',
  },
  webMap: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  webDisclaimer: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
    borderRadius: 8,
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
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
  addButton: {
    position: 'absolute',
    bottom: 32,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});