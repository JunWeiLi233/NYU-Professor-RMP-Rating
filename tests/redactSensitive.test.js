import { describe, expect, it } from "vitest";
import { redactHomePath } from "../scripts/redact-sensitive.js";

describe("sensitive path redaction", () => {
  it("redacts exact home paths and descendants on either path separator", () => {
    expect(redactHomePath("/Users/student", { home: "/Users/student" })).toBe("<home>");
    expect(redactHomePath("/Users/student/project/dist", { home: "/Users/student" })).toBe("<home>/project/dist");
    expect(redactHomePath("C:\\Users\\Student\\project", { home: "C:\\Users\\Student" })).toBe("<home>\\project");
  });

  it("does not redact a sibling path that merely shares the home prefix", () => {
    expect(redactHomePath("/Users/student-other/project", { home: "/Users/student" })).toBe("/Users/student-other/project");
  });
});
