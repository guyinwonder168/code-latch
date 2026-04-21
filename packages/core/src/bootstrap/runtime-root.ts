/**
 * Runtime-root initialization for `.tmp/codelatch/`.
 *
 * This module provides:
 * - pure path computation for all runtime-root subdirectories
 * - a filesystem operations interface for dependency injection
 * - directory initialization using injected I/O
 */

export type RuntimeRootPaths = {
  root: string;
  db: string;
  manifest: string;
  versionGovernor: string;
  registry: string;
  plans: string;
  runs: string;
  sync: string;
  audits: string;
  cleanup: string;
  packsProject: string;
  packsCache: string;
  incidents: string;
  proposalsReview: string;
  cacheRefs: string;
  cacheSnippets: string;
  workspaces: string;
};

export type FsOps = {
  mkdir: (path: string, options?: { recursive?: boolean }) => Promise<void>;
  writeFile: (path: string, data: string) => Promise<void>;
};

const RUNTIME_ROOT_DIR = '.tmp/codelatch';

/**
 * Compute all runtime-root paths from a project root.
 * Pure function — no side effects.
 */
export const createRuntimeRootPaths = (projectRoot: string): RuntimeRootPaths => {
  const root = `${projectRoot}/${RUNTIME_ROOT_DIR}`;
  return {
    root,
    db: `${root}/index.db`,
    manifest: `${root}/project-manifest.json`,
    versionGovernor: `${root}/version-governor.json`,
    registry: `${root}/truth-doc-registry.json`,
    plans: `${root}/plans`,
    runs: `${root}/runs`,
    sync: `${root}/sync`,
    audits: `${root}/audits`,
    cleanup: `${root}/cleanup`,
    packsProject: `${root}/packs/project`,
    packsCache: `${root}/packs/cache`,
    incidents: `${root}/incidents`,
    proposalsReview: `${root}/proposals/review`,
    cacheRefs: `${root}/cache/refs`,
    cacheSnippets: `${root}/cache/snippets`,
    workspaces: `${root}/workspaces`
  };
};

const RUNTIME_SUBDIRS: ReadonlyArray<keyof RuntimeRootPaths> = [
  'plans', 'runs', 'sync', 'audits', 'cleanup',
  'packsProject', 'packsCache', 'incidents',
  'proposalsReview', 'cacheRefs', 'cacheSnippets', 'workspaces'
];

/**
 * Initialize the runtime-root directory structure using injected filesystem ops.
 * Creates the root directory plus all required subdirectories.
 */
export const initializeRuntimeRoot = async (
  paths: RuntimeRootPaths,
  fs: FsOps
): Promise<void> => {
  await fs.mkdir(paths.root, { recursive: true });

  for (const key of RUNTIME_SUBDIRS) {
    await fs.mkdir(paths[key], { recursive: true });
  }
};
