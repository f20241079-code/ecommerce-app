process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'http://localhost';
process.env.SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'test-key';

require('@testing-library/jest-native/extend-expect');

// Mock AsyncStorage used by contexts
jest.mock('@react-native-async-storage/async-storage', () => require('./__mocks__/async-storage'));

// Mock Supabase in tests so missing env vars do not warn or fail
jest.mock('@supabase/supabase-js');
