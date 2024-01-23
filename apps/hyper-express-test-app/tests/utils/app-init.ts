import { NestHyperExpressApplication } from '@m8a/platform-hyper-express';
import { request } from 'pactum';

export async function appInit(
  app: NestHyperExpressApplication,
  port: number = 9999,
  host?: string,
  callback?: () => void,
) {
  await app.listen(port, host, callback);
  const url = await app.getUrl();
  request.setBaseUrl(
    url.replace('::1', '127.0.0.1').replace('+unix', '').replace('%3A', ':'),
  );
}
