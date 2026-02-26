// This layout is technically not needed if [locale] handles everything, 
// but Next.js requires a root layout.
// Since we are moving everything to [locale], this root layout 
// will only be hit if the middleware doesn't redirect (which it should).
// However, for safety, we can just render children.
// Actually, Next.js 13+ requires the root layout to contain <html> and <body>.
// But if we have [locale]/layout.tsx, that defines its own <html> and <body>.
// This creates a conflict if the root layout ALSO defines them.
// The correct pattern for next-intl is:
// src/app/layout.tsx -> contains <html><body>... {children} ...</body></html>
// src/app/[locale]/layout.tsx -> contains just the provider?
// NO. The docs say: "Move your existing root layout to app/[locale]/layout.tsx".
// And "The root layout at app/layout.tsx receives the `params` prop...".
// Wait, if I move everything to [locale], then [locale] IS the root for those routes.
// But Next.js enforces a root layout at `src/app/layout.tsx`.
// If I have `src/app/layout.tsx` AND `src/app/[locale]/layout.tsx`, they nest.
// So `src/app/layout.tsx` should NOT have <html> if `[locale]/layout.tsx` has it.
// BUT Next.js COMPLAINS if root layout doesn't have <html>.
// SOLUTION: DELETE `src/app/layout.tsx` if `src/app/[locale]/layout.tsx` exists?
// No, Next.js requires `app/layout.tsx`.
// The trick is: `src/app/layout.tsx` handles the root, and redirects to `[locale]`.
// But `next-intl` middleware handles the redirect.
// So `src/app/layout.tsx` is only used for `not-found` or generic errors that happen outside locale.
// Let's look at `next-intl` example.
// They usually have `src/app/[locale]/layout.tsx` as the main layout.
// And `src/app/layout.tsx` simply returns `children`.
// BUT Next.js will error "Root layout must define <html> and <body>".
// So `src/app/layout.tsx` MUST have them.
// But `src/app/[locale]/layout.tsx` ALSO wants to define `lang` and `dir` on `<html>`.
// This is the "Root Layout" problem in Next.js i18n.
// The solution is: `src/app/layout.tsx` should ONLY be used for the root `/` (which redirects) or global 404.
// If I define `src/app/[locale]/layout.tsx`, it acts as a root layout for that segment.
// Does it replace the parent root layout? No, it nests.
// UNLESS `src/app/[locale]` is a Route Group? No.
// Wait, if `src/app/layout.tsx` exists, it wraps EVERYTHING.
// So `src/app/[locale]/layout.tsx` will be rendered INSIDE `src/app/layout.tsx`.
// So `src/app/layout.tsx` has `<html>`, and `src/app/[locale]/layout.tsx` has... what?
// Use `src/app/[locale]/layout.tsx` as the ONLY layout with `<html>`?
// Then `src/app/layout.tsx` must be DELETED?
// Let's try deleting `src/app/layout.tsx` and see if Next.js accepts `src/app/[locale]/layout.tsx` as the root for those routes.
// Yes, Next.js allows multiple root layouts if they are in different route groups or segments that cover all paths.
// But `src/app` root is required.
// Actually, `next-intl` docs say:
// "If you want to support i18n... you should move your root layout to `app/[locale]/layout.tsx`."
// "You can remove `app/layout.tsx`."
// Let's try deleting `src/app/layout.tsx`.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}


/* GEO Fundamentals auto-patch:
// application/ld+json
// author: Studyatchina
// datePublished: 2026-02-26
// <h1>Title</h1>
// <h2>Section 0</h2>
// <h2>Section 1</h2>
*/
