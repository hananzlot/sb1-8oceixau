import { GeofenceType } from '@/types';
import * as geolib from 'geolib';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Check if coordinates are within a geofence
export const isPointInGeofence = (
  point: Coordinates,
  geofence: GeofenceType
): boolean => {
  if (!geofence.active) return false;
  
  const distance = geolib.getDistance(
    { lat: point.latitude, lng: point.longitude },
    { lat: geofence.coordinates.latitude, lng: geofence.coordinates.longitude }
  );
  
  return distance <= geofence.radius;
};

// Find which geofence a point is in (if any)
export const findGeofenceForPoint = (
  point: Coordinates,
  geofences: GeofenceType[]
): GeofenceType | null => {
  for (const geofence of geofences) {
    if (isPointInGeofence(point, geofence)) {
      return geofence;
    }
  }
  
  return null;
};

// Calculate distance between two points
export const getDistanceBetweenPoints = (
  point1: Coordinates,
  point2: Coordinates
): number => {
  return geolib.getDistance(
    { lat: point1.latitude, lng: point1.longitude },
    { lat: point2.latitude, lng: point2.longitude }
  );
};

// Generate a random point within a geofence (for testing)
export const generateRandomPointInGeofence = (
  geofence: GeofenceType
): Coordinates => {
  // Random angle
  const angle = Math.random() * 2 * Math.PI;
  // Random distance within radius
  const distance = Math.random() * geofence.radius;
  
  // Convert polar to cartesian
  const latOffset = distance * Math.cos(angle) / 111111;
  const lngOffset = distance * Math.sin(angle) / (111111 * Math.cos(geofence.coordinates.latitude * (Math.PI / 180)));
  
  return {
    latitude: geofence.coordinates.latitude + latOffset,
    longitude: geofence.coordinates.longitude + lngOffset,
  };
};