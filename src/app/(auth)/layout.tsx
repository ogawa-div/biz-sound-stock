"use client"

import { ReactNode, useEffect } from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // 認証ページでは通常のスクロールを有効化
    document.documentElement.setAttribute('data-lp-page', 'true');
    document.body.setAttribute('data-lp-page', 'true');
    
    return () => {
      // クリーンアップ
      document.documentElement.removeAttribute('data-lp-page');
      document.body.removeAttribute('data-lp-page');
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {children}
    </div>
  )
}
