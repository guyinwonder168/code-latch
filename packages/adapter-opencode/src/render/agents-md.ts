/**
 * OpenCode AGENTS.md renderer — follows Section 7.5 thin-anchor contract.
 *
 * Produces the thin project anchor for AGENTS-aware hosts
 * (OpenCode, Codex, Kilo Code). Must NOT become a pack registry,
 * workflow engine copy, approval history storage, machine lockfile,
 * or duplicate of the truth docs.
 *
 * Required logical fields per Section 7.5:
 * 1. Framework identity
 * 2. Truth-doc locations
 * 3. Local project context location (when one exists)
 * 4. A very small set of repo-specific non-negotiable reminders
 */

export type AgentsMdInput = {
  truthDocPaths: {
    prd: string;
    technicalDesign: string;
    implementationPlan: string;
  };
  localContextPath?: string;
};

/**
 * Render AGENTS.md following the Section 7.5 contract.
 * Pure function — no side effects.
 */
export const renderAgentsMd = (input: AgentsMdInput): string => {
  const lines: string[] = [
    '# AGENTS.md',
    '',
    'This repository uses CodeLatch.',
    '',
    '## Source of Truth',
    `- PRD: \`${input.truthDocPaths.prd}\``,
    `- Technical Design: \`${input.truthDocPaths.technicalDesign}\``,
    `- Implementation Plan: \`${input.truthDocPaths.implementationPlan}\``
  ];

  if (input.localContextPath) {
    lines.push('', '## Local Context', `- Project context: \`${input.localContextPath}\``);
  }

  lines.push(
    '',
    '## Non-Negotiable Reminders',
    '- Keep work aligned to the truth docs.',
    '- Keep changes scoped to approved work.',
    '- Use CodeLatch flows for sync, planning, execution, and review.'
  );

  return lines.join('\n');
};
