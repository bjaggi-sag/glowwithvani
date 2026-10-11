import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  getYouTubeId,
  matchesDiscipline,
  parseProject,
} from "../src/data/work.ts";

const video = {
  slug: "photo-hustinder",
  title: "Photo / Hustinder",
  format: "video",
  role: "Makeup artist",
  description: "Makeup by Gurvani Kaur.",
  disciplines: ["screen"],
  url: "https://youtu.be/nPntwQ_pm9w",
  published: true,
};

test("recognizes supported YouTube URL shapes without tracking parameters", () => {
  for (const url of [
    video.url + "?si=tracking",
    "https://www.youtube.com/watch?v=nPntwQ_pm9w&t=20",
    "https://youtube.com/shorts/nPntwQ_pm9w",
    "https://youtube.com/embed/nPntwQ_pm9w",
  ]) {
    assert.equal(getYouTubeId(url), "nPntwQ_pm9w");
  }
});
test("rejects lookalike hosts, unsafe protocols and malformed IDs", () => {
  for (const url of [
    "https://youtube.com.evil.test/watch?v=nPntwQ_pm9w",
    "javascript:alert(1)",
    "http://youtu.be/nPntwQ_pm9w",
    "https://user:pass@youtu.be/nPntwQ_pm9w",
    "https://youtu.be/bad",
    "https://youtu.be/nPntwQ_pm9w/other",
  ]) {
    assert.equal(getYouTubeId(url), null);
  }
});
test("published videos require a playable YouTube link", () => {
  assert.equal(parseProject(video, "video").releaseStatus, "released");
  assert.throws(
    () => parseProject({ ...video, url: "" }, "video"),
    /YouTube URL/,
  );
  assert.throws(
    () => parseProject({ ...video, url: "https://vimeo.com/123" }, "video"),
    /HTTPS project URL/,
  );
});
test("upcoming films do not require a trailer and drafts default private", () => {
  const upcoming = parseProject(
    {
      ...video,
      url: undefined,
      releaseStatus: "upcoming",
      published: undefined,
    },
    "draft",
  );
  assert.equal(upcoming.published, false);
  assert.equal(upcoming.url, undefined);
});
test("magazines work with uploaded images or related portfolio photos, without a URL", () => {
  const publication = {
    ...video,
    format: "publication",
    url: undefined,
    publication: "Test publication",
    disciplines: ["editorial"],
    coverImage: "/portfolio/originals/test.jpg",
    coverAlt: "Published beauty portrait",
  };
  assert.equal(parseProject(publication, "magazine").url, undefined);
  assert.equal(
    parseProject(
      {
        ...publication,
        coverImage: undefined,
        coverAlt: undefined,
        portfolioIds: ["editorial-4"],
      },
      "magazine",
    ).portfolioIds[0],
    "editorial-4",
  );
  assert.throws(
    () => parseProject({ ...publication, coverImage: undefined }, "magazine"),
    /publication image or link/,
  );
  assert.throws(
    () => parseProject({ ...publication, publication: "" }, "magazine"),
    /publication/,
  );
});
test("validates slugs, cover paths, alt text, credits and discipline values", () => {
  for (const change of [
    { slug: "../invalid" },
    { disciplines: ["invented"] },
    { coverImage: "/portfolio/originals/../secret.jpg", coverAlt: "Invalid" },
    { coverImage: "/portfolio/originals/cover.jpg" },
    { credits: [{ role: "Director" }] },
    { published: "false" },
    { sortOrder: NaN },
    { releaseStatus: "invented" },
  ])
    assert.throws(() => parseProject({ ...video, ...change }, "invalid"));
});
test("discipline filters preserve overlapping categories", () => {
  assert.equal(
    matchesDiscipline(["Editorial", "Soft Glam"], "editorial"),
    true,
  );
  assert.equal(matchesDiscipline(["Editorial", "Soft Glam"], "beauty"), true);
  assert.equal(matchesDiscipline(["SFX"], "character"), true);
  assert.equal(matchesDiscipline(["Theatre"], "character"), true);
  assert.equal(matchesDiscipline(["Film & Video"], "screen"), true);
  assert.equal(matchesDiscipline(["Bridal"], "screen"), false);
  assert.equal(matchesDiscipline(["Bridal"], "all"), true);
});
test("published repository projects validate and reference existing photos", () => {
  const slugs = new Set();
  const photoIds = new Set(
    fs
      .readdirSync("content/portfolio")
      .filter((f) => f.endsWith(".json"))
      .map(
        (f) =>
          JSON.parse(fs.readFileSync(`content/portfolio/${f}`, "utf8")).slug,
      ),
  );
  for (const file of fs
    .readdirSync("content/projects")
    .filter((f) => f.endsWith(".json"))) {
    const record = JSON.parse(
      fs.readFileSync(`content/projects/${file}`, "utf8"),
    );
    if (record.published !== true) continue;
    const project = parseProject(record, file);
    assert.equal(slugs.has(project.slug), false);
    slugs.add(project.slug);
    project.portfolioIds.forEach((id) => assert.equal(photoIds.has(id), true));
    if (project.coverImage)
      assert.equal(fs.existsSync(`public${project.coverImage}`), true);
  }
  assert.equal(slugs.has("photo-hustinder"), true);
  assert.equal(slugs.has("upcoming-punjabi-feature"), false);
});
