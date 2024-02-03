'use client'
import { useMemo, type FC, useState, useEffect } from 'react'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {Pagination} from "@nextui-org/pagination";

interface PaginationProps {
    currentPage: number
    totalLinks: number
    linksPerPage: number
}

const PaginationComponent: FC<PaginationProps> = ({ currentPage, totalLinks, linksPerPage }) => {
    const router = useRouter();
    // const [currPage, setCurrPage] = useState<number>(currentPage);
    // const searchParams = useSearchParams();
    // useEffect(() => {
    //     console.log("page changed i know", searchParams.get('page'));
    //     const pg = searchParams.get('page')
    //     if(pg){
    //         setCurrPage(parseInt(pg, 10));
    //     }
    //     else{
    //         setCurrPage(1);
    //     }
    // }, [searchParams])

    return (
        <div className='flex overflow-x-hidden mt-20 justify-center' key={currentPage + totalLinks}>
    <Pagination 
    classNames={{
        base : "overflow-x-hidden my-1",
        item : "rounded-xl font-bold ",
        cursor : "bg-gradient-to-br  from-indigo-500 to-pink-500 rounded-2xl  text-white font-bold text-lg",
    }}
    initialPage={currentPage} 
    variant='flat'
    color='secondary'
    size='md'
    key={currentPage}
    showControls  
    onChange={(page)=>router.push(`?page=${page}`)}
    total={Math.ceil(totalLinks/linksPerPage)} 
    />
    </div>
    )
}

export default PaginationComponent