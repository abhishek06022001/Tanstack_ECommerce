import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { ProductParams } from "@/types"
import { useQueryClient } from "@tanstack/react-query"
import { MouseEventHandler } from "react"
import { number } from "zod"

interface PaginationBarProp {
    productParam: ProductParams
    setProductParam: React.Dispatch<React.SetStateAction<ProductParams>>
    count: number
    refetch: any
}
export function PaginationBar({ productParam, setProductParam, count, refetch }: PaginationBarProp) {
    let last_page = Math.floor(count / 8);
    let decimal_part = (count / 8) - last_page;
    const page_nums: number[] = [];
    const queryClient = useQueryClient();
    for (let i = 1; i <= last_page; i++) {
        page_nums.push(i);
    }
    if (decimal_part) {
        page_nums.push(last_page + 1);
    }
    function changePage(page: number) {
        setProductParam({ ...productParam, page: page });
    }
    function prev_page() {
        if (!(productParam.page === 1)) {
            setProductParam({ ...productParam, page: productParam.page - 1 });
        };
    }
    function next_page() {
        if (!(productParam.page === page_nums[page_nums.length - 1])) {
            setProductParam({ ...productParam, page: productParam.page + 1 });
        };
    }
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem onClick={() => prev_page()}>
                    <PaginationPrevious />
                </PaginationItem>
                {page_nums.map((num) => {
                    let is_Active = false;
                    if (num === productParam.page) {
                        is_Active = true;
                    }
                    return <PaginationItem
                        onClick={() => changePage(num)}
                    >
                        <PaginationLink isActive={is_Active} >{num}</PaginationLink>
                    </PaginationItem>
                })}
                <PaginationItem onClick={() => next_page()}>
                    <PaginationNext />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
