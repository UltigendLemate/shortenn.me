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

const dummyUrl = [
  {slug : "dummy", url : "https://www.google.com", id : "1"},
  {slug : "dummy", url : "https://www.google.com", id : "2"},
  {slug : "dummy", url : "https://www.google.com", id : "3"},
  {slug : "dummy", url : "https://www.google.com", id : "4"},
  {slug : "dummy", url : "https://www.google.com", id : "5"},
  {slug : "dummy", url : "https://www.google.com", id : "6"},
  {slug : "dummy", url : "https://www.google.com", id : "7"},
  {slug : "dummy", url : "https://www.google.com", id : "8"},
  {slug : "dummy", url : "https://www.google.com", id : "9"}
]


const Page = ({ searchParams }: { searchParams: { page?: string } }) => {
  const session = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const currentPage = parseInt(searchParams.page ?? '1', 10); // Get page from query
  const [result, setResult] = useState<Partial<Url>[]>(dummyUrl);
  const [totalLinks, setTotalLinks] = useState<number>(1);
  const linksPerPage = 9; // Set links per page
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

  return <main className="pt-28 bg-gradient-to-b from-[#2e026d] to-[#15162c] min-h-screen text-white">


        <div className="grid md:grid-cols-3 gap-10  container">
          {result.map((link, index) => {
            return <UrlCard key={link.id} {...link} loading={isLoading} />
          })
          }
        </div>

<PaginationComponent key={currentPage + totalLinks} currentPage={currentPage} totalLinks={totalLinks} linksPerPage={linksPerPage} />


  </main>

}
export default Page