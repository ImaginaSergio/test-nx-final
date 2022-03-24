import { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

/* Third-party imports */
import {
  Box,
  ChakraProvider,
  Flex,
  Spinner,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import { isMobile as isMobileBrowser } from 'react-device-detect';

/** Page imports */
import Home from './pages/Home/Home';
import Foro from './pages/Foro/Foro';
import Login from './pages/Login/Login';
import Cursos from './pages/Cursos/Cursos';
import Perfil from './pages/Perfil/Perfil';
import Roadmap from './pages/Roadmap/Roadmap';
import Procesos from './pages/Procesos/Procesos';
import Register from './pages/Register/Register';
import Comunidad from './pages/Comunidad/Comunidad';
import Favoritos from './pages/Favoritos/Favoritos';
import OnBoarding from './pages/OnBoarding/OnBoarding';
import Certificaciones from './pages/Certificaciones/Certificaciones';

/** Own component imports */
import { theme } from '@clevery-lms/ui';
import { Sidebar, RequireAuth } from './shared/components';
import { SesionController } from './controllers/sesion.controller';
import { IFavorito, IProgresoGlobal, IRuta, IUser } from '@clevery-lms/data';
import {
  getUserByID,
  LOGIN_TOKEN,
  LOGIN_USER,
  getFavoritos,
  addFavorito as serverAddFavorito,
  removeFavorito as serverRemoveFavorito,
} from '@clevery-lms/data';
import {
  LayoutContext,
  LoginContext,
  ThemeContext,
  RoadmapContext,
  FavoritosContext,
  ProgresoGlobalContext,
} from './shared/context';
import {
  setItem,
  setItemWithExpire,
  removeItem,
  getItem,
} from '@clevery-lms/data';
import { MovilSidebar } from './shared/components/navigation/Sidebar/MovilSidebar';

/** Style imports */
import './styles.scss';

const getTheme = (user: IUser) => {
  let data;

  if (user?.preferencias?.theme) data = user.preferencias.theme;
  else data = localStorage.getItem('chakra-ui-color-mode');

  return data === 'light' || data === 'dark' ? data : 'light';
};

function App() {
  const [token, setToken] = useState<string>();
  const [user, setUser] = useState<IUser | null>();
  const [ruta, setRuta] = useState<IRuta | null>();
  const [favoritos, setFavoritos] = useState<IFavorito[]>([]);
  const [progresoGlobal, setProgresoGlobal] =
    useState<IProgresoGlobal | null>();

  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  const [showHeader, setShowHeader] = useState<boolean>(true);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);

  const [firstLoad, setFirstLoad] = useState<boolean>(true);

  const disabledPages = process.env.REACT_APP_DISABLE_PAGES?.split(' ');

  const [isMobile] = useMediaQuery('(max-width: 548px)');
  const {
    isOpen: isOpenSidebar,
    onOpen: onOpenSidebar,
    onClose: onCloseSidebar,
  } = useDisclosure();

  useEffect(() => {
    const storageUser = getItem(LOGIN_USER);
    const storageToken = getItem(LOGIN_TOKEN);

    // Si existe token en localStorage probamos a hacer login con él.
    // Si no, limpiamos la información redundante.
    if (storageToken && storageUser)
      login({ token: storageToken }, storageUser?.id, true);
    else logout();
  }, []);

  useEffect(() => {
    if (user !== undefined) {
      setFirstLoad(false);

      if (user) {
        const _themeMode: 'light' | 'dark' = getTheme(user);

        setThemeMode(_themeMode);
        localStorage.setItem('chakra-ui-color-mode', _themeMode);
      }

      // Cuando iniciemos sesión, cargamos listado de favoritos
      (async () => {
        if (user?.id) {
          const dataFavoritos = await getFavoritos({
            query: [{ user_id: user?.id }, { limit: 10000 }],
            client: 'campus',
          });
          setFavoritos([...(dataFavoritos?.data || [])]);
        } else {
          setFavoritos([]);
        }
      })();
    }
  }, [user]);

  const login = async (
    _token: { token: string; type?: string },
    userId: any,
    saveInStorage: boolean
  ) => {
    // Si encontramos algún error, dejamos la petición.
    if (!_token.token || !userId) {
      logout();

      return Promise.reject('¡Faltan datos!');
    }

    // Guardamos el token en la contextAPI
    setToken(_token.token);

    // Y también en el localStorage para posteriores inicios de sesión durante una semana.
    // Si no quiere guardar sesión, guardaremos únicamente durante 1h.
    if (saveInStorage) setItem(LOGIN_TOKEN, _token.token);
    else setItemWithExpire(LOGIN_TOKEN, _token.token);

    // Y también recuperamos los datos del usuario
    const _user: IUser = await getUserByID({ id: userId, client: 'campus' });

    // Si encontramos algún error, dejamos la petición.
    if (!_user) {
      logout();

      return Promise.reject('¡Fallo al pedir datos del usuario!');
    }

    setUser({ ..._user });
    setProgresoGlobal(
      _user.progresoGlobal ? { ..._user.progresoGlobal } : null
    );
    setRuta(
      _user.progresoGlobal?.ruta ? { ..._user.progresoGlobal.ruta } : null
    );

    // Y los guardamos en local o session storage según convenga.
    if (saveInStorage) setItem(LOGIN_USER, { ..._user });
    else setItemWithExpire(LOGIN_USER, { ..._user });

    return Promise.resolve({ user: _user });
  };

  const logout = () => {
    setUser(null);
    setToken(undefined);

    removeItem(LOGIN_USER);
    removeItem(LOGIN_TOKEN);
  };

  // TODO: WIP (faltan endpoints de back)
  const filterFavoritos = (query: string) => {};

  const addFavorito = (newFavorito: IFavorito) => {
    setFavoritos((last) => [...last, newFavorito]);

    serverAddFavorito({ favorito: { ...newFavorito, objeto: undefined } });
  };

  const removeFavorito = (favorito: IFavorito) => {
    const last: any[] = [...favoritos]
      ?.map((fav) =>
        fav.objetoId == favorito.objetoId &&
        fav.tipo === favorito.tipo &&
        fav.userId == favorito.userId
          ? undefined
          : fav
      )
      ?.filter((fav) => fav);

    setFavoritos([...last]);

    if (favorito.id) serverRemoveFavorito({ id: favorito.id });
  };

  return (
    <Router basename="/">
      <ChakraProvider theme={theme}>
        <LoginContext.Provider
          value={{ user, setUser, token, setToken, login, logout }}
        >
          <ThemeContext.Provider value={{ themeMode, setThemeMode }}>
            <ProgresoGlobalContext.Provider
              value={{ progresoGlobal, setProgresoGlobal }}
            >
              <RoadmapContext.Provider value={{ ruta, setRuta }}>
                {firstLoad ? (
                  <Flex w="100%" h="100vh" align="center" justify="center">
                    <Spinner boxSize="40px" />
                  </Flex>
                ) : (
                  <LayoutContext.Provider
                    value={{
                      showHeader,
                      showSidebar,
                      setShowHeader,
                      setShowSidebar,
                      onOpenSidebar,
                      isMobile,
                    }}
                  >
                    <FavoritosContext.Provider
                      value={{
                        favoritos,
                        addFavorito,
                        removeFavorito,
                        filterFavoritos,
                      }}
                    >
                      <Flex className="app">
                        {showSidebar &&
                          (isMobile || isMobileBrowser ? (
                            <MovilSidebar
                              state={{ isOpenSidebar, onCloseSidebar }}
                            />
                          ) : (
                            <Sidebar />
                          ))}

                        <Box className="app-container">
                          <Routes>
                            <Route
                              element={
                                <RequireAuth
                                  isAuthenticated={!!user && user.activo}
                                />
                              }
                            >
                              <Route path="/" element={<Home />} />
                            </Route>

                            {!disabledPages?.includes('cursos') && (
                              <Route
                                element={
                                  <RequireAuth
                                    isAuthenticated={!!user && user.activo}
                                  />
                                }
                              >
                                <Route path="cursos/*" element={<Cursos />} />
                              </Route>
                            )}

                            {!disabledPages?.includes('perfil') && (
                              <Route
                                element={
                                  <RequireAuth
                                    isAuthenticated={!!user && user.activo}
                                  />
                                }
                              >
                                <Route path="perfil/*" element={<Perfil />} />
                              </Route>
                            )}

                            {!disabledPages?.includes('roadmap') && (
                              <Route
                                element={
                                  <RequireAuth
                                    isAuthenticated={!!user && user.activo}
                                  />
                                }
                              >
                                <Route path="roadmap/*" element={<Roadmap />} />
                              </Route>
                            )}

                            {!disabledPages?.includes('procesos') && (
                              <Route
                                element={
                                  <RequireAuth
                                    isAuthenticated={!!user && user.activo}
                                  />
                                }
                              >
                                <Route
                                  path="procesos/*"
                                  element={<Procesos />}
                                />
                              </Route>
                            )}

                            {!disabledPages?.includes('comunidad') && (
                              <Route
                                element={
                                  <RequireAuth
                                    isAuthenticated={!!user && user.activo}
                                  />
                                }
                              >
                                <Route
                                  path="comunidad/*"
                                  element={<Comunidad />}
                                />
                              </Route>
                            )}

                            {!disabledPages?.includes('certificaciones') && (
                              <Route
                                element={
                                  <RequireAuth
                                    isAuthenticated={!!user && user.activo}
                                  />
                                }
                              >
                                <Route
                                  path="certificaciones/*"
                                  element={<Certificaciones />}
                                />
                              </Route>
                            )}

                            {!disabledPages?.includes('favoritos') && (
                              <Route
                                element={
                                  <RequireAuth
                                    isAuthenticated={!!user && user.activo}
                                  />
                                }
                              >
                                <Route
                                  path="favoritos/*"
                                  element={<Favoritos />}
                                />
                              </Route>
                            )}

                            {!disabledPages?.includes('foro') && (
                              <Route
                                element={
                                  <RequireAuth
                                    isAuthenticated={!!user && user.activo}
                                  />
                                }
                              >
                                <Route path="foro/*" element={<Foro />} />
                              </Route>
                            )}

                            {!disabledPages?.includes('register') && (
                              <Route path="register/*" element={<Register />} />
                            )}

                            <Route
                              path="onboarding/*"
                              element={<OnBoarding />}
                            />
                            <Route path="login/*" element={<Login />} />

                            <Route
                              element={<RequireAuth isAuthenticated={!!user} />}
                            >
                              <Route path="*" element={<Navigate to="/" />} />
                            </Route>
                          </Routes>
                        </Box>
                      </Flex>
                    </FavoritosContext.Provider>
                  </LayoutContext.Provider>
                )}

                <SesionController />
              </RoadmapContext.Provider>
            </ProgresoGlobalContext.Provider>
          </ThemeContext.Provider>
        </LoginContext.Provider>
      </ChakraProvider>
    </Router>
  );
}

export default App;
