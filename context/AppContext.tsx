import React, { createContext, useState, useContext, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import { NamedDevice, GeofenceType, DeviceLocation } from '@/types';
import { isPointInGeofence } from '@/utils/geofenceUtils';

interface AppContextType {
  namedDevices: NamedDevice[];
  geofences: GeofenceType[];
  currentLocation: DeviceLocation | null;
  isScanning: boolean;
  addNamedDevice: (macAddress: string, name: string) => void;
  removeNamedDevice: (macAddress: string) => void;
  updateDeviceLocation: () => void;
  addGeofence: (geofence: GeofenceType) => void;
  removeGeofence: (id: string) => void;
  updateGeofence: (id: string, update: Partial<GeofenceType>) => void;
  startScanning: () => void;
  stopScanning: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [namedDevices, setNamedDevices] = useState<NamedDevice[]>([]);
  const [geofences, setGeofences] = useState<GeofenceType[]>([]);
  const [currentLocation, setCurrentLocation] = useState<DeviceLocation | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);

  // Request location permissions on mount
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
    };
    requestPermissions();
  }, []);

  // Update device locations periodically
  useEffect(() => {
    if (!locationPermission) return;

    const locationInterval = setInterval(() => {
      updateDeviceLocation();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(locationInterval);
  }, [locationPermission]);

  const addNamedDevice = (macAddress: string, name: string) => {
    setNamedDevices(prev => {
      const exists = prev.find(d => d.macAddress === macAddress);
      if (exists) {
        return prev.map(d => 
          d.macAddress === macAddress 
            ? { ...d, name, lastSeen: new Date() }
            : d
        );
      }
      return [...prev, { macAddress, name, lastSeen: new Date() }];
    });
  };

  const removeNamedDevice = (macAddress: string) => {
    setNamedDevices(prev => prev.filter(d => d.macAddress !== macAddress));
  };

  const updateDeviceLocation = async () => {
    if (!locationPermission) return;

    try {
      const location = await Location.getCurrentPositionAsync({});
      const newLocation: DeviceLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: new Date(),
      };
      setCurrentLocation(newLocation);

      // Update devices' geofence status
      setNamedDevices(prev => prev.map(device => {
        let inGeofence: string | undefined;
        
        for (const geofence of geofences) {
          if (!geofence.active) continue;
          
          const isInside = isPointInGeofence(
            { latitude: newLocation.latitude, longitude: newLocation.longitude },
            geofence
          );
          
          if (isInside) {
            inGeofence = geofence.name;
            break;
          }
        }

        return {
          ...device,
          inGeofence,
        };
      }));
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const addGeofence = (geofence: GeofenceType) => {
    setGeofences(prev => [...prev, geofence]);
  };

  const removeGeofence = (id: string) => {
    setGeofences(prev => prev.filter(g => g.id !== id));
  };

  const updateGeofence = (id: string, update: Partial<GeofenceType>) => {
    setGeofences(prev =>
      prev.map(geofence => (geofence.id === id ? { ...geofence, ...update } : geofence))
    );
  };

  const startScanning = () => {
    setIsScanning(true);
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  const contextValue = {
    namedDevices,
    geofences,
    currentLocation,
    isScanning,
    addNamedDevice,
    removeNamedDevice,
    updateDeviceLocation,
    addGeofence,
    removeGeofence,
    updateGeofence,
    startScanning,
    stopScanning,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};