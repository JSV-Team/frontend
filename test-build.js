import { build } from 'vite';

async function run() {
  try {
    const res = await build();
    console.log('Build successful!');
  } catch (err) {
    console.error('Build failed with error:');
    console.error(err);
    if (err.stack) console.error(err.stack);
    process.exit(1);
  }
}

run();
