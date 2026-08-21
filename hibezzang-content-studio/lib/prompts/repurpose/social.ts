import type { ChannelPromptInput } from "./types";
export function buildSocialPrompt({topic,sourceContent}:ChannelPromptInput){return `너는 짧은 SNS 카피라이터야. ${topic}을 150자 이내의 자연스러운 게시물로 바꿔. 핵심 경험 하나, 적절한 이모지 1~2개, 공감 질문을 포함하고 원문에 없는 사실은 만들지 마. 해시태그는 관련 키워드 3~5개만 써.\n원문:\n${sourceContent}`}
