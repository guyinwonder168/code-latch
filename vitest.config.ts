import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts']
  },
  resolve: {
    alias: {
      '@codelatch/core': path.resolve(__dirname, 'packages/core/src/index.ts'),
      '@codelatch/schemas': path.resolve(__dirname, 'packages/schemas/src/index.ts'),
      '@codelatch/workflow-contracts': path.resolve(__dirname, 'packages/workflow-contracts/src/index.ts'),
      '@codelatch/adapter-base': path.resolve(__dirname, 'packages/adapter-base/src/index.ts'),
      '@codelatch/adapter-opencode': path.resolve(__dirname, 'packages/adapter-opencode/src/index.ts'),
      '@codelatch/adapter-opencode/plugin': path.resolve(__dirname, 'packages/adapter-opencode/src/plugin/index.ts'),
      '@codelatch/shared-utils': path.resolve(__dirname, 'packages/shared-utils/src/index.ts')
    }
  }
});
