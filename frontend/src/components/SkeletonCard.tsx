import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
    return (
        <div className="flex flex-col space-y-3 ">
            <Skeleton className="h-80 w-96 rounded-xl bg-orange-200" />
            <div className="space-y-2 ">
                <Skeleton className="h-4 w-[250px] bg-orange-100" />
            </div>
        </div>
    )
}
