import { CreateProduct } from '@/components/my_created/CreateProduct';
import { ProductCard } from '@/components/my_created/ProductCard';
import { Button } from '@/components/ui/button';
import { ProductCardtype, ProductParams } from '@/types';
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { PaginationBar } from '@/components/my_created/Pagination';
import { SelectCategory } from '@/components/my_created/SelectCategory';
type Props = {}

function ProductPage({ }: Props) {
  const ac_token = localStorage.getItem('accessToken');
  const [productParam, setProductParam] = useState<ProductParams>({
    page: 1, searchQuery: '', category: 'none'
  })


  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: () => {
      let categoryQuery = `&category=${productParam.category}`;
      let searchQuery = `&name=${productParam.searchQuery}`;
      let skipQuery = `&skip=${productParam.page}`;
      return axios.get(`/api/get_products?${categoryQuery}${searchQuery}${skipQuery}`, {
        headers: {
          token: ac_token
        }
      });
    }
  })
  useEffect(() => {
    refetch();
  }, [productParam])

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <div>Error found...</div>
  }
  const product_array = data?.data.msg || null;
  const count = data?.data.total_products;
  // console.log("The received data is", data?.data);
  return (
    <div className='p-5  min-h-[1000px] flex flex-col justify-between '>
      <div>
        <div className='my-5 flex gap-5 ' >
          <CreateProduct />
          <Input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProductParam({ ...productParam, searchQuery: e.target.value, page: 1 })}
            className='w-96' placeholder="Search products" />
          <SelectCategory productParam={productParam} setProductParam={setProductParam} />
        </div>
        <div className=' flex flex-wrap mb-4 gap-10' >

          {product_array && product_array.map((product: ProductCardtype) => {
            return <ProductCard key={product.id} product={product} />
          })}

        </div>
      </div>
      <PaginationBar   productParam={productParam} count={count} refetch={refetch} setProductParam={setProductParam} />

    </div>
  )
}

export default ProductPage