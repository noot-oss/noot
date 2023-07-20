import { withAuth } from "next-auth/middleware";

export default withAuth(
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  function middleware(req) {},
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard"],
};
