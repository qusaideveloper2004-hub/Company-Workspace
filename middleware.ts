import { clerkMiddleware, createRouteMatcher  } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/tickets(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

