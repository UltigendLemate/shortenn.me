import { notFound } from "next/navigation";
import { type Url } from "../../components/Shortener";
import UrlCard from "../../components/UrlCard";
import { authOptions } from "~/server/auth";
import { getServerSession } from "next-auth";
import { getMyUrls, totalUrls } from "../lib/queries";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import PaginationComponent from "~/components/PaginationComponent";




const page = async ({searchParams} : {searchParams : {page? : string}}) => {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return notFound();
    const currentPage = parseInt(searchParams.page ?? '1', 10); // Get page from query
    const linksPerPage = 9; // Set links per page
    const result = await getMyUrls( currentPage, linksPerPage);
    if (!result) return notFound();
    const totalLinks = await totalUrls(session.user.id);
    return <main className="pt-28 bg-gradient-to-b from-[#2e026d] to-[#15162c] min-h-screen text-white">
    <div className="grid grid-cols-3 gap-10 container">
      {result.map((link) => {
        return <UrlCard key={link.id} {...link} />
      })
      }
    </div>

    <PaginationComponent currentPage={currentPage} totalLinks={totalLinks} linksPerPage={linksPerPage} />
  </main>
  } catch (error) {
    console.log(error)
    return notFound();
  }
}
export default page