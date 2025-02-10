import { Heading, HStack, Icon, Text, VStack } from "@gluestack-ui/themed";
import { UserPhoto } from "./UserPhoto";
import { LogOut } from "lucide-react-native";
import { useAuth } from "@hooks/useAuth";
import DefaultImg from "@assets/userPhotoDefault.png";
import { TouchableOpacity } from "react-native";
import { api } from "@services/api";
export function HomeHeader() {

  const {user, signOut} = useAuth();

  return (
    <HStack bg="$gray600" pt="$16" pb="$5" px="$8" alignItems="center" gap="$4">
      <UserPhoto
        source={user.avatar ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}`} : DefaultImg}
        alt="Imagem do usuário"
        w={46}
        h={46}
      />
      <VStack flex={1}>
        <Text color="$gray100" fontSize="$sm">
          Olá,
        </Text>
        <Heading color="$gray100" fontSize="$md">
          {user.name} 
        </Heading>
      </VStack>
      <TouchableOpacity onPress={signOut}>
      <Icon as={LogOut} color="$gray200" size="xl" />
      </TouchableOpacity>
    </HStack>
  );
}
