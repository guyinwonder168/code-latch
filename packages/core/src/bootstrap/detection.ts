/**
 * Repository detection for bootstrap.
 *
 * Examines a project directory to determine:
 * - Whether it is a git repository
 * - What truth docs already exist (canonical or non-canonical)
 * - What root files exist (README, CHANGELOG, etc.)
 * - What host-specific directories exist (.opencode/, .claude/, etc.)
 *
 * Uses dependency injection for filesystem reads.
 */

export type RepoDetectionResult = {
  isGitRepo: boolean;
  existingTruthDocs: TruthDocDetection[];
  existingRootFiles: string[];
  existingHostDirs: HostDirDetection[];
  hasExistingCodelatch: boolean;
};

export type TruthDocDetection = {
  role: 'prd' | 'technical_design' | 'implementation_plan';
  path: string;
  isCanonical: boolean;
};

export type HostDirDetection = {
  hostId: string;
  path: string;
};

export type FsReadOps = {
  exists: (path: string) => Promise<boolean>;
  readdir: (path: string) => Promise<string[]>;
};

const CANONICAL_TRUTH_DOC_PATHS: Record<string, string> = {
  prd: 'product-docs/prd.md',
  technical_design: 'product-docs/technical-design.md',
  implementation_plan: 'product-docs/implementation-plan.md'
};

const COMMON_TRUTH_DOC_PATTERNS: Record<string, string[]> = {
  prd: ['product-docs/prd.md', 'product-docs/codelatch-prd.md', 'docs/prd.md', 'PRD.md'],
  technical_design: ['product-docs/technical-design.md', 'product-docs/tech-design.md', 'docs/technical-design.md'],
  implementation_plan: ['product-docs/implementation-plan.md', 'product-docs/impl-plan.md', 'docs/implementation-plan.md']
};

const ROOT_FILES = [
  'README.md', 'CHANGELOG.md', 'CONTRIBUTING.md',
  'AGENTS.md', 'CLAUDE.md', 'CONTEXT.md'
];

const HOST_DIRS: Record<string, string> = {
  opencode: '.opencode',
  'claude-code': '.claude',
  codex: '.codex',
  kilocode: '.kilo'
};

const CODELATCH_RUNTIME_ROOT = '.tmp/codelatch';

/**
 * Detect repository state for bootstrap decisions.
 * Uses injected filesystem read operations.
 */
export const detectRepoState = async (
  projectRoot: string,
  fs: FsReadOps
): Promise<RepoDetectionResult> => {
  const isGitRepo = await fs.exists(`${projectRoot}/.git`);
  const existingTruthDocs = await detectTruthDocs(projectRoot, fs);
  const existingRootFiles = await detectRootFiles(projectRoot, fs);
  const existingHostDirs = await detectHostDirs(projectRoot, fs);
  const hasExistingCodelatch = await fs.exists(`${projectRoot}/${CODELATCH_RUNTIME_ROOT}`);

  return {
    isGitRepo,
    existingTruthDocs,
    existingRootFiles,
    existingHostDirs,
    hasExistingCodelatch
  };
};

const detectTruthDocs = async (
  projectRoot: string,
  fs: FsReadOps
): Promise<TruthDocDetection[]> => {
  const results: TruthDocDetection[] = [];

  for (const [role, paths] of Object.entries(COMMON_TRUTH_DOC_PATTERNS)) {
    for (const path of paths) {
      const fullPath = `${projectRoot}/${path}`;
      if (await fs.exists(fullPath)) {
        const canonicalPath = CANONICAL_TRUTH_DOC_PATHS[role];
        results.push({
          role: role as TruthDocDetection['role'],
          path,
          isCanonical: path === canonicalPath
        });
        break; // Use the first match for each role
      }
    }
  }

  return results;
};

const detectRootFiles = async (
  projectRoot: string,
  fs: FsReadOps
): Promise<string[]> => {
  const found: string[] = [];

  for (const file of ROOT_FILES) {
    if (await fs.exists(`${projectRoot}/${file}`)) {
      found.push(file);
    }
  }

  return found;
};

const detectHostDirs = async (
  projectRoot: string,
  fs: FsReadOps
): Promise<HostDirDetection[]> => {
  const found: HostDirDetection[] = [];

  for (const [hostId, dir] of Object.entries(HOST_DIRS)) {
    if (await fs.exists(`${projectRoot}/${dir}`)) {
      found.push({ hostId, path: dir });
    }
  }

  return found;
};
