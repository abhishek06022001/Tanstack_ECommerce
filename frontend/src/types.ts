
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
// name: data?.data[0].name,
//     email: data?.data[0].email,
//         address: data?.data[0].address,
//             age: data?.data[0].age,
//                 role: data?.data[0].role,
//                     dob: data?.data[0].dob
export interface UserProp {
    name: string | null,
    address: string | null,
    age: number | null,
    role: number | null,
    dob: string | null,
    email: string | null,
    image: string | null
}

export type UsersType = {
    name: string, role: number, email: string
}