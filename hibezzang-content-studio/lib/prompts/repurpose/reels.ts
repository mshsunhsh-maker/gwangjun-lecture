import type { ChannelPromptInput } from "./types";
export function buildReelsPrompt({topic,sourceContent}:ChannelPromptInput){return `너는 숏폼 영상 후킹 카피라이터야.\n주제: ${topic}\n원문:\n${sourceContent}\n\n원문 사실만 사용해 1) 서로 다른 심리 트리거 각도 10개, 2) 자연스러운 한국어 회화체의 3~10어절 훅 15개, 3) 각 훅의 짧은 B-roll 아이디어를 번호 목록으로 출력해. 모호한 표현과 근거 없는 수치·효과·논란은 만들지 마.`}
