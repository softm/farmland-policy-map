"""UI regression tests against a development server or actual Pages deployment.
Set APP_URL and REQUIRE_MAP=1 for real external map verification.
Only normal viewport tiles are loaded; no tile scanning or offline prefetching.
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
    page=context.new_page(); errors=[]; page.on('pageerror',lambda e: errors.append(str(e)))
    if not LIVE:
        page.route(re.compile(r'https://.*'),lambda route: route.abort())
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
    response=page.goto(URL,wait_until='networkidle');assert response.status==200
    assert page.title().startswith('농지안심맵')
    if LIVE:
        page.wait_for_selector('.leaflet-container',timeout=15000)
        page.wait_for_selector('img.leaflet-tile-loaded',timeout=20000)
    page.screenshot(path=str(out/'desktop.png'),full_page=True)
    page.locator('#add-parcel').click()
    page.locator('#f-name').fill('검증용 농지')
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
    page.locator('[data-task="inheritance"]').check()
    page.wait_for_timeout(300)
    page.reload(wait_until='networkidle')
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
    path=downloaded.value.path();backup=json.loads(Path(path).read_text())
    assert len(backup['parcels'])==1 and len(backup['evidence'])==1
    assert 'vworldKey' not in backup
    page.get_by_role('button',name='닫기',exact=True).click()
    page.locator('[data-view="policies"]').click()
    assert page.locator('#policy-grid .policy-card').count()==6
    page.get_by_role('button',name='임대차',exact=True).click()
    assert page.locator('#policy-grid .policy-card').count()==2
    page.screenshot(path=str(out/'policies.png'),full_page=True)
    page.set_viewport_size({'width':390,'height':844})
    page.locator('[data-view="map"]').click()
    page.locator('.parcel-card').first.click()
    page.screenshot(path=str(out/'mobile.png'),full_page=True)
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    page.locator('[data-action="close-detail"]').click()
    page.locator('#settings').click()
    page.once('dialog',lambda d:d.accept())
    page.get_by_role('button',name='이 브라우저의 모든 농지·증빙 삭제').click()
    page.wait_for_timeout(300)
    assert page.locator('#count-total').inner_text()=='0'
    page.locator('#settings').click()
    page.once('dialog',lambda d:d.accept())
    page.locator('#backup-file').set_input_files({'name':'backup.json','mimeType':'application/json','buffer':json.dumps(backup).encode()})
    page.wait_for_timeout(500)
    assert page.locator('#count-total').inner_text()=='1'
    assert not errors, errors
    (out/'verification.json').write_text(json.dumps({'url':URL,'liveMapChecked':LIVE,'browserErrors':errors,'checks':['page load','register','assessment','task persistence','benefits','evidence','backup','policy filter','mobile overflow','delete','restore'],'screenshots':['desktop.png','policies.png','mobile.png']},ensure_ascii=False,indent=2))
    context.close();browser.close()
print('Browser smoke tests passed. Live map checked:',LIVE)
