'use client'
import { useMemo, type FC, useState, useEffect } from 'react'
import InfiniteScroll from "react-infinite-scroll-component";
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Pagination } from "@nextui-org/pagination";
import { type Url } from './Shortener'
import { getMyUrls, totalUrls } from '../app/lib/queries'
import UrlCard from './UrlCard'
interface PaginationProps {
    currentPage: number
    totalLinks: number
    linksPerPage: number
    data: Partial<Url>[]
}

const PaginationComponent: FC<PaginationProps> = ({ currentPage, totalLinks, linksPerPage, data }) => {
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
    const [posts, setPosts] = useState<Partial<Url>[]>(data);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState(true);
    const getMorePost = async () => {
        const res = await getMyUrls(currentPage, linksPerPage);
        if (res !== null) {
            const newPosts = res;
            setPosts((post) => [...post, ...newPosts]);
            setIsLoading(false);
        }
    };
    return (
        <>
            <InfiniteScroll
                dataLength={posts.length}
                next={getMorePost}
                hasMore={hasMore}
                loader={<h3> Loading...</h3>}
                endMessage={<h4>Nothing more to show</h4>}
            >
                {posts.map((link, index) => {
                    return <UrlCard key={link.id} {...link} loading={isLoading} />
                })
                }
            </InfiniteScroll>
            <style jsx>
                {`
                    .back {
                    padding: 10px;
                    background-color: dodgerblue;
                    color: white;
                    margin: 10px;
                    }
                `}
            </style>
        </>
    )
}

export default PaginationComponent