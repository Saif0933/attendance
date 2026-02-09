import { AxiosError } from "axios";
import { ToastAndroid } from "react-native";

export const showError = (error: AxiosError | Error) => {
    if(error instanceof AxiosError){
       ToastAndroid.show(error.response?.data?.message || "Something went wrong", ToastAndroid.LONG); 
    }else{
        ToastAndroid.show(error.message || "Something went wrong", ToastAndroid.LONG);
    }
}

export const showSuccess = (message: string) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
}