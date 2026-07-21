import React from 'react';
import AdUnit from './AdUnit';

// Desktop-only (xl+) fixed side-rail ads, unchanged from the pre-migration static
// pages (blog post + analysis). Not a Better Ads Standards "large sticky ad" —
// that standard targets full-width mobile stickies, not narrow desktop rails.
export function AdSidebarLeft({ label }: { label: string }) {
    return (
        <div className="fixed left-4 top-1/2 -translate-y-1/2 hidden xl:block w-40 h-96 z-10">
            <div className="h-full flex flex-col">
                <div className="text-center text-xs text-gray-500 mb-2 flex-shrink-0">{label}</div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 flex-1 flex items-center justify-center">
                    <AdUnit slot="7607800035" format="auto" fullWidthResponsive insClassName="adsbygoogle w-full" />
                </div>
            </div>
        </div>
    );
}

export function AdSidebarRight({ label }: { label: string }) {
    return (
        <div className="fixed right-4 top-1/2 -translate-y-1/2 hidden xl:block w-40 h-96 z-10">
            <div className="h-full flex flex-col">
                <div className="text-center text-xs text-gray-500 mb-2 flex-shrink-0">{label}</div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 flex-1 flex items-center justify-center">
                    <AdUnit slot="5671756041" format="autorelaxed" insClassName="adsbygoogle w-full" />
                </div>
            </div>
        </div>
    );
}
