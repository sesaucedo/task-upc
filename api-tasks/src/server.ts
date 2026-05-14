import 'dotenv/config';
import { createApp } from './app';

const PORT = parseInt(process.env.PORT ?? '3000', 10);
const app  = createApp();

const server = app.listen(PORT, () => {
  console.log(`\n Server: http://localhost:${PORT}`);
  console.log(` Env:    ${process.env.NODE_ENV ?? 'development'}\n`);
});

const shutdown = (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log(' Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));