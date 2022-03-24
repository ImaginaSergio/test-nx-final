import { useContext, useEffect, useState } from 'react';

import ReactPlayer from 'react-player';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import {
  BiCog,
  BiError,
  BiExitFullscreen,
  BiFullscreen,
  BiPause,
  BiPlay,
  BiVolumeFull,
  BiVolumeMute,
} from 'react-icons/bi';
import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tooltip,
  useMediaQuery,
  useToast,
} from '@chakra-ui/react';

import { ILeccion } from '@clevery-lms/data';
import { updateProgresoGlobal } from '@clevery-lms/data';
import { capitalizeFirst, fmtSnds, onFailure } from '@clevery-lms/utils';
import {
  LoginContext,
  ProgresoGlobalContext,
} from '../../../../../shared/context';
import {
  EVENTO_VIDEO_PAUSE,
  EVENTO_VIDEO_PLAY,
} from '../../../../../controllers/sesion.controller';

import './LeccionesPlayer.css';

let controlsTimeout: any = undefined;
const PROGRESO_VIDEO = 60 * 5;

interface PlayerProps {
  player: any;
  leccion?: ILeccion;
  onLeccionStarted: (leccion: ILeccion) => void;
  onLeccionCompleted: (leccion: ILeccion) => void;
}

type Quality = '360p' | '720p' | '1080p' | 'auto';

