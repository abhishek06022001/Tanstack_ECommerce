
export interface ProductCardProps {
    product: ProductCardtype;
}
export type ProductCardtype = {
    id: number,
    name: string,
    description?: string,
    image?: string,
    price: number
}