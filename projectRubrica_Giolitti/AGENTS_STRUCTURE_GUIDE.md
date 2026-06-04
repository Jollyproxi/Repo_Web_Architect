# AGENTS.md Structure Guide

## Overview

This document explains the hierarchical AGENTS.md system used in the `projectRubrica_Giolitti` project. This structure is designed to provide AI agents (like GitHub Copilot) with contextual, scoped guidance at multiple levels of the project hierarchy.

---

## Architecture Principles

### 1. **Hierarchical Scoping**
- **Root AGENTS.md**: Defines the project-wide scope, architecture, and rules
- **Subdirectory AGENTS.md**: Refines rules for specific functional areas (css/, js/, memory/, tests/)
- **Cascading Rules**: Each level inherits and specializes from parent levels

### 2. **Single Responsibility**
Each AGENTS.md focuses on its domain:
- `css/AGENTS.md` → CSS-specific guidance
- `js/AGENTS.md` → JavaScript/ES Modules guidance
- `memory/AGENTS.md` → Documentation practices
- `tests/AGENTS.md` → Testing guidelines

### 3. **Cross-referencing**
Every subdirectory AGENTS.md includes:
- A "Vedi `../AGENTS.md`" reference to the parent
- Context that assumes readers have read the root AGENTS.md first

---

## File Structure

### Root AGENTS.md
**Location**: `./AGENTS.md`

**Purpose**: Project-level governance and architectural guidelines

**Standard Sections**:
```markdown
# [Project Name]

⚠️ REGOLA FISSA: Prima di procedere, leggi SEMPRE il `../AGENTS.md` 
di root e tutti gli AGENTS.md lungo il percorso fino a questa cartella.

## Ambito
- Clear description of what the project is
- Technology stack
- Scope boundaries

## Architettura da preservare
- Key files and their responsibilities
- Critical design patterns
- Module relationships

## Regole operative
- Behavioral guidelines for AI/developers
- What to update when making changes
- Naming conventions and patterns

## Comandi utili
- Common commands (npm test, build, etc.)

## Verifica
- How to verify the project works
- Testing approaches
- Manual verification steps
```

### Subdirectory AGENTS.md
**Locations**: `css/AGENTS.md`, `js/AGENTS.md`, `memory/AGENTS.md`, `tests/AGENTS.md`

**Purpose**: Domain-specific refinements and guardrails

**Standard Sections**:
```markdown
# [Project Name]/[Subdirectory]

## Ambito
- Scope of this directory
- Types of files housed here
- Relationship to parent project

## Regole operative
- Directory-specific rules
- File naming conventions
- Interaction patterns with other modules

## Comandi utili
- Commands specific to this area
- Testing approaches for this domain

## Verifica tipica
- Verification steps specific to this area
- Common checks before committing

## Indice AGENTS.md
- Vedi `../AGENTS.md` per [context/rules]
```

---

## How It Works

### Reading Order
1. When working in any subdirectory, first read the **root AGENTS.md**
2. Then read the **subdirectory AGENTS.md** for specific guidance
3. Each file provides context that builds on the previous level

### Example Flow
```
Developer enters /js directory
    ↓
Reads ../AGENTS.md (root project guidelines)
    ↓
Reads ./AGENTS.md (JavaScript-specific guidance)
    ↓
Understands both project scope AND js-specific rules
    ↓
Begins work with proper context
```

### Integration with Copilot
These files work with GitHub Copilot's attachment system:
- Include them in `.github/copilot-instructions.md` or as file attachments
- Copilot reads the hierarchy and understands:
  - What the project is (root)
  - What this specific area does (subdirectory)
  - What rules apply (cascading)

---

## Implementation Checklist

To implement this structure in a new project:

### 1. Create Root AGENTS.md
- [ ] Define project name and purpose
- [ ] Describe technology stack
- [ ] Explain key architectural decisions
- [ ] List critical files and responsibilities
- [ ] Document behavioral rules
- [ ] Add common commands
- [ ] Describe verification procedures

### 2. Create Subdirectory AGENTS.md Files
For each major directory (src/, tests/, docs/, etc.):
- [ ] Define directory scope and purpose
- [ ] Add directory-specific rules
- [ ] Provide directory-relevant commands
- [ ] Add typical verification steps
- [ ] Include back-reference to root: `Vedi ../AGENTS.md`

### 3. Document Cross-references
- [ ] Root AGENTS.md mentions all subdirectories it oversees
- [ ] Each subdirectory AGENTS.md references back to root
- [ ] Consider mentioning file paths in descriptions

### 4. Integration
- [ ] Add to `.github/copilot-instructions.md` (if using GitHub Copilot)
- [ ] Reference in main README.md
- [ ] Include in onboarding documentation

---

## Key Design Benefits

### For Developers
- ✅ Clear understanding of project scope and rules at any level
- ✅ Reduced cognitive load through layered information
- ✅ Easy to find guidance specific to their current context

### For AI Agents
- ✅ Machine-readable structured guidance
- ✅ Hierarchical context helps understand project better
- ✅ Prevents out-of-scope changes
- ✅ Improves code consistency

### For Project Maintenance
- ✅ Centralized documentation of architectural decisions
- ✅ Easy to update rules across the team
- ✅ Scales well as project grows
- ✅ Historical record of "why" decisions were made

---

## Example: projectRubrica_Giolitti Structure

```
projectRubrica_Giolitti/
├── AGENTS.md (root: browser-only app, ES modules, localStorage/sessionStorage)
├── css/
│   └── AGENTS.md (CSS coordination, no backend concerns)
├── js/
│   └── AGENTS.md (ES modules, client-side only, script01.js orchestrates)
├── memory/
│   └── AGENTS.md (living docs, sync with code changes)
├── tests/
│   └── AGENTS.md (keep tests in sync with code)
└── [other files]
```

---

## Best Practices

### ✅ Do
- Keep AGENTS.md files short and focused
- Use the hierarchical structure to avoid repetition
- Update AGENTS.md when architecture changes
- Reference specific file names and patterns
- Include verification steps that developers can run

### ❌ Don't
- Make root AGENTS.md too detailed (that's what subdirectories are for)
- Add code examples (reference files instead)
- Forget to cross-reference between levels
- Let AGENTS.md fall out of sync with actual code
- Mix multiple unrelated rules in one section

---

## Customization for Your Project

When adapting this for your own projects:

1. **Adjust directory names** based on your structure (src/, lib/, components/, etc.)
2. **Customize sections** as needed (may not need all sections for all projects)
3. **Add project-specific rules** that reflect your team's standards
4. **Reference actual files** using specific paths
5. **Keep verification steps simple** and runnable by anyone

---

## Related Concepts

- **memory/** system: Living documentation (separate from AGENTS.md)
- **Copilot Instructions**: How to attach AGENTS.md to Copilot
- **Architecture Decision Records (ADRs)**: Can complement AGENTS.md
- **README.md**: Overview for humans; AGENTS.md guides AI/detailed work

---

## Questions to Ask When Building Your AGENTS.md

1. **What is this project fundamentally about?**
2. **What should developers NOT do?**
3. **What files are critical to preserve/understand?**
4. **How do I verify this area works correctly?**
5. **What are the main conventions (naming, patterns, structure)?**
6. **What commands do people run most often?**
7. **How does this directory fit into the bigger project?**

Answer these, and you have the seeds of a good AGENTS.md.

---

## Version History

- **v1.0** (2026-06-04): Initial guide created based on projectRubrica_Giolitti structure
