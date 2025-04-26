// Mock Google Sheets API integration for demo purposes

export interface SheetsConfig {
  sheetId: string;
  apiKey?: string;
  enabled: boolean;
}

interface DeviceLogEntry {
  deviceName: string;
  macAddress: string;
  timestamp: Date;
  geofenceName: string | null;
  event: string;
}

export const GoogleSheetsUtils = {
  // Check if the sheets API is configured
  isConfigured: (config: SheetsConfig): boolean => {
    return !!(config.sheetId && config.apiKey && config.enabled);
  },
  
  // Initialize the connection
  initialize: async (config: SheetsConfig): Promise<boolean> => {
    // In a real implementation, this would initialize the Google Sheets API client
    return true;
  },
  
  // Add a new device log entry
  addDeviceLog: async (
    config: SheetsConfig, 
    entry: DeviceLogEntry
  ): Promise<boolean> => {
    // In a real implementation, this would write to Google Sheets
    console.log('Adding device log to Google Sheets:', entry);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  },
  
  // Get all device logs
  getDeviceLogs: async (
    config: SheetsConfig, 
    filter?: { deviceId?: string, startDate?: Date, endDate?: Date }
  ): Promise<DeviceLogEntry[]> => {
    // In a real implementation, this would read from Google Sheets
    // Return mock data for demo
    return [
      {
        deviceName: 'MacBook Pro',
        macAddress: '00:1B:44:11:3A:B7',
        timestamp: new Date(Date.now() - 3600000),
        geofenceName: 'Office',
        event: 'enter',
      },
      {
        deviceName: 'MacBook Pro',
        macAddress: '00:1B:44:11:3A:B7',
        timestamp: new Date(Date.now() - 7200000),
        geofenceName: 'Home',
        event: 'exit',
      },
    ];
  },
  
  // Create a new sheet for a device if it doesn't exist
  createDeviceSheetIfNeeded: async (
    config: SheetsConfig, 
    deviceName: string
  ): Promise<boolean> => {
    // In a real implementation, this would create a new sheet
    return true;
  },
};

export default GoogleSheetsUtils;