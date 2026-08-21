import type { ChannelPromptInput } from "./types";
export function buildCarouselPrompt({topic,sourceContent}:ChannelPromptInput){return `너는 Instagram 카드뉴스 에디터야. 주제는 ${topic}이야. 원문 사실만 사용해 5~7장으로 구성해. 각 장마다 짧은 제목, 2문장 이내 본문, 이미지 아이디어를 출력하고 1장은 훅, 마지막 장은 저장·공감 CTA로 구성해.\n원문:\n${sourceContent}`}
