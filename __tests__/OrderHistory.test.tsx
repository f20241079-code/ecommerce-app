import { render, waitFor } from '@testing-library/react-native';
import OrderHistory from '../app/(stack)/order-history';
import { ThemeProvider } from '../context/ThemeContext';
import * as supabaseHelpers from '../lib/supabaseHelpers';

jest.mock('../lib/supabaseHelpers');

describe('OrderHistory screen', () => {
  const fetchOrdersMock = supabaseHelpers.fetchOrders as jest.MockedFunction<typeof supabaseHelpers.fetchOrders>;
  const getCurrentUserIdMock = supabaseHelpers.getCurrentUserId as jest.MockedFunction<typeof supabaseHelpers.getCurrentUserId>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders orders with items and total', async () => {
    getCurrentUserIdMock.mockResolvedValue('user-1');
    fetchOrdersMock.mockResolvedValue([
      {
        id: 'order-1',
        status: 'Processing',
        total: 60,
        created_at: '2026-07-15T12:00:00.000Z',
        items: [
          { id: '1', name: 'T-Shirt', price: 20, quantity: 2, icon: '👕' },
          { id: '2', name: 'Sneakers', price: 20, quantity: 1, icon: '👟' },
        ],
      },
    ]);

    const screen = await render(
      <ThemeProvider>
        <OrderHistory />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Order #order-1')).toBeTruthy();
      expect(screen.getByText('Processing')).toBeTruthy();
      expect(screen.getByText('Total: $60')).toBeTruthy();
      expect(screen.getByText('• T-Shirt x2 — $40')).toBeTruthy();
      expect(screen.getByText('• Sneakers x1 — $20')).toBeTruthy();
    });
  });
});
