import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("absensi_session");
  const response = NextResponse.json({ success: true, message: "Logout berhasil" });
  response.cookies.set("absensi_session", "", {
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });
  return response;
}

