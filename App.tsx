import { StatusBar } from "react-native";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "./config/gluestack-ui.config";
import { Loading } from "@components/Loading";
import {AuthContext, AuthContextProvider} from "@contexts/AuthContext";
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
     <AuthContextProvider>
     {fontsLoaded ? <Routes/> : <Loading />}
     </AuthContextProvider>
    </GluestackUIProvider>
  );
}
