import { StatusBar } from "react-native";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "./config/gluestack-ui.config";
import { Loading } from "@components/Loading";
import { Signin } from "@screens/Signin";
import { Signup } from "@screens/Signup";
import { Routes } from "@routes/index";
export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  return (
    <GluestackUIProvider config={config}>
      <StatusBar
        barStyle={"light-content"}
        translucent
        backgroundColor={"transparent"}
      />
      {fontsLoaded ? <Routes/> : <Loading />}
    </GluestackUIProvider>
  );
}
