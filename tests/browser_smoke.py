"""Browser regressions. REQUIRE_MAP=1 verifies genuine Naver tiles and geocoding.
Only user-visible viewport tiles are requested. No tile scans or prefetching.
"""
import os, re, json, mimetypes
from pathlib import Path
from playwright.sync_api import sync_playwright
URL=os.getenv('APP_URL','https://farmland.test/')
LIVE=os.getenv('REQUIRE_MAP')=='1'
out=Path(os.getenv('SCREENSHOT_DIR','test-results'));out.mkdir(exist_ok=True)
with sync_playwright() as pw:
    browser=pw.chromium.launch(**({'executable_path':'/usr/bin/chromium','args':['--no-sandbox']} if Path('/usr/bin/chromium').exists() else {}))
    context=browser.new_context(viewport={'width':1440,'height':1000},locale='ko-KR',accept_downloads=True)
    page=context.new_page();errors=[]
    page.on('pageerror',lambda e:(errors.append(str(e)),print('BROWSER ERROR:',str(e))))
    if not LIVE:
        page.route(re.compile(r'https://.*'),lambda route:route.abort())
        if URL.startswith('https://farmland.test/'):
            from urllib.parse import urlparse
            root=Path(__file__).resolve().parents[1]
            def serve(route):
                path=urlparse(route.request.url).path.lstrip('/') or 'index.html'
                file=(root/path).resolve()
                if not file.is_relative_to(root) or not file.is_file():
                    route.fulfill(status=404,body='Not found');return
                route.fulfill(status=200,content_type=mimetypes.guess_type(str(file))[0] or 'application/octet-stream',body=file.read_bytes())
            page.route('https://farmland.test/**',serve)
    def capture(name,map_view=False):
        page.wait_for_load_state('networkidle')
        page.locator('#toast').wait_for(state='hidden',timeout=8000)
        if LIVE and map_view:
            page.wait_for_function("Array.from(document.querySelectorAll('#map img')).some(i=>i.complete&&i.naturalWidth>100&&/naver|pstatic/.test(i.src))",timeout=20000)
        page.screenshot(path=str(out/name),full_page=True)
    response=page.goto(URL,wait_until='networkidle');assert response.status==200
    page.wait_for_function("document.body.dataset.recordsReady === 'true'",timeout=15000)
    assert page.title().startswith('농지안심맵')
    if LIVE:
        page.wait_for_selector('body[data-map-ready="true"]',timeout=20000)
        page.wait_for_function("Array.from(document.querySelectorAll('#map img')).some(i=>i.naturalWidth>100&&/naver|pstatic/.test(i.src))",timeout=20000)
        assert page.locator('#map').get_attribute('data-provider')=='naver'
        assert page.evaluate('typeof window.L')=='undefined'
        page.locator('[data-map-type="normal"]').click()
        assert page.locator('#map').get_attribute('data-map-type')=='normal'
        page.locator('[data-map-type="hybrid"]').click()
        page.locator('#search').fill('경기도 성남시 분당구 불정로 6')
        page.locator('#search-form button[type="submit"]').click()
        page.wait_for_selector('#search-results button[data-result]',timeout=15000)
        assert '네이버 주소' in page.locator('#search-results').inner_text()
        page.locator('#search-results button[data-result]').first.click()
        page.locator('#search-clear').click()
    capture('desktop.png',map_view=True)
    page.locator('#add-parcel').click()
    page.locator('#f-name').fill('검증용 농지')
    page.locator('#f-lat').fill('37.3595704')
    page.locator('#f-lng').fill('127.105399')
    page.locator('#f-acquisition').select_option('inheritance')
    page.locator('#f-use').select_option('leased')
    page.locator('#f-leaseReason').select_option('inheritance')
    page.locator('#f-contract').select_option('written')
    page.locator('#f-facility').select_option('none')
    page.locator('#f-mismatch').select_option('no')
    page.locator('#f-notice').select_option('no')
    page.get_by_role('button',name='저장하고 점검 보기').click()
    page.wait_for_selector('#detail:not([hidden])')
    assert '상속농지' in page.locator('#detail').inner_text()
    assert page.locator('#count-total').inner_text()=='1'
    if LIVE:
        page.wait_for_selector('.naver-pin[data-pin]')
        assert page.locator('.pin-rank').first.inner_text()=='1'
        page.locator('[data-action="close-detail"]').click()
        page.locator('#select-map-all').uncheck()
        page.wait_for_function("document.querySelectorAll('.naver-pin').length===0")
        page.locator('#select-map-all').check()
        page.wait_for_selector('.naver-pin')
        page.locator('.parcel-card').first.click()
    page.locator('[data-task="inheritance"]').check()
    page.wait_for_timeout(300)
    page.reload(wait_until='networkidle')
    page.wait_for_function("document.body.dataset.recordsReady === 'true'",timeout=15000)
    assert page.locator('#count-total').inner_text()=='1'
    page.locator('.parcel-card').first.click()
    assert page.locator('[data-task="inheritance"]').is_checked()
    page.locator('[data-tab="benefits"]').click()
    assert '관리·위탁' in page.locator('#detail').inner_text()
    page.locator('[data-tab="evidence"]').click()
    page.locator('[data-action="evidence-add"]').click()
    page.locator('[name="title"]').fill('실제 작업 메모')
    page.locator('[name="note"]').fill('입력 저장 기능 검증. 실제 농지 자료 아님.')
    page.get_by_role('button',name='증빙 저장').click()
    page.wait_for_selector('#dialog:not([open])',state='attached')
    page.locator('[data-action="close-detail"]').click()
    page.locator('[data-view="evidence"]').click()
    page.wait_for_selector('.evidence-card')
    assert '실제 작업 메모' in page.locator('#evidence-grid').inner_text()
    page.locator('#settings').click()
    with page.expect_download() as downloaded:
        page.get_by_role('button',name='전체 백업 저장').click()
    backup=json.loads(Path(downloaded.value.path()).read_text())
    assert len(backup['parcels'])==1 and len(backup['evidence'])==1
    assert 'vworldKey' not in backup and 'naverKeyId' not in backup
    page.get_by_role('button',name='닫기',exact=True).click()
    page.locator('[data-view="policies"]').click()
    assert page.locator('#policy-grid .policy-card').count()==6
    page.get_by_role('button',name='임대차',exact=True).click()
    assert page.locator('#policy-grid .policy-card').count()==2
    capture('policies.png')
    page.set_viewport_size({'width':390,'height':844})
    page.locator('[data-view="map"]').click()
    page.locator('#list-toggle').click()
    assert page.locator('body').evaluate("e=>e.classList.contains('list-collapsed')")
    page.locator('#list-toggle').click()
    assert not page.locator('body').evaluate("e=>e.classList.contains('list-collapsed')")
    page.locator('.parcel-card').first.click()
    capture('mobile.png',map_view=True)
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    page.locator('[data-action="close-detail"]').click()
    page.locator('#settings').click()
    page.once('dialog',lambda d:d.accept())
    page.get_by_role('button',name='이 브라우저의 모든 농지·증빙 삭제').click()
    page.wait_for_function("document.querySelector('#count-total').textContent==='0'")
    page.locator('#settings').click()
    page.once('dialog',lambda d:d.accept())
    page.locator('#backup-file').set_input_files({'name':'backup.json','mimeType':'application/json','buffer':json.dumps(backup).encode()})
    page.wait_for_function("document.querySelector('#count-total').textContent==='1'")
    assert not errors,errors
    result={'url':URL,'liveMapChecked':LIVE,'browserErrors':list(errors),'naverMapAndGeocoderChecked':LIVE,'checks':['page load','real Naver tiles','normal/hybrid switch','Naver geocoder','register','numbered marker','show/hide markers','assessment','task persistence','benefits','evidence','backup','policy filter','mobile sheet collapse/expand','mobile overflow','delete','restore'],'screenshots':['desktop.png','policies.png','mobile.png']}
    if LIVE:
        # Independent public navigation check. Failure here does not invalidate app tests.
        central={'status':'pending'}
        try:
            page.set_viewport_size({'width':1440,'height':1000})
            r=page.goto('https://softm.github.io/projects/',wait_until='networkidle')
            assert r.status==200
            link=page.locator('a[href="https://softm.github.io/projects/farmland-policy-map/"]').first
            link.wait_for(state='visible',timeout=15000)
            page.screenshot(path=str(out/'central-index.png'),full_page=True)
            link.click();page.wait_for_load_state('networkidle')
            page.wait_for_function("document.querySelector('#title')?.textContent==='농지안심맵'",timeout=15000)
            app_link=page.locator('a[href="https://softm.github.io/farmland-policy-map/"]').first
            app_link.wait_for(state='visible',timeout=15000)
            page.screenshot(path=str(out/'project-home.png'),full_page=True)
            app_link.click();page.wait_for_load_state('networkidle')
            assert page.title().startswith('농지안심맵')
            central={'status':'passed','index':'https://softm.github.io/projects/','projectHome':'https://softm.github.io/projects/farmland-policy-map/','app':page.url}
        except Exception as exc:
            central={'status':'failed','url':page.url,'error':str(exc)}
            page.screenshot(path=str(out/'central-error.png'),full_page=True)
        result['centralNavigation']=central
    (out/'verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
    context.close();browser.close()
print('Browser smoke tests passed. Live Naver map checked:',LIVE)
