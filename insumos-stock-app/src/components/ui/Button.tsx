import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant: "primary" | "secondary" | "tertiary";
}

export default function Button({
  title,
  onPress,
  variant = "primary",
}: ButtonProps) {
  const variantes = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    tertiary: "bg-tertiary",
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`p-4 rounded-xl ${variantes[variant]} justify-center items-center my-2`}
    >
      <Text className="text-white text-center font-semibold">{title}</Text>
    </TouchableOpacity>
  );
}
