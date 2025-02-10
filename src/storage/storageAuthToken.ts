import AsyncStorage from "@react-native-async-storage/async-storage";

import { AUTH_TOKEN_STORAGE } from "./storageConfig";

type StorageAuthTokenProps = {
    token: string;
    refreshToken: string;
}

export async function storageAuthTokenSave({token, refreshToken}:StorageAuthTokenProps) {
    try {
        await AsyncStorage.setItem(AUTH_TOKEN_STORAGE, JSON.stringify({token, refreshToken}));
    } catch (error) {
        throw error;
    }
}

export async function storageAuthTokenGet(){
    try {
        const response = await AsyncStorage.getItem(AUTH_TOKEN_STORAGE);

        const {token, refreshToken}:StorageAuthTokenProps = response ? JSON.parse(response) : {};

        return {
            token, refreshToken
        };
    } catch (error) {
        throw error;
    }
}

export async function storageAuthTokenRemove(){
    try {
        await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE);
    } catch (error) {
        throw error;
    }
}