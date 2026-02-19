import { useNavigate } from 'react-router-dom';
import { ErrorState } from '@/shared/ui/ErrorState';

export default function ProductEntityNotFoundPage() {
  const navigate = useNavigate();

  return (
    <ErrorState
      variant="warning"
      title="Product not found"
      message="The product ID exists in route format, but no product data was found."
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
