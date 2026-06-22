# Security Specification & Test Cases

## Data Invariants
1. **Tool Integrity**: A tool's slug must match its normalized, URL-safe name, and tags/features lists must remain within strict bounds (maximum size 10 to prevent denial-of-wallet payload bloat).
2. **PII and Bookmark Privacy**: Any bookmark is strictly owned by the creator user. Only the creator is authorized to query and write (create or delete) their own bookmarks.
3. **Temporal Sanity**: Tools created or modified must use `request.time` for timestamps rather than client-asserted times.
4. **Strict Role Separation**: Operations on tools, categories, and collections collections are strictly limited to verified, authenticated admins (specifically checking bootstrapped `vikash4287@gmail.com` or custom admins document entries).

## The "Dirty Dozen" Poisonous Payloads

### Payload 1: Unauthorized Tool Creation (Identity Spoofing)
- **Target**: `/databases/{database}/documents/tools/{toolId}`
- **Payload**: Attempting to create a tool without a valid admin session.
- **Expected Outcome**: `PERMISSION_DENIED`

### Payload 2: Admin Spoofing via Custom Claims (Identity Spoofing)
- **Target**: `/databases/{database}/documents/tools/chatgpt`
- **Payload**: Creating a tool asserting role claims directly in token.
- **Expected Outcome**: `PERMISSION_DENIED`

### Payload 3: Injecting giant metadata lists (Denial of Wallet)
- **Target**: `/databases/{database}/documents/tools/overload`
- **Payload**: Creating a tool with a tags array containing 10,000 items.
- **Expected Outcome**: `PERMISSION_DENIED`

### Payload 4: Invalid Identifier / Special Characters (Resource Poisoning)
- **Target**: `/databases/{database}/documents/tools/!!!%%%$$$`
- **Payload**: Creating a tool with special/malicious characters in the document ID.
- **Expected Outcome**: `PERMISSION_DENIED`

### Payload 5: Slandering Competitor Tool Name (State Shortcutting)
- **Target**: `/databases/{database}/documents/tools/{toolId}` (update / patch)
- **Payload**: Attempting as a normal user to alter a core tool’s website page to a phishing link.
- **Expected Outcome**: `PERMISSION_DENIED`

### Payload 6: Modifying Core System Categories (Identity Spoofing)
- **Target**: `/databases/{database}/documents/categories/writing` (update)
- **Payload**: Unauthenticated user trying to modify the visual colors of a category definition.
- **Expected Outcome**: `PERMISSION_DENIED`

### Payload 7: Deleting curated Collections (Identity Spoofing)
- **Target**: `/databases/{database}/documents/collections/best-ai-tools-for-students`
- **Payload**: Non-admin attempting to delete a highly rated category directory folder.
- **Expected Outcome**: `PERMISSION_DENIED`

### Payload 8: Blanket Bookmark Reads (PII Blanket Test)
- **Target**: `/databases/{database}/documents/bookmarks`
- **Payload**: Querying all bookmarks across all users without restricting to own `userId`.
- **Expected Outcome**: `PERMISSION_DENIED`

### Payload 9: Stealing another user's Bookmark (Identity Spoofing)
- **Target**: `/databases/{database}/documents/bookmarks/{bookmarkId}`
- **Payload**: Creation of a bookmark for `userB` by an authenticated `userA`.
- **Expected Outcome**: `PERMISSION_DENIED`

### Payload 10: Client Temporal Forgery (Time Hijacking)
- **Target**: `/databases/{database}/documents/tools/custom`
- **Payload**: Attempting to set `createdAt` in the future or past (e.g. `2035-12-31T23:59:59Z`).
- **Expected Outcome**: `PERMISSION_DENIED`

### Payload 11: Multi-field Ghost Injecting (Shadow Update Test)
- **Target**: `/databases/{database}/documents/tools/chatgpt` (update)
- **Payload**: Trying to alter `views` count whilst sneaking in `isVerified: true` as a ghost field.
- **Expected Outcome**: `PERMISSION_DENIED`

### Payload 12: Invalid Data Types (Value Poisoning Test)
- **Target**: `/databases/{database}/documents/tools/chatgpt`
- **Payload**: Sending `views` score as a boolean true instead of a numeric integer value.
- **Expected Outcome**: `PERMISSION_DENIED`
