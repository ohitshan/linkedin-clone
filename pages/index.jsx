import Head from "next/head";
import Image from "next/image";
import { getSession, signOut, useSession } from "next-auth/react";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import { useRouter } from "next/router";
import Feed from "../components/Feed";
import { AnimatePresence } from "framer-motion";
import Modal from "../components/Modal";
import { useRecoilState } from "recoil";
import { modalState, modalTypeState } from "../atoms/modalAtom";
import { connectToDatabase } from "../utils/mongodb";
import Widgets from "../components/Widgets";

export default function Home({ posts, articles }) {
  const [modalOpen, setModalOpen] = useRecoilState(modalState);
  const [modalType, setModalType] = useRecoilState(modalTypeState);
  console.log(articles);
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/home");
    },
  });
  return (
    <div
      className="bg-[#F3F2EF] dark:bg-black dark:text-white h-screen 
     md:space-y-6"
    >
      {/* overflow-y-scroll */}

      <Head>
        <title>Feed | LinkedIn</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="flex justify-center gap-x-5 px-4 sm:px-12">
        <div className="flex flex-col md:flex-row gap-5 ">
          <SideBar />
          <Feed posts={posts} />
        </div>
        <Widgets articles={articles} />
        <AnimatePresence>
          {modalOpen && (
            <Modal handleClose={() => setModalOpen(false)} type={modalType} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/home",
      },
    };
  }

  const { db } = await connectToDatabase();
  const posts = await db
    .collection("posts")
    .find()
    .sort({ timestamp: -1 })
    .toArray();

  const results = await fetch(
    `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${process.env.NEWS_API_KEY}`
  ).then((res) => res.json());

  console.log(results);
  return {
    props: {
      session,
      articles: results.articles,
      posts: posts.map((post) => ({
        ...post,
        _id: post._id.toString(),
        timestamp: post.timestamp.toString(),
      })),
    },
  };
}
