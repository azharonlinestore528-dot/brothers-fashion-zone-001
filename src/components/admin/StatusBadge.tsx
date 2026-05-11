'use client';

const STATUS_CONFIG: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#FEF3C7', text: '#D97706' },
  placed: { bg: '#F0F9FF', text: '#0369A1' },
  verified: { bg: '#DCFCE7', text: '#16A34A' },
  dispatched: { bg: '#DBEAFE', text: '#2563EB' },
  delivered: { bg: '#F3E8FF', text: '#7C3AED' },
  cancelled: { bg: '#FEE2E2', text: '#DC2626' },
  failed: { bg: '#FEE2E2', text: '#DC2626' },
  active: { bg: '#DCFCE7', text: '#16A34A' },
  inactive: { bg: '#FEE2E2', text: '#DC2626' },
  percent: { bg: '#DBEAFE', text: '#2563EB' },
  flat: { bg: '#DCFCE7', text: '#16A34A' },
};

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status.toLowerCase()] || { bg: '#1A1A1A', text: '#FFFFFF' };
  
  return (
    <span
      className="font-inter text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize"
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {status}
    </span>
  );
}