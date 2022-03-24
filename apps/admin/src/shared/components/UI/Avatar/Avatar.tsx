import { Center, Image } from '@chakra-ui/react';

type AvatarProps = {
  src?: string;
  name: string;
  size?: string;
  fontSize?: string;
  rounded?: string;
};

export const Avatar = ({ src, name, size, fontSize = '15px', rounded = '150px' }: AvatarProps) => {
  return src ? (
    <Image fit="cover" minW={size} minH={size} h={size} w={size} rounded={rounded} alt={name} src={src} />
  ) : (
    <Center
      bg="#1EE59C"
      color="#17B482"
      lineHeight="20px"
      fontWeight="bold"
      w={size}
      h={size}
      minW={size}
      minH={size}
      rounded={rounded}
      fontSize={fontSize}
      textTransform="uppercase"
    >
      {name}
    </Center>
  );
};
