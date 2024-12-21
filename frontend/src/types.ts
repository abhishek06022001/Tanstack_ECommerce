
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
export interface ProductParams {
    page: number, category: string, searchQuery: string
}