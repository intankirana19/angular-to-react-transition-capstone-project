# Unit Tests

This folder stores unit tests only.

- `unit` is kept intentionally so test levels are explicit.
- If needed later, other levels can be added without mixing concerns:
  - `src/tests/integration/`
  - `tests/e2e/`
- Decision note:
  - Co-located unit tests are valid, and we considered that option first.
  - We use `src/tests/unit` in this capstone to keep review flow simple and test structure easy to scan.
  - Trade-off: test files are a bit farther from source files.

Current structure is grouped by feature and code type, for example:

- `src/tests/unit/products/components/*.test.tsx`
- `src/tests/unit/products/hooks/*.test.ts`

References:
- https://www.yockyard.com/post/co-locate-unit-tests/
- https://dev.to/el_mahfoudbouatim_b502a2/react-best-practices-for-scalable-frontends-part-1-folder-structure-and-organization-4ik7
