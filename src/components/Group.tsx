import { Button, Text } from "@gluestack-ui/themed";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof Button> & {
  name: string;
  isActive: boolean;
};

export function Group({ name, isActive, ...rest }: Props) {

  return (
    <Button
      minWidth="$24"
      height="$10"
      bg="$gray600"
      rounded="$md"
      justifyContent="center"
      alignItems="center"
      borderColor="$green500"
      borderWidth={isActive ? 1 : 0}
      mr="$3"
      sx={{
        ":active": {
          borderWidth: 1,
        },
      }}
      {...rest}
    >
      <Text
        color={isActive ? "$green500" : "$gray200"}
        textTransform="uppercase"
        fontSize="$xs"
        fontFamily="$heading"
      >
        {name}
      </Text>
    </Button>
  );
}
