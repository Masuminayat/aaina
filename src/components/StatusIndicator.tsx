/**
 * StatusIndicator — Shows the current try-on pipeline stage
 */
import { Loader2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import type { TryOnStatus } from '../types/providers';

interface Props {
  status: TryOnStatus;
}

const stageConfig = {
  preparing: { icon: Loader2, color: 'text-blue-400', spin: true },
  queued: { icon: Clock, color: 'text-yellow-400', spin: false },
  generating: { icon: Loader2, color: 'text-[var(--color-accent)]', spin: true },
  finishing: { icon: Loader2, color: 'text-[var(--color-accent)]', spin: true },
  done: { icon: CheckCircle2, color: 'text-green-400', spin: false },
  error: { icon: AlertCircle, color: 'text-red-400', spin: false },
};

export function StatusIndicator({ status }: Props) {
  const cfg = stageConfig[status.stage];
  const Icon = cfg.icon;

  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)]">
      <Icon
        className={`w-5 h-5 ${cfg.color} ${cfg.spin ? 'animate-spin' : ''}`}
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--color-text-primary)]">
          {status.message}
        </p>
        {status.stage === 'queued' && status.position !== undefined && (
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Position in queue: {status.position}
          </p>
        )}
        {status.stage === 'generating' && status.progress !== undefined && (
          <div className="mt-2 h-1.5 bg-[var(--color-surface-overlay)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, status.progress)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
