import { Heading, HStack, Image, Text, VStack, Icon } from "@gluestack-ui/themed";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import IMG from "@assets/userPhotoDefault.png";
import {ChevronRight} from "lucide-react-native";
type Props = TouchableOpacityProps;

export function ExerciseCard({ ...rest }: Props) {
  return (
    <TouchableOpacity {...rest}>
      <HStack bg="$gray500" p="$2" pr="$4" rounded="$md" mb="$3" alignItems="center">
        <Image
          source={IMG}
          alt="Imagem do exercício"
          w="$16"
          h="$16"
          rounded="$md"
          mr="$4"
          resizeMode="cover"
        />
        <VStack flex={1}>
            <Heading fontSize="$lg" color="$white" fontFamily="$heading">Puxada frontal</Heading>
            <Text fontSize="$sm" color="$gray200" mt="$1" numberOfLines={2}>Teste</Text>
        </VStack>
        <Icon as={ChevronRight} color="$gray300"/>
      </HStack>
    </TouchableOpacity>
  );
}
