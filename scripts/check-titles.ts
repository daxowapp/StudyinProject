import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function check() {
  const trans = await prisma.programTranslation.findMany({ select: { programId: true, languageCode: true, title: true }});
  console.dir(trans, { depth: null });
}
check()
