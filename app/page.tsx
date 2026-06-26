import { getLectures } from "@/lib/api";
import LectureBrowser from "./LectureBrowser";

export default async function Home() {
  const lectures = await getLectures();

  return (
    <div>
      <section className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          광주·전남 무료강연을 한곳에서
        </h1>
        <p className="mt-2 text-slate-500">
          지자체와 공공기관이 운영하는 무료강연을 지역·분야별로 찾아보세요.
        </p>
      </section>

      <LectureBrowser lectures={lectures} />
    </div>
  );
}
