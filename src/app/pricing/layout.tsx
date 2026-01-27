"use client"

import { ReactNode, useEffect } from 'react';

export default function PricingLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Pricingページでは通常のスクロールを有効化
    document.documentElement.setAttribute('data-lp-page', 'true');
    document.body.setAttribute('data-lp-page', 'true');
    
    return () => {
      // クリーンアップ
      document.documentElement.removeAttribute('data-lp-page');
      document.body.removeAttribute('data-lp-page');
    };
  }, []);

  return <>{children}</>;
}
