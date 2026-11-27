# Mirrorbound Firestore Security Specification

## 1. Data Invariants

1. **Authentication & Verification Gate**: Every write (`create`, `update`, `delete`) to `/leaderboard_entries/{entryId}` requires an authenticated user with a verified email (`request.auth != null && request.auth.token.email_verified == true`).
2. **Identity Ownership Invariant**: A score entry's `userId` must strictly equal `request.auth.uid` on creation and remain immutable across updates (`incoming().userId == existing().userId`).
3. **Path Variable Hardening**: Every single-document target operation (`get`, `create`, `update`, `delete`) validates `isValidId(entryId)` (`<= 128` chars, `^[a-zA-Z0-9_\-]+$`).
4. **Strict Key & Schema Blueprint**: `isValidLeaderboardScore(data)` enforces exact keys (`hasAll` and `hasOnly`), string length bounds (`playerName` 1..24, `themeName` 1..28, `bracket` 10..32), enum membership for `mode`, `difficulty`, and `bracket`, and numeric bounds (`score` 0..50000, `moves` 6..500, `timeSeconds` 1..7200, `bestStreak` 1..24).
5. **Temporal Integrity**: `createdAt` must equal `request.time` on creation and remain immutable on update; `updatedAt` must equal `request.time` on both creation and update.
6. **Zero PII Storage**: `/leaderboard_entries/{entryId}` stores only public gameplay metrics and a sanitized display `playerName`—never email addresses, phone numbers, or private profile data.
7. **Secure List Query Enforcer**: `allow list` validates `resource.data.bracket in ['classic_easy', 'classic_medium', 'classic_hard', 'timed_easy', 'timed_medium', 'timed_hard'] && resource.data.score >= 0 && resource.data.score <= 50000`.

## 2. The "Dirty Dozen" Adversarial Payloads

1. **Identity Spoofing**: `userId: "victim-uid-999"` while signed in as `"attacker-uid-111"`.
2. **Unverified Email Write**: Valid payload sent by a user token with `email_verified: false`.
3. **Shadow Field Injection**: Valid payload plus extra field `isAdmin: true`.
4. **Resource Poisoning (Oversized ID)**: Document ID exceeding 128 characters or containing special characters.
5. **Value Poisoning (Out-of-Range Score)**: `score: 9999999` (exceeds 50000 cap) or negative score.
6. **Impossible Move Count**: `moves: 2` (fewer than minimum 6 moves).
7. **Client Timestamp Forgery**: `createdAt` set to a forged past or future timestamp instead of `request.time`.
8. **Bracket Mismatch Tampering**: `mode: "classic"`, `difficulty: "easy"`, but `bracket: "timed_hard"`.
9. **Immutable Field Mutation on Update**: Updating `createdAt` or `userId` on an existing score entry.
10. **Score Downgrade / Unlisted Key Update**: Attempting to mutate `mode` or `difficulty` during an update action.
11. **Oversized Display Name**: `playerName` with 500 characters (exceeds 24-character limit).
12. **Unauthorized Cross-User Delete**: Authenticated user attempting to delete another user's leaderboard entry.
