import { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

/** Page imports */
import Meta from './pages/Meta/Meta';
import Login from './pages/Login/Login';
import Cursos from './pages/Cursos/Cursos';
import Clientes from './pages/Clientes/Clientes';
import Usuarios from './pages/Usuarios/Usuarios';
import Ejercicios from './pages/Ejercicios/Ejercicios';
import Estadisticas from './pages/Estadisticas/Estadisticas';
import Configuracion from './pages/Configuracion/Configuracion';
import Certificaciones from './pages/Certificaciones/Certificaciones';

/* Component imports */
import { RequireAuth } from './shared/components';
import { Sidebar } from './shared/components/Navigation/Sidebar/Sidebar';

/* Third-party imports */
import { ChakraProvider, Flex } from '@chakra-ui/react';

/** Other imports */
import { theme } from '@clevery-lms/ui';
import { isRoleAllowed } from '@clevery-lms/utils';
import LogoOpenBootcamp from './assets/logos/LogoOpenBootcamp.png';
import { LoginContext, QueryContext, ThemeContext } from './shared/context';
import {
  getItem,
  setItem,
  setItemWithExpire,
  removeItem,
} from '@clevery-lms/data';
import {
  IUser,
  UserRolEnum,
  getUserByID,
  LOGIN_USER,
  LOGIN_TOKEN,
} from '@clevery-lms/data';

/** Style imports */
import './styles.scss';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const getThemeFromLocal = () => {
  const data = localStorage.getItem('chakra-ui-color-mode');

  return data === 'light' || data === 'dark' ? data : undefined;
};

function App() {
  const [page, setPage] = useState<string>('');
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [query, setQuery] = useState<Map<string, any>>(new Map<string, any>());

  const [user, setUser] = useState<any>();
  const [token, setToken] = useState<string>();
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(
    getThemeFromLocal() || 'light'
  );

  useEffect(() => {
    const storageUser = getItem(LOGIN_USER);
    const storageToken = getItem(LOGIN_TOKEN);

    // Si existe token en localStorage probamos a hacer login con él.
    // Si no, limpiamos la información redundante.
    if (storageToken) login({ token: storageToken }, storageUser.id, true);
    else logout();
  }, []);

  const login = async (
    _token: { token: string; type?: string },
    userId: number,
    saveInStorage: boolean
  ) => {
    // Guardamos el token en la contextAPI
    setToken(_token.token);

    // Y también en el localStorage para posteriores inicios de sesión durante una semana.
    // Si no quiere guardar sesión, guardaremos únicamente durante 1h.
    if (saveInStorage) setItem(LOGIN_TOKEN, _token.token);
    else setItemWithExpire(LOGIN_TOKEN, _token.token);

    // Y también recuperamos los datos del usuario
    const _user: IUser = await getUserByID({ id: userId, client: 'admin' });

    if (
      isRoleAllowed([UserRolEnum.ADMIN, UserRolEnum.SUPERVISOR], _user?.rol)
    ) {
      setUser({ ..._user });

      // Y los guardamos en local o session storage según convenga.
      if (saveInStorage) setItem(LOGIN_USER, { ..._user });
      else setItemWithExpire(LOGIN_USER, { ..._user });
    } else {
      logout();
    }

    return Promise.resolve();
  };

  useEffect(() => {
    if (user !== undefined) setFirstLoad(false);
  }, [user]);

  const logout = () => {
    setUser(null);
    setToken(undefined);

    removeItem(LOGIN_USER);
    removeItem(LOGIN_TOKEN);
  };

  return (
    <Router basename="/">
      <ChakraProvider theme={theme}>
        <LoginContext.Provider
          value={{ user, setUser, token, setToken, login, logout }}
        >
          <ThemeContext.Provider value={{ themeMode, setThemeMode }}>
            <QueryContext.Provider
              value={{
                page,
                setPage,
                query,
                resetQuery: () => setQuery(new Map<string, any>()),
                setQuery: (key: string, value: any) =>
                  setQuery(new Map<string, any>(query.set(key, value))),
              }}
            >
              <div className="app">
                {!firstLoad ? (
                  <>
                    {user && <Sidebar />}

                    <div className="app-container">
                      <Routes>
                        <Route
                          element={
                            <RequireAuth
                              isAuthenticated={isRoleAllowed(
                                [UserRolEnum.ADMIN],
                                user?.rol
                              )}
                            />
                          }
                        >
                          <Route path="meta/*" element={<Meta />} />
                        </Route>

                        <Route
                          element={
                            <RequireAuth
                              isAuthenticated={isRoleAllowed(
                                [UserRolEnum.ADMIN],
                                user?.rol
                              )}
                            />
                          }
                        >
                          <Route path="cursos/*" element={<Cursos />} />
                        </Route>

                        <Route
                          element={
                            <RequireAuth
                              isAuthenticated={isRoleAllowed(
                                [UserRolEnum.ADMIN],
                                user?.rol
                              )}
                            />
                          }
                        >
                          <Route path="clientes/*" element={<Clientes />} />
                        </Route>

                        <Route
                          element={
                            <RequireAuth
                              isAuthenticated={isRoleAllowed(
                                [
                                  UserRolEnum.ADMIN,
                                  UserRolEnum.SUPERVISOR,
                                  UserRolEnum.PROFESOR,
                                ],
                                user?.rol
                              )}
                            />
                          }
                        >
                          <Route path="usuarios/*" element={<Usuarios />} />
                        </Route>

                        <Route
                          element={
                            <RequireAuth
                              isAuthenticated={isRoleAllowed(
                                [UserRolEnum.ADMIN],
                                user?.rol
                              )}
                            />
                          }
                        >
                          <Route
                            path="configuracion/*"
                            element={<Configuracion />}
                          />
                        </Route>

                        <Route
                          element={
                            <RequireAuth
                              isAuthenticated={isRoleAllowed(
                                [UserRolEnum.ADMIN],
                                user?.rol
                              )}
                            />
                          }
                        >
                          <Route
                            path="certificaciones/*"
                            element={<Certificaciones />}
                          />
                        </Route>

                        <Route
                          element={
                            <RequireAuth
                              isAuthenticated={isRoleAllowed(
                                [
                                  UserRolEnum.ADMIN,
                                  UserRolEnum.SUPERVISOR,
                                  UserRolEnum.PROFESOR,
                                ],
                                user?.rol
                              )}
                            />
                          }
                        >
                          <Route path="ejercicios/*" element={<Ejercicios />} />
                        </Route>

                        <Route
                          element={
                            <RequireAuth
                              isAuthenticated={isRoleAllowed(
                                [UserRolEnum.ADMIN, UserRolEnum.SUPERVISOR],
                                user?.rol
                              )}
                            />
                          }
                        >
                          <Route
                            path="estadisticas/*"
                            element={<Estadisticas />}
                          />
                        </Route>

                        <Route path="login/*" element={<Login />} />
                        <Route
                          path="*"
                          element={
                            isRoleAllowed(
                              [UserRolEnum.SUPERVISOR],
                              user?.rol
                            ) ? (
                              <Navigate to="/usuarios" />
                            ) : (
                              <Navigate to="/cursos" />
                            )
                          }
                        />
                      </Routes>
                    </div>
                  </>
                ) : (
                  <Flex
                    boxSize="100%"
                    direction="column"
                    align="center"
                    justify="center"
                  >
                    <img
                      className="loading-animation"
                      src={LogoOpenBootcamp}
                      alt="Logotipo de OpenBootcamp"
                    />
                  </Flex>
                )}
              </div>
            </QueryContext.Provider>
          </ThemeContext.Provider>
        </LoginContext.Provider>
      </ChakraProvider>
    </Router>
  );
}

export default App;
