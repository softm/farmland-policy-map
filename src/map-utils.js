/** Map-only state: never changes legal assessment or stored evidence. */
export const DEFAULT_NAVER_KEY = 'etfcybk8vf'; // Public browser ID in the user's reference repository, not a client secret.
export const REFERENCE_COMMIT = '263fddd1393cae2fc840d64a3fc80c353c1fcdb3';
export const normalizeQuery = q => String(q ?? '').normalize('NFKC').replace(/\s+/g,' ').trim();
export function validPoint(p){return p!=null&&Number.isFinite(p.lat)&&Number.isFinite(p.lng)&&Math.abs(p.lat)<=90&&Math.abs(p.lng)<=180;}
export function inBounds(p,b){if(!validPoint(p))return false;if(!b)return true;return p.lat>=b.south&&p.lat<=b.north&&(b.west<=b.east?(p.lng>=b.west&&p.lng<=b.east):(p.lng>=b.west||p.lng<=b.east));}
export function sortRows(rows,sort,assess){const rank={priority:0,review:1,missing:2,basic:3};return [...rows].sort((a,b)=>{let n=sort==='name'?a.name.localeCompare(b.name,'ko'):sort==='area'?(b.area??-1)-(a.area??-1):sort==='status'?rank[assess(a).status]-rank[assess(b).status]:String(b.updatedAt).localeCompare(String(a.updatedAt));return n||a.id.localeCompare(b.id);});}
export function latestGate(){let version=0;return {next:()=>++version,current:token=>token===version,cancel:()=>++version};}
export function mercatorBounds(b){const x=lon=>lon*20037508.342789244/180,y=lat=>Math.log(Math.tan((90+Math.max(-85,Math.min(85,lat)))*Math.PI/360))*6378137;return [x(b.west),y(b.south),x(b.east),y(b.north)];}
export function createQueryCache(request,{max=64,ttl=600000}={}){const values=new Map(),tasks=new Map();return async raw=>{const q=normalizeQuery(raw);if(!q)return [];const cached=values.get(q);if(cached&&Date.now()-cached.at<ttl)return cached.value;if(tasks.has(q))return tasks.get(q);const task=Promise.resolve().then(()=>request(q)).then(value=>{values.set(q,{at:Date.now(),value});if(values.size>max)values.delete(values.keys().next().value);return value;}).finally(()=>tasks.delete(q));tasks.set(q,task);return task;};}
