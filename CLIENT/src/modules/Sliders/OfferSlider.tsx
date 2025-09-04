import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";



export function OfferSlider({ offers }: any) {
    return (
        <Carousel
            opts={{
                align: "start",
            }}
            className="w-[90%]"
        >
            <div className="mb-4" style={{  margin: "10px", display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "1.2rem", fontWeight: 500 }}>LATEST OFFERS</span>
                <span style={{ fontSize: "15px" }}>grab the deal do not miss out.</span>
            </div>

            <CarouselContent className="flex gap-4 px-2"> {/* added gap and padding */}
                {offers.map((image: any, index: number) => (
                    <CarouselItem
                        key={index}
                        className="basis-full md:basis-1/2 lg:basis-1/3"
                    >
                        <div className="p-2">
                            <Card className="overflow-hidden">
                                <CardContent className="p-0">
                                    <img 
                                        src={image}
                                        alt={`Offer ${index + 1}`}
                                        className="w-full h-64 object-cover cursor-pointer"
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>

            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
}
