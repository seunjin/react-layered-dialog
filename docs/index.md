# react-layered-dialog 문서 인덱스

> 이 인덱스는 모든 문서의 목차 역할을 합니다. 문서 추가/수정 시 반드시 업데이트하세요.

---

## 📚 문서 목록

### 시작하기 (Getting Started)
| 문서 | 설명 | 상태 |
|------|------|------|
| [소개](./getting-started/introduction.md) | 라이브러리 개요 및 특징 | 🟢 완료 |
| [빠른 시작](./getting-started/quick-start.md) | 5분 만에 시작하기 | 🟢 완료 |
| [설치](./getting-started/installation.md) | 설치 및 설정 방법 | 🟢 완료 |

### 가이드 (Guides)
| 문서 | 설명 | 상태 |
|------|------|------|
| [기본 사용법](./guides/basic-usage.md) | 동기 다이얼로그 열기/닫기 | 🟢 완료 |
| [비동기 다이얼로그](./guides/async-dialogs.md) | Promise 기반 확인 모달 | 🟢 완료 |
| [상태 관리](./guides/state-management.md) | update, getProps 사용법 | 🟢 완료 |
| [애니메이션](./guides/animations.md) | close/unmount 분리 활용 | 🟢 완료 |
| [Z-Index 전략](./guides/z-index-strategy.md) | 계층 구조 및 외부 연동 가이드 | 🟢 완료 |
| [접근성](./guides/accessibility.md) | ARIA, 키보드 네비게이션 | 🟢 완료 |
| [useDialogStore 가이드](./guides/use-dialog-store.md) | 스토어 상태 React 구독 활용 | 🟢 완료 |

### API 레퍼런스 (API Reference)
| 문서 | 설명 | 상태 |
|------|------|------|
| [DialogStore](./api/dialog-store.md) | 스토어 클래스 API | 🟢 완료 |
| [createDialogApi](./api/create-dialog-api.md) | 레지스트리 API 생성 | 🟢 완료 |
| [useDialogController](./api/use-dialog-controller.md) | 컨트롤러 훅 | 🟢 완료 |
| [DialogsRenderer](./api/dialogs-renderer.md) | 렌더러 컴포넌er | 🟢 완료 |
| [타입 정의](./api/types.md) | 모든 타입 레퍼런스 | 🟢 완료 |

### 고급 (Advanced)
| 문서 | 설명 | 상태 |
|------|------|------|
| [커스텀 레지스트리](./advanced/custom-registry.md) | defineDialog 심화 | 🟢 완료 |
| [다중 스토어](./advanced/multiple-stores.md) | 여러 스토어 운영 | 🟢 완료 |
| [SSR 지원](./advanced/ssr.md) | 서버사이드 렌더링 | 🟢 완료 |

### 레시피 (Recipes)
| 문서 | 설명 | 상태 |
|------|------|------|
| [Next.js Provider](./recipes/nextjs-provider.md) | App Router용 복사 가능한 세팅 코드 | 🟢 완료 |

### 기여하기 (Contributing)
| 문서 | 설명 | 상태 |
|------|------|------|
| [개발 환경](./contributing/development.md) | 로컬 개발 설정 | 🟢 완료 |
| [개발 워크플로우](./contributing/workflow.md) | 기능 추가 및 테스트 절차 | 🟢 완료 |
| [커밋 가이드](./contributing/commit-guide.md) | 커밋 메시지 규칙 | 🟢 완료 |
| [릴리즈 절차](./contributing/releasing.md) | 배포 프로세스 | 🟢 완료 |

---

## 🔖 상태 범례

| 상태 | 의미 |
|------|------|
| 🟢 완료 | 문서 작성 완료, 최신 상태 |
| 🟡 부분 | 일부 내용 존재, 보강 필요 |
| 🔴 미작성 | 문서 미존재 또는 작성 필요 |

---

## 📋 관련 문서

- [v1.0.0 마이그레이션 가이드](./migration-v1.md) - v0 → v1 업그레이드 체크리스트
- [문서화 규칙](./DOCUMENTATION_RULES.md) - 문서 작성 시 따라야 할 규칙
- [코드베이스 분석](./CODEBASE_ANALYSIS.md) - 라이브러리 구조 상세 분석
- [V1.0 로드맵](./V1_ROADMAP.md) - 버전 1.0 릴리즈 체크리스트
