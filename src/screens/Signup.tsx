import {
  Text,
  VStack,
  Image,
  Center,
  Heading,
  ScrollView,
  useToast
} from "@gluestack-ui/themed";
import BackgroundImg from "@assets/background.png";
import Logo from "@assets/logo.svg";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup"
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { ToastMessage } from "@components/ToastMessage";
import { useState } from "react";
import { useAuth } from "@hooks/useAuth";
const signUpSchema = yup.object({
  name: yup.string().required("Informe o nome."),
  email: yup.string().required("Informe o e-mail.").email("email inválido."),
  password: yup.string().required("Informe a senha.").min(6, "A senha deve ter pelo menos 6 dígitos."),
  password_confirm: yup.string().required("Confirme a senha.").oneOf([yup.ref("password"), ""], "A confirmação da senha não confere")
});

type FormDataProps = yup.InferType<typeof signUpSchema>;
export function Signup() {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {signIn} = useAuth();

    const toast = useToast();

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirm: "",
    },
  });

  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSignUp = async ({
    email,
    name,
    password,
    password_confirm,
  }: FormDataProps) => {
   try {
    setIsLoading(true);
     await api.post('/users', {
      email,
      name,
      password
   });
   await signIn(email, password);

   } catch (error) {
    setIsLoading(false);
    const isAppError = error instanceof AppError;

    const title = isAppError ? error.message : 'Não foi possível criar a conta. Tente novamente mais tarde.';

    toast.show({
      placement: "top",
      render: ({id}) => (
        <ToastMessage 
          id={id}
          title={title}
          action="error"
          onClose={() => toast.close(id)}
        />
      )
    })

   }
  };

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
          <Center gap="$2" flex={1}>
            <Heading color="$gray100">Crie sua conta</Heading>
            <Controller
              name="name"
              control={control}
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  placeholder="Nome"
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                  errorMessage={errors.name?.message}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  placeholder="Email"
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  errorMessage={errors.email?.message}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  placeholder="Senha"
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                  secureTextEntry
                  errorMessage={errors.password?.message}
                />
              )}
            />
            <Controller
              name="password_confirm"
              control={control}
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  placeholder="Confirme a Senha"
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                  secureTextEntry
                  errorMessage={errors.password_confirm?.message}
                  onSubmitEditing={handleSubmit(handleSignUp)}
                />
              )}
            />
            <Button
              title="Criar e acessar"
              onPress={handleSubmit(handleSignUp)}
            />
          </Center>
          <Button
            title="Voltar para o login"
            variant="outline"
            mt="$12"
            onPress={handleGoBack}
          />
        </VStack>
      </VStack>
    </ScrollView>
  );
}
