export type ToolKey = "ideas"|"writer"|"seo"|"hooks"|"images"|"repurpose";
export interface ToolResult { title:string; badge:string; body:string; meta?:string[] }
const ideaTitles=["좁은 주방이 넓어 보이는 수납 습관 7가지","써보고 알게 된 자동센서 휴지통의 의외의 장점","장마철 빨래 냄새, 제가 바꾼 딱 한 가지","코스트코에서 다시 살 리빙템 5개","40대 엄마의 아침 시간을 줄인 살림 루틴","외관과 달랐던 동네 파스타집 솔직 후기","냉장고 정리 전 꼭 버려야 할 물건들","거실 분위기를 바꾼 만 원대 아이템","아이와 가기 좋았던 주말 브런치 맛집","가을 오기 전 점검할 집안일 체크리스트"];
export function generateMock(type:ToolKey,topic:string):ToolResult[]{
 const t=topic||"살림 아이디어";
 if(type==="ideas") return ideaTitles.map((title,i)=>({title,badge:["정보형","경험형","구매형","비교형","시즌형"][i%5],body:`${t}와 연결해 직접 경험을 담기 좋은 구체적인 콘텐츠예요.`,meta:[`점수 ${92-i*2}`,i<3?"난이도 낮음":"난이도 보통"]}));
 if(type==="writer") return [{title:`“직접 써보니 달랐어요..” ${t} 솔직한 이야기 [리빙리뷰]`,badge:"완성 초안",body:`*“처음에는 저도 반신반의했어요.”*\n\n${t}을 직접 경험하게 된 계기부터 차근차근 말씀드릴게요.\n\n## 제가 직접 확인한 첫인상\n[사진: 사용 전 모습]\n여기에는 사용자가 제공한 실제 경험과 확인된 사실을 넣어주세요.\n\n## 써보니 의외였던 점\n[사진: 실제 사용 장면]\n좋았던 점과 아쉬웠던 점을 함께 적으면 훨씬 믿음이 가더라고요.\n\n## 그래서 다시 선택할까?\n제 기준과 사용 환경을 솔직히 정리해 주세요. 여러분도 본인 상황에 맞는지 확인해보세요.`,meta:["#리빙리뷰 #살림정보 #40대엄마 #직접사용 #일상이야기 #생활꿀팁 #솔직후기 #Hi베짱"]}];
 if(type==="seo") return [{title:`${t} SEO 진단`,badge:"82점",body:"검색 의도가 명확하고 경험형 콘텐츠에 적합해요. 제목 앞부분에 핵심 키워드를 자연스럽게 배치하고, 실제 사진 설명을 구체화해 보세요.",meta:[t,`${t} 후기`,`${t} 추천`,"직접 사용 후기","살림 꿀팁"]}];
 if(type==="hooks") return ["궁금증형","공감형","손해회피형","경험형","숫자형"].flatMap((badge,i)=>[1,2,3].map(n=>({title:`${badge} 도입 ${n}`,badge,body:[`“여러분도 ${t} 때문에 한 번쯤 고민하셨죠?”`,`저도 처음엔 ${t}이 다 비슷하다고 생각했어요.`,`직접 써보기 전에는 몰랐던 차이가 있더라고요.`][(i+n)%3]})));
 if(type==="images") return ["썸네일","본문 도입","사용 장면","장단점 비교","마무리"].map((badge,i)=>({title:`${badge} 이미지 ${i+1}`,badge,body:`따뜻한 자연광 아래 ${t}의 실제 사용감을 보여주는 생활 사진. 과도한 연출 없이 크림·세이지 톤, 여백이 있는 구도.`,meta:["프롬프트 복사 가능"]}));
 return ["Instagram Reels","카드뉴스","Threads","뉴스레터","짧은 SNS"].map((badge,i)=>({title:`${t} · ${badge}`,badge,body:i===0?`첫 3초: “이거 직접 써보니 달랐어요.”\n화면: 사용 전후 비교\nCTA: 자세한 후기는 블로그에서 확인하세요.`:`${t}의 핵심 경험을 ${badge} 독자에게 맞게 짧고 자연스럽게 재구성한 초안입니다.`}));
}
