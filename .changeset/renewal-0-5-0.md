---
"react-layered-dialog": minor
---

feat: 리뉴얼된 API/문서로 전면 전환 (0.5.0)

Breaking Changes
- DialogManager/createUseDialogs 계열 레거시 API 제거
- 레거시 타입 구조 정리 및 컨트롤러 중심(useDialogController) 모델로 전환
- 동일 ID 중복 오픈 시 Error 발생

Added
- DialogStore 기반 스택 관리(open/openAsync/close/unmount/...)
- DialogsRenderer + 컨텍스트 컨트롤러(컴포넌트 내부 close/update/status/stack)
- defineDialog / createDialogApi 레지스트리로 타입 안전한 메서드 자동 생성
- Promise 기반 비동기 다이얼로그(openAsync + resolve/reject)
- DialogStatus('idle'|'loading'|'done'|'error')와 스택 메타(topId/size/index)

Changed
- z-index: baseZIndex에서 시작, open 시 증가, 스택이 비면 reset
- 문서 개편: Fundamentals(개념) ↔ API(시그니처) 분리, 사이드바 Core/Types/Advanced 그룹, 타이틀 영어화
- 모바일 코드 블록 가로 오버플로우 해결(wrapLongLines, max-width)

Migration (요약)
1) 루트에 <DialogsRenderer store={store}/> 배치
2) DialogStore 생성 + createDialogApi/defineDialog로 레지스트리 구성
3) openDialog('type', payload) → dialog.type(payload)
4) 컴포넌트 내부는 useDialogController()로 close/unmount/update/status/stack 제어
5) 비동기는 await dialog.confirm(...) 형태로 전환

