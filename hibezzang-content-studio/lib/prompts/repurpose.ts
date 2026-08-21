export interface ThreadsPromptInput {
  topic: string;
  sourceContent: string;
  audienceItem?: string;
}

export interface ReelsPromptInput {
  topic: string;
  sourceContent: string;
  includeVisualIdeas?: boolean;
}

export function buildReelsPrompt({ topic, sourceContent, includeVisualIdeas = true }: ReelsPromptInput): string {
  return `
<role>
당신은 TikTok, Instagram Reels, YouTube Shorts용 후킹 카피를 전문으로 쓰는 트렌드 감각 있는 카피라이터입니다.
영상 시작 3초 안에 시청자의 시선을 사로잡는 첫 문장을 만듭니다.
</role>

<task>
주제: ${topic}
아래 원문을 분석해 서로 다른 심리 트리거 기반 각도와 짧은 영상 훅을 작성하세요.
</task>

<process>
1. FOMO, 호기심, 논란, 변화, 내부 팁, 충격, 공감 등을 검토해 서로 겹치지 않는 각도 10개를 찾습니다.
2. 여러 각도를 섞어 짧고 강한 훅 15개를 만듭니다.
3. 모든 훅은 말했을 때 자연스럽고 리듬감 있는 한국어 회화체로 작성합니다.
4. '이 영상 꼭 보세요' 같은 모호한 표현을 사용하지 않습니다.
5. 구체적인 숫자·기간·수치·충격적 진술은 원문에 실제로 있을 때만 사용합니다.
6. 원문에 없는 경험, 효과, 수치, 반응, 논란을 만들거나 과장하지 않습니다.
</process>

<output_format>
## 1. 심리 트리거 기반 각도 10개
번호 목록으로 각도명과 핵심 방향만 간결하게 작성합니다.

## 2. 후킹 문장 15개
번호 목록으로 작성하며 각 훅은 반드시 3~10어절 이내로 제한합니다.
불필요한 해설 없이 훅만 작성합니다.

${includeVisualIdeas ? "## 3. 빠른 시각 연출 아이디어\n각 훅 번호에 맞춰 한 줄짜리 B-roll 또는 화면 연출을 제안합니다." : "시각 연출 아이디어는 출력하지 않습니다."}
</output_format>

<source>
--- 원문 시작 ---
${sourceContent.trim()}
--- 원문 끝 ---
</source>
`.trim();
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
