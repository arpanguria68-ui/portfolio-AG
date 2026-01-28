import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const projects = [
    {
        title: "NeoBank Finance",
        description: "Reimagining the mobile banking experience for Gen Z with AI-driven savings insights.",
        year: "2024",
        tags: ["Fintech", "Mobile App"],
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC60U7Xmg9DYXVNGKeFboA7uIhth4FdnoZFU48ciZyrKd56ebljcFEhJXJFz6wuc8M_lcRD-yqYnh1AvRbDWASzywpEd9nEAjGpIlpzMOJoZtjBu0q01a9DAXvfn1qeP4Wxlv_ZlMWrbg-pIPwvCmPm8ZFf_4CgUm3xdhu_8kmeAxswFu9J8Gv8jUKnSwWQ6wVneq5-aAsP8e-diDQ7-rNq4lT0CVP7zT27S2Cy1Jw2MydWVPVsJQQUetNIXm6jv138pLrix6jQ4MLS",
        link: "/gallery"
    },
    {
        title: "DataViz Pro",
        description: "Enterprise analytics dashboard enabling real-time decision making for sales teams.",
        year: "2023",
        tags: ["SaaS", "Strategy"],
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuApIiN6GKo3BRo5bLrUOnA41JodEj1ORLhA-dXGI6zS13geEwKDcyvUQiOp9UXRpBhyUHA6MQNEAsQz7DSE2GqHkpXscJnoi6ujsZm5_I6M2uPmZ8ZSEW1gUWXwmeNORGR3fDYOdnMJd69S6LRbkBx7gvRJ9y-S6vyBJoA5teX4T9XQvhSlQuIzHqYk1E892m6CGCLBFKreBiCyY5Z1hvfSKVn63r2nw1q1dADLGMfs7XjavKn3sI7naqs8hTDcZQ5YbYplbM6CBIH9",
        link: "#"
    },
    {
        title: "Vitality Health",
        description: "Patient monitoring interface connecting doctors with real-time health metrics.",
        year: "2022",
        tags: ["Health", "UX Research"],
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBROlpKiNAqcPZejAh_NQ5ypzoOUdoIthvEF7mU5yEG1c4e8XKRu2q0BjJi9miOJ9iJ75FFXB-6u6lPToM35Cj_Lg8pxwkGhLApucrjrWT6PK5OKevCXiSsDN1Bd3ZfruNwSI8kNmptchDD88sooosPqs6Ihzk3h96_taeIGmhcNniUnT1y1_05XYnn-P2I8CTNH3Vtn1mJ-o8JQOfx8fQZCUVzqcxOcmrGP7YgnjLfVMn1Ducpn-WXM7MqTcPa2GG5LcPF1_C4mtBI",
        link: "#"
    }
];
async function main() {
    console.log(`Start seeding ...`);
    // Clear existing to avoid duplicates if ID is auto-increment
    await prisma.project.deleteMany();
    for (const p of projects) {
        const project = await prisma.project.create({
            data: {
                title: p.title,
                description: p.description,
                year: p.year,
                tags: JSON.stringify(p.tags),
                image: p.image,
                link: p.link
            }
        });
        console.log(`Created project with id: ${project.id}`);
    }
    console.log(`Seeding finished.`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map