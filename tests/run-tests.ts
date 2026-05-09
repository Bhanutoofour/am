import assert from "node:assert/strict";
import {
  modelNumberSlug,
  modelSlug,
  normalizeUrlPathSegment,
  productSlug,
  titleToSlug,
} from "../utils/slug";
import { limitString } from "../utils/helper";
import { formatDate, getYouTubeVideoId } from "../utils/videoHelpers";

type TestCase = {
  name: string;
  run: () => void | Promise<void>;
};

const tests: TestCase[] = [
  {
    name: "titleToSlug trims, lowercases, removes punctuation, and collapses spaces",
    run: () => {
      assert.equal(
        titleToSlug("  OFC Telecommunications / Trenchers!!  "),
        "ofc-telecommunications-trenchers",
      );
    },
  },
  {
    name: "productSlug supports direct product URLs and industry-scoped URLs",
    run: () => {
      assert.equal(productSlug("Wheel Trenchers"), "wheel-trenchers");
      assert.equal(
        productSlug("Wheel Trenchers", "Water Management"),
        "water-management-wheel-trenchers",
      );
    },
  },
  {
    name: "modelNumberSlug creates clean nested model route segments",
    run: () => {
      assert.equal(modelNumberSlug(" RUDRA 100 XT "), "rudra-100-xt");
      assert.equal(modelNumberSlug("A-45 / Pro"), "a-45-pro");
    },
  },
  {
    name: "modelSlug joins product, title, and model number without empty parts",
    run: () => {
      assert.equal(
        modelSlug("Trenchers", "Pipeline Trencher", "RUDRA 100"),
        "trenchers-pipeline-trencher-rudra-100",
      );
      assert.equal(
        modelSlug("", "Mini Trencher", "DHruva100"),
        "mini-trencher-dhruva100",
      );
    },
  },
  {
    name: "normalizeUrlPathSegment matches messy inbound route segments",
    run: () => {
      assert.equal(
        normalizeUrlPathSegment("  OFC & Telecom///Trenchers  "),
        "ofc-and-telecom-trenchers",
      );
    },
  },
  {
    name: "limitString leaves short text alone and ellipsizes long text",
    run: () => {
      assert.equal(limitString("Autocracy", 20), "Autocracy");
      assert.equal(limitString("Autocracy Machinery", 9), "Autocracy...");
    },
  },
  {
    name: "formatDate returns human-readable date texta",
    run: () => {
      assert.equal(formatDate(new Date("2026-05-09T00:00:00Z")), "9 May 2026");
    },
  },
  {
    name: "getYouTubeVideoId extracts IDs from supported YouTube URL shapes",
    run: () => {
      assert.equal(
        getYouTubeVideoId("https://www.youtube.com/embed/abc123XYZ09"),
        "abc123XYZ09",
      );
      assert.equal(
        getYouTubeVideoId("https://youtu.be/abc123XYZ09"),
        "abc123XYZ09",
      );
      assert.equal(getYouTubeVideoId("https://example.com/video"), null);
    },
  },
];

async function main() {
  const failures: string[] = [];

  for (const test of tests) {
    try {
      await test.run();
      console.log(`PASS ${test.name}`);
    } catch (error) {
      failures.push(test.name);
      console.error(`FAIL ${test.name}`);
      console.error(error);
    }
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} test(s) failed.`);
    process.exit(1);
  }

  console.log(`\n${tests.length} test(s) passed.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
