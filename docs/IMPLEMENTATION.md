# 농지안심맵 MVP 구현 명세 · v0.1.0

기준일 2026-10-05. 필지별 확인할 일 → 공식 근거 → 상담/활용기회 → 증빙을 연결합니다.

## 구현 범위

| 기획 항목 | 현재 구현 | 추가 조건 |
|---|---|---|
| 지도·등록 위치 | 실제 OSM 지도, 위치 선택·마커·지역/좌표 검색 | 지적경계·소유자는 미확인 |
| 주소/지번 검색 | VWorld Search 연결 코드 | 도메인 제한 키로 실응답 검증 필요 |
| 지적도·진흥지역·영농여건불리농지 | VWorld WMS 1.3.0 선택 레이어 | 키와 허용 서비스 필요 |
| 필지 공간 분석 | 사용자 위치 마커 관리 | PNU 피처·PostGIS·경사/도로 분석은 후속 |
| 전수조사 영향 | 취득·이용·계약·시설·통지·불일치 체크리스트 | 공식 조사대상 여부를 자동 조회하지 않음 |
| 정책·혜택 | 공식 링크, 이유·할 일, 농지별 상담 경로 | 자동 수급·적법성 확정하지 않음 |
| 증빙 | 이미지/PDF·메모·내용 해시·원본 저장 | 촬영시각·경작사실 인증은 아님 |
| 보고서 | 브라우저 인쇄/PDF 저장 활용 | 첨부 PDF 병합은 하지 않음 |
| 개인정보 | 로컬 IndexedDB | 로그인/암호화/동기화/독립 출처는 후속 |
| 정책 변화 | 출처·검토일·규칙 버전 표시 | 자동 수집·검토 승인·알림은 후속 |
| 배포 | main 소스, gh-pages 배포 산출물, Actions 검증 | 기존 Pages 소스 설정을 유지 |

## 기술 선택과 구조

GitHub Pages의 정적 호스팅에 맞춰 초기 Next.js/PostGIS 구상 대신 **ES modules + Leaflet + IndexedDB**로 첫 버전을 구현합니다. 서버 계정형 기능은 후속 서비스로 분리합니다.

`index.html` 화면 구조, `assets/app.css` 반응형, `src/domain.js` 값 검증·판정규칙·출처, `src/storage.js` 원자적 저장/복원, `src/app.js` 지도·UI·증빙·백업·인쇄, `sw.js` 앱 정적 셸, `tests/` 단위/브라우저 회귀 검증.

## 판정 안전장치

조사 확률이나 임의 점수, 합법/불법, 지원금 확정값을 표시하지 않습니다. 정보 부족을 낮은 위험으로 취급하지 않습니다. 상속 한 필지 면적과 총 보유면적을 혼동하지 않고, 가족경작·공유·경매만으로 투기 등급을 부여하지 않습니다. 체크 완료는 사용자의 작업 기록입니다. 입력한 통지기한은 한국 날짜 기준으로 계산합니다.

최초 기획에 포함된 특정 전수조사 날짜·유예·정상화 주장은 일부 원문 재확인에 실패하여 자동 규칙에서 제외했습니다. **미확인 2026-11-15 마감이나 특정 유형 외 제재 면제 같은 단정을 운영하지 않습니다.** 향후 공식 공고의 시행일·종료일·대상·예외·출처·검토일을 별도 정책 데이터로 추가해야 합니다.

## 공식 근거

| 자료 | 출처 |
|---|---|
| 농지법 | https://www.law.go.kr/법령/농지법 |
| 농지법 제23조 | https://www.law.go.kr/LSW/lsLawLinkInfo.do?chrClsCd=010202&lsId=000479&lsJoLnkSeq=1000732579&print=print |
| 농지 임대차 생활법령 | https://easylaw.go.kr/CSP/CnpClsMain.laf?ccfNo=3&cciNo=1&cnpClsNo=1&csmSeq=1774&menuType=onhunqna&popMenu=ov |
| 농지공간포털 | https://njy.mafra.go.kr/ |
| 농지은행 | https://www.fbo.or.kr/ |
| 연속지적도 공공데이터 | https://www.data.go.kr/data/15123899/openapi.do |
| 토지이용계획정보 | https://www.data.go.kr/data/15123973/openapi.do |
| VWorld WMS/WFS | https://www.vworld.kr/dev/v4dv_wmsguide2_s001.do |
| Leaflet | https://leafletjs.com/examples/quick-start/ |
| OSM 지도 이용정책 | https://operations.osmfoundation.org/policies/tiles/ |

## 개인 데이터

`parcels`: id, name, address, pnu, area, lat/lng, acquisition, acquiredAt, ownership, role, use, leaseReason, contract, facility, mismatch, notice, deadline, difficulty, notes, done, updatedAt, demo.

`evidence`: id, parcelId, title, date, note, data(data URL), fileName, sha256.

허용 첨부 JPG/PNG/WebP/PDF 8MB/건. 백업은 `farmland-policy-map/v1` 스키마, 최대 60MB, 사전 검증 후 단일 트랜잭션 병합. 동일 ID 덮어쓰기와 삭제는 사용자 확인을 받습니다. 농지 삭제 시 연결된 증빙도 삭제합니다. 사용자 텍스트는 HTML 이스케이프하며 SVG/HTML 실행형 첨부는 거부합니다.

민감정보 공개 Git 전송은 없지만 브라우저 내 데이터 암호화는 제공하지 않습니다. 동일 출처의 다른 페이지 코드도 저장소에 접근 가능하므로 본인 민감문서 보관용으로 사용하지 않습니다.

## 후속 순서

1. 발급 키로 VWorld 주소·필지 응답·도메인 제한 검증, PNU 피처/공식 속성 결합.
2. 권한 있는 농지대장·경영체 원본 자료의 최소정보 대조와 사람 검토.
3. 독립 도메인, 인증·접근통제·암호화 파일저장·동기화.
4. 공식 공고 수집과 검토 승인 후 정책 버전 배포, 동의 기반 변경 알림.
5. PostGIS 공간분석과 한계 표시, 정책 적용 규칙의 전문가 검토.
