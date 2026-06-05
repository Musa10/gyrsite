import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

/** Build a minimal Tiptap doc from one or more paragraphs of text. */
function doc(...paragraphs: string[]) {
  return {
    type: "doc",
    content: paragraphs.map((text) => ({
      type: "paragraph",
      content: text ? [{ type: "text", text }] : [],
    })),
  };
}

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: "Admin", role: Role.ADMIN, passwordHash },
  });

  console.log(`Seeded admin user: ${email}`);

  // ---- Bilingual demo content (EN + AR) so both locales render out of the box ----

  // Post 1 — fully bilingual.
  const bilingualPost = {
    title: "Three traces, one wing",
    slug: "three-traces-one-wing",
    excerpt: "Inside GYR's connect–innovate–elevate operating model.",
    body: doc(
      "Every GYR engagement runs on three parallel currents — connect, innovate, elevate.",
      "Integrated like circuits across a falcon's wing, they turn ideas into performance.",
    ),
    titleAr: "ثلاثة مسارات، جناح واحد",
    excerptAr: "داخل نموذج عمل جي واي آر: الاتصال والابتكار والارتقاء.",
    bodyAr: doc(
      "كل تعاون مع جي واي آر يقوم على ثلاثة تيارات متوازية — الاتصال، الابتكار، الارتقاء.",
      "متكاملة كالدوائر عبر جناح الصقر، تحوّل الأفكار إلى أداء.",
    ),
    status: "PUBLISHED" as const,
    publishedAt: new Date(),
    tags: ["connect", "innovate", "elevate"],
    authorId: admin.id,
  };
  await prisma.post.upsert({
    where: { slug: bilingualPost.slug },
    update: bilingualPost,
    create: bilingualPost,
  });

  // Post 2 — English only, to exercise the Arabic→English fallback path.
  const englishOnlyPost = {
    title: "Field notes from Dubai",
    slug: "field-notes-from-dubai",
    excerpt: "Early signals from our latest deployments.",
    body: doc(
      "Notes from the field as we ship the systems that connect the UAE to the world.",
    ),
    status: "PUBLISHED" as const,
    publishedAt: new Date(),
    tags: ["field-notes"],
    authorId: admin.id,
  };
  await prisma.post.upsert({
    where: { slug: englishOnlyPost.slug },
    update: englishOnlyPost,
    create: englishOnlyPost,
  });

  // Page — bilingual, shown in nav (exercises localized getNavPages()).
  const aboutPage = {
    title: "About",
    slug: "about",
    body: doc(
      "GYR is a UAE technology company engineering the systems that connect, the breakthroughs that innovate, and the performance that elevates.",
    ),
    titleAr: "من نحن",
    bodyAr: doc(
      "جي واي آر شركة تقنية إماراتية تهندس الأنظمة التي تربط، والابتكارات التي تطوّر، والأداء الذي يرتقي.",
    ),
    status: "PUBLISHED" as const,
    publishedAt: new Date(),
    showInNav: true,
    navOrder: 1,
  };
  await prisma.page.upsert({
    where: { slug: aboutPage.slug },
    update: aboutPage,
    create: aboutPage,
  });

  // Team member — bilingual.
  const memberData = {
    name: "Layla Al Mansoori",
    role: "Chief Technology Officer",
    bio: "Leads GYR's engineering across connect, innovate, and elevate.",
    roleAr: "الرئيسة التنفيذية للتقنية",
    bioAr: "تقود الهندسة في جي واي آر عبر الاتصال والابتكار والارتقاء.",
    status: "PUBLISHED" as const,
    order: 1,
  };
  const existingMember = await prisma.teamMember.findFirst({
    where: { name: memberData.name },
  });
  if (existingMember) {
    await prisma.teamMember.update({
      where: { id: existingMember.id },
      data: memberData,
    });
  } else {
    await prisma.teamMember.create({ data: memberData });
  }

  console.log("Seeded bilingual demo content (posts, page, team member)");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
