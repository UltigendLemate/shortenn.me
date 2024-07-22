/* eslint-disable @typescript-eslint/no-floating-promises */
'use client'
import { notFound } from "next/navigation";
import { type Url } from "../../components/Shortener";
import UrlCard from "../../components/UrlCard";
import { authOptions } from "~/server/auth";
import { getServerSession } from "next-auth";
import { getMyUrls, totalUrls } from "../lib/queries";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import PaginationComponent from "~/components/PaginationComponent";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { get } from "http";
import { CiSearch } from "react-icons/ci";
import InfiniteScroll from "react-infinite-scroll-component";
import page from "../404/page";

const dummyUrl = [
  { slug: "dummy", url: "https://www.google.com", id: "1" },
  { slug: "dummy", url: "https://www.google.com", id: "2" },
  { slug: "dummy", url: "https://www.google.com", id: "3" },
  { slug: "dummy", url: "https://www.google.com", id: "4" },
  { slug: "dummy", url: "https://www.google.com", id: "5" },
  { slug: "dummy", url: "https://www.google.com", id: "6" },
  { slug: "dummy", url: "https://www.google.com", id: "7" },
  { slug: "dummy", url: "https://www.google.com", id: "8" },
  { slug: "dummy", url: "https://www.google.com", id: "9" }
]


const Page = ({ searchParams }: { searchParams: { page?: string } }) => {
  const session = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(parseInt(searchParams.page ?? '1', 10)); 
  const [result, setResult] = useState<Partial<Url>[]>(dummyUrl);
  const [totalLinks, setTotalLinks] = useState<number>(1);
  const linksPerPage = 9; // Set links per page
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState<Partial<Url>[]>([]);
  const [hasMore, setHasMore] = useState(true);


  const getMorePost = async () => {
    const nextPage = currentPage + 1;
    const res = await getMyUrls(nextPage, linksPerPage);
    if (res !== null) {
      setResult((post) => [...post, ...res]);
      setCurrentPage(nextPage);
      if (res.length < linksPerPage) {
        setHasMore(false);
      }
    }
  };

  const filterurl = (searchText: string) => {
    const regex = new RegExp(searchText, "i"); // 'i' flag for case-insensitive search
    return result.filter((fUrl: Partial<Url>) => {
      // Handle undefined cases for url, slug, userId, createdAt, and updatedAt
      return regex.test(fUrl.url || '') ||
        regex.test(fUrl.slug || '') ||
        regex.test(fUrl.userId || '');
    });
  }
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchResult = filterurl(e.target.value);
    setSearchedResults(searchResult);
    setSearchText(e.target.value);
  }



  useEffect(() => {
    console.log("page changed i know", searchParams.page);
    console.log(result)
  }, [currentPage]);
  useEffect(() => {
    setIsLoading(true);
    async function fetchData() {
      const response = await getMyUrls(currentPage, linksPerPage);
      if (response) {
        setResult([]);
        setResult(response);
        setIsLoading(false);
      }
    }
    fetchData();
  }, [currentPage]);

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        const totlinks = await totalUrls(session.data?.user.id ?? "");
        setTotalLinks(totlinks);
      }
      fetchData();
    }
  }, [session, totalLinks])

  if (!isLoading && result.length === 0) return notFound();



  return (
  <main className="pt-28 bg-gradient-to-b from-[#2e026d] to-[#15162c] min-h-screen text-white px-8">
    <div className="px-2 border-b-2 border-gray-300">
      <form className='relative w-full flex items-center gap-2'>
        <CiSearch />
        <input
          type='text'
          placeholder='Search for your URLs by their slug name...'
          value={searchText}
          onChange={handleSearchChange}
          required
          className=' w-full h-10   bg-transparent text-white text-lg outline-none'
        />
      </form>
    </div>
    {/* All Prompts */}
    {searchText ? (
      // <div className="grid md:grid-cols-3 gap-10  container mt-3">
      //   {searchedResults.map((link, index) => {
      //     return <UrlCard key={link.id} {...link} loading={isLoading} />
      //   })
      //   }
      // </div> 
      <InfiniteScroll
        dataLength={searchedResults.length}
        next={getMorePost}
        hasMore={hasMore}
        loader={<h3> Loading...</h3>}
        endMessage={<h4>Nothing more to show</h4>}
      >
        <div className="grid md:grid-cols-3 gap-10  container mt-3">
          {searchedResults.map((link, index) => {
            return <UrlCard key={link.id} {...link} loading={isLoading} />
          })
          }
        </div>
      </InfiniteScroll>
      
    ) : (
      // <div className="grid md:grid-cols-3 gap-10  container mt-3">
      //   {result.map((link, index) => {
      //     return <UrlCard key={link.id} {...link} loading={isLoading} />
      //   })
      //   }
      // </div>
      <InfiniteScroll
        dataLength={result.length}
        next={getMorePost}
        hasMore={hasMore}
        loader={<h3> Loading...</h3>}
        endMessage={<h4>Nothing more to show</h4>}
      >
        <div className="grid md:grid-cols-3 gap-10  container mt-3">
          {result.map((link, index) => {
            return <UrlCard key={link.id} {...link} loading={isLoading} />
          })
          }
        </div>
      </InfiniteScroll>

    )}


    {/* <PaginationComponent key={currentPage + totalLinks} currentPage={currentPage} totalLinks={totalLinks} linksPerPage={linksPerPage} data={result} /> */}
    {/* Infinite scrolling */}

  </main>)

}
export default Page