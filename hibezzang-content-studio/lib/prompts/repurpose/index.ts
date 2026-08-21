import { buildCarouselPrompt } from "./carousel"; import { buildNewsletterPrompt } from "./newsletter"; import { buildReelsPrompt } from "./reels"; import { buildSocialPrompt } from "./social"; import { buildThreadsPrompt } from "./threads";
export const repurposePromptBuilders={reels:buildReelsPrompt,carousel:buildCarouselPrompt,threads:buildThreadsPrompt,newsletter:buildNewsletterPrompt,social:buildSocialPrompt} as const;
export type RepurposeChannel=keyof typeof repurposePromptBuilders;
