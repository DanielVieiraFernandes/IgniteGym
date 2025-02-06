import { AppError } from "@utils/AppError";
import axios from "axios";

const api = axios.create({
    baseURL: "http://192.168.15.26:3333",
    timeout: 30000,
    
});

api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if(error.response && error.response.data){
        return Promise.reject(new AppError(error.response.data.message));
    } 

    return Promise.reject(error);
})



export { api };