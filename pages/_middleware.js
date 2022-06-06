import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const url = req.nextUrl.clone();
  url.pathname = "/home";
  if (req.nextUrl.pathname === "/") {
    console.log("hi");
    const session = await getToken({
      req,
      secret: process.env.JWT_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
    });
    // if (!session) {
    //   console.log("no");
    //   // return NextResponse.redirect(url);
    // } else {
    //   console.log("hjoi");
    // }
    //getToken 이 null임 또한 index 에서 session을 가져와서 로그인 아닐시 /home으로 처리해줌
    //???
  }
}
