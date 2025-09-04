"use client"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import { BannerImages } from "@/scripts/helper"

function Slider() {

    return (
        <Carousel style={{
            userSelect: "none", cursor: "pointer", height: "100%",
            width: "100%", overflow: "hidden"
        }}>
            <CarouselContent >
                {BannerImages.map((each, idx) => (
                    <CarouselItem key={idx} style={{ flex: "0 0 100%" }}>
                        <img src={each} alt={`banner-${idx}`} width="100%" height="100%"
                            style={{ objectFit: "cover", borderRadius: "20px", }}
                        />
                    </CarouselItem>
                ))}
            </CarouselContent>

        </Carousel>
    )
}

export default Slider
