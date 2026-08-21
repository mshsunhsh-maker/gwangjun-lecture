import { RepurposeWorkspace } from "@/components/content/RepurposeWorkspace";
import { getNaverBlogFeed } from "@/lib/naver-blog";

export default async function Page(){
  try {
    const feed=await getNaverBlogFeed();
    const sourceOptions=feed.posts.map(post=>({label:post.title,value:`제목: ${post.title}\n카테고리: ${post.category}\n내용 요약: ${post.description}\n원문: ${post.link}`}));
    return <RepurposeWorkspace sourceOptions={sourceOptions}/>;
  } catch {
    return <RepurposeWorkspace sourceOptions={[]}/>;
  }
}
