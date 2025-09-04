export interface UserProps {
    name: string;
    email: string;
    password?: string;
    provider: string;
    providerId?: string;
    imageData?: {
        url: string,
        fileId: string
    };
    salt?: string;

}

export interface updateProfileProps {

    name?: string;
    imageData?: {
        url: string,
        fileId: string
    };
}


export interface ProductPayloadType {
    productName: string;
    productPrice: string;
    productImage: {
        data: Buffer,
        contentType: string;
    };
    productCategory: string;
    productDesc?: string;
    AdditionalInfo?: JSON;

}


export interface ProductType {
    productImage: Buffer;
    contentType: string;
}


