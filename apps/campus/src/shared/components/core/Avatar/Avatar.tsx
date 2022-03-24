import { Center, Image } from '@chakra-ui/react';

type AvatarProps = {
  src?: string;
  name?: string;
  size?: string;
  rounded?: string;
  bgColor?: string;
  fontSize?: string;
};

export const Avatar = ({ src, name = 'NA', size, fontSize = '15px', rounded = '50%', bgColor = 'primary' }: AvatarProps) => {
  return src ? (
    <Image fit="cover" minW={size} minH={size} h={size} w={size} rounded={rounded} alt={name} src={src} />
  ) : (
    <Center
      w={size}
      h={size}
      minW={size}
      minH={size}
      bg={bgColor}
      color="#fff"
      lineHeight="20px"
      fontWeight="bold"
      rounded={rounded}
      fontSize={fontSize}
      textTransform="uppercase"
    >
      {name}
    </Center>
  );
};
