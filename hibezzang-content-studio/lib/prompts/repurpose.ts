export interface ThreadsPromptInput {
  topic: string;
  sourceContent: string;
  audienceItem?: string;
}

export function buildThreadsPrompt({ topic, sourceContent, audienceItem }: ThreadsPromptInput): string {
  return `
<role>
너는 인스타그램 Threads 콘텐츠 기획 전문가야.
</role>

<task>
주제: ${topic}
스친들과 이야기할 아이템: ${audienceItem?.trim() || topic}

아래 원문을 바탕으로 Instagram Threads 게시물 1개를 작성해.
</task>

<rules>
1. 자연스러운 반말체로 쓸 것.
2. 내용에 맞는 이모지를 적절히 사용할 것. 문장마다 붙이거나 남발하지 말 것.
3. 공백을 포함해 500자 이내로 쓸 것.
4. 첫 문장은 스크롤을 멈추게 하는 짧은 훅으로 시작할 것.
5. 마지막 문장은 스친들의 경험이나 의견을 묻는 질문으로 끝낼 것.
6. 원문에 없는 경험, 가격, 수치, 제품 정보, 반응을 만들지 말 것.
7. 해시태그, 제목, 설명, 글자 수 안내 없이 게시물 본문만 출력할 것.
</rules>

<source>
--- 원문 시작 ---
${sourceContent.trim()}
--- 원문 끝 ---
</source>
`.trim();
}
