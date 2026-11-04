const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { mkdtemp, readdir, rm } = require("node:fs/promises");
const { tmpdir } = require("node:os");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const ts = require("typescript");

const source = ts.transpileModule(
  readFileSync(path.join(__dirname, "../src/lib/song-store.ts"), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }
).outputText;

function loadStore(env, blob) {
  const exports = {};
  vm.runInNewContext(source, {
    exports,
    require: (name) => name === "@vercel/blob" ? blob : require(name),
    process: { env, cwd: () => process.cwd(), pid: process.pid },
    Response,
  });
  return exports;
}

const input = {
  artist: "Test Artist", title: "Test Song", key: "C", detectedKey: "C",
  keyConfidence: null, rawContent: "C\nTest", structuredContent: [], language: null,
};

test("private blobs survive separate instances, rename, paginate, and delete", async () => {
  const blobs = new Map();
  const sdk = {
    async list({ prefix, cursor }) {
      const matches = [...blobs.keys()].filter((name) => name.startsWith(prefix));
      const offset = Number(cursor || 0);
      return {
        blobs: matches.slice(offset, offset + 1).map((pathname) => ({ pathname })),
        hasMore: offset + 1 < matches.length,
        cursor: String(offset + 1),
      };
    },
    async put(name, contents, options) {
      assert.equal(options.access, "private");
      assert.equal(options.addRandomSuffix, false);
      assert.equal(options.allowOverwrite, true);
      blobs.set(name, contents);
    },
    async get(name, options) {
      assert.equal(options.access, "private");
      assert.equal(options.useCache, false);
      return blobs.has(name)
        ? { statusCode: 200, stream: new Response(blobs.get(name)).body }
        : null;
    },
    async del(names) {
      for (const name of Array.isArray(names) ? names : [names]) blobs.delete(name);
    },
  };
  const env = { VERCEL: "1", BLOB_READ_WRITE_TOKEN: "test-token" };
  const first = loadStore(env, sdk);
  const second = loadStore(env, sdk);
  const [a, b] = await Promise.all([first.createSong(input), second.createSong(input)]);
  assert.notEqual(a.id, b.id);
  assert(blobs.has(`songs/${a.id}/test-artist-test-song.json`));
  assert.equal((await second.getSong(a.id)).title, input.title);
  assert.equal((await first.listSongs()).length, 2);
  await second.updateSong(a.id, { title: "Renamed" });
  assert(!blobs.has(`songs/${a.id}/test-artist-test-song.json`));
  assert(blobs.has(`songs/${a.id}/test-artist-renamed.json`));
  assert.equal((await first.getSong(a.id)).title, "Renamed");
  assert.equal(await first.deleteSong(a.id), true);
  assert.equal(await second.getSong(a.id), undefined);
  assert.equal(await first.deleteSong(a.id), false);
});

test("missing Blob configuration fails explicitly without temporary fallback", async () => {
  const store = loadStore({ VERCEL: "1" }, {});
  await assert.rejects(store.listSongs(), /BLOB_READ_WRITE_TOKEN/);
  await assert.rejects(store.createSong(input), /BLOB_READ_WRITE_TOKEN/);
});

test("local files retain artist-title naming and support CRUD", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "harmonia-store-test-"));
  try {
    const store = loadStore({ HARMONIA_DATA_DIR: directory }, {});
    const song = await store.createSong(input);
    assert.deepEqual(await readdir(path.join(directory, "songs")), ["test-artist-test-song.json"]);
    assert.equal((await store.getSong(song.id)).title, input.title);
    await store.updateSong(song.id, { title: "Renamed" });
    assert.deepEqual(await readdir(path.join(directory, "songs")), ["test-artist-renamed.json"]);
    assert.equal(await store.deleteSong(song.id), true);
    assert.equal((await store.listSongs()).length, 0);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
