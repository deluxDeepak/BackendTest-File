import { spawn } from 'child_process';

const PORT = 5173; // Default Vite dev server port

console.log('🚀 Starting ngrok tunnel...');
console.log('📡 Tunneling to: http://localhost:' + PORT);
console.log('⚠️  Keep this terminal running to maintain the tunnel\n');

const ngrok = spawn('ngrok', ['http', PORT.toString()], {
  stdio: 'inherit',
  shell: true
});

ngrok.on('error', (error) => {
  console.error('❌ Error starting ngrok:', error.message);
  console.error('Make sure ngrok is installed globally: npm install -g ngrok');
  process.exit(1);
});

ngrok.on('close', (code) => {
  console.log('\n🛑 ngrok tunnel closed');
  process.exit(code);
});
