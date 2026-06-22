import { FC } from 'react';
import { useParams } from 'react-router-dom';
import OrderDetails from '@/components/store/orders/OrderDetails';
import OrdersList from '@/components/store/orders/OrdersList';

const MyOrderPage: FC = () => {
  const { id } = useParams<{ id: string }>();

  if (id) {
    return <OrderDetails id={id} />;
  }

  return <OrdersList />;
};

export default MyOrderPage;
