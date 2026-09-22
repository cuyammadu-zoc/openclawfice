// Route tests run without a persistent local token file.
process.env.VERCEL = '1';
process.env.OPENCLAWFICE_TEST_BYPASS_AUTH = '1';
process.env.OPENCLAWFICE_TEST_USER_ID = 'vitest-user';