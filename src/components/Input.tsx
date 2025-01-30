import {
  Input as GluestackInput,
  InputField,
  FormControl,
  FormControlError,
  FormControlErrorText,
} from "@gluestack-ui/themed";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof InputField> & {
  isReadOnly?: boolean;
  errorMessage?: string | null;
  isInvalid?: boolean;
};

export function Input({
  isReadOnly = false,
  errorMessage = null,
  isInvalid = false,
  ...rest
}: Props) {
  const invalid = !!errorMessage || isInvalid;

  return (
    <FormControl isInvalid={invalid} w="$full" mb="$4">
      <GluestackInput
        isInvalid={isInvalid}
        h="$14"
        borderWidth="$0"
        borderRadius="$md"
        $focus={{
          borderWidth: 1,
          borderColor: invalid ? "$red500" :"$green500",
        }}
        isReadOnly={isReadOnly}
        $invalid={{
          borderWidth: 1,
          borderColor: "$red500"
        }}
        opacity={isReadOnly ? 0.5 : 1}
      >
        <InputField
          color="$white"
          fontFamily="$body"
          placeholderTextColor="$gray300"
          bg="$gray700"
          px="$4"
          {...rest}
        />
      </GluestackInput>
      <FormControlError>
        <FormControlErrorText>{errorMessage}</FormControlErrorText>
      </FormControlError>
    </FormControl>
  );
}
