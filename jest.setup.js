require('@testing-library/jest-native/extend-expect');

// Mock AsyncStorage used by contexts
jest.mock('@react-native-async-storage/async-storage', () => require('./__mocks__/async-storage'));
