import { useContext, useEffect, useState } from 'react';

import { BsDiscord } from 'react-icons/bs';
import { Flex, Button, Image, Text, Icon, useToast } from '@chakra-ui/react';

import { getUserByID, updateUser } from '@clevery-lms/data';
import DiscordWidgetBg from '../../../../assets/home/OBDiscord.png';
import { LayoutContext, LoginContext } from '../../../../shared/context';
import { onFailure } from '@clevery-lms/utils';

export const DiscordWidget = () => {
  const toast = useToast();

  const { isMobile } = useContext(LayoutContext);
  const { user, setUser } = useContext(LoginContext);

  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (
      user?.preferencias?.showDiscord === false ||
      process.env.REACT_APP_SHOW_DISCORD === 'FALSE'
    )
      setOpen(false);
    else setOpen(true);
  }, [user]);

  const closeDiscord = () => {
    if (!user?.id) {
      onFailure(
        toast,
        'Error inesperado',
        'El ID de usuario es undefined. Por favor, contacte con soporte.'
      );
      return;
    }

    setOpen(false);

    updateUser({ id: user.id, user: { preferencias: { showDiscord: false } } })
      .then(async (res) => {
        const dataUser = await getUserByID({ id: user.id || 0 });

        if (!dataUser.isAxiosError) setUser({ ...dataUser });
        else console.error({ error: dataUser });
      })
      .catch((err) => console.error({ err }));
  };

  return open ? (
    <Flex
      w="100%"
      h="100%"
      maxH="100%"
      bg="white"
      rounded="2xl"
      align="center"
      overflow="hidden"
      border="1px solid var(--chakra-colors-gray_3)"
    >
      <Flex
        wrap="wrap"
        w="90%"
        justify="center"
        align="space-between"
        direction="column"
        px={{ base: '20px', sm: '40px' }}
        py={{ base: '30px', sm: '50px' }}
      >
        <Text variant="h2_heading" color="black" mb="10px">
          Una comunidad para todos
        </Text>

        <Text variant="p_text" color="black" mb="30px">
          Tenemos una comunidad en Discord en la que alumnos y profesores pueden
          interactuar y preguntar o responder dudas o curiosidades.
        </Text>

        <Flex direction={{ base: 'column', md: 'row' }} gap="12px">
          <a
            href="https://discord.gg/tzDGcwkn4R"
            target="_blank"
            rel="noreferrer"
          >
            <Button
              bg="#475AE1"
              w="fit-content"
              rounded="12px"
              color="white"
              fontSize="16px"
              fontWeight="bold"
              lineHeight="16px"
              _hover={{ opacity: '0.8' }}
              rightIcon={<Icon as={BsDiscord} />}
            >
              Ir a Discord
            </Button>
          </a>

          <Button
            bg="gray_3"
            w="fit-content"
            rounded="12px"
            fontSize="16px"
            color="black"
            fontWeight="bold"
            lineHeight="16px"
            _hover={{ opacity: '0.8' }}
            onClick={closeDiscord}
          >
            Ahora no
          </Button>
        </Flex>
      </Flex>
      {!isMobile && (
        <Flex
          boxSize="100%"
          justify="flex-end"
          align="center"
          position="relative"
        >
          <Image
            position="absolute"
            h="494px"
            left="10%"
            src={DiscordWidgetBg}
            fit="cover"
            style={{
              filter: 'drop-shadow(0px 4px 15px rgba(0, 0, 0, 0.25))',
              maxWidth: 'fit-content',
            }}
          />
        </Flex>
      )}
    </Flex>
  ) : null;
};
