export default async function handler(req: any, res: any) {
  return res.status(200).json({
    status: 'ok',
    environment: 'vercel-serverless',
    time: new Date().toISOString(),
  });
}
