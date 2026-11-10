#!/usr/bin/env python3
"""Build the separate n8n workflow that posts a Facebook teaser after an article is live.

  python3 scripts/n8n/fb_teaser_workflow.py create                # create it, INACTIVE, with a placeholder webhook
  python3 scripts/n8n/fb_teaser_workflow.py set-webhook <url>     # point the Make node at the real webhook
  python3 scripts/n8n/fb_teaser_workflow.py activate | deactivate

Flow: hourly -> list zh-TW posts -> pick the oldest post that was published >= 3h ago, not yet announced,
and whose public page returns 200 -> LLM writes a short hook -> rule checks -> POST to a Make webhook
(Make's Facebook Pages module does the actual post) -> remember the post id -> Telegram note.
The webhook URL is a secret: it lives only inside the n8n workflow, never in this repo.
Posts already live when the workflow is first activated are marked as announced, so nothing old is flooded out.
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
import n8n_api  # noqa: E402

NAME = '紫微 FB 預告（發文後 3 小時）'
PLACEHOLDER = 'https://hook.make.com/REPLACE_WITH_REAL_WEBHOOK'
SITE = 'https://aiziwei.online'

PICK = r"""
const sd = $getWorkflowStaticData('global');
sd.fbPosted = sd.fbPosted || [];
sd.fbTries = sd.fbTries || {};
const posts = ($input.first().json.data || {}).posts || [];
const now = Date.now();
const DELAY = 3 * 3600e3, WINDOW = 72 * 3600e3, MAXTRY = 3;
const live = posts.filter(p => p.status === 'published' && p.language === 'zh-TW' && p.published_at
  && new Date(p.published_at).getTime() <= now - DELAY);
if (!sd.fbInit) {
  // first run: whatever is already live counts as announced, so old posts are not flooded to Facebook
  live.forEach(p => { if (!sd.fbPosted.includes(p.id)) sd.fbPosted.push(p.id); });
  sd.fbInit = true;
  return [];
}
const todo = live
  .filter(p => !sd.fbPosted.includes(p.id) && new Date(p.published_at).getTime() >= now - WINDOW && (sd.fbTries[p.id] || 0) < MAXTRY)
  .sort((a, b) => new Date(a.published_at) - new Date(b.published_at));
