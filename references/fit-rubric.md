# Fit rubric: Apply / Stretch / Skip

Thresholds are fixed. Do not change them after seeing evaluation results.

Let M = number of must-have requirements. S = number with status SUPPORTED. P = number PARTIAL.
Coverage = (S + 0.5 * P) / M, reported as a percentage.

| Verdict | Rule |
|---|---|
| **Apply** | Coverage >= 80% AND no hard-requirement gap |
| **Stretch** | Coverage 50% to 79%, or Apply-level coverage but one hard-requirement gap the user could plausibly close |
| **Skip** | Coverage < 50%, OR any hard requirement is a confirmed gap with no realistic workaround |

A **hard requirement** is a credential, legal condition or years-of-experience threshold the posting states as mandatory (for example a licence, work authorization, or "10+ years").

Always output: the verdict, coverage %, the 3 strongest matches, the confirmed gaps, and one sentence on what would change the verdict.
Never soften a Skip to be polite, and never push a Stretch to Apply to please the user.
