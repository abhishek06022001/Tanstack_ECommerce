export type LandingPage = {
    page: Number,
    query: String,
    category: String
}
export type Product = {
    description: string ,
    name: string ,
    id: number | null,
    category: string | null
    price: number | null,
    image: string | null
}
export type ProductType = {
    information: Product,
    loading: boolean
}
export type FileType = {
    file: File;
}