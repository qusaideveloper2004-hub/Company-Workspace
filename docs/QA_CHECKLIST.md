# Manual QA Checklist

Use separate Clerk accounts linked to active Employee records for each role. Test in local development first, then repeat the smoke test on the Vercel production URL.

## 1. Access protection

- A signed-out visitor who opens `/dashboard` is redirected to `/sign-in`.
- A Clerk account with no linked Employee record is redirected to `/unauthorized`.
- An inactive Employee is redirected to `/unauthorized` and cannot complete protected API actions.

## 2. Tasks

| Role | Expected result |
| --- | --- |
| Admin | Can create, view, update, and delete any task. |
| Manager | Can create, view, update, and delete tasks only in their own department. |
| Employee | Cannot create or delete tasks; can update only a task assigned to them. |

Also test a manager trying a task from another department and an employee trying a task assigned to someone else. Both actions must return or show a permission denial.

## 3. Tickets

| Role | Expected result |
| --- | --- |
| Admin | Can view and manage all tickets. |
| Manager | Can view and manage tickets in their department. |
| Employee | Can view and manage only tickets they created. |

## 4. Announcements

| Role | Expected result |
| --- | --- |
| Admin | Can create, update, and delete announcements. |
| Manager | Can create and update announcements, but cannot delete them. |
| Employee | Can read announcements only. |

## 5. Employees and settings

- Admin can create, update, and delete employees.
- Manager can create employees in their own department and update eligible employees there, but cannot delete.
- Employee can view the company employee list but cannot open employee details or manage records.
- Only Admin can change Company Settings.
- Every active employee can change only their own preferences, including theme.

## 6. Production smoke test

1. Confirm Vercel has `DATABASE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, and `CLERK_SECRET_KEY` for Production.
2. Push the latest commit and wait for the Vercel deployment to finish.
3. Open the production URL in an incognito window.
4. Sign in, open Dashboard, create one allowed record, and verify it appears after refresh.
5. Change the theme in Settings, refresh the browser, and verify the saved theme remains active.
