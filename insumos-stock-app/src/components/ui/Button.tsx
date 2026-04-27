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
      className={`p-4 rounded-xl ${variantes[variant]} my-2 ${className}`}
    >
      {title && <Text className="text-white text-center font-semibold">{title}</Text>}
      {icon && <Ionicons name={icon as any} size={24} color="white" />}
    </TouchableOpacity>
  );
}
