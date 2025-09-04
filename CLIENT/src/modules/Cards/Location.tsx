import { Search, X } from "lucide-react";
import style from "./location.module.css";
import { useEffect,  useState } from "react";
import { fetchAllCountries, searchForSpecificCountry, toggleDomOverflow } from "@/utils";

interface LocationProps {
    setLocationApiBox: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedCountry: React.Dispatch<React.SetStateAction<string>>;
}

function Location({ setLocationApiBox, setSelectedCountry }: LocationProps) {


    const [countryName, setCountryName] = useState<string>("");
    const [countriesData, setCountriesData] = useState<any[]>([]);
    const [closing, setClosing] = useState(false);

    useEffect(() => {

        const fetchAllCountriesData = async () => {
            const AllCountries = await fetchAllCountries();
            setCountriesData(AllCountries);
        };

        toggleDomOverflow(false);
        fetchAllCountriesData();

        return () => {
            toggleDomOverflow(true);
        };

    }, []);


    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const matchedCountries = searchForSpecificCountry(countryName);
            setCountriesData(matchedCountries);
        }, 700);

        return () => clearTimeout(timeoutId);
    }, [countryName]);


    const handleClose = () => {
        setClosing(true);
        setTimeout(() => {
            toggleDomOverflow(true);
            setLocationApiBox(false);
        }, 300);
    };

    return (

        <div className={style.locationContainer}>
            <div onClick={handleClose} className={style.locationAPI}></div>

            <div className={`${style.locations} ${closing ? style.closing : ""}`}>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <span style={{ fontWeight: "bolder" }}>
                        Choose your Delivery Location
                    </span>
                    <span style={{ fontSize: "14px", fontWeight: "lighter" }}>
                        Enter your address and we will specify the offer for your area.
                    </span>

                    <button
                        onClick={handleClose}
                        style={{
                            position: "absolute",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#272A2C",
                            color: "white",
                            cursor: "pointer",
                            width: "35px",
                            height: "35px",
                            border: "none",
                            borderRadius: "50%",
                            right: "10px",
                            top: "10px",
                        }}
                    >
                        <X />
                    </button>
                </div>

                <div className={style.locationSearchCont}>
                    <input
                        id={style.searchInput}
                        type="text"
                        value={countryName}
                        onChange={(e) => setCountryName(e.target.value)}
                        placeholder="Search your area..."
                    />
                    <Search cursor={"pointer"} />
                </div>

                <div className={style.allCountries}>
                    {countriesData && countriesData.length > 0 ? (
                        countriesData.map((country) => (
                            <p
                                onClick={() => {
                                    setSelectedCountry(country.country);
                                    handleClose();
                                }}
                                id={style.eachCountry}
                                key={country.country}
                            >
                                {country.country}
                            </p>
                        ))
                    ) : (
                        <span className="self-center font-thin">No Country Found</span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Location;
