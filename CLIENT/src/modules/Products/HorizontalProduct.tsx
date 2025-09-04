import React, { useEffect, useState } from 'react'
import ProductsLoader from '../Loaders/ProductsLoader';
import ProductSlider from './ProductSlider';
import { getMonthName } from '@/scripts/helper';

function HorizontalProduct({ categoryItem }: { categoryItem: string }) {

    const [productsLoading, setProductsLoading] = useState<boolean>(true);

    useEffect(() => {

        const timeout = setTimeout(() => {
            setProductsLoading(false);
        }, 3000);

    }, [])


    return (
        <div style={{ display: 'flex', flexDirection: "column" }}>
            <span style={{ fontSize: "1.2rem", fontWeight: "500" }}>{categoryItem}</span>
            <span style={{ fontSize: "14px" }}>Do not miss the current offers until the end of {getMonthName(new Date().getUTCMonth() + 1)}.</span>

            {
                productsLoading ?
                    <ProductsLoader />
                    :
                    <ProductSlider />
            }
        </div>
    )
}

export default HorizontalProduct