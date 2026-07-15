import { act, fireEvent, render } from '@testing-library/react-native';
import { Button, Text } from 'react-native';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

function TestApp() {
  const { theme, toggleTheme, colors } = useTheme();
  return (
    <>
      <Text testID="theme">{theme}</Text>
      <Text testID="bg">{colors.background}</Text>
      <Button testID="toggle" title="toggle" onPress={() => toggleTheme()} />
    </>
  );
}

test('theme toggle updates theme and colors', async () => {
  const { getByTestId } = await render(
    <ThemeProvider>
      <TestApp />
    </ThemeProvider>
  );

  const theme = getByTestId('theme');
  const bg = getByTestId('bg');
  const toggle = getByTestId('toggle');

  expect(theme.props.children).toBe('light');

  await act(async () => fireEvent.press(toggle));

  expect(theme.props.children).toBe('dark');
  expect(bg.props.children).not.toBe('light');
});
