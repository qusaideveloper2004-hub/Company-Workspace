"use client";

import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, useAuth, useUser } from "@clerk/nextjs";

function titleFromPath(pathname: string) {
  const segment = pathname.split("/").filter(Boolean)[0] ?? "dashboard";
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

export default function Navbar() {
  const pathname = usePathname();

  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-4">
      <h2 className="text-lg font-semibold">{titleFromPath(pathname)}</h2>

      {!isLoaded ? null : isSignedIn ? (
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">
            {user?.firstName ?? user?.primaryEmailAddress?.emailAddress}
          </span>

          <UserButton />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <SignInButton mode="redirect">
            <button className="rounded bg-blue-600 px-4 py-2 text-white">Sign In</button>
          </SignInButton>

          <SignUpButton mode="redirect">
            <button className="rounded bg-gray-200 px-4 py-2 text-gray-800">Sign Up</button>
          </SignUpButton>
        </div>
      )}
    </header>
  );
}



// "use client";

// import { usePathname } from "next/navigation";
// import {
//   SignInButton,
//   SignUpButton,
//   UserButton,
//   useAuth,
//   useUser,
// } from "@clerk/nextjs";

// function titleFromPath(pathname: string) {
//   const segment =
//     pathname.split("/").filter(Boolean)[0] ?? "dashboard";

//   return segment.charAt(0).toUpperCase() + segment.slice(1);
// }

// export default function Navbar() {
//   const pathname = usePathname();

//   const { isLoaded, isSignedIn } = useAuth();
//   const { user } = useUser();

//   return (
//     <header>
//       <div>
//         {titleFromPath(pathname)}
//       </div>

//       {!isLoaded ? null : isSignedIn ? (
//         <div className="flex items-center gap-3">
//           <span className="text-sm text-muted">
//             {user?.firstName ??
//               user?.primaryEmailAddress?.emailAddress}
//           </span>

//           <UserButton />
//         </div>
//       ) : (
//         <div className="flex items-center gap-2">
//           <SignInButton mode="redirect">
//             <button>Sign In</button>
//           </SignInButton>

//           <SignUpButton mode="redirect">
//             <button>Sign Up</button>
//           </SignUpButton>
//         </div>
//       )}
//     </header>
//   );
// }