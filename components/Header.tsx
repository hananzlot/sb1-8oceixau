import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { ArrowLeft, Settings as SettingsIcon, MoreVertical } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showSettings?: boolean;
  rightAction?: React.ReactNode;
  onSettingsPress?: () => void;
  transparent?: boolean;
}

const Header = ({ 
  title, 
  showBack = false, 
  showSettings = false, 
  rightAction,
  onSettingsPress,
  transparent = false,
}: HeaderProps) => {
  const { colors } = useColorScheme();
  const router = useRouter();
  
  return (
    <SafeAreaView 
      style={[
        styles.safeArea, 
        { 
          backgroundColor: transparent ? 'transparent' : colors.background,
          borderBottomColor: transparent ? 'transparent' : colors.border,
          borderBottomWidth: transparent ? 0 : StyleSheet.hairlineWidth,
        }
      ]}
    >
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          {showBack && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <ArrowLeft size={24} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
        
        <Text 
          style={[
            styles.title, 
            { color: colors.text }
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        
        <View style={styles.rightContainer}>
          {rightAction}
          
          {showSettings && !rightAction && (
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={onSettingsPress || (() => router.push('/settings'))}
              activeOpacity={0.7}
            >
              <SettingsIcon size={22} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    width: '100%',
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    paddingHorizontal: 16,
  },
  leftContainer: {
    width: 44,
    alignItems: 'flex-start',
  },
  rightContainer: {
    width: 44,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 17,
    fontFamily: 'SFProDisplay-SemiBold',
    textAlign: 'center',
    flex: 1,
  },
  backButton: {
    padding: 4,
  },
  settingsButton: {
    padding: 4,
  },
});

export default Header;