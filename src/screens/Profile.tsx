import { useState } from "react";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { VStack, Text, Center, Heading, useToast } from "@gluestack-ui/themed";
import { Alert, ScrollView, TouchableOpacity } from "react-native";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import * as ImagePicker from "expo-image-picker";
import * as fs from "expo-file-system";
import { ToastMessage } from "@components/ToastMessage";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@hooks/useAuth";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import DefaultImg from "@assets/userPhotoDefault.png";

const profileSchema = yup.object({
  name: yup.string().required("Informe o nome."),
  email: yup.string(),
  old_password: yup.string(),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 dígitos")
    .nullable()
    .transform((value) => (!!value ? value : null)),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => (!!value ? value : null))
    .oneOf([yup.ref("password"), null], "A confirmação de senha não confere"),
});

type FormDataProps = yup.InferType<typeof profileSchema>;

export function Profile() {
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const { user, updateUserProfile } = useAuth();
  const toast = useToast();

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema),
  });

  const handleUserPhotoSelect = async () => {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      console.log(photoSelected);

      if (photoSelected.canceled) {
        return;
      }

      const photoUri = photoSelected.assets[0].uri;

      if (photoUri) {
        const photoInfo = (await fs.getInfoAsync(photoUri)) as { size: number };

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 1) {
          return toast.show({
            placement: "top",
            render: ({ id }) => (
              <ToastMessage
                id={id}
                title="Essa imagem é muito grande. Escolha uma de até 5MB"
                action="error"
                onClose={() => toast.close(id)}
              />
            ),
          });
        }

        const fileExtension = photoUri.split(".").pop();
        console.log(fileExtension);

        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoUri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        } as any;

        const userPhotoUploadForm = new FormData();
        userPhotoUploadForm.append("avatar", photoFile);

        const avatarUpdatedResponse = await api.patch("/users/avatar", userPhotoUploadForm, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const userUpdated = user;
        userUpdated.avatar = avatarUpdatedResponse.data.avatar;
        updateUserProfile(userUpdated);

        toast.show({
          placement: "top",
          render: ({ id }) => (
            <ToastMessage
              id={id}
              onClose={() => toast.close(id)}
              title="Foto atualizada!"
              action="success"
            />
          ),
        });
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar a imagem");
    }
  };

  const handleProfileUpdate = async (data: FormDataProps) => {
    setIsUpdate(true);
    try {
      const userUpdated = user;
      userUpdated.name = data.name;

      await api.put(`/users`, data);

      await updateUserProfile(userUpdated);

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            onClose={() => toast.close(id)}
            title="Perfil alterado com sucesso"
            action="success"
          />
        ),
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível atualizar os dados. Tente novamente mais tarde";

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            onClose={() => toast.close(id)}
            title={title}
            action="error"
          />
        ),
      });
    } finally {
      setIsUpdate(false);
    }
  };

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 36 }}
        showsVerticalScrollIndicator={false}
      >
        <Center mt="$6" px="$10">
          <UserPhoto
           source={user.avatar ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}`} : DefaultImg}
            alt="Foto do usuário"
            size="xl"
          />
          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              color="$green500"
              fontFamily="$heading"
              fontSize="$md"
              mt="$2"
              mb="$8"
            >
              Alterar foto
            </Text>
          </TouchableOpacity>
          <Center w="$full" gap="$4">
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Nome"
                  bg="$gray600"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.name?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="E-mail"
                  bg="$gray600"
                  isReadOnly
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </Center>
          <Heading
            alignSelf="flex-start"
            fontFamily="$heading"
            color="$gray200"
            fontSize="$md"
            mt="$12"
            mb="$2"
          >
            Alterar senha
          </Heading>
          <Center w="$full" gap="$4">
            <Controller
              control={control}
              name="old_password"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Senha antiga"
                  secureTextEntry
                  bg="$gray600"
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Nova senha"
                  secureTextEntry
                  bg="$gray600"
                  onChangeText={onChange}
                  value={value as string}
                  errorMessage={errors.password?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="confirm_password"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Confirme a nova senha"
                  secureTextEntry
                  bg="$gray600"
                  onChangeText={onChange}
                  errorMessage={errors.confirm_password?.message}
                  value={value as string}
                />
              )}
            />

            <Button
              title="Atualizar"
              isLoading={isUpdate}
              onPress={handleSubmit(handleProfileUpdate)}
            />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  );
}
