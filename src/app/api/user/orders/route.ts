import { headers } from 'next/headers';
import { desc, eq } from 'drizzle-orm';
import { respData, respErr } from '@/lib/resp';
import { getAuth } from '@/core/auth';
import { db } from '@/core/db';
import { order } from '@/config/db/schema';

export async function GET() {
  try {
    const auth = getAuth();
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session?.user) {
      return respErr('Unauthorized');
    }

    const rows = await db()
      .select()
      .from(order)
      .where(eq(order.userId, session.user.id))
      .orderBy(desc(order.createdAt));

    return respData(rows);
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}
