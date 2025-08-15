import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");
  console.log("Creating demo user");
  const demoUser = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      username: "demo_user",
      total_xp: 0,
      current_streak: 0,
      best_streak: 0,
    },
  });
  console.log(`   User ${demoUser.username} successfully created.`); 
  console.log("Creating lessons");
  const lessons = [
    {
      id: 1,
      title: "Basic Arithmetic",
      description: "Master addition and subtraction fundamentals",
      order: 1,
      problems: [
        {
          type: "MULTIPLE_CHOICE",
          question: "What is 15 + 23?",
          xp: 10,
          options: [
            { value: 35, is_correct: false },
            { value: 38, is_correct: true },
            { value: 40, is_correct: false },
            { value: 33, is_correct: false },
          ],
        },
        {
          type: "MULTIPLE_CHOICE",
          question: "What is 47 - 19?",
          xp: 10,
          options: [
            { value: 28, is_correct: true },
            { value: 26, is_correct: false },
            { value: 30, is_correct: false },
            { value: 32, is_correct: false },
          ],
        },
        {
          type: "INPUT",
          question: "Calculate: 156 + 87",
          correct_answer: 243,
          xp: 15,
        },
        {
          type: "MULTIPLE_CHOICE",
          question: "What is 91 - 36?",
          xp: 10,
          options: [
            { value: 53, is_correct: false },
            { value: 55, is_correct: true },
            { value: 57, is_correct: false },
            { value: 59, is_correct: false },
          ],
        },
      ],
    },
    {
      id: 2,
      title: "Multiplication Mastery",
      description: "Practice your times tables",
      order: 2,
      problems: [
        {
          type: "MULTIPLE_CHOICE",
          question: "What is 7 × 8?",
          xp: 10,
          options: [
            { value: 54, is_correct: false },
            { value: 56, is_correct: true },
            { value: 58, is_correct: false },
            { value: 52, is_correct: false },
          ],
        },
        {
          type: "INPUT",
          question: "Calculate: 12 × 9",
          correct_answer: 108,
          xp: 15,
        },
        {
          type: "MULTIPLE_CHOICE",
          question: "What is 6 × 7?",
          xp: 10,
          options: [
            { value: 40, is_correct: false },
            { value: 42, is_correct: true },
            { value: 44, is_correct: false },
            { value: 48, is_correct: false },
          ],
        },
        {
          type: "MULTIPLE_CHOICE",
          question: "What is 9 × 4?",
          xp: 10,
          options: [
            { value: 32, is_correct: false },
            { value: 36, is_correct: true },
            { value: 38, is_correct: false },
            { value: 40, is_correct: false },
          ],
        },
        {
          type: "INPUT",
          question: "Calculate: 15 × 6",
          correct_answer: 90,
          xp: 15,
        },
      ],
    },
    {
      id: 3,
      title: "Division Basics",
      description: "Learn division fundamentals",
      order: 3,
      problems: [
        {
          type: "MULTIPLE_CHOICE",
          question: "What is 56 ÷ 8?",
          xp: 10,
          options: [
            { value: 6, is_correct: false },
            { value: 7, is_correct: true },
            { value: 8, is_correct: false },
            { value: 9, is_correct: false },
          ],
        },
        {
          type: "INPUT",
          question: "Calculate: 144 ÷ 12",
          correct_answer: 12,
          xp: 15,
        },
        {
          type: "MULTIPLE_CHOICE",
          question: "What is 81 ÷ 9?",
          xp: 10,
          options: [
            { value: 8, is_correct: false },
            { value: 9, is_correct: true },
            { value: 10, is_correct: false },
            { value: 7, is_correct: false },
          ],
        },
        {
          type: "MULTIPLE_CHOICE",
          question: "What is 72 ÷ 6?",
          xp: 10,
          options: [
            { value: 10, is_correct: false },
            { value: 11, is_correct: false },
            { value: 12, is_correct: true },
            { value: 13, is_correct: false },
          ],
        },
      ],
    },
  ];

  for (const lessonData of lessons) {
    const { problems, ...lesson } = lessonData;
    const createdLesson = await prisma.lesson.upsert({
      where: { id: lesson.id },
      update: {},
      create: lesson,
    });

    console.log(`   Created lesson: ${createdLesson.title}`);
    for (const problemData of problems) {
      const { options, ...problem } = problemData;
      const createdProblem = await prisma.problem.upsert({
        where: { id: problems.indexOf(problemData) + 1 + (lesson.id - 1) * 10 },
        update: {},
        create: {
          id: problems.indexOf(problemData) + 1 + (lesson.id - 1) * 10,
          lesson_id: createdLesson.id,
          type: problem.type as any,
          question: problem.question,
          correct_answer: problem.correct_answer || null,
          xp: problem.xp,
        },
      });

      if (options) {
        for (const optionData of options) {
          await prisma.problemOption.upsert({
            where: {
              id:
                options.indexOf(optionData) + 1 + (createdProblem.id - 1) * 10,
            },
            update: {},
            create: {
              id:
                options.indexOf(optionData) + 1 + (createdProblem.id - 1) * 10,
              problem_id: createdProblem.id,
              ...optionData,
            },
          });
        }
      }

      console.log(`       Created problem: ${createdProblem.question}`);
    }
  }

  console.log("Seeding completed...");
}

main()
  .catch((e) => {
    console.log("Seed failed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
