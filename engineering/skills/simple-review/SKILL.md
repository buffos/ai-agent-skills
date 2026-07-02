---
name: simple-review
description: Review the code just before a code submit of the code. Use when user wants be sure of the code quality and mentions explicitly the skill.
---

- Check the code that has not yet been submitted for violation of SOLID principles.
- Report all violations ranked by severity and suggest an improvement on every one of those violations.
- Check that all new code has corresponding tests testing all paths (happy and error paths).

- Check if all tests pass. Frontend and backend test should all pass. If not they should be fixed, regardless if the were caused by current or older changes.
- Check if existing linters have been applied. If errors exist, they should be fixed, regardless if they were cause by current of older changes.

- If CSS is involved check there are we have used the project classes, if they exists, there are no duplications, and no ways to simplify existing CSS. If there are ways to improve, list them analytically.