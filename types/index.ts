export interface NamedDevice {
  macAddress: string;
  name: string;
  lastSeen: Date;
  inGeofence?: string;
}

export interface GeofenceType {
  id: string;
  name: string;
  color: string;
  radius: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  active: boolean;
}

export interface DeviceLocation {
  latitude: number;
  longitude: number;
  timestamp: Date;
}