import type { ChannelPromptInput } from "./types";
export function buildNewsletterPrompt({topic,sourceContent}:ChannelPromptInput){return `너는 생활형 뉴스레터 에디터야. ${topic}을 제목, 프리헤더, 따뜻한 인사, 핵심 내용 3개, 블로그 원문 이동 CTA 순서로 작성해. 직접 경험을 들려주는 구어체를 유지하고 원문에 없는 사실은 만들지 마.\n원문:\n${sourceContent}`}
