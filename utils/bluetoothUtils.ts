import { Platform } from 'react-native';

export interface BluetoothDevice {
  id: string;
  name: string | null;
  rssi: number | null;
  manufacturerData?: string;
}

class BluetoothManager {
  private isScanning: boolean = false;

  async isAvailable(): Promise<boolean> {
    if (Platform.OS === 'web') {
      return 'bluetooth' in navigator;
    }
    
    // For native platforms, we'll implement actual BLE checks
    return true;
  }

  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') {
      return true;
    }

    // For native platforms, we'll implement actual permission requests
    return true;
  }

  async startScan(onDeviceFound: (device: BluetoothDevice) => void): Promise<void> {
    if (this.isScanning) return;

    try {
      this.isScanning = true;
      
      if (Platform.OS === 'web') {
        // Mock scanning for web
        const mockDevices: BluetoothDevice[] = [
          { id: 'AA:BB:CC:DD:EE:01', name: 'MacBook Pro', rssi: -45 },
          { id: 'AA:BB:CC:DD:EE:02', name: 'AirTag Keys', rssi: -60 },
          { id: 'AA:BB:CC:DD:EE:03', name: 'Tracking Card', rssi: -70 },
        ];
        
        mockDevices.forEach((device, index) => {
          setTimeout(() => {
            onDeviceFound(device);
          }, 500 + Math.random() * 2000);
        });
      } else {
        // We'll implement native BLE scanning here
        console.log('Native BLE scanning not implemented');
      }
    } catch (error) {
      console.error('Error starting scan:', error);
      this.isScanning = false;
    }
  }

  async stopScan(): Promise<void> {
    if (!this.isScanning) return;

    try {
      this.isScanning = false;
      // We'll implement actual BLE stop scanning here for native
    } catch (error) {
      console.error('Error stopping scan:', error);
    }
  }

  async connect(deviceId: string): Promise<boolean> {
    // Mock connection
    return true;
  }

  async disconnect(deviceId: string): Promise<boolean> {
    // Mock disconnection
    return true;
  }

  async getConnectedDevices(): Promise<BluetoothDevice[]> {
    // Mock connected devices
    return [
      { id: 'AA:BB:CC:DD:EE:01', name: 'MacBook Pro', rssi: -45 },
    ];
  }
}

export default new BluetoothManager();