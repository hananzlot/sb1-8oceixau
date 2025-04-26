import React, { useEffect } from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  Easing, 
  View,
  Text
} from 'react-native';
import { Scan, X } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ScanButtonProps {
  isScanning: boolean;
  onPress: () => void;
}

const ScanButton = ({ isScanning, onPress }: ScanButtonProps) => {
  const { colors } = useColorScheme();
  const pulseAnim = new Animated.Value(1);
  const rotateAnim = new Animated.Value(0);
  
  useEffect(() => {
    let pulseAnimation: Animated.CompositeAnimation;
    let rotateAnimation: Animated.CompositeAnimation;
    
    if (isScanning) {
      // Pulse animation
      pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      
      // Rotate animation
      rotateAnimation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      
      pulseAnimation.start();
      rotateAnimation.start();
    } else {
      // Reset animations when not scanning
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    
    return () => {
      if (pulseAnimation) pulseAnimation.stop();
      if (rotateAnimation) rotateAnimation.stop();
    };
  }, [isScanning]);
  
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  const iconColor = isScanning ? colors.background : colors.primary;
  const buttonColor = isScanning ? colors.error : colors.primary;
  
  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.pulseContainer,
          {
            opacity: isScanning ? 0.3 : 0,
            transform: [{ scale: pulseAnim }],
            backgroundColor: buttonColor,
          },
        ]}
      />
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[
          styles.button,
          { backgroundColor: buttonColor },
        ]}
      >
        <Animated.View
          style={{
            transform: [{ rotate }],
          }}
        >
          {isScanning ? (
            <X color={iconColor} size={28} />
          ) : (
            <Scan color={iconColor} size={28} />
          )}
        </Animated.View>
      </TouchableOpacity>
      <Text style={[styles.label, { color: buttonColor }]}>
        {isScanning ? 'Stop' : 'Scan'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  pulseContainer: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    top: 0,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'SFProText-Medium',
  },
});

export default ScanButton;