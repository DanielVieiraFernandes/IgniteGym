import { UserDTO } from "@dtos/userDTO";
import { api } from "@services/api";
import { createContext, useContext, useEffect, useState } from "react";
import {
  storageUserSave,
  storageUserGet,
  storageUserRemove,
} from "@storage/storageUser";
import {
  storageAuthTokenSave,
  storageAuthTokenGet,
  storageAuthTokenRemove,
} from "@storage/storageAuthToken";

export type AuthContextDataProps = {
  user: UserDTO;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoadingUserStoragedata: boolean;
};

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

type AuthContextProviderProps = {
  children: React.ReactNode;
};

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO);
  const [isLoadingUserStoragedata, setIsLoadingUserStoragedata] =
    useState<boolean>(true);

  async function userAndTokenUpdate(userData: UserDTO, token: string) {
    try {
      setIsLoadingUserStoragedata(true);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(userData);
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStoragedata(false);
    }
  }

  async function storageUserAndTokenSave(userData: UserDTO, token: string) {
    try {
      setIsLoadingUserStoragedata(true);
      await storageUserSave(userData);
      await storageAuthTokenSave(token);
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStoragedata(false);
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data } = await api.post("/sessions", { email, password });

      console.log(data);

      if (data.user && data.token) {
        setIsLoadingUserStoragedata(true);
        await storageUserAndTokenSave(data.user, data.token);
        await userAndTokenUpdate(data.user, data.token);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStoragedata(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoadingUserStoragedata(true);
      setUser({} as UserDTO);
      await storageUserRemove();
      await storageAuthTokenRemove();
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStoragedata(false);
    }
  };

  async function loadUserData() {
    try {
      setIsLoadingUserStoragedata(true);
      const userLogged = await storageUserGet();
      const token = await storageAuthTokenGet();

      if (userLogged && token) {
        userAndTokenUpdate(userLogged, token);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStoragedata(false);
    }
  }

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        isLoadingUserStoragedata,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
