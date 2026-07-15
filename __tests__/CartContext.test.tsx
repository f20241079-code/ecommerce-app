import { act, fireEvent, render } from '@testing-library/react-native';
import { Button, Text } from 'react-native';
import { CartProvider, useCart } from '../context/CartContext';

function TestApp() {
  const { addToCart, increaseQuantity, decreaseQuantity, clearCart, total, count } = useCart();
  return (
    <>
      <Button testID="add" title="add" onPress={() => addToCart({ id: '1', name: 'P', price: 10, icon: '' })} />
      <Button testID="inc" title="inc" onPress={() => increaseQuantity('1')} />
      <Button testID="dec" title="dec" onPress={() => decreaseQuantity('1')} />
      <Button testID="clear" title="clear" onPress={() => clearCart()} />
      <Text testID="total">{String(total)}</Text>
      <Text testID="count">{String(count)}</Text>
    </>
  );
}

test('cart add/increase/decrease/clear', async () => {
  const { getByTestId } = await render(
    <CartProvider>
      <TestApp />
    </CartProvider>
  );

  const add = getByTestId('add');
  const inc = getByTestId('inc');
  const dec = getByTestId('dec');
  const clear = getByTestId('clear');
  const total = getByTestId('total');
  const count = getByTestId('count');

  await act(async () => {
    fireEvent.press(add);
  });

  expect(count.props.children).toBe('1');
  expect(total.props.children).toBe('10');

  await act(async () => {
    fireEvent.press(inc);
  });

  expect(count.props.children).toBe('2');
  expect(total.props.children).toBe('20');

  await act(async () => {
    fireEvent.press(dec);
  });

  expect(count.props.children).toBe('1');
  expect(total.props.children).toBe('10');

  await act(async () => {
    fireEvent.press(clear);
  });

  expect(count.props.children).toBe('0');
  expect(total.props.children).toBe('0');
});
