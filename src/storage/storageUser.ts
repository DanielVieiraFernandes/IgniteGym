import AsyncStorage from "@react-native-async-storage/async-storage";

import {UserDTO} from "@dtos/userDTO";
import { USER_STORAGE } from "./storageConfig";

export async function storageUserSave(user:UserDTO){
    try {
        await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
    } catch (error) {
        
    }
}

export async function storageUserGet(){
    try {
        
        const storage = await AsyncStorage.getItem(USER_STORAGE);

        const user: UserDTO = storage ? JSON.parse(storage) : {};

        return user;
    } catch (error) {
        
    }
}

export async function storageUserRemove(){
    try {
        await AsyncStorage.removeItem(USER_STORAGE);
    } catch (error) {
        throw error;
    }
}