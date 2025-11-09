# Batch Scoring API URL Fix

## Issue
The download template button was returning 404 errors with duplicate `/api/v1` in the URL:
```
GET http://localhost:8000/api/v1/api/v1/credit/batch-template 404 (Not Found)
```

## Root Cause
The `.env.local` file already includes `/api/v1` in the `NEXT_PUBLIC_API_URL`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

But the API functions were adding `/api/v1` again:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const response = await fetch(`${API_BASE_URL}/api/v1/credit/batch-template`, ...);
```

This resulted in: `http://localhost:8000/api/v1` + `/api/v1/credit/batch-template` = ❌ Duplicate!

## Solution
Updated `src/features/batch-scoring/api/batch-scoring.api.ts`:

### Before:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Routes had /api/v1 prefix
fetch(`${API_BASE_URL}/api/v1/credit/batch-score`, ...)
fetch(`${API_BASE_URL}/api/v1/credit/batch-template`, ...)
```

### After:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Routes without /api/v1 prefix (already in API_BASE_URL)
fetch(`${API_BASE_URL}/credit/batch-score`, ...)
fetch(`${API_BASE_URL}/credit/batch-template`, ...)
```

## Final URLs
- ✅ Batch Score: `http://localhost:8000/api/v1/credit/batch-score`
- ✅ Template Download: `http://localhost:8000/api/v1/credit/batch-template`

## Testing
1. Restart the Next.js dev server (if environment variables changed):
   ```bash
   # Stop the current dev server (Ctrl+C)
   pnpm dev
   ```

2. Go to the batch scoring page:
   ```
   http://localhost:3000/dashboard/batch-scoring
   ```

3. Click "Download Template" button

4. The CSV file should download successfully

## Additional Improvements
Also added better error handling to show users when:
- Backend is not running
- Download fails
- Export fails

Now error messages are displayed in the UI instead of silently failing.
