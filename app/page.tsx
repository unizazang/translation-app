// app/page.tsx (수정 코드)
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/translate");
}
