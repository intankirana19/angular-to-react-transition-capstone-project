import { useNavigate } from 'react-router-dom';
import { ErrorState } from '@/shared/ui/ErrorState';

export default function ProductNotFoundPage() {
  const navigate = useNavigate();

  return (
    <ErrorState
      variant="warning"
      title="Product page not found"
      message="The product route you tried to open does not exist."
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
