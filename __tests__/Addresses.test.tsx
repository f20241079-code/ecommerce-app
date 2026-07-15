import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import Addresses from '../app/(stack)/addresses';
import { ThemeProvider } from '../context/ThemeContext';
import * as supabaseHelpers from '../lib/supabaseHelpers';

jest.mock('../lib/supabaseHelpers');

describe('Addresses screen', () => {
  const fetchAddressesMock = supabaseHelpers.fetchAddresses as jest.MockedFunction<typeof supabaseHelpers.fetchAddresses>;
  const getCurrentUserIdMock = supabaseHelpers.getCurrentUserId as jest.MockedFunction<typeof supabaseHelpers.getCurrentUserId>;
  const deleteAddressMock = supabaseHelpers.deleteAddress as jest.MockedFunction<typeof supabaseHelpers.deleteAddress>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders saved addresses and deletes an address when confirmed', async () => {
    getCurrentUserIdMock.mockResolvedValue('user-1');

    fetchAddressesMock
      .mockResolvedValueOnce([
        { id: '1', label: 'Home', address: '123 Main Street', city: 'New York', default: true },
        { id: '2', label: 'Work', address: '456 Elm Street', city: 'Gotham', default: false },
      ])
      .mockResolvedValueOnce([
        { id: '2', label: 'Work', address: '456 Elm Street', city: 'Gotham', default: false },
      ]);

    deleteAddressMock.mockResolvedValue(true);

    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
      const deleteButton = buttons?.find((button) => button.text === 'Delete');
      deleteButton?.onPress?.();
    });

    const screen = await render(
      <ThemeProvider>
        <Addresses />
      </ThemeProvider>
    );

    await act(async () => {
      await waitFor(() => {
        expect(screen.getByText('Home')).toBeTruthy();
        expect(screen.getByText('Work')).toBeTruthy();
      });
    });

    const deleteButtons = screen.getAllByText('🗑️ Delete');
    await act(async () => {
      fireEvent.press(deleteButtons[0]);
    });

    await waitFor(() => {
      expect(deleteAddressMock).toHaveBeenCalledWith('user-1', '1');
    });

    await waitFor(() => {
      expect(screen.queryByText('Home')).toBeNull();
      expect(screen.getByText('Work')).toBeTruthy();
    });

    alertSpy.mockRestore();
  });
});
