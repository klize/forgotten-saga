# UI 수정 TODO

## variants/ vs src/ 이중 UI 정리 (★ 2026-04-30)

### 배경
`9e13cff breaking: renewal` 커밋 이후 두 개의 UI 시스템이 공존:

| | 구 UI | 신 UI |
|--|--|--|
| 위치 | `src/` (App.jsx, components/) | `variants/` (monolith.jsx 한 덩이) |
| 빌드 | Vite + Tailwind + React 19 | 브라우저 babel standalone (CDN React 18) |
| 진입점 | (`index.html`이 더 이상 안 부름) | 현재 `index.html` 진입 |
| 상태 | **dead code** (안 쓰임) | 라이브에 사용 |

`variants/`는 클로드 디자인 도구(Antigravity 프리뷰)의 라이브 편집 워크플로우용 폴더:
- `claude-design/index.html` — 디자인 도구가 띄우는 미리보기
- `variants/tweaks-panel.jsx` — 부모(디자인 툴)와 `postMessage` 통신
- `index.html`의 `/*EDITMODE-BEGIN*/.../*EDITMODE-END*/` 마커 — 디자인 도구가 라이브로 덮어씀
- 이 워크플로우 때문에 일부러 Vite 빌드를 우회 (빌드하면 마커/채널 깨짐)

### 발생한 문제
GitHub Pages 라이브 사이트가 `Loading · F · S · A · G · A` 화면에서 멈춤.
원인: 워크플로우가 `vite build` 산출물(`docs/`)만 deploy하는데, `variants/`는 vite의 entry/public 어느 쪽에도 안 잡혀서 누락됨. 결과적으로 `<script src="variants/markdown.jsx">` 등이 모두 404 → babel이 컴파일 못함 → `window.MonolithVariant` 등 globals가 영원히 undefined → 로딩 화면 고정.

### 1단계: 응급 복구 (이번 커밋)
`.github/workflows/deploy.yml`에 빌드 단계 뒤로 `cp -r variants docs/` 한 줄 추가.
이걸로 라이브 사이트 복구. 빌드 시스템은 그대로 유지 (과도기 상태).

### 2단계: A 체제로 정착 (별도 작업, 미진행)

**결정: A로 간다** (변경 사항 반영, 2026-04-30)

처음엔 B(src/로 흡수)를 추천했으나, klize의 워크플로우 설명을 듣고 A로 변경:
- 디자인 도구가 프리뷰 단계지만 디자인 결과물이 좋아서 계속 활용 예정
- 디자인이 확정 안 됐고 앞으로도 도구로 자주 업데이트 예정 → src/로 통합하면 매번 포팅 부담
- A 체제는 도구 호환성 + 클로드 직접 수정 모두 같은 방식 (`variants/*.jsx` Edit) 으로 가능. 빌드도 없으니 push만 하면 즉시 반영.

**A 정착 작업 내역 (별도 세션에서 진행):**
1. `src/` 처리 — 아래 두 옵션 중 결정 미정:
   - (1) **삭제** + README/CLAUDE.md에 "이전 vite UI는 `9e13cff^` 참조" 한 줄. git이 영구 보존 (`git show 9e13cff^:src/App.jsx` 등으로 5초 부활). klize는 "legacy 보존"을 원했으나, git이 이미 그 역할을 한다는 점 합의함.
   - (2) `src/`를 `legacy/`로 이름 변경 + README에 "archive — 사용 안 함, 빌드 안 됨" 명시. 폴더 보면서 비교 가능하지만 dead code 가시성 비용 있음.
2. `package.json`에서 vite/tailwind/react 의존성 제거 (또는 patch-notes 빌드용으로 minimal 유지)
3. `vite.config.js` 삭제
4. `vite-plugin-patch-notes.js` → standalone Node 스크립트로 변환 (예: `tools/build-patch-notes.js`)
5. `.github/workflows/deploy.yml` 재작성:
   - `npm ci`, `npm run build` 제거
   - `node tools/build-patch-notes.js` 단계만 남기고 root 정적 파일을 그대로 upload
6. `claude-design/`, `scratch/`, `scraps/` 등이 deploy 산출물에 안 들어가게 제외 (workflow에서 명시적으로)

**A의 트레이드오프 (수용)**:
- Babel standalone 3MB를 매 방문마다 다운로드 + 클라이언트 컴파일 → 첫 로드 비용 있음 (재방문 캐싱은 됨)
- SRI로 react@18.3.1, babel@7.29.0 핀됨 → 보안 패치 차단 (development build라 어차피 production-grade는 아님)
- 위 비용을 감수하는 대신 디자인 도구 호환 + 빌드 파이프라인 폐기

### 참고
- 현재 `docs/index.html`은 옛 vite 빌드 잔재 (FSAGA 카드 페이지) — Actions 다음 실행 때 새 index.html로 덮어써짐
- `src/`는 dead code지만 vite 빌드는 여전히 컴파일해서 `docs/assets/index-*.js`를 만듦 (아무도 안 쓰는 산출물). 2단계에서 정리됨.

---

## 설치 가이드
- [ ] 구체적으로 어떻게 바꿀지 정리 필요
- 현재: 3스텝 (다운로드 → 압축해제 → Loader 실행) + 참고사항 박스
- 파일: `src/components/InstallGuide.jsx`

## 기능 소개
- [ ] 구체적으로 어떻게 바꿀지 정리 필요
- 현재: 8개 카드 그리드 (2열)
- 파일: `src/components/Features.jsx`

## 패치노트 데이터 소스
- 현재: `src/components/PatchNotes.jsx` 안에 하드코딩된 배열
- GitHub 릴리스/커밋 기반 자동화 아님 → 수동 추가 필요
- 자동화 하려면 GitHub Releases API에서 fetch하는 방식으로 변경 가능
