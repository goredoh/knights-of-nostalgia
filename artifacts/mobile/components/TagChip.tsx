import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useColors } from '@/hooks/useColors';

interface TagChipProps {
  label: string;
  onPress?: () => void;
  active?: boolean;
  small?: boolean;
}

export function TagChip({ label, onPress, active = false, small = false }: TagChipProps) {
  const colors = useColors();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[
        styles.chip,
        {
          paddingHorizontal: small ? 8 : 12,
          paddingVertical: small ? 3 : 5,
          backgroundColor: active ? colors.primary : colors.secondary,
          borderRadius: 20,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            fontSize: small ? 11 : 12,
            color: active ? colors.primaryForeground : colors.mutedForeground,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
  },
  label: {
    fontFamily: 'Inter_500Medium',
    letterSpacing: 0.2,
  },
});
