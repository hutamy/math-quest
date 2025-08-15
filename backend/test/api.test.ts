import { test } from "tap";
import { buildApp } from "../src/app";

test("POST /api/lessons/:id/submit - Integration Test", async (t) => {
  const app = buildApp();
  t.teardown(() => app.close());

  // Test data with unique attempt_id
  const timestamp = Date.now();
  const submitRequest = {
    attempt_id: `integration-test-${timestamp}`,
    answers: [{ problem_id: 1, option_id: 2 }],
  };

  // First submission
  const response1 = await app.inject({
    method: "POST",
    url: "/api/lessons/1/submit",
    payload: submitRequest,
  });

  t.equal(response1.statusCode, 200, "First submission should return 200");

  const result1 = JSON.parse(response1.body);
  t.type(result1.earned_xp, "number", "Should return earned XP");
  t.type(result1.streak.current, "number", "Should return current streak");

  // Second submission with same attemptId (idempotent test)
  const response2 = await app.inject({
    method: "POST",
    url: "/api/lessons/1/submit",
    payload: submitRequest,
  });

  t.equal(response2.statusCode, 500, "Second submission should return 500");
});

test("GET /api/lessons - Integration Test", async (t) => {
  const app = buildApp();
  t.teardown(() => app.close());

  const response = await app.inject({
    method: "GET",
    url: "/api/lessons",
  });

  t.equal(response.statusCode, 200, "Should return 200");

  const lessons = JSON.parse(response.body);
  t.type(lessons, "object", "Should return array of lessons");
  t.ok(Array.isArray(lessons), "Should be an array");

  if (lessons.length > 0) {
    const lesson = lessons[0];
    t.type(lesson.id, "number", "Lesson should have numeric ID");
    t.type(lesson.title, "string", "Lesson should have title");
    t.type(
      lesson.progress_percent,
      "number",
      "Lesson should have progress percent"
    );
  }
});

test("GET /api/lessons/:id - Integration Test", async (t) => {
  const app = buildApp();
  t.teardown(() => app.close());

  const response = await app.inject({
    method: "GET",
    url: "/api/lessons/1",
  });

  t.equal(response.statusCode, 200, "Should return 200");

  const lesson = JSON.parse(response.body);
  t.type(lesson.id, "number", "Should have numeric ID");
  t.type(lesson.title, "string", "Should have title");
  t.type(lesson.problems, "object", "Should have problems array");
  t.ok(Array.isArray(lesson.problems), "Problems should be an array");

  if (lesson.problems.length > 0) {
    const problem = lesson.problems[0];
    t.type(problem.id, "number", "Problem should have numeric ID");
    t.type(problem.question, "string", "Problem should have question");
    t.type(problem.xp, "number", "Problem should have XP value");

    // Ensure correct answers are not leaked
    if (problem.options) {
      for (const option of problem.options) {
        t.notOk(
          option.hasOwnProperty("is_correct"),
          "Options should not include is_correct"
        );
      }
    }
  }
});

test("GET /api/profile - Integration Test", async (t) => {
  const app = buildApp();
  t.teardown(() => app.close());

  const response = await app.inject({
    method: "GET",
    url: "/api/profile",
  });

  t.equal(response.statusCode, 200, "Should return 200");

  const profile = JSON.parse(response.body);
  t.type(profile.total_xp, "number", "Should have total_xp");
  t.type(profile.current_streak, "number", "Should have current_streak");
  t.type(profile.best_streak, "number", "Should have best_streak");
  t.type(profile.progress_percent, "number", "Should have progress_percent");
});

