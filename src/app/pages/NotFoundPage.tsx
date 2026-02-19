import { useNavigate } from 'react-router-dom';
import { ErrorState } from '@/shared/ui/ErrorState';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <ErrorState
      variant="warning"
      title="Page not found"
      message="The page you tried to open does not exist."
      actions={[
        {
          label: 'Back to Products',
          variant: 'primary',
          onClick: () => navigate('/products', { replace: true }),
        },
      ]}
    />
  );
}
