import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const unis = await prisma.university.findMany({
    select: { id: true, name: true, code: true }
  })
  console.log(`Universities in DB: ${unis.length}`)
  
  let validCodes = 0
  let missingCodes = 0
  
  for (const uni of unis) {
    if (uni.code) {
      validCodes++
      console.log(`- ${uni.name}: ${uni.code}`)
    } else {
      missingCodes++
      console.log(`- ${uni.name}: NO CODE`)
    }
  }
  
  console.log(`Valid codes: ${validCodes}, Missing codes: ${missingCodes}`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
