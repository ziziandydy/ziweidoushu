"use client";

import React, { useEffect, useRef } from 'react';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

const AD_CLIENT = 'ca-pub-3240143153468832';

interface AdUnitProps {
    slot: string;
    format?: string;
    layoutKey?: string;
    fullWidthResponsive?: boolean;
    style?: React.CSSProperties;
    insClassName?: string;
    wrapperClassName?: string;
    label?: string;
}

export default function AdUnit({
    slot,
    format,
    layoutKey,
    fullWidthResponsive,
    style = { display: 'block' },
    insClassName = 'adsbygoogle',
    wrapperClassName,
    label,
}: AdUnitProps) {
    // AdSense can only be pushed once per <ins> — guard against React StrictMode's double-invoke in dev
    const pushed = useRef(false);

    useEffect(() => {
        if (pushed.current) return;
        pushed.current = true;
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
            console.error('AdSense push failed:', error);
        }
    }, []);

    return (
        <div className={wrapperClassName}>
            {label && <div className="text-center text-xs text-gray-500 mb-2">{label}</div>}
            <ins
                className={insClassName}
                style={style}
                data-ad-client={AD_CLIENT}
                data-ad-slot={slot}
                data-ad-format={format}
                data-ad-layout-key={layoutKey}
                data-full-width-responsive={fullWidthResponsive ? 'true' : undefined}
            />
        </div>
    );
}
