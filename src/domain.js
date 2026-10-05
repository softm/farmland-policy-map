/** Deterministic pre-checks, NOT official eligibility, investigation odds or legal advice. */
export const VERSION = '0.2.0';
export const REVIEWED_AT = '2026-10-05';
export const SOURCES = {
  portal:{title:'농지공간포털',url:'https://njy.mafra.go.kr/'},
  map:{title:'공식 농지 지도',url:'https://njy.mafra.go.kr/map/mapMain.do'},
  law:{title:'농지법 · 국가법령정보센터',url:'https://www.law.go.kr/법령/농지법'},
  lease:{title:'농지법 제23조 · 임대차 예외',url:'https://www.law.go.kr/LSW/lsLawLinkInfo.do?chrClsCd=010202&lsId=000479&lsJoLnkSeq=1000732579&print=print'},
  leaseGuide:{title:'찾기쉬운 생활법령 · 농지 임대차',url:'https://easylaw.go.kr/CSP/CnpClsMain.laf?ccfNo=3&cciNo=1&cnpClsNo=1&csmSeq=1774&menuType=onhunqna&popMenu=ov'},
  bank:{title:'농지은행·농지연금',url:'https://www.fbo.or.kr/'},
  ministry:{title:'농림축산식품부 · 최신 공지 확인',url:'https://www.mafra.go.kr/'},
  registry:{title:'농업경영체 등록정보 확인',url:'https://uni.agrix.go.kr/'},
  cadastral:{title:'연속지적도형정보 · 공공데이터',url:'https://www.data.go.kr/data/15123899/openapi.do'},
  landuse:{title:'토지이용계획정보 · 공공데이터',url:'https://www.data.go.kr/data/15123973/openapi.do'},
  vworld:{title:'VWorld · API 신청',url:'https://www.vworld.kr/'},
  eum:{title:'토지이음',url:'https://www.eum.go.kr/'}
};
export const POLICIES = [
 {id:'survey',tag:'조사 대응',title:'조사 통지를 받았다면, 기한부터 확인',body:'공식 조사대상 여부와 소명기한은 관할 시·군·구의 통지로 확인하세요. 지도나 자경 여부 하나만으로 조사대상·위반 여부를 확정할 수 없습니다.',action:'통지서·취득자료·현재 경작자료를 필지별로 정리하세요.',source:'ministry',status:'개별 통지 확인'},
 {id:'lease',tag:'임대차',title:'타인이 경작한다고 모두 불법은 아닙니다',body:'농지법 제23조에는 상속 등 취득 사유, 질병 등 부득이한 사유, 고령농, 농지은행 위탁 등 임대차 예외가 있습니다. 해당 사유의 전체 요건을 확인해야 합니다.',action:'소유자·실제 경작자·임대 근거와 계약 내용을 함께 확인하세요.',source:'lease',status:'법령 근거'},
 {id:'elder',tag:'임대차',title:'고령농 예외는 나이만으로 판단하지 않습니다',body:'60세 이상 요건 외에 자경기간, 거주 지역 등 추가 조건이 있습니다. 5년 경작과 5년 초과 경작도 구분해야 합니다.',action:'거주지, 자경 시작·종료일, 필지 위치를 상담 시 준비하세요.',source:'leaseGuide',status:'추가 요건 필요'},
 {id:'ledger',tag:'정보 정비',title:'농지대장·경영체·실제 경작내용 맞춰보기',body:'서로 다른 기록은 오류나 변경 미반영일 수 있습니다. 이 앱은 행정 DB에 접속하지 않으며, 입력한 불일치 여부에 따라 확인할 항목을 정리합니다.',action:'변경신청 대상·절차·기한은 관할 행정기관에서 확인하세요.',source:'portal',status:'사용자 입력 기반'},
 {id:'bank',tag:'활용 기회',title:'직접 경작이 어렵다면 농지은행 상담',body:'위탁임대·매도·임차농지 공급·농지연금 등 자신의 목적에 맞는 사업을 확인하세요. 사업별 요건과 대상농지가 달라 자동 승인되지 않습니다.',action:'소유·취득자료와 이용현황을 준비해 해당 사업을 문의하세요.',source:'bank',status:'사업별 자격 확인'},
 {id:'boundary',tag:'지도 안내',title:'지도상 경계와 법적 경계는 다릅니다',body:'연속지적도는 참고용 도면입니다. 경계 분쟁, 실제 면적, 맹지·진입권, 영농여건불리농지 지정 여부를 지도만으로 확정하지 않습니다.',action:'공식 열람자료를 확인하고 경계 확인이 필요하면 적법한 측량을 이용하세요.',source:'cadastral',status:'참고용 공간정보'}
];
export const OPTIONS = {
 role:[['owner','소유자'],['tenant','임차·경작자']],
 acquisition:[['unknown','확인 중'],['purchase','매매'],['inheritance','상속'],['gift','증여'],['auction','경매'],['other','기타']],
 use:[['unknown','확인 중'],['self','직접 경작'],['family','가족 경작'],['leased','다른 사람 경작'],['fallow','휴경']],
 leaseReason:[['unknown','확인 중'],['inheritance','상속 관련 예외 검토'],['illness','질병 등 부득이한 사유'],['elder','고령농 관련 예외 검토'],['bank','농지은행 위탁계약'],['other','기타 법정 예외'],['none','확인된 근거 없음']],
 contract:[['unknown','확인 중'],['written','서면 계약'],['verbal','구두 약정'],['none','없음']],
 facility:[['unknown','확인 중'],['none','시설 없음'],['permitted','시설 있음 · 허가/신고 확인'],['unverified','시설 있음 · 허가/신고 미확인']],
 mismatch:[['unknown','대조 전'],['no','입력상 일치'],['yes','차이 있음']],
 notice:[['unknown','확인 중'],['no','받지 않음'],['yes','통지 받음']],
 difficulty:[['unknown','확인 중'],['no','특이사항 없음'],['yes','경사·진입·재해 등 어려움']],
 ownership:[['unknown','확인 중'],['sole','단독'],['shared','공유']],
 landType:[['unknown','확인 중'],['field','전'],['paddy','답'],['orchard','과수원'],['other','기타']]
};
export const label = (field,value) => OPTIONS[field]?.find(([v])=>v===value)?.[1] || '확인 중';
export function assess(p, now = new Date()) {
 const checks=[], benefits=[];
 const add=(id,level,title,reason,action,source='law')=>checks.push({id,level,title,reason,action,source});
 if(p.notice==='yes') add('notice','priority','통지서·소명기한 확인','관할기관의 통지를 받았다고 입력했습니다.','통지서의 조사 사유와 제출기한을 확인하고 담당 부서에 제출자료를 문의하세요.','ministry');
 if(p.use==='unknown') add('use','missing','실제 이용현황 입력','경작 현황이 아직 확인되지 않았습니다.','직접·가족·타인 경작 또는 휴경 여부를 확인하세요.','portal');
 if(p.use==='leased'||p.role==='tenant') {
  add('lease',p.leaseReason==='none'?'priority':'review','임대차 허용 근거 확인','타인 경작 또는 임차경작으로 입력했습니다. 이것만으로 불법 여부를 판단할 수 없습니다.','취득 사유와 임대차 예외의 전체 요건, 계약기간을 확인하세요.','lease');
  if(['inheritance','illness','elder','bank','other'].includes(p.leaseReason)) add('exception','review','입력한 예외 사유의 증빙 준비',label('leaseReason',p.leaseReason)+'를 선택했습니다. 예외 적용 확정은 아닙니다.','상속자료·진단자료·자경기간·거주지·위탁계약 등 해당 근거를 관할기관과 확인하세요.','lease');
  if(p.contract!=='written') add('contract','review','계약 내용 서면 정리','계약서가 없다고 자동으로 불법이 되는 것은 아니지만 내용 확인과 증명이 필요합니다.','약정내용과 실제 경작관계를 확인하고 계약 방법은 관할기관에 문의하세요.','law');
  benefits.push({title:p.role==='tenant'?'안정적인 임차·경작 관계 확인':'농지은행 위탁임대 상담',body:'사업 요건과 임대차 관계를 확인하는 상담 경로입니다. 선정이나 적법성을 보장하지 않습니다.',source:'bank'});
 }
 if(p.use==='fallow') add('fallow','priority','휴경 사유·기간 확인','휴경을 입력했습니다. 질병·재해·농지개량 등 사유와 기간을 별도로 살펴봐야 합니다.','휴경 원인 자료와 향후 이용 계획을 정리하고 담당 부서와 협의하세요.');
 if(p.facility==='unverified') add('facility','priority','시설의 허가·신고 확인','시설이 있지만 허가·신고 상태가 확인되지 않았습니다.','농막·창고·주차장 등 실제 용도와 관련 서류를 확인하세요.','eum');
 if(p.mismatch==='yes') add('mismatch','priority','행정정보 불일치 점검','사용자가 기록 간 차이가 있다고 입력했습니다. 위반이 확인된 것은 아닙니다.','농지대장·경영체·직불금 신청내용을 원본과 대조하고 사실에 맞게 정정하세요.','portal');
 if(p.mismatch==='unknown') add('registry','missing','행정정보 원본 대조','행정기관 자료가 자동 연동되지 않았습니다.','농지대장과 경영체, 실제 경작내용을 확인해 입력하세요.','registry');
 if(p.acquisition==='inheritance') {add('inheritance','review','상속농지의 보유·임대 조건 확인','상속 취득은 증여·매매와 다르게 검토합니다. 한 필지 면적만으로 총 보유면적 요건을 판단하지 않습니다.','본인이 보유한 상속농지 전체 면적과 경작 여부, 위탁 여부를 확인하세요.','lease');benefits.push({title:'상속농지 관리·위탁 방법 비교',body:'상속관계와 전체 보유농지, 경작 여부를 바탕으로 상담하세요.',source:'bank'});}
 if(p.ownership==='shared') add('shared','review','공유자 간 경작·사용관계 확인','공유라고 자동으로 투기농지가 되는 것은 아닙니다.','지분·실제 이용·공유자 합의내용을 정리하세요.','law');
 if(p.difficulty==='yes') add('difficulty','review','경작이 어려운 사유 정리','경작곤란과 영농여건불리농지의 공식 지정은 다릅니다.','진입로·경사·재해 사진과 공식 지정 여부를 확인하세요.','portal');
 if(p.use==='self') benefits.push({title:'경영체·직불금·지원사업 확인',body:'실경작 사실 외에도 사업별 자격·소득·면적·신청기간 요건을 확인해야 합니다.',source:'registry'});
 if(p.use==='fallow'||p.difficulty==='yes') benefits.push({title:'유휴농지 활용·농지은행 상담',body:'위탁·매도·활용 가능 여부는 농지 상태와 사업별 기준에 따라 개별 심사됩니다.',source:'bank'});
 if(!checks.some(c=>c.level==='priority')) add('evidence','basic','경작·이용 증빙 꾸준히 기록','현재 입력에서 우선 확인 항목이 발견되지 않았더라도 적법성이 확인된 것은 아닙니다.','작업일지·사진·구입 영수증·계약자료를 실제 사실에 따라 보관하세요.','portal');
 const required=['acquisition','use','facility','mismatch','notice'];
 const known=required.filter(k=>p[k]&&p[k]!=='unknown').length;
 let status=checks.some(c=>c.level==='priority')?'priority':known<required.length?'missing':checks.some(c=>c.level==='review')?'review':'basic';
 const days=p.deadline?daysUntil(p.deadline,now):null;
 return {checks,benefits,status,known,total:required.length,days,reviewedAt:REVIEWED_AT,ruleVersion:VERSION};
}
export const STATUS={priority:{title:'우선 확인',color:'#b45325'},review:{title:'조건 검토',color:'#8a6b20'},missing:{title:'정보 보완',color:'#64748b'},basic:{title:'기본 점검',color:'#28775f'}};
export function daysUntil(date,now=new Date()) {const d=new Date(date+'T00:00:00+09:00');if(!Number.isFinite(d.getTime()))return null;const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);return Math.round((d-new Date(today+'T00:00:00+09:00'))/86400000);}
export const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function validateParcel(raw) {
 if(!raw||typeof raw!=='object')throw Error('농지 형식이 올바르지 않습니다.');
 const p={};
 for(const k of ['id','name','address','pnu','acquiredAt','deadline','notes','source'])p[k]=String(raw[k]??'').slice(0,k==='notes'?2000:250);
 if(!/^[a-zA-Z0-9_-]{1,80}$/.test(p.id))throw Error('농지 ID가 올바르지 않습니다.');
 if(!p.name.trim())throw Error('농지 이름을 입력하세요.');
 if(p.pnu&&!/^\d{19}$/.test(p.pnu))throw Error('PNU는 19자리 숫자입니다.');
 for(const k of ['lat','lng','area']){p[k]=raw[k]===''||raw[k]===null||raw[k]===undefined?null:Number(raw[k]);if(p[k]!==null&&!Number.isFinite(p[k]))throw Error('숫자 형식이 잘못되었습니다.');}
 if((p.lat===null)!==(p.lng===null)||p.lat!==null&&(Math.abs(p.lat)>90||Math.abs(p.lng)>180))throw Error('위도·경도를 함께 정확히 입력하세요.');
 if(p.area!==null&&(p.area<=0||p.area>1e10))throw Error('면적은 0보다 커야 합니다.');
 for(const [k,options] of Object.entries(OPTIONS)){p[k]=String(raw[k]??'unknown');if(!options.some(([v])=>v===p[k]))p[k]=k==='role'?'owner':'unknown';}
 for(const k of ['acquiredAt','deadline'])if(p[k]&&(!/^\d{4}-\d{2}-\d{2}$/.test(p[k])||!Number.isFinite(new Date(p[k]).getTime())||new Date(p[k]).toISOString().slice(0,10)!==p[k]))throw Error('날짜를 확인하세요.');
 p.done=Array.isArray(raw.done)?raw.done.filter(x=>typeof x==='string'&&/^[a-z-]+$/.test(x)).slice(0,30):[];
 p.updatedAt=typeof raw.updatedAt==='string'?raw.updatedAt:new Date().toISOString();p.demo=raw.demo===true;
 return p;
}
export function validateBackup(raw) {
 if(raw?.schema!=='farmland-policy-map/v1'||!Array.isArray(raw.parcels)||!Array.isArray(raw.evidence)||raw.parcels.length>1000||raw.evidence.length>2000)throw Error('이 앱의 백업 파일이 아니거나 허용량을 초과했습니다.');
 const parcels=raw.parcels.map(validateParcel),ids=new Set(parcels.map(p=>p.id));if(ids.size!==parcels.length)throw Error('중복된 농지 ID가 있습니다.');
 const seen=new Set();const evidence=raw.evidence.map(e=>{if(!e||!ids.has(e.parcelId)||!/^[-a-zA-Z0-9_]{1,80}$/.test(e.id)||seen.has(e.id))throw Error('증빙 연결이 잘못되었습니다.');seen.add(e.id);if(e.data&&!/^data:(image\/(png|jpeg|webp)|application\/pdf);base64,[A-Za-z0-9+/=]+$/.test(e.data))throw Error('허용하지 않는 첨부파일 형식입니다.');if((e.data||'').length>12e6)throw Error('첨부파일이 너무 큽니다.');return {id:e.id,parcelId:e.parcelId,title:String(e.title||'증빙').slice(0,150),date:String(e.date||'').slice(0,10),note:String(e.note||'').slice(0,2000),data:e.data||'',fileName:String(e.fileName||'').slice(0,200),sha256:String(e.sha256||'').slice(0,64)};});
 return {parcels,evidence};
}
