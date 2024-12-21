import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ProductParams } from "@/types"

interface SelectCategoryProp {
    productParam: ProductParams
    setProductParam: React.Dispatch<React.SetStateAction<ProductParams>>
}

export function SelectCategory({ productParam, setProductParam }: SelectCategoryProp) {

    function handleChange(value: string) {
        setProductParam({ ...productParam, category: value, page: 1 })
    }

    return (
        <Select onValueChange={handleChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="none">View all</SelectItem>
                    <SelectItem value="jewelary">Jewelary</SelectItem>
                    <SelectItem value="mens">Men's Clothing</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
