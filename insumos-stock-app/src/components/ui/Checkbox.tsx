import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from './Text';

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export default function Checkbox({ label, checked, onChange, className = '' }: CheckboxProps) {
  return (
    <Pressable 
      onPress={() => onChange(!checked)}
      className={`flex-row items-center gap-2 ${className}`}
    >
      <View className={`w-6 h-6 rounded border-2 items-center justify-center ${checked ? 'bg-primary border-primary' : 'border-gray-400 dark:border-gray-500'}`}>
        {checked && <Ionicons name="checkmark" size={18} color="white" />}
      </View>
      {label && <Text className="text-sm text-gray-700 dark:text-gray-300">{label}</Text>}
    </Pressable>
  );
}
