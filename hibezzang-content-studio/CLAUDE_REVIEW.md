# Claude Independent Review — Hi베짱 Content Studio

Use this file as the handoff template after each V1–V5 milestone.

## Review role
Act as an independent senior reviewer. Do not assume the Codex implementation is correct. Look for simpler, safer, more maintainable alternatives.

## Current milestone
V__

## Goal of this milestone
- 

## Changed files
- 

## Architecture decisions
- 

## Verification already performed
- `npm run build`: 
- `npm run lint`: 
- TypeScript/typecheck: 
- Manual UI checks: 

## Known limitations
- 

## Independent review checklist
Please review the implementation for:

1. Architecture
   - separation of concerns
   - component boundaries
   - unnecessary coupling or duplication

2. Correctness
   - TypeScript issues
   - runtime/Next.js App Router issues
   - state/data inconsistencies
   - edge cases

3. UX/accessibility
   - responsive layout
   - keyboard use
   - labels/semantics
   - readability and Korean UI copy

4. Security
   - secret/API-key exposure
   - unsafe client/server boundaries
   - untrusted input handling

5. Maintainability
   - unnecessary complexity
   - naming
   - reusable types/components
   - future Supabase/AI integration readiness

6. AI/prompt layer (V2+)
   - prompt separation
   - structured output design
   - hallucination/freshness assumptions
   - provider coupling

## Required response format
Return:

### BLOCKERS
Issues that should be fixed before advancing.

### IMPORTANT
High-value improvements that are not hard blockers.

### OPTIONAL
Nice-to-have improvements.

### VERIFIED
Things that appear sound.

### RECOMMENDED NEXT STEP
One concise recommendation for the next milestone.

For every BLOCKER or IMPORTANT item, identify the relevant file/path and give a concrete fix.
