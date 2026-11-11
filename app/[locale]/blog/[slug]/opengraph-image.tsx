import { ImageResponse } from 'next/og';
import { getBlogPost } from '../../../lib/blog';
import { OG_IMAGE_URL } from '../../../lib/ogImage';

export const alt = 'AI 紫微斗數';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Per-article share card: brand mark + the article title, on the site's palette.
// The font is fetched as a subset holding only the characters we draw, so it stays tiny.
async function loadFont(text: string): Promise<ArrayBuffer | null> {
    try {
        const css = await (await fetch(
            `https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@700&text=${encodeURIComponent(text)}`,
        )).text();
        const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
        if (!url) return null;
        return await (await fetch(url)).arrayBuffer();
    } catch {
        return null;
    }
}

export default async function Image(props: { params: Promise<{ locale: string; slug: string }> }) {
    const params = await props.params;
    const post = await getBlogPost(decodeURIComponent(params.slug), params.locale);
    if (!post) return Response.redirect(OG_IMAGE_URL, 302);

    const title = String(post.title);
    const brand = 'AI 紫微斗數　aiziwei.online';
    const font = await loadFont(title + brand);
    if (!font) return Response.redirect(OG_IMAGE_URL, 302);

    const len = [...title].length;
    const fontSize = len <= 16 ? 84 : len <= 26 ? 72 : 60;

    return new ImageResponse(
        (
            <div style={{
                width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
                justifyContent: 'space-between', padding: '64px 80px',
                background: 'linear-gradient(135deg,#F8F2EA,#EBE3DA)', fontFamily: 'Noto Sans TC', color: '#17171E',
            }}>
                <div style={{ display: 'flex', width: 72, height: 72, background: '#9C3D25' }} />
                <div style={{ display: 'flex', fontSize, fontWeight: 700, lineHeight: 1.35, letterSpacing: 1 }}>{title}</div>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: 30, color: '#4E4E5C' }}>
                    <div style={{ display: 'flex', width: 6, height: 34, background: '#9C3D25', marginRight: 18 }} />
                    {brand}
                </div>
            </div>
        ),
        { ...size, fonts: [{ name: 'Noto Sans TC', data: font, weight: 700, style: 'normal' }] },
    );
}
