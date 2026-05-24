// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { scanAlbertPageOnce } from "../src/contentDom.js";

describe("Albert content DOM injection", () => {
  it("injects one RMP card per Albert instructor and updates it with rating data", async () => {
    document.body.innerHTML = `
      <table>
        <tbody>
          <tr>
            <td>CSCI-UA 201 Computer Systems Organization</td>
            <td>Instructor: YAP, CHEE KENG</td>
          </tr>
        </tbody>
      </table>
    `;

    const lookupProfessor = vi.fn(async (name) => ({
      name,
      department: "Computer Science",
      rating: 2.1,
      difficulty: 4.5,
      ratingsCount: 92,
      wouldTakeAgain: 24.2857,
      tags: ["Tough grader"],
      topComments: ["Avoid if you dislike fast lectures."],
      url: "https://www.ratemyprofessors.com/professor/419998",
    }));

    const mounted = scanAlbertPageOnce({ document, lookupProfessor });
    await Promise.all(mounted.pendingLookups);

    expect(lookupProfessor).toHaveBeenCalledWith("Chee Keng Yap");
    expect(document.querySelectorAll(".nyu-rmp-card")).toHaveLength(1);
    expect(document.querySelector(".nyu-rmp-score").textContent).toBe("2.1");
    expect(document.body.textContent).toContain("Difficulty 4.5");
    expect(document.body.textContent).toContain("Avoid if you dislike fast lectures.");
  });

  it("does not duplicate cards when Albert mutates the same processed row", async () => {
    document.body.innerHTML = `<div>Instructor: Ada Lovelace</div>`;
    const lookupProfessor = vi.fn(async () => null);

    await Promise.all(scanAlbertPageOnce({ document, lookupProfessor }).pendingLookups);
    await Promise.all(scanAlbertPageOnce({ document, lookupProfessor }).pendingLookups);

    expect(document.querySelectorAll(".nyu-rmp-card")).toHaveLength(1);
    expect(lookupProfessor).toHaveBeenCalledTimes(1);
  });
});
