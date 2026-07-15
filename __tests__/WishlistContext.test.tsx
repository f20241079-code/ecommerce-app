import { act, fireEvent, render } from '@testing-library/react-native';
import { Button, Text } from 'react-native';
import { WishlistProvider, useWishlist } from '../context/WishlistContext';

function TestApp() {
  const { addToWishlist, removeFromWishlist, isInWishlist, count } = useWishlist();
  return (
    <>
      <Button testID="add" title="add" onPress={() => addToWishlist({ id: 'a', name: 'A', price: 5, rating: 4, icon: '' })} />
      <Button testID="remove" title="remove" onPress={() => removeFromWishlist('a')} />
      <Text testID="in">{String(isInWishlist('a'))}</Text>
      <Text testID="count">{String(count)}</Text>
    </>
  );
}

test('wishlist add/remove', async () => {
  const { getByTestId } = await render(
    <WishlistProvider>
      <TestApp />
    </WishlistProvider>
  );

  const add = getByTestId('add');
  const remove = getByTestId('remove');
  const inNode = getByTestId('in');
  const count = getByTestId('count');

  await act(async () => fireEvent.press(add));

  expect(inNode.props.children).toBe('true');
  expect(count.props.children).toBe('1');

  await act(async () => fireEvent.press(remove));

  expect(inNode.props.children).toBe('false');
  expect(count.props.children).toBe('0');
});
