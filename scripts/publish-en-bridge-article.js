#!/usr/bin/env node

/**
 * One-off: insert the manually localized English companion to the first
 * weekly zh-TW curation article as a DRAFT for review before publishing.
 * See docs/n8n-english-edition-plan.md ("近期內容過渡方案").
 * Usage: node scripts/publish-en-bridge-article.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
const { sql } = require('@vercel/postgres');

const ZH_SOURCE_ID = '56a84936-6059-4348-b6d1-5605d557f06d';

const title = "What \"Presidential Fortune\" Really Means: Reading Taiwan's Political Predictions Through Zi Wei Dou Shu";
const slug = 'what-presidential-fortune-really-means-reading-taiwans-political-predictions';
const tags = ['Zi Wei Dou Shu', 'AI Zi Wei Dou Shu', 'political astrology', 'Lu Shiow-yen', 'annual luck', 'Migration Palace'];

const content = `## When Astrology Becomes the Language of Political Imagination

Taiwan's news cycle recently produced an odd overlap between politics and fortune-telling. Lu Shiow-yen, the mayor of Taichung and one of the names most frequently floated as a future presidential contender within her party, became the subject of a fortune-teller's public verdict: her "presidential fortune" (總統運) was said to be fading, making a future presidential bid difficult. Around the same time, a separate wave of predictions for the second half of the year bundled together a possible stock market plunge, extended heatwaves, and an uptick in natural disasters into a single looming narrative of collective crisis.

The more dramatic the headline, the easier it becomes to compress a complex political contest into a single question — does this person "have the fate" for it or not — and to compress broad economic and climate anxiety into one approaching, undifferentiated disaster. A Taiwanese entertainment outlet ran the headline "Lu Shiow-yen's Presidential Fortune Is Fading — Fortune-Teller Says a Presidential Run Will Be Difficult." A major news portal's lifestyle section warned, ahead of Ghost Month, of a "chaotic" second half of the year: sharp stock drops, prolonged heat, more natural disasters. A third outlet named three zodiac signs facing what it called "devastating financial loss." Each piece answers a complicated question with a short, confident sentence — but "presidential fortune" is not a single indicator that Zi Wei Dou Shu (Purple Star Astrology) can isolate and read off in a line. Without a full chart, birth data, the sequence of decade and annual luck, and a proper cross-reference against real events, a single pronouncement should never be mistaken for a settled political conclusion.

## The Zi Wei Dou Shu View: Fortune Is Not a Substitute for Political Outcomes

According to the theoretical framework of Wang Ting-chih's *Zhong Zhou School of Zi Wei Dou Shu*, the discipline reads a person's trajectory through the interaction of the natal chart (原局), the ten-year Major Limit (大限), and the one-year Annual Flow (流年) — summarized as "the natal chart is the substance, the flowing luck is the application" (原局為體，行運為用). The birth chart sets the upper and lower bounds of one's structural potential; the Major Limit and Annual Flow function more like activating conditions. A strong natal structure meeting an unfavorable year usually means a temporary setback, not collapse. A weak natal structure meeting a favorable year rarely turns a lucky stretch into durable, long-term power on its own.

Applied to a political figure, this means "presidential fortune" cannot be read off a single year's favorable stars or one annual transformation in isolation. Electoral success also depends on party nomination, track record in local governance, the structure of public opinion, competitors' strategies, geopolitics, and the electoral system itself. If a chart offers anything useful here, it is a symbolic lens for asking under what conditions a person tends to perform well — not a mechanism for declaring an election already decided.

The interaction between the Annual Flow's Four Transformations and the natal chart's own Four Transformations is, per the Zhong Zhou School framework, the key pivot for reading what a given year is really about. Applied to Lu Shiow-yen's political prospects, the more useful question isn't "does she have presidential fate," but which dimension a given period is activating: public image, organizational pressure, external perception, or the weight of formal responsibility? Is what she's facing a matter of personal capability, or constraints from her party and the broader environment? That framing sits much closer to how Zi Wei Dou Shu is actually meant to be used than a yes-or-no verdict on destiny.

The Migration Palace (遷移宮) is particularly suited to reading public figures. Per the same framework, it sits opposite the Life Palace and governs one's fortune away from home base, exposure to changing environments, and how one is perceived by others — which maps naturally onto politics, an inherently public and external arena. A local leader stepping beyond their home constituency to face national media, intra-party negotiation, and a far more diverse electorate is, symbolically, exactly what the Life Palace–Migration Palace relationship describes. A favorable Migration Palace can mean gaining support while in motion, finding backing on a larger stage; if it's afflicted by inauspicious stars, it can instead show up as more exposure, more controversy, and more travel without proportionate gain.

But the Migration Palace can't decide political advancement on its own — it has to be read together with the Official Position Palace (官祿宮), which distinguishes whether a difficulty originates from a shifting external environment or from the nature of the role and its responsibilities. Seen this way, a local politician hitting resistance while trying to build a national profile doesn't have to be translated as "her luck is running out" — it could equally mean the external environment (Migration Palace) hasn't matured yet, or that the political role itself (Official Position Palace) is still in transition.

The method of Three Directions and Four Squares (三方四正) exists precisely to prevent this kind of oversimplification. No single palace should ever be judged in isolation: the Life Palace has to be read together with the Wealth, Career, and Migration palaces; one palace carrying an unfavorable star doesn't automatically make the whole reading unfavorable, and one palace showing a favorable star can still be offset by afflictions from its triangulated palaces. A public figure's "presidential fortune," at minimum, deserves to be examined across personal positioning, resource integration, formal responsibility, and external reputation as a whole structure — which is also a useful reminder for readers: when a headline lifts out a single star or a single palace, it's worth keeping some critical distance.

As for the "collective crisis" framing for the rest of the year, the Fortune and Virtue Palace (福德宮) offers another layer. It governs inner life, psychological stability, and a sense of blessing, and sits opposite the Wealth Palace, shaping how people relate to money and material comfort. When a society is already contending with inflation, market volatility, extreme weather, or geopolitical anxiety, a broad decline in collective "福德感" — that sense of psychological ease — makes any crisis narrative land more easily. That doesn't mean astrological forecasts cause the crisis; it means they can act as an amplifier for anxiety that already exists, giving people a tidy story — "this is simply an unlucky year" — for uncertainty that was there regardless.

Star dignity — whether a star is "exalted" (廟旺) or "fallen" (落陷) in a given palace — shouldn't be read as a one-way verdict either. A star's strength does shift depending on where it lands, but a fallen star that receives favorable transformations such as Prosperity, Power, or Status can still, through later effort, produce real achievement. Applied to political commentary, this is a genuinely useful idea: an unfavorable placement isn't failure, and a favorable stretch isn't a guaranteed win. What actually matters is whether the person in question can recognize their weak points, adjust strategy, and let institutions, team, and real-world resources share the risk together.

## Practical Advice: Turn Predictions Into a Risk Map, Not a Verdict

When you come across a political fortune prediction, it helps to swap "will this person succeed" for three narrower questions. What time window is actually being discussed? Does it point to public image, role pressure, or resource integration — or to something external entirely? And does the prediction show its work — natal chart, flowing luck, palace triangulation — or is it just strong adjectives with no stated basis? A reading with no visible method is closer to a media narrative than a complete astrological analysis.

For collective risks like market crashes, heatwaves, or natural disasters, astrology can serve as a cultural language for self-reminder — it cannot replace meteorological, financial, or public-safety information. Reading about "devastating financial loss" is not a reason to panic-sell; reading about "more natural disasters" is not a specific date to plan around. A steadier approach is to actually review your asset allocation, emergency fund, insurance coverage, and disaster preparedness, and to make decisions based on data from government agencies and professional institutions.

The same logic applies to political judgment. Voters can weigh a candidate's public record, policy feasibility, governance history, and team competence, and treat astrological commentary as a mirror for collective anxiety and the mood of the times rather than a voting instruction. The Migration Palace's symbolism can remind us to pay attention to public image; the Fortune and Virtue Palace can remind us to notice pressure and judgment bias — but the vote itself still belongs to public policy and democratic responsibility.

## Conclusion: A Chart Can Illuminate Uncertainty — It Cannot Vote for a Society

From Lu Shiow-yen's "presidential fortune" to predictions of a turbulent second half of the year, the real question worth asking isn't whether astrology can announce a winner in advance — it's why people want a certain answer so badly in the first place. Used within its actual theoretical structure, Zi Wei Dou Shu's annual cycles, its Migration Palace, and its Three Directions and Four Squares method can help organize a reading of circumstance, role, and psychological pressure. Cut down to a single declarative sentence, that same framework easily disguises a complicated reality as fate.

A chart can point to where a person needs more caution. It cannot vote on a society's behalf, and it cannot carry responsibility for markets or the natural environment. If you'd like a fuller reading of your own chart's flowing luck and structure, our analysis tool is available as a reference for cultural learning and self-reflection: https://aiziwei.online/en/analysis

## References
- ["Lu Shiow-yen's Presidential Fortune Is Fading! Fortune-Teller Says a Presidential Run Will Be Difficult" — FTV News via LINE TODAY (Chinese)](https://news.google.com/rss/articles/CBMiVkFVX3lxTE8yN0Q1ekgyeTdPWTVfUWxENlJhTmZ1WTZZZ1ZTUm5naFpCZHJJRjE1WTlwUWlCT2F2eFZfYTV5c2hJUVRXR0d4Rl9XVFc0dEplY3BDdURn?oc=5)
- ["Warning Before Ghost Month: Fortune-Tellers on the Second Half of the Year — Sharp Stock Drops, Extended Heatwaves, More Natural Disasters" — UDN Lifestyle (Chinese)](https://news.google.com/rss/articles/CBMie0FVX3lxTFBVX0hRWl9sTUpFX0gwbVZrdm5BR1Nzcm5DZXJRc1NNc29Rcjg1eFM4NTJKZ1ZvRXluMzFOUkh2c3R1T2dabUItY2xSRDJUZmJ6RFNMY05QdlNRNXRwejM5NnplTWFPTzVoTnFzM1hrYkVZZzVFcmJ4ekhENA?oc=5)
- ["2026's Second Half Brings Chaotic Star Alignments! Fortune-Tellers Name 3 Zodiac Signs Facing Devastating Financial Loss" — Yahoo News Taiwan (Chinese)](https://news.google.com/rss/articles/CBMizAJBVV95cUxOUzFqMkN0TlhuelBMTWRnZWIyUFF6Nm9iXzUxYlBMNE1ycjJBYjJ0WjV6M19QZnhzZlMzbXZVNHhSbkZGVlhVeTVMYmdyVkxqNUJSMXdndnAxMzNmb3ZBU0lNMXNob3VZLUduazRHbi1DWWI2ZWxYa1BxZkhxdzVNZ1BsMmR5cnU3QzVqUzJvX0V6OURsdm9lck1xQnNRMlh4d1gxeXJZejlZX3poNFUwYjFPWnh1cElCcUE1O2Z3QkZZdlltVHZ2ZUR2OV84YnlZVEVxampkZTVWZ3ZuWVA1RS1RS25zaFFXZmFCN1pjNDhtREJTNU5mWFprMk0yeWlEbmdlSTdMZ3JtaDNlZFloMFdGZDRsS3dZRmZ3dWZKcG1sRUJPbUVCS3I0eWVVYTZCV3ZNaVdtYU9Ma0JINHJLSy05b2IwaVRwQUQ5QQ?oc=5)

This content was AI-assisted and reviewed by our editorial team. It is provided for entertainment and cultural/educational purposes only and should not be treated as financial, medical, or political advice.`;

async function main() {
    const wordCount = content.split(/\s+/).length;
    console.log(`📝 內容約 ${wordCount} 個英文字`);

    const existing = await sql`SELECT id FROM blog_posts WHERE slug = ${slug} AND language = 'en'`;
    if (existing.rows.length > 0) {
        console.log('⚠️ slug 已存在，中止');
        process.exit(1);
    }

    const result = await sql`
    INSERT INTO blog_posts (title, slug, content, tags, status, published_at, language, translated_from, author)
    VALUES (
      ${title},
      ${slug},
      ${content},
      ${JSON.stringify(tags)}::jsonb,
      'draft',
      NULL,
      'en',
      ${ZH_SOURCE_ID},
      '王老師'
    )
    RETURNING id, title, slug, status
  `;
    console.log('✅ 已建立英文草稿：');
    console.table(result.rows);
    console.log(`\n預覽網址（需先發布才能看到，可用 admin 後台或 PUT /api/blog/${result.rows[0].id} 改 status='published'）`);

    process.exit(0);
}

main().catch(e => { console.error('❌ 執行失敗:', e); process.exit(1); });
