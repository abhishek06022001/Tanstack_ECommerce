
import CreateProduct from "@/components/CreateProduct";
import ProductCard from "@/components/ProductCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { Button } from "@/components/ui/button";
import { LandingPage, Product } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
type Props = {}
function ProductPage({ }: Props) {
    const [productObj, setProductObj] = useState<LandingPage>({
        page: 1, query: "", category: "none"
    })
    let items = [];
    let i = 0;
    while (i < 8) {
        i++;
        items.push(<><SkeletonCard /></>)
    }
    const [loading, setLoading] = useState(true);
    const [productObjs, setProductObjs] = useState<Product[]>([])
    useEffect(() => {
        async function fetchProducts() {
            const categoryQuery = `&category=${productObj.category}`;
            const response = await axios.get(`/api/get_products?${categoryQuery}&name=${productObj.query}&skip=${productObj.page}`);
            setProductObjs(response.data.msg);
        };
        setTimeout(() => {
            setLoading(false);
        }, 1000);
        fetchProducts();
    }, [])
    return (
        <>
            <div className="px-10 pt-5  sm:flex block  gap-5" >
                <div>
                    <select name="category" id="category"
                        className="w-48 bg-orange-100 p-2 rounded-none md:m-0 my-1" >
                        <option value="none">Select a category</option>
                        <option value="electronics">electronics</option>
                        <option value="mens">mens</option>
                        <option value="jewelery">jewelery</option>
                    </select>
                </div>
                <div>
                    <input type="text" placeholder="Search Item" className="p-2  text-black w-60 bg-orange-100" />
                </div>
                <div>
                    <CreateProduct />
                </div>
            </div>
            <div className="p-5 px-10 flex flex-wrap gap-4 " >
                {loading ?
                    <>
                        {items}
                    </>
                    :
                    productObjs.map(product => {
                        return <ProductCard
                            {...product}
                        />
                    })
                }
            </div>
        </>
    )
}

export default ProductPage
