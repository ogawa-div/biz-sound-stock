import React from 'react';
import { Music, ShieldCheck, Wallet, Zap, CheckCircle2 } from 'lucide-react';

export const IconMap: Record<string, React.FC<any>> = {
  Music,
  ShieldCheck,
  Wallet,
  Zap,
  CheckCircle2
};

export const GetIcon = ({ name, className }: { name: string; className?: string }) => {
  const Icon = IconMap[name];
  return Icon ? <Icon className={className} /> : null;
};