for (const p of todo) {
  const url = 'https://aiziwei.online' + encodeURI(p.url);
  // only announce what is really on the public site
  let code = 0;
  try {
    const r = await this.helpers.httpRequest({ url, method: 'GET', returnFullResponse: true, ignoreHttpStatusErrors: true, timeout: 20000 });
    code = r.statusCode;
  } catch (e) { code = 0; }
  if (code !== 200) continue;
  return [{ json: { id: p.id, title: p.title, url, tags: String(p.tags || ''), body: String(p.content || '').slice(0, 1800) } }];
}
return [];
"""

CHECK = r"""
const src = $('選文並驗證上線').first().json;
const sd = $getWorkflowStaticData('global');
sd.fbTries = sd.fbTries || {};
sd.fbTries[src.id] = (sd.fbTries[src.id] || 0) + 1;
let t = $input.first().json.output[0].content[0].text;
if (typeof t === 'string') t = JSON.parse(t.replace(/^```json\s*/i, '').replace(/```\s*$/, ''));
let msg = String(t.message || '').trim();
const errors = [];
if (msg.length < 40 || msg.length > 260) errors.push('長度需 40 到 260 字，目前 ' + msg.length);
if (/[—–―─]/.test(msg)) errors.push('含破折號');
if (/\p{Extended_Pictographic}/u.test(msg)) errors.push('含 Emoji');
if (/https?:\/\//.test(msg)) errors.push('文案內不得放網址');
const banned = ['準確率', '保證', '科學邏輯', '首先', '其次', '總之', '綜上所述', '不僅如此', '值得注意的是', '一定會', '必定'];
const hit = banned.filter(w => msg.includes(w));
if (hit.length) errors.push('含禁用詞：' + hit.join('、'));
if (errors.length) throw new Error('FB 預告文案未通過（第 ' + sd.fbTries[src.id] + ' 次，最多 3 次）：' + src.title + '｜' + errors.join('；'));
msg += '\n\n（本文由 AI 輔助撰寫、經站方監督，僅供娛樂和文化學習參考。）';
return [{ json: { message: msg, link: src.url, title: src.title, id: src.id } }];
"""

RECORD = r"""
const src = $('檢查文案').first().json;
const sd = $getWorkflowStaticData('global');
sd.fbPosted = sd.fbPosted || [];
if (!sd.fbPosted.includes(src.id)) sd.fbPosted.push(src.id);
sd.fbPosted = sd.fbPosted.slice(-200);
return [{ json: { title: src.title } }];
"""

SYSTEM = """你是「AI 紫微斗數」Facebook 粉專的小編。請替一篇網站專欄寫一則簡短預告貼文，目的是讓讀者好奇、點連結到網站讀全文。繁體中文。

【格式】
1. 第一行是 hook：一個具體的問題、場景或反直覺的觀察，直接取自文章內容，要讓人想知道答案。
2. 接著 2 到 3 行短句，透露文章裡「一個」具體的看點（例如某個星曜、宮位或觀念），但不要把結論講完，留懸念。
3. 最後一行用一句話邀請讀全文，語氣自然，例如「完整的推演寫在文章裡」，不要寫「點擊下方連結」「立即閱讀」這類行銷口吻。
4. 全文 60 到 180 字。連結由系統另外附上，你不要寫任何網址。

【硬性規定】
- 只能根據提供的標題與文章內容寫，不得捏造文章沒有的事實、個案、數據或讀者來信，不得自稱有執業經驗。
- 不得預言或保證任何人的命運結果；不得使用「準確率」「保證」「科學邏輯」「一定會」這類宣稱。
- 禁用破折號與 Emoji；禁用「首先、其次、總之、綜上所述、不僅如此、值得注意的是」。
- 不要複製標題當 hook，也不要整段照抄文章開頭。
- 輸出 JSON：{"message": "貼文內文"}。"""

SCHEMA = json.dumps({
    "type": "object",
    "properties": {"message": {"type": "string", "description": "FB 預告貼文內文，不含網址"}},
    "required": ["message"],
    "additionalProperties": False,
}, ensure_ascii=False)


def build(webhook):
    tg = {'telegramApi': {'id': 'DL3qUg6LCTetekDw', 'name': 'Telegram account !'}}
    nodes = [
        {'id': 'fb-trigger', 'name': '每小時檢查', 'type': 'n8n-nodes-base.scheduleTrigger', 'typeVersion': 1.1,
         'position': [0, 0], 'parameters': {'rule': {'interval': [{'field': 'hours', 'hoursInterval': 1}]}}},
        {'id': 'fb-list', 'name': '取近期中文文章', 'type': 'n8n-nodes-base.httpRequest', 'typeVersion': 4.3,
         'position': [240, 0], 'parameters': {'url': SITE + '/api/blog/list?limit=20&language=zh-TW', 'options': {}}},
        {'id': 'fb-pick', 'name': '選文並驗證上線', 'type': 'n8n-nodes-base.code', 'typeVersion': 2,
         'position': [480, 0], 'parameters': {'jsCode': PICK.strip()}},
        {'id': 'fb-llm', 'name': '寫預告文案', 'type': '@n8n/n8n-nodes-langchain.openAi', 'typeVersion': 2,
         'position': [720, 0], 'credentials': {'openAiApi': {'id': 'pcAm2yc2bIRwI0xA', 'name': 'OpenAi account'}},
         'parameters': {
             'modelId': {'__rl': True, 'value': 'gpt-5.6-luna', 'mode': 'list', 'cachedResultName': 'GPT-5.6-LUNA'},
             'responses': {'values': [
                 {'role': 'system', 'content': SYSTEM},
                 {'content': "=標題：{{ $json.title }}\n標籤：{{ $json.tags }}\n\n文章內容（節錄）：\n{{ $json.body }}"},
             ]},
             'builtInTools': {},
             'options': {'textFormat': {'textOptions': {'type': 'json_schema', 'schema': SCHEMA}}},
         }},
        {'id': 'fb-check', 'name': '檢查文案', 'type': 'n8n-nodes-base.code', 'typeVersion': 2,
         'position': [960, 0], 'parameters': {'jsCode': CHECK.strip()}},
        {'id': 'fb-make', 'name': '送到 Make 發 FB', 'type': 'n8n-nodes-base.httpRequest', 'typeVersion': 4.3,
         'position': [1200, 0], 'parameters': {
             'method': 'POST', 'url': webhook, 'sendBody': True, 'specifyBody': 'json',
             'jsonBody': '={{ JSON.stringify({ message: $json.message, link: $json.link, title: $json.title }) }}',
             'options': {'timeout': 20000}}},
        {'id': 'fb-record', 'name': '記錄已預告', 'type': 'n8n-nodes-base.code', 'typeVersion': 2,
         'position': [1440, 0], 'parameters': {'jsCode': RECORD.strip()}},
        {'id': 'fb-tg', 'name': '通知已預告', 'type': 'n8n-nodes-base.telegram', 'typeVersion': 1.2,
         'position': [1680, 0], 'credentials': tg,
         'parameters': {'chatId': '850700458', 'text': '=【AI紫微】已送出 FB 預告：{{ $json.title }}', 'additionalFields': {}}},
    ]
    order = [n['name'] for n in nodes]
    conns = {order[i]: {'main': [[{'node': order[i + 1], 'type': 'main', 'index': 0}]]} for i in range(len(order) - 1)}
    return {'name': NAME, 'nodes': nodes, 'connections': conns,
            'settings': {'executionOrder': 'v1', 'timezone': 'Asia/Taipei', 'errorWorkflow': 'k4pQNJ91Ev07sdo0'}}


def find():
    s, d = n8n_api.call('GET', '/workflows?limit=100')
    for w in d.get('data', []):
        if w['name'] == NAME:
            return w['id']
    return None


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    if cmd == 'create':
        if find():
            sys.exit('already exists: ' + find())
        s, d = n8n_api.call('POST', '/workflows', build(PLACEHOLDER))
        print(s, d.get('id') or d)
    elif cmd == 'set-webhook':
        wid = find() or sys.exit('workflow not found')
        s, w = n8n_api.call('GET', f'/workflows/{wid}')
        for n in w['nodes']:
            if n['name'] == '送到 Make 發 FB':
                n['parameters']['url'] = sys.argv[2]
        body = {k: w[k] for k in ('name', 'nodes', 'connections', 'settings')}
        s, d = n8n_api.call('PUT', f'/workflows/{wid}', body)
        print(s, 'ok' if s == 200 else d)
    elif cmd in ('activate', 'deactivate'):
        wid = find() or sys.exit('workflow not found')
        s, d = n8n_api.call('POST', f'/workflows/{wid}/{cmd}')
        print(s, d.get('active') if isinstance(d, dict) else d)
    else:
        print(__doc__)


if __name__ == '__main__':
    main()
