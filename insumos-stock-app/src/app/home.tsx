import { useRouter } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { View } from "react-native";
import Button from "../components/ui/Button";
import Text from "../components/ui/Text";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <StatusBar style="light"/>
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Button
        title="Click"
        onPress={() => console.log("Click")}
        variant="primary"
      />
      <Button
        title="Click"
        onPress={() => console.log("Click")}
        variant="secondary"
      />
      <Button
        title="Click"
        onPress={() => console.log("Click")}
        variant="tertiary"
      />
      <Button 
        title="Volver a Login" 
        onPress={() => router.replace('/login')} 
        variant="secondary"
      />
    </View>
  );
}
