import { Text, VStack, Image, Center, Heading } from "@gluestack-ui/themed";
import BackgroundImg from "@assets/background.png";
import Logo from "@assets/logo.svg";
import {Input} from "@components/Input";

export function Signin() {
  return (
    <VStack flex={1} bg="$gray700">
      <Image
        source={BackgroundImg}
        alt="Pessoas treinando"
        w="$full"
        h={624}
        position="absolute"
        defaultSource={BackgroundImg}
      />
      <VStack flex={1} px="$10" pb="$16">
      <Center my="$24">
        <Logo />
        <Text color="$gray100" fontSize="$sm">
          Treine sua mente e seu corpo
        </Text>
      </Center>
      <Center gap="$2">
        <Heading color="$gray100">Acesse a conta</Heading>
        <Input placeholder="E-mail"/>
        <Input placeholder="Senha"/>
      </Center>
      </VStack>
    </VStack>
  );
}
