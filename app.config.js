const fs = require('fs');
const dotenv = require('dotenv');

const loadEnvFile = (path) => {
  try {
    return dotenv.parse(fs.readFileSync(path, 'utf8'));
  } catch {
    return {};
  }
};

const isPlaceholderValue = (value) =>
  typeof value === 'string' &&
  (value.includes('<project>') || value.includes('your_anon_key') || value.includes('example') || value.includes('REPLACE'));

const env = loadEnvFile('.env');
const localEnv = loadEnvFile('.env.local');
const mergedEnv = { ...env };

Object.entries(localEnv).forEach(([key, value]) => {
  if (!value) return;
  if (!isPlaceholderValue(value)) {
    mergedEnv[key] = value;
  }
});

Object.entries(mergedEnv).forEach(([key, value]) => {
  if (!process.env[key] && value != null) {
    process.env[key] = value;
  }
});

const appJson = require('./app.json');

const SUPABASE_URL = process.env.SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? '';

const isSupabaseUrlValid = (url) => {
  return typeof url === 'string' && /^https:\/\/[^\s]+\.supabase\.co\/?$/.test(url);
};

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    'Warning: SUPABASE_URL and SUPABASE_ANON_KEY are not both set in the environment.\n' +
      'Create a .env.local file or export the values before starting Expo.\n' +
      'Login will use the fallback no-op client without them.'
  );
} else if (!isSupabaseUrlValid(SUPABASE_URL)) {
  console.error(
    'Improper SUPABASE_URL detected: ' + SUPABASE_URL + '\n' +
      'It must be a valid Supabase project URL, for example: https://your-project.supabase.co'
  );
}

module.exports = {
  ...appJson.expo,
  extra: {
    ...appJson.expo.extra,
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
  },
};
