import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant: "primary" | "secondary" | "tertiary";
  className?: string;
  icon?: string;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  className = "",
  icon,
}: ButtonProps) {
  const variantes = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    tertiary: "bg-tertiary",
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center justify-center rounded-2xl ${variantes[variant]} ${className}`}
    >
      {icon && (
        <Ionicons 
          name={icon as any} 
          size={24} 
          color="white" 
          style={{ marginRight: title ? 8 : 0 }} 
        />
      )}
      {title && <Text className="text-white text-center font-bold">{title}</Text>}
    </TouchableOpacity>
  );
}
