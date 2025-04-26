import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Home, Map, Settings, Scan } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  const { colorScheme, colors } = useColorScheme();
  const isWeb = Platform.OS === 'web';
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondaryText,
        tabBarStyle: {
          ...styles.tabBar,
          backgroundColor: isWeb ? colors.background : 'transparent',
          borderTopColor: colors.border,
        },
        tabBarBackground: () => 
          !isWeb ? (
            <BlurView 
              tint={colorScheme === 'dark' ? 'dark' : 'light'} 
              intensity={90} 
              style={StyleSheet.absoluteFill} 
            />
          ) : null,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, size }) => <Scan size={size} color={color} />,
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => <Map size={size} color={color} />,
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    elevation: 0,
    height: 85,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  tabBarLabel: {
    fontFamily: 'SFProText-Medium',
    fontSize: 12,
  },
});