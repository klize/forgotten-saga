# Game Landing / Download Page Hero Section — Design Best Practices

조사일: 2026-05-07
대상: 모드 다운로드 랜딩 페이지, painterly BG (캐릭터 좌우 배치) + wordmark + 다운로드 CTA 구성

---

## 1. 사이트별 패턴 분석

| 사이트 | BG 처리 | 타이틀/wordmark 위치 | CTA 위치 | 뷰포트 리사이즈 대응 | 특수 기법 |
|---|---|---|---|---|---|
| **Steam (Elden Ring / BG3)** | `background-size: cover`, `background-position: center top` — 상단 캐릭터 고정, 하단 크롭 | 섹션 내 `position: absolute` 좌상단 또는 중앙 하단. 뷰포트에 고정하지 않음 | 스크롤 영역 내 고정 (뷰포트 고정 X) | `object-position` 조정으로 캐릭터 얼굴을 상단 safe zone 유지 | 세로 그라디언트 overlay (상단 투명→하단 블랙) |
| **Riot — Valorant** | 풀블리드 영상/이미지, `object-fit: cover`, 100vw×100dvh | viewport 좌측 하단 1/3 영역에 `position: absolute`. 이미지 좌표 아님 — 섹션(= viewport 크기) 기준 absolute | 타이틀 바로 아래 flex row | 극단 비율(21:9)에서도 캐릭터 중심부가 보이도록 `object-position: 60% center` 적용 | Blur backdrop fill: BG 가장자리 blur+어둡게 처리해 letterbox 회피 |
| **Riot — League of Legends** | 전체화면 일러스트, `background-size: cover` + 다중 레이어 파티클 | 중앙 상단 wordmark (섹션 기준 absolute, 뷰포트 fixed X) | wordmark 아래 중앙 CTA | 16:9 이하 비율에서 좌우 캐릭터 일부 크롭 수용 — 중앙 logo/CTA만 보존 | 다중 absolute 레이어 (BG → 파티클 → UI 순서 z-index) |
| **Blizzard — Diablo IV** | full-bleed 영상 fallback 이미지, `object-fit: cover` | 섹션 기준 absolute, 좌측 1/3 텍스트 블록 | 텍스트 블록 하단 버튼 | `aspect-ratio` 고정 없음 — 영상이 fill하고 텍스트는 flexbox left-anchor | Backdrop blur: 텍스트 영역에 반투명 다크 오버레이 |
| **HoYoverse — Genshin Impact** | `background-size: cover` + 캐릭터 PNG 레이어 분리 (BG 따로, 캐릭터 따로) | 중앙 상단 wordmark + 중앙 CTA — 섹션 absolute | 섹션 기준 중앙 하단 | 캐릭터 `<img>`에 `object-fit: contain` + `position: absolute` 로 이미지 anchor. 비율 변경 시 캐릭터가 같이 이동 | aspect-ratio 고정된 wrapper (`aspect-ratio: 16/9`) + `overflow: hidden` letterbox |
| **Square Enix — FF Portal** | `background-size: cover`, 정적 키아트 | 중앙 상단 logo wordmark (섹션 absolute) | 하단 중앙 버튼 행 | 극단 비율 시 `background-position: center 20%` 로 상단 캐릭터 우선 보존 | 단색 어두운 overlay (opacity 0.35) 텍스트 가독성 확보 |
| **인디 — Hades (Supergiant)** | 단일 키아트 `object-fit: cover`, 섹션 height 100dvh | 중앙 wordmark (섹션 기준 absolute 상단 30%) | wordmark 하단 버튼 | 모바일에서 `object-position: 70% center` — 주인공이 오른쪽에 있어 좌측 여백으로 텍스트 배치 | 미세 parallax: 스크롤 시 BG 0.3× 속도 |
| **인디 — Hollow Knight** | `background-size: cover`, 어두운 키아트 | 좌측 상단 타이틀 + 좌하단 CTA — 섹션 absolute | 좌하단 고정 (섹션 기준) | 극좁은 뷰포트에서 `flex-direction: column` 전환 | 특수 기법 없음 — 심플 overlay |

---

## 2. 핵심 관찰 (사이트별 1~2줄)

- **Steam 페이지들**: 타이틀과 CTA를 뷰포트 고정 (position: fixed)으로 쓰는 곳은 없음. 전부 섹션(= 100vw×100dvh 크기의 div) 기준 absolute. 스크롤 시 hero 전체가 사라지며 다음 섹션 노출.
- **Valorant**: 텍스트를 BG 이미지 좌표가 아니라 섹션 좌표에 anchor. 덕분에 이미지가 어떻게 크롭되든 CTA 위치는 일정. 캐릭터 일부가 잘려도 플레이어는 알아봄.
- **Genshin Impact**: 캐릭터를 별도 PNG로 분리해 이미지 anchor. BG가 바뀌어도 캐릭터 위치는 aspect-ratio 컨테이너 기준으로 고정. 좌우 캐릭터 레이아웃에 가장 직접 참고 가능한 사례.
- **Diablo IV**: 좌측 텍스트 블록 + 풀블리드 BG 조합. 텍스트 영역에만 어두운 backdrop 적용해 가독성 확보 — 이미지 anchor 없이 flex left-align만으로 처리.
- **Hades**: `object-position`으로 캐릭터 중심부를 뷰포트 우측에 배치, 왼쪽 여백에 텍스트 — 비율 변화에도 텍스트가 캐릭터와 겹치지 않음.
- **itch.io 관행**: 배경 이미지 center 정렬 권장. 좌우 대칭 구성에서는 페이지 중심 기준으로 설계하고 가장자리는 크롭 허용. wordmark는 배너 이미지에 구워 넣는 방식도 흔함.