export const LeccionesPlayer = ({
  player,
  leccion,
  onLeccionCompleted,
  onLeccionStarted,
}: PlayerProps) => {
  const fullscreenHandler = useFullScreenHandle();
  const toast = useToast();

  const { progresoGlobal, setProgresoGlobal } = useContext(
    ProgresoGlobalContext
  );
  const { user } = useContext(LoginContext);

  const [savedSeconds, setSavedSeconds] = useState<number>();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(100);
  const [playedSeconds, setPlayedSeconds] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [quality, setQuality] = useState<Quality>('auto');
  const [isMute, setIsMute] = useState<boolean>(false);
  const [areControlsVisible, setAreControlsVisible] = useState<boolean>(true);
  const [refreshProgressVideo, setRefreshProgressVideo] =
    useState<boolean>(false);
  const [shouldMountPlayer, setShouldMountPlayer] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const [isMobilePlayer] = useMediaQuery('(max-width: 490px)');

  function updateProgresoVideo() {
    if (leccion?.id && progresoGlobal?.progresoLecciones) {
      const _progresoLecciones = progresoGlobal?.progresoLecciones;

      _progresoLecciones[leccion?.id] = playedSeconds;
      _progresoLecciones.lastPlayed = leccion?.id;

      updateProgresoGlobal({
        id: progresoGlobal?.id || 0,
        progresoGlobal: { progresoLecciones: _progresoLecciones },
      });
    }
  }

  useEffect(() => {
    setIsPlaying(false);
    setIsReady(false);
    setRefreshProgressVideo(!refreshProgressVideo);
  }, []);

  useEffect(() => {
    const progresoLecciones: any = progresoGlobal?.progresoLecciones;
    const segundos =
      progresoLecciones && leccion?.id ? progresoLecciones[leccion?.id] : 0;

    setPlayedSeconds(segundos);
    setSavedSeconds(segundos);
    setIsPlaying(false);
    setError(false);
  }, [leccion]);

  useEffect(() => {
    if (shouldMountPlayer && isReady && player?.current)
      player?.current?.seekTo(playedSeconds);
  }, [shouldMountPlayer]);

  useEffect(() => {
    setTimeout(() => updateProgresoVideo(), PROGRESO_VIDEO * 1000);
  }, [refreshProgressVideo]);

  const onProgressChange = async (playedSeconds: number) => {
    await player?.current?.seekTo(playedSeconds);
  };

  const handleVolumeChange = (volume: number) => {
    setVolume(volume);
    if (volume === 0) setIsMute(true);
    else setIsMute(false);
  };

  const showControls = (shouldSetTimeout: boolean) => {
    setAreControlsVisible(true);
    clearTimeout(controlsTimeout);
    if (shouldSetTimeout)
      controlsTimeout = setTimeout(() => setAreControlsVisible(false), 3000);
  };

  const handleOnReady = async () => {
    await setIsPlaying(true);
    await player?.current?.seekTo(savedSeconds);
    await setIsPlaying(false);
    setIsReady(true);
  };

  function handleOnEnded() {
    if (leccion) {
      onLeccionCompleted(leccion);
      updateProgresoVideo();
    } else {
      onFailure(
        toast,
        'Error al guardar el progreso',
        'La lección es indefinida. Actualice la página y contacte con soporte si el error persiste..'
      );
    }
  }

  function handleOnStart() {
    if (leccion) {
      onLeccionStarted(leccion);

      if (!progresoGlobal?.progresoLecciones[leccion.id || 0]) {
        updateProgresoGlobal({
          id: user?.progresoGlobal.id || 0,
          progresoGlobal: JSON.parse(
            `{"progresosLecciones": {"${leccion?.id || 0}": ${playedSeconds}}}`
          ),
        })
          .then((res) => setProgresoGlobal({ ...res?.value?.data }))
          .catch((error) => console.error(error));
      }
    } else {
      onFailure(
        toast,
        'Error al guardar el progreso',
        'La lección es indefinida. Actualice la página y contacte con soporte si el error persiste..'
      );
    }
  }

  function handleOnSeek(seconds: number) {
    setPlayedSeconds(seconds);
  }

  function handleOnPlay() {
    setIsPlaying(true);

    const onPlayEvent = new Event(EVENTO_VIDEO_PLAY);

    window.dispatchEvent(onPlayEvent);
  }

  function handleOnPause() {
    setIsPlaying(false);
    updateProgresoVideo();

    const onPauseEvent = new Event(EVENTO_VIDEO_PAUSE);

    window.dispatchEvent(onPauseEvent);
  }

  const handleChangeQuality = async (quality: Quality) => {
    await setShouldMountPlayer(false);
    await setQuality(quality);
    await setShouldMountPlayer(true);
  };

  return error ? (
    <Center color="white" w="100%" bg="#000000" style={{ aspectRatio: '16/9' }}>
      <Icon m="20px" fontSize="7xl" as={BiError} />

      <Box fontWeight="bold" fontSize="3xl">
        Se ha producido un error inesperado
      </Box>

      <Box fontSize="xl">Inténtalo de nuevo más tarde</Box>
    </Center>
  ) : (
    <FullScreen className="w100 h100 hidden" handle={fullscreenHandler}>
      <Flex
        position="relative"
        bg="#000000"
        boxSize="100%"
        minH={{ base: '248px', sm: '348px' }}
        maxH={fullscreenHandler.active ? {} : { base: '650px', '2xl': '748px' }}
        style={{ aspectRatio: '16/9' }}
      >
        {shouldMountPlayer && (
          <ReactPlayer
            ref={player}
            onReady={handleOnReady}
            onStart={handleOnStart}
            onEnded={handleOnEnded}
            onPlay={handleOnPlay}
            onPause={handleOnPause}
            onSeek={handleOnSeek}
            onProgress={(p) => setPlayedSeconds(p.playedSeconds)}
            /* onError={() => setError(true)} */
            onDuration={(d) => setDuration(d)}
            allowFullScreen
            config={{
              vimeo: { playerOptions: { quality: quality, responsive: true } },
            }}
            playbackRate={playbackSpeed}
            pip
            volume={volume / 100}
            muted={isMute}
            playing={isPlaying}
            controls={false}
            width="100%"
            height="100%"
            url={leccion?.contenido}
            style={{ aspectRatio: '16/9' }}
          />
        )}

        <Flex
          top="0px"
          left="0px"
          right="0px"
          bottom="54px"
          position="absolute"
          align="center"
          justify="center"
          onMouseMove={() => showControls(true)}
          onClick={() => setIsPlaying(!isPlaying)}
          cursor={areControlsVisible ? 'pointer' : 'none'}
          bg={isPlaying ? 'transparent' : 'blackAlpha.400'}
        >
          {!isPlaying && <Icon fontSize="90px" color="#FFF" as={BiPlay} />}
        </Flex>

        <Flex
          color="white"
          align="center"
          px="16px"
          h="54px"
          left="0px"
          right="0px"
          bottom="0px"
          position="absolute"
          bg="rgb(0, 0, 0, 0.6)"
          onMouseEnter={() => showControls(false)}
          style={{ backdropFilter: 'blur(100px)' }}
          visibility={!isPlaying || areControlsVisible ? 'visible' : 'hidden'}
        >
          <Icon
            cursor="pointer"
            boxSize="32px"
            onClick={() => setIsPlaying(!isPlaying)}
            as={isPlaying ? BiPause : BiPlay}
            color="whiteAlpha.800"
          />

          <Flex w="100%" px="8px" align="center" gap="8px">
            <Slider
              max={duration || 100}
              h="5px"
              value={playedSeconds}
              onChange={onProgressChange}
              aria-label="video-playedSeconds"
            >
              <SliderTrack bgColor="whiteAlpha.300">
                <SliderFilledTrack bgColor="whiteAlpha.800" />
              </SliderTrack>

              <Tooltip
                color="#000"
                placement="top"
                bgColor="white"
                label={fmtSnds(playedSeconds)}
                visibility={isPlaying ? 'hidden' : 'visible'}
              >
                <SliderThumb bg="whiteAlpha.900" />
              </Tooltip>
            </Slider>

            <Box color="whiteAlpha.800">{`${
              duration - playedSeconds > 0 ? '-' : ''
            }${fmtSnds(duration - playedSeconds)}`}</Box>

            {!isMobilePlayer && (
              <>
                <Menu placement="top">
                  <Tooltip placement="top" label="Velocidad de reproducción">
                    <MenuButton
                      _hover={{ bg: 'transparent' }}
                      _active={{ bg: 'transparent' }}
                      as={Button}
                      p="0px"
                      w="fit-content"
                      minW="fit-content"
                      bg="transparent"
                      paddingInline="0px"
                      color="whiteAlpha.800"
                    >
                      <Icon boxSize="25px" cursor="pointer" as={BiCog} />
                    </MenuButton>
                  </Tooltip>

                  <MenuList title="Velocidad de reproducción" color="black">
                    <MenuItem onClick={() => setPlaybackSpeed(0.25)}>
                      x0.25
                    </MenuItem>
                    <MenuItem onClick={() => setPlaybackSpeed(0.5)}>
                      x0.5
                    </MenuItem>
                    <MenuItem onClick={() => setPlaybackSpeed(0.75)}>
                      x0.75
                    </MenuItem>
                    <MenuItem onClick={() => setPlaybackSpeed(1)}>x1</MenuItem>
                    <MenuItem onClick={() => setPlaybackSpeed(1.25)}>
                      x1.25
                    </MenuItem>
                    <MenuItem onClick={() => setPlaybackSpeed(1.5)}>
                      x1.5
                    </MenuItem>
                    <MenuItem onClick={() => setPlaybackSpeed(2)}>x2</MenuItem>
                  </MenuList>
                </Menu>

                <Menu placement="top">
                  <Tooltip placement="top" label="Calidad de reproducción">
                    <MenuButton
                      alignContent="center"
                      justify="center"
                      _hover={{ bg: 'transparent' }}
                      _active={{ bg: 'transparent' }}
                      as={Button}
                      p="0px"
                      pt="3px"
                      pl="1px"
                      m="0px"
                      bg="transparent"
                      color="whiteAlpha.800"
                    >
                      <Box>{capitalizeFirst(quality)}</Box>
                    </MenuButton>
                  </Tooltip>

                  <MenuList title="Velocidad de reproducción" color="black">
                    <MenuItem onClick={() => handleChangeQuality('1080p')}>
                      1080p
                    </MenuItem>
                    <MenuItem onClick={() => handleChangeQuality('720p')}>
                      720p
                    </MenuItem>
                    <MenuItem onClick={() => handleChangeQuality('360p')}>
                      360p
                    </MenuItem>
                    <MenuItem onClick={() => handleChangeQuality('auto')}>
                      Auto
                    </MenuItem>
                  </MenuList>
                </Menu>
              </>
            )}

            {isMobilePlayer && (
              <Menu placement="top">
                  <Tooltip placement="top" label="Ajustes">
                    <MenuButton
                      _hover={{ bg: 'transparent' }}
                      _active={{ bg: 'transparent' }}
                      as={Button}
                      p="0px"
                      w="fit-content"
                      minW="fit-content"
                      bg="transparent"
                      paddingInline="0px"
                      color="whiteAlpha.800"
                    >
                      <Icon boxSize="25px" cursor="pointer" as={BiCog} />
                    </MenuButton>
                  </Tooltip>

                  <MenuList
                    title="Velocidad de reproducción"
                    color="#000"
                    bg="whiteAlpha.900"
                    p="5px"
                    w="fit-content"
                    display="flex"
                    flexDirection="column"
                  >
                    <Menu>
                      <MenuButton
                        _hover={{ bg: 'transparent' }}
                        _active={{ bg: 'transparent' }}
                        as={Button}
                        p="0px"
                        w="fit-content"
                        minW="fit-content"
                        bg="transparent"
                        paddingInline="0px"
                        color="#5b5b5b"
                      >
                        Velocidad
                      </MenuButton>

                      <MenuList title="Velocidad de reproducción" color="#000">
                        <MenuItem onClick={() => setPlaybackSpeed(0.25)}>
                          x0.25
                        </MenuItem>
                        <MenuItem onClick={() => setPlaybackSpeed(0.5)}>
                          x0.5
                        </MenuItem>
                        <MenuItem onClick={() => setPlaybackSpeed(0.75)}>
                          x0.75
                        </MenuItem>
                        <MenuItem onClick={() => setPlaybackSpeed(1)}>
                          x1
                        </MenuItem>
                        <MenuItem onClick={() => setPlaybackSpeed(1.25)}>
                          x1.25
                        </MenuItem>
                        <MenuItem onClick={() => setPlaybackSpeed(1.5)}>
                          x1.5
                        </MenuItem>
                        <MenuItem onClick={() => setPlaybackSpeed(2)}>
                          x2
                        </MenuItem>
                      </MenuList>
                    </Menu>

                    <Menu placement="top">
                      <Tooltip placement="top" label="Calidad de reproducción">
                        <MenuButton
                          alignContent="center"
                          justify="center"
                          _hover={{ bg: 'transparent' }}
                          _active={{ bg: 'transparent' }}
                          as={Button}
                          p="0px"
                          pt="3px"
                          pl="1px"
                          m="0px"
                          bg="transparent"
                          color="#5b5b5b"
                        >
                          <Box>{capitalizeFirst(quality)}</Box>
                        </MenuButton>
                      </Tooltip>

                      <MenuList title="Velocidad de reproducción" color="black">
                        <MenuItem onClick={() => handleChangeQuality('1080p')}>
                          1080p
                        </MenuItem>
                        <MenuItem onClick={() => handleChangeQuality('720p')}>
                          720p
                        </MenuItem>
                        <MenuItem onClick={() => handleChangeQuality('360p')}>
                          360p
                        </MenuItem>
                        <MenuItem onClick={() => handleChangeQuality('auto')}>
                          Auto
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </MenuList>
                </Menu>
            )}

            {!isMobilePlayer && (
              <>
                <Icon
                  cursor="pointer"
                  fontSize="25px"
                  as={isMute ? BiVolumeMute : BiVolumeFull}
                  onClick={() => setIsMute(!isMute)}
                  color="whiteAlpha.800"
                />

                <Slider
                  value={isMute ? 0 : volume}
                  onChange={(v) => handleVolumeChange(v)}
                  max={100}
                  min={0}
                  w="120px"
                  h="5px"
                  aria-label="video-playedSeconds"
                >
                  <SliderTrack bgColor="whiteAlpha.200">
                    <SliderFilledTrack bgColor="whiteAlpha.800" />
                  </SliderTrack>

                  <SliderThumb bg="whiteAlpha.900" />
                </Slider>
              </>
            )}

            {isMobilePlayer && (
              <Popover placement="top">
                <PopoverTrigger>
                  <IconButton
                    bg="transparent"
                    color="whiteAlpha.800"
                    aria-label="sonido"
                    fontSize="25px"
                    p="0px"
                    w="fit-content"
                    minW="fit-content"
                    paddingInline="0px"
                    outline="none"
                    _active={{ border: 'none' }}
                    icon={
                      isMute ? (
                        <BiVolumeMute size="25px" />
                      ) : (
                        <BiVolumeFull size="25px" />
                      )
                    }
                  />
                </PopoverTrigger>

                <PopoverContent
                  w="fit-content"
                  bg="transparent"
                  border="none"
                  _active={{ outline: 'none' }}
                >
                  <PopoverBody>
                    <Slider
                      orientation="vertical"
                      value={isMute ? 0 : volume}
                      onChange={(v) => handleVolumeChange(v)}
                      max={100}
                      min={0}
                      w="5px"
                      h="120px"
                      aria-label="video-playedSeconds"
                    >
                      <SliderTrack bgColor="whiteAlpha.300">
                        <SliderFilledTrack bgColor="whiteAlpha.800" />
                      </SliderTrack>
                      <SliderThumb bg="whiteAlpha.900" />{' '}
                    </Slider>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            )}

            <Tooltip
              label={
                fullscreenHandler.active ? 'Exit fullscreen' : 'Fullscreen'
              }
              placement="top"
            >
              <Icon
                color="whiteAlpha.800"
                cursor="pointer"
                onClick={
                  fullscreenHandler.active
                    ? fullscreenHandler.exit
                    : fullscreenHandler.enter
                }
                ml="8px"
                fontSize="20px"
                as={fullscreenHandler.active ? BiExitFullscreen : BiFullscreen}
              />
            </Tooltip>
          </Flex>
        </Flex>
      </Flex>
    </FullScreen>
  );
};
