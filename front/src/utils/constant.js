// In production (Vercel) the backend is served from the same domain under /api,
// so this stays empty and the paths below resolve as relative. Locally it falls
// back to the standalone backend dev server on port 8000.
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export const USER_API_END_POINT=`${API_BASE}/api/v1/user`;
export const JOB_API_END_POINT=`${API_BASE}/api/v1/job`;
export const APPLICATION_API_END_POINT=`${API_BASE}/api/v1/application`;
export const COMPANY_API_END_POINT=`${API_BASE}/api/v1/company`;