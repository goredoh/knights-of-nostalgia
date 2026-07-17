import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

interface AvatarProps {
  name: string;
  size?: number;
  isKnight?: boolean;
}

export function Avatar({ name, size = 40, isKnight = false }: AvatarProps) {
  const colors = useColors();
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Deterministic color from name
  const hues = [220, 260, 200, 180, 300, 30, 160, 340];
  const hue = hues[name.charCodeAt(0) % hues.length];
  const bgColor = `hsl(${hue}, 35%, 28%)`;
  const textColor = `hsl(${hue}, 60%, 75%)`;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bgColor,
          borderWidth: isKnight ? 2 : 0,
          borderColor: isKnight ? colors.primary : 'transparent',
        },
      ]}
    >
      <Text style={[styles.initials, { fontSize: size * 0.38, color: textColor }]}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.5,
  },
});
