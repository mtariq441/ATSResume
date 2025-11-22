import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * GET /api/analyses
 * List recent analysis results
 * 
 * ⚠️ IMPORTANT: This endpoint requires a database in production!
 * 
 * In the local development environment with Express, results are stored in memory.
 * However, Vercel serverless functions are stateless - in-memory storage does NOT
 * persist across function invocations.
 * 
 * To make this endpoint work in production, you need to:
 * 1. Set up a database (PostgreSQL, MongoDB, etc.)
 * 2. Store analysis results in the database from the /api/analyze endpoint
 * 3. Query the database in this endpoint to retrieve and list results
 * 
 * Recommended databases for Vercel:
 * - Vercel Postgres (built-in integration)
 * - Neon (serverless PostgreSQL)
 * - PlanetScale (serverless MySQL)
 * - MongoDB Atlas
 * - Supabase
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  try {
    const limit = parseInt(req.query.limit as string) || 20;

    // ⚠️ DATABASE REQUIRED: Replace this with actual database query
    // Example with Vercel Postgres:
    // const { rows } = await sql`
    //   SELECT * FROM analyses 
    //   ORDER BY created_at DESC 
    //   LIMIT ${limit}
    // `;
    // return res.status(200).json(rows);

    return res.status(501).json({ 
      error: 'This endpoint requires a database to be configured in production. Please see the VERCEL_DEPLOYMENT.md file for setup instructions.',
      note: 'The main /api/analyze endpoint works without a database and returns results directly.'
    });
  } catch (error) {
    console.error('List error:', error);
    return res.status(500).json({ 
      error: 'Failed to list analyses' 
    });
  }
}
