import { useCallback, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";


interface NotificationPromptProps {
    message: string;
    type: string;
}

const NotificationPrompt = ({ message, type }: NotificationPromptProps) => {

    const toastPayload = {
        position: "top-center",
        autoClose: 3000
    }
    const notifyPrompt = useCallback(() => {

        switch (type) {

            case "error": toast.error(`${message}`, toastPayload as any);
                break;
            case "success": toast.success(`${message}`, toastPayload as any);
                break;
            case "message": toast.error(`${message}`, toastPayload as any);
                break;

            default: return;
        }


    }, [message]);


    useEffect(() => {
        notifyPrompt();
    }, [message]);

    return (
        <div>
            <ToastContainer />
        </div>
    )
}

export default NotificationPrompt;