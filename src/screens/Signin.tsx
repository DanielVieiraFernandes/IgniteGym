import {
  Text,
  VStack,
  Image,
  Center,
  Heading,
  ScrollView,
  useToast,
} from "@gluestack-ui/themed";
import BackgroundImg from "@assets/background.png";
import Logo from "@assets/logo.svg";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { useNavigation } from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@hooks/useAuth";
import { AppError } from "@utils/AppError";
import { ToastMessage } from "@components/ToastMessage";
import { useState } from "react";
const signInSchema = yup.object({
  email: yup.string().required("Informe o email.").email(),
  password: yup.string().required("Informe a senha"),
});

type SignInDataProps = yup.InferType<typeof signInSchema>;

export function Signin() {

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {signIn,user} = useAuth();
  const toast = useToast();

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInDataProps>({
    resolver: yupResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  const handleNewAccount = () => {
    navigation.navigate("signUp");
  };

  const handleSignIn = async ({email,password}:SignInDataProps) => {
    try {
      setIsLoading(true);
      await signIn(email, password); 

    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError ? error.message : 'Não foi possível entrar. Tente novamente mais tarde';
      toast.show({
       placement: 'top',
       render: ({id}) => (
        <ToastMessage 
        title={title}
        id={id}
        onClose={() => toast.close(id)}
        action="error"
        
        />
       )
      })
      setIsLoading(false);
    } 
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1}>
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
            <Controller
              control={control}
              name="email"
              render={({field:{onChange,value,onBlur}}) => (
                <Input
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  errorMessage={errors.email?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({field:{onChange,value,onBlur}}) => (
                <Input
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                  placeholder="Senha"
                  secureTextEntry
                  errorMessage={errors.password?.message}
                />
              )}
            />
            <Button title="Acessar" onPress={handleSubmit(handleSignIn)} isLoading={isLoading} />
          </Center>
          <Center flex={1} justifyContent="flex-end" mt="$4">
            <Text color="$gray100" fontSize="$sm" mb="$3" fontFamily="$body">
              Ainda não tem acesso?
            </Text>
            <Button
              title="Criar conta"
              variant="outline"
              onPress={handleNewAccount}
            />
          </Center>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
