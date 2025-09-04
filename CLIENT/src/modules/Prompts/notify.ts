import { useGlobalContext } from "@/context/Context";

export type NotificationType = "success" | "error" | "message";

export const useNotify = () => {
    const { setNotify } = useGlobalContext();

    return (message: string, type: NotificationType = "message") => {
        setNotify({ message, type });
    };
};


