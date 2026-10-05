# 농지안심맵 구현 명세 · v0.2.0

농지별 확인할 일 → 공식 근거 → 활용기회 → 증빙을 연결하는 정적 웹 앱입니다. 정책 안내 검토일은 2026-10-05이며 지도 교체와 법률 규칙 변경은 구분합니다.

## 네이버 지도 적용 기준

사용자가 지정한 [돌봄한눈 저장소](https://github.com/softm/homecare-nationwide-care-services-map)를 읽기 전용으로 참고했습니다. 기준 커밋은 `263fddd1393cae2fc840d64a3fc80c353c1fcdb3`입니다.

| 참고 모듈 | 농지 앱에 적용한 내용 |
|---|---|
| index.html의 지도 로더 | Naver Maps v3 + geocoder, 기본 HYBRID, 일반지도 전환, 확대·축소·현재위치 |
| naver-geocoder.js | 검색어 정규화, 동일 요청 중복 방지, 제한된 메모리 캐시, 시간 초과와 오류 안내 |
| map-experience.js | 현재 지도영역 갱신, 선택 시 목록 순번 보존, 지도 중심·배율을 탭 세션에 보관 |
| map-marker-placement.js / map-marker-labels.js | 목록과 같은 번호, 상태 마커, 선택 강조, 저배율 이름표 억제·겹침 완화 |
| care-mobile-focus.css/js | 모바일 떠 있는 검색창, 접이식 목록, 지도 확대 보기, 하단 상세 패널 |

기존 Leaflet/OSM 로드는 제거했습니다. 참고 저장소의 **공개 브라우저 Key ID**를 기본 사용하며 Client Secret은 사용하지 않습니다. 같은 지도 Application의 사용량을 공유하며 허용 Origin이 필요합니다. 사용자가 설정 화면에서 자신의 브라우저 Key ID로 바꿀 수 있습니다.

## 현재 구현 범위

| 기능 | 상태·한계 |
|---|---|
| 네이버 일반/위성·도로 지도 | 운영 Pages에서 실제 이미지 로딩·유형 전환 확인 |
| 네이버 주소·지번 검색 | 운영 Pages에서 실제 Geocoder 응답과 검색 위치 이동 확인 |
| 지도↔목록 | 현재영역/전체 농지, 자동/수동 갱신, 정렬, 동일 순번, 개별/전체 마커 표시 |
| 농지 등록 | 지도 클릭, 역지오코딩 주소 보완, 직접 주소/PNU/면적/취득/경작/통지 입력 |
| 공간정보 WMS | VWorld 영상을 Naver GroundOverlay로 표시하는 코드. 실발급 VWorld 키가 없어 실제 응답은 미검증 |
| 정책·혜택 | 사용자 입력 기반 사전점검과 상담 경로. 조사대상·적법성·수급 확정 아님 |
| 증빙·보고서 | JPG/PNG/WebP/PDF 원본 8MB/건, 메모·해시·다운로드, 인쇄용 보고서. 첨부 PDF 병합은 하지 않음 |
| 데이터 | 기존 IndexedDB 스키마 유지, 원본 포함 JSON 백업·복원, 삭제 |
| 배포 | main → 37개 단위 테스트·빌드 → gh-pages → Pages → 실제 브라우저 검사 |

지도영역 조회는 **등록한 농지의 목록 필터**입니다. 전국 농지 행정 DB를 수집하거나 소유자 정보를 조회하는 기능이 아닙니다. PNU로 실제 필지경계를 자동 조회하거나 경사·진입권·공식 지정 여부를 판단하지 않습니다.

## 소스 구조

`src/naver-map.js`: SDK·Naver 지도 수명주기·지오코딩·마커·WMS.

`src/map-utils.js`: 범위 판정·정렬·검색 순서 제어·캐시·좌표 변환.

`src/app.js`: 기존 농지/정책/증빙 화면, 지도 워크스페이스 연결.

`assets/naver-ui.css`: 돌봄한눈을 참고한 반응형 지도·목록 UI.

`src/domain.js`: 입력 검증·설명 가능한 사전점검·출처·규칙 버전.

`src/storage.js`: IndexedDB 트랜잭션·연결 증빙 삭제·일괄 복원.

`tests/domain.test.mjs`, `tests/map-utils.test.mjs`: 단위 테스트 37개.

`tests/browser_smoke.py`: 실제 Naver 이미지·주소 검색·유형 전환·번호 마커·표시 체크·농지 저장·새로고침·증빙·백업·모바일·복원 검사. 중앙 프로젝트 이동은 별도 결과로 보고합니다.

`scripts/migrate-naver.mjs`, `scripts/finalize-naver.mjs`: 첫 교체 때 사용한 명시적 소스 변환 기록. 운영 브라우저에서 실행하지 않습니다.

## 정책 안전장치와 후속 범위

조사 확률·임의 위험점수·합법/불법·지원금 확정값을 표시하지 않습니다. 정보 부족을 낮은 위험으로 취급하지 않고, 상속 한 필지 면적과 총 보유면적을 혼동하지 않습니다. 가족경작·공유·경매만으로 투기 등급을 부여하지 않습니다. 체크 완료는 사용자의 작업 기록이며 관할기관의 확인이 아닙니다.

최초 기획의 일부 전수조사 날짜·유예·정상화 주장은 원문 재확인에 실패해 규칙에서 제외했습니다. 미확인 2026-11-15 마감이나 특정 유형 외 제재 면제 같은 단정을 적용하지 않습니다. 정책 자동 수집·알림, 공식 행정 DB 대조, PNU 피처/정밀 공간분석, 로그인·암호화·기기 간 동기화는 후속 범위입니다.

## 개인정보·보관

농지·증빙 DB 이름은 기존 `farmland-policy-map-v1`을 그대로 사용합니다. 저장자료를 공개 Git이나 운영 서버로 전송하지 않습니다. 백업은 `farmland-policy-map/v1`, 최대 60MB, 사전검증 후 단일 트랜잭션 병합이며 동일 ID 덮어쓰기와 삭제는 사용자 확인을 받습니다. 사용자 텍스트는 HTML 이스케이프하고 실행형 SVG/HTML 첨부는 거부합니다.

브라우저 내 데이터는 암호화하지 않으며 같은 `softm.github.io` 출처의 다른 코드도 접근 가능하므로 주민등록번호·민감문서를 보관하지 마세요. 지도 열람·주소 검색 시 네이버에 조회 위치·검색어·IP·참조 도메인이 전달될 수 있습니다. API 키는 백업에 넣지 않습니다.

## 근거·개발 문서

[농지공간포털](https://njy.mafra.go.kr/) · [농지법](https://www.law.go.kr/법령/농지법) · [농지은행](https://www.fbo.or.kr/) · [연속지적도 공공데이터](https://www.data.go.kr/data/15123899/openapi.do) · [VWorld](https://www.vworld.kr/) · [Naver Maps 공식 SDK](https://navermaps.github.io/maps.js.ncp/docs/) · [Naver Geocoder](https://navermaps.github.io/maps.js.ncp/docs/tutorial-Geocoder-Geocoding.html)
