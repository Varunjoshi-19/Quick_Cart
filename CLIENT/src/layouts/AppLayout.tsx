import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "@/components/Footer";
import { ChevronUp } from "lucide-react";
import { MenuOptionBar } from "@/modules/MenuOptionBar";
import { scrollToTop } from "@/utils/index"
import { useGlobalContext } from "@/context/Context";
import NotificationPrompt from "@/modules/Prompts/prompt";
function AppLayout() {

    const [showButton, setShowButton] = useState(false);
    const { notification } = useGlobalContext();
 

    useEffect(() => {
          
    scrollToTop();
     
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    return (
        <div style={{ overflow: "hidden" }}>

            {notification && <NotificationPrompt message={notification.message} type={notification.type} />}

            <NavBar />
            <main style={{ display: "flex", justifyContent: 'center', alignItems: "center", marginTop: "180px" }}>
                <Outlet />
            </main>
            <Footer />

            <div
                className={`fixed bottom-6 right-6 transition-all duration-500 ${showButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    }`}
            >
                <button
                    onClick={scrollToTop}
                    className="p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-gray-700 transition cursor-pointer"
                >
                    <ChevronUp size={30} />
                </button>
            </div>

            {/* bottom menu option navigation bar only visible in mobile devices */}
            <MenuOptionBar />
        </div>
    );
}

export default AppLayout;
