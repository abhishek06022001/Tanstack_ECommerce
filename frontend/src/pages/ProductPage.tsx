import { ProductCard } from '@/components/my_created/ProductCard';
import { ProductCardtype } from '@/types';
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'

type Props = {}

function ProductPage({ }: Props) {
  const ac_token = localStorage.getItem('accessToken');
  const { data, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: () => {
      return axios.get(`/api/get_products`, {
        headers: {
          token: ac_token
        }
      });
    }
  })
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <div>Error found...</div>
  }
  console.log("Rerendered the page...");
  console.log("The fetched data is ,", data?.data.msg);
  const product_array = data?.data.msg || null;
  return (
    <div className='p-10 flex flex-wrap gap-10' >
      {product_array && product_array.map((product: ProductCardtype) => {
        return <ProductCard key={product.id} product={product} />
      })}
    </div>
  )
}

export default ProductPage