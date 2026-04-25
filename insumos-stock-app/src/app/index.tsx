import { Text, View } from "react-native";
import Button from "../components/ui/Button";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
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
    </View>
  );
}
