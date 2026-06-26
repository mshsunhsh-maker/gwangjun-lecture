import Link from "next/link";
import { notFound } from "next/navigation";
import { getLectureById, getLectures } from "@/lib/api";

export async function generateStaticParams() {
  const lectures = await getLectures();
  return lectures.map((l) => ({ id: l.id }));
}

export default async function LecturePage(props: PageProps<"/lecture/[id]">) {
  const { id } = await props.params;
  const lecture = await getLectureById(id);

  if (!lecture) notFound();

  const fmt = (start?: string, end?: string) => {
    if (!start && !end) return "미정";
    if (!end || start === end) return start ?? "";
    if (!start) return `~ ${end}`;
    return `${start} ~ ${end}`;
  };

  const dateLabel = fmt(lecture.startDate, lecture.endDate);
  const applyLabel =
    lecture.applyStartDate || lecture.applyEndDate
      ? fmt(lecture.applyStartDate, lecture.applyEndDate)
      : null;

  return (
    <article className="mx-auto max-w-2xl">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
      >
        ← 목록으로 돌아가기
      </Link>

      <div className="mb-4 flex items-center gap-2">
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
          {lecture.category}
        </span>
        {lecture.isFree && (
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            무료
          </span>
        )}
      </div>

      <h1 className="mb-3 text-2xl font-bold leading-snug">{lecture.title}</h1>
      <p className="mb-8 whitespace-pre-line text-slate-600">
        {lecture.description}
      </p>

      <dl className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
        <Row label="운영 기관" value={lecture.organization} />
        <Row label="교육 일정" value={`${dateLabel}${lecture.startTime ? ` ${lecture.startTime}` : ""}`} />
        {applyLabel && <Row label="접수 기간" value={applyLabel} />}
        <Row label="장소" value={`${lecture.region} · ${lecture.venue}`} />
        {lecture.capacity != null && (
          <Row label="정원" value={`${lecture.capacity}명`} />
        )}
        {lecture.contact && <Row label="문의" value={lecture.contact} />}
        <Row label="출처" value={lecture.source} />
      </dl>

      {lecture.applyUrl && (
        <a
          href={lecture.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 block w-full rounded-xl bg-slate-900 py-3 text-center font-semibold text-white transition hover:bg-slate-700"
        >
          신청 페이지로 이동 →
        </a>
      )}
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 px-5 py-3">
      <dt className="w-20 shrink-0 text-sm font-medium text-slate-500">
        {label}
      </dt>
      <dd className="text-sm text-slate-800">{value}</dd>
    </div>
  );
}
