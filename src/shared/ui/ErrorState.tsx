import { ReactNode } from 'react';
import { Button } from '@/shared/ui/Button';
import { AlertTriangle } from 'lucide-react';

type ErrorStateVariant = 'danger' | 'warning';

interface ErrorStateAction {
  label: string;
  onClick: () => void | Promise<unknown>;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

interface ErrorStateProps {
  title: string;
  message: string;
  variant?: ErrorStateVariant;
  actions?: ErrorStateAction[];
  icon?: ReactNode;
  fullScreen?: boolean;
}

const variantClassMap: Record<ErrorStateVariant, string> = {
  danger: 'bg-danger-50 text-danger-800',
  warning: 'bg-warning-50 text-warning-800',
};

const iconWrapperClassMap: Record<ErrorStateVariant, string> = {
  danger: 'bg-danger-100',
  warning: 'bg-warning-100',
};

export function ErrorState({
  title,
  message,
  variant = 'danger',
  actions = [],
  icon,
  fullScreen = false,
}: ErrorStateProps) {
  const resolvedIcon = icon ?? <AlertTriangle className="h-6 w-6" />;

  return (
    <div className={fullScreen ? 'flex min-h-screen items-center justify-center p-6' : 'flex min-h-[60vh] items-center justify-center'}>
      <div
        className={`w-full max-w-md rounded-lg p-6 text-center shadow-sm ${variantClassMap[variant]}`}
        role="alert"
        aria-live="polite"
      >
        <div className="mb-4 flex justify-center">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${iconWrapperClassMap[variant]}`}>
            {resolvedIcon}
          </div>
        </div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm">{message}</p>
        {actions.length > 0 ? (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {actions.map((action) => (
              <Button
                key={action.label}
                variant={action.variant ?? 'secondary'}
                onClick={() => {
                  void action.onClick();
                }}
                disabled={action.disabled}
              >
                {action.label}
              </Button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
