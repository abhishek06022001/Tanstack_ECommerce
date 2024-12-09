import { ProductForm } from "@/components/ProductForm";
import { logoutUser } from "@/features/userSlice";
import { useAppDispatch } from "@/hooks/hooks";
import { Product, ProductType } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { BounceLoader } from "react-spinners";
type Props = {}
function IndividualProduct({ }: Props) {
    const [product, setProduct] = useState<ProductType>({
        information: {
            description: '',
            name: '',
            id: null,
            price: null,
            image: '',
            category: "none"
        },
        loading: true
    });
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const ac_token = localStorage.getItem('accessToken');
    const { id } = useParams();
    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await axios.get(`/api/get_product/${id}`, {
                    headers: {
                        token: ac_token
                    }
                });
                const fetched_product_ = {
                    information: response.data.msg, loading: false
                };
                setProduct(fetched_product_);
            } catch (error) {
                dispatch(logoutUser());
                setProduct({ ...product, loading: true })
                setTimeout(() => {
                    navigate('/login');
                }, 1000)
            }
        };
        fetchProduct();
    }, [id]);
    return (
        <div className="flex justify-center items-center h-full">
            {product.loading ? <>
                <BounceLoader color="orange" /></> :
                <>
                    <ProductForm product={product} setProduct={setProduct} ac_token={ac_token} />
                </>
            }
        </div>
    )
}
export default IndividualProduct