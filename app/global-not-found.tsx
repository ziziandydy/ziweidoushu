import '../public/styles.css';

// 沒有根 layout 時（<html> 由 app/[locale]/layout.tsx 提供），未匹配的路徑由這裡輸出完整文件
export default function GlobalNotFound() {
    return (
        <html lang="zh-TW">
            <body className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 min-h-screen">
                <main className="max-w-xl mx-auto px-4 py-24 text-center">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p className="text-gray-700 mb-6">找不到這個頁面 / Page not found</p>
                    <a href="/" className="text-blue-600 hover:text-blue-800">回首頁 / Home</a>
                </main>
            </body>
        </html>
    );
}
