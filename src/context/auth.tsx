import React, { useReducer, createContext } from 'react';
import jwtDecode from 'jwt-decode';

export interface USER {
  user: any
  login: (userData: USER_LOGIN) => void
  logout: () => void
}
export interface USER_LOGIN {
  id: string
  email: string
  token: string
  username: string
}

const initialState: USER = {
  user: null,
  login: (userData: USER_LOGIN) => {},
  logout: () => {}
};

if (localStorage.getItem('jwtToken')) {
  const decodedToken = jwtDecode(localStorage.getItem('jwtToken') as string) as any;

  if (decodedToken.exp * 1000 < Date.now()) 
    localStorage.removeItem('jwtToken');
  else 
    initialState.user = decodedToken;
}

const AuthContext: React.Context<USER> = createContext({
  user: null,
  login: (userData: USER_LOGIN) => {},
  logout: () => {}
});

function authReducer(state: USER, action: any) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
}

function AuthProvider(props: any) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  function login(userData: USER_LOGIN) {
    localStorage.setItem('jwtToken', userData.token);
    dispatch({
      type: 'LOGIN',
      payload: userData
    });
  }

  function logout() {
    localStorage.removeItem('jwtToken');
    dispatch({ type: 'LOGOUT' });
  }

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };
