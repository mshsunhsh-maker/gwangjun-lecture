import type { ChannelPromptInput } from "./types";
export function buildThreadsPrompt({topic,sourceContent}:ChannelPromptInput){return `너는 Instagram Threads 콘텐츠 기획 전문가야.\n주제: ${topic}\n원문:\n${sourceContent}\n\n규칙: 자연스러운 반말체, 적절한 이모지, 공백 포함 500자 이내, 짧은 훅으로 시작, 마지막은 스친들의 경험이나 의견을 묻는 질문. 원문에 없는 사실은 만들지 말고 게시물 본문만 출력해.`}