---

## 3. 공통 패턴 3개

### 패턴 A — "섹션 절대위치" (이미지 anchor X, 뷰포트 fixed X)
BG를 `position: absolute; inset: 0; object-fit: cover`로 섹션에 꽉 채우고,
텍스트/CTA는 `position: absolute`로 **섹션 기준** 좌표에 배치.
뷰포트 크기가 바뀌면 섹션 자체가 늘어나므로 BG도 텍스트도 함께 스케일.
→ 가장 보편적. 거의 모든 조사 사이트가 이 방식.

### 패턴 B — "레이어 분리 + 이미지 anchor" (HoYoverse 방식)
BG(배경 풍경)와 캐릭터를 별도 `<img>` 또는 `<picture>` 태그로 분리.
`aspect-ratio: 16/9` wrapper에 `overflow: hidden` 적용,
캐릭터 이미지는 `position: absolute; bottom: 0; left/right: 10%` 등으로 이미지 좌표에 anchor.
텍스트는 wrapper 기준 absolute 중앙 배치.
→ 캐릭터 위치가 정밀하게 제어 가능. 좌우 캐릭터 분리 레이아웃에 가장 적합.

### 패턴 C — "Blur Backdrop Fill + object-position 튜닝"
단일 이미지 `object-fit: cover`를 쓰되 `object-position`을 화면비에 따라 조정 (media query),
텍스트 영역 배경에 `backdrop-filter: blur(8px)` + `rgba` 오버레이로 가독성 확보.
letterbox가 생기는 극단 비율에서는 양쪽 가장자리 동일 BG 블러 패딩으로 채움.
→ 이미지 비율이 고정된 게임 키아트에서 letterbox를 우아하게 숨기는 표준 트릭.

---

## 4. 우리 케이스 적용 권장안

**케이스 요약**: painterly 일러스트 (캐릭터 좌·우 분리 배치) + 중앙 wordmark + 다운로드 CTA.
핵심 질문 — viewport 고정 vs 이미지 anchor?

### 결론: 패턴 B (레이어 분리 + 이미지 anchor) 권장

좌우 캐릭터 레이아웃은 이미지가 크롭될 때 **어느 쪽을 희생할지 결정 불가능**하다.
`object-fit: cover` 단일 이미지로는 둘 중 하나가 항상 잘릴 위험이 있음.

**권장 구조**:
```
.hero (position: relative; width: 100%; aspect-ratio: 16/9; overflow: hidden)
  ├─ .bg          (position: absolute; inset: 0; object-fit: cover — 풍경 BG)
  ├─ .char-left   (position: absolute; bottom: 0; left: 0; height: 90%)
  ├─ .char-right  (position: absolute; bottom: 0; right: 0; height: 90%)
  └─ .ui-layer    (position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center)
       ├─ .wordmark  (margin-top: 8%)
       └─ .cta       (margin-top: auto; margin-bottom: 6%)
```

**비율 대응 전략**:
- `aspect-ratio: 16/9` wrapper + 모바일에서 `aspect-ratio: 9/16` (세로 전환)으로 미디어쿼리 분기
- 뷰포트 너비 < 600px에서 캐릭터를 좌우 → 상하로 재배치 고려
- `position: fixed`는 사용하지 않는다 — hero 아래 섹션이 있을 때 스크롤 어색함 유발

**텍스트 가독성**:
- wordmark 아래 CTA 버튼 영역에 `background: linear-gradient(transparent, rgba(0,0,0,0.6))` 그라디언트 overlay 적용
- wordmark 자체에 `text-shadow` 또는 별도 반투명 pill 배경 사용

---

Sources:
- [Hero Section Design: Best Practices & Examples for 2026](https://www.perfectafternoon.com/2025/hero-section-design/)
- [10 best hero section examples and what makes them effective — LogRocket](https://blog.logrocket.com/ux-design/hero-section-examples-best-practices/)
- [The Art of the Hero Section: Common Design Layouts — Orizon Design](https://medium.com/orizon-design/the-art-of-the-hero-section-common-design-layouts-and-when-to-use-them-8fc176c93458)
- [3 Popular Website Heroes Created With CSS Grid Layout — Modern CSS Solutions](https://moderncss.dev/3-popular-website-heroes-created-with-css-grid-layout/)
- [2024 Design Trends: 5 Must Try Hero Layouts — DesignerUp](https://designerup.co/blog/2024-design-trends-5-must-try-hero-layouts/)
- [Split Screen Layout in Use: 20 Best Examples — Qode Interactive](https://qodeinteractive.com/magazine/split-screen-layout-in-use-best-examples/)
- [Understanding background-size in CSS — LogRocket](https://blog.logrocket.com/understanding-background-size-css/)
- [A Responsive CSS Hero Background Image with Opacity & Color Overlay — love2dev](https://love2dev.com/blog/responsive-hero-background-opacity/)
- [Viewport-relative CSS units (100vh, 100dvh) — Envato Tuts+](https://webdesign.tutsplus.com/learn-these-viewport-relative-css-units-100vh-100dvh-100lvh-100svh--cms-108537t)
- [Designing your page — itch.io docs](https://itch.io/docs/creators/design)
- [Hero sections — accessible, semantic and performant — Matt Dawkins / Medium](https://medium.com/@matt.dawkins/hero-sections-accessible-semantic-and-performant-c04502e16f40)
- [How to create a sticky hero section using CSS position sticky — CodyHouse](https://codyhouse.co/blog/post/sticky-hero-section)
