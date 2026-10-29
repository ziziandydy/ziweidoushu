import '../public/styles.css';
import { fontVariables } from './lib/fonts';

// 沒有根 layout 時（<html> 由 app/[locale]/layout.tsx 提供），未匹配的路徑由這裡輸出完整文件
export default function GlobalNotFound() {
    return (
        <html lang="zh-TW" className={fontVariables}>
            <body className="min-h-screen">
                <main className="max-w-xl mx-auto px-4 py-24 text-center">
                    <img src="/logo-mark.svg" alt="" width={48} height={48} className="mx-auto mb-6 w-12 h-12" />
                    <h1 className="text-4xl font-bold text-ink-900 mb-4">404</h1>
                    <p className="text-ink-600 mb-6">找不到這個頁面 / Page not found</p>
                    <a href="/" className="link">回首頁 / Home</a>
                </main>
            </body>
        </html>
    );
}
