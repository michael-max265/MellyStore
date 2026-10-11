import fs from 'node:fs';
fs.writeFileSync('dev-server.log', 'Starting serve.mjs...\n');

try {
  const { createServer } = await import('vite');
  fs.appendFileSync('dev-server.log', 'Vite imported.\n');

  const server = await createServer({
    server: {
      port: 5173,
      host: '127.0.0.1'
    }
  });
  fs.appendFileSync('dev-server.log', 'Server created.\n');

  await server.listen();
  fs.appendFileSync('dev-server.log', 'Server listening on http://127.0.0.1:5173\n');
} catch (err) {
  fs.appendFileSync('dev-server.log', 'Error: ' + String(err) + '\n' + (err?.stack || '') + '\n');
}
