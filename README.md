# Clerk Nuxt Example Application

This is a starter template for a Nuxt 3 application integrated with Clerk for authentication and authorization.

## Features

-   **Clerk Authentication:** Secure user authentication powered by Clerk, supporting:
    -   Email Magic Link sign-in.
    -   Email and Password sign-in with verification code (OTP).
-   **Role-Based Access Control (RBAC):** Global middleware to protect routes and redirect users based on their assigned roles (admin, host, attendee, both).
-   **Nuxt 3:** Built with the latest version of Nuxt.js for a powerful and flexible development experience.
-   **Tailwind CSS:** Styled with Tailwind CSS for rapid UI development and easy customization.
-   **Segmented Sign-in UI:** A user-friendly interface on the sign-in page to switch between different authentication methods.

## Project Structure

Key files and directories:

-   `middleware/auth.global.ts`: Global Nuxt middleware handling authentication checks and role-based redirections.
-   `pages/sign-in/index.vue`: The main sign-in page, offering both magic link and email/password options.
-   `pages/verify-email.vue`: Handles email verification links from Clerk.
-   `components/EmailSignIn.vue`: Component for email magic link authentication.
-   `components/EmailPasswordSignIn.vue`: Component for email and password authentication with OTP.
-   `components/ui/Button.vue`: A reusable button component styled with Tailwind CSS and `class-variance-authority`.

## Authentication Flow

1.  **Unauthenticated Users:** If an unauthenticated user tries to access a protected route, they are redirected to the `/sign-in` page.
2.  **Authenticated Users on Public Routes:** If an authenticated user lands on a public route (e.g., `/`, `/sign-in`), they are redirected to a role-specific dashboard (e.g., `/admin`, `/host`, `/attendee`, `/combined-dashboard`) or the home page (`/`) if no specific role is defined.
3.  **Authenticated Users on Protected Routes:** Access to protected routes (e.g., `/admin`, `/host`, `/dashboard`) is granted only if the user's role matches the required access level. Otherwise, they are redirected to `/sign-in`.

## Role-Based Access Control (RBAC)

Roles are managed via Clerk's session claims (e.g., `sessionClaims.value?.role`). The following roles are currently supported:

-   `admin`: Access to `/admin` routes.
-   `host`: Access to `/host` routes.
-   `attendee`: Access to `/dashboard` routes.
-   `both`: Access to `/admin`, `/host`, and `/dashboard` routes, and redirected to `/combined-dashboard` from public routes.

**Note:** This implementation uses custom roles stored in session claims. For more advanced multi-tenancy or granular permission management, consider leveraging Clerk's native [Organizations](https://clerk.com/docs/organizations/overview) feature.

## Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm or Yarn
-   Clerk Account: Obtain your `NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `NUXT_CLERK_SECRET_KEY` from your Clerk Dashboard.

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd clerk-nuxt-example
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  Create a `.env` file in the project root and add your Clerk keys:
    ```
    NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_YOUR_PUBLISHABLE_KEY"
    NUXT_CLERK_SECRET_KEY="sk_live_YOUR_SECRET_KEY"
    ```

### Development Server

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open your browser to `http://localhost:3000`.

### Build for Production

```bash
npm run build
# or
yarn build
```

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

## Customization

-   **Styling:** Modify `tailwind.config.js` and `assets/css/main.css` for global styles. Component-specific styles are handled via Tailwind classes directly in the Vue components.
-   **Roles:** Adjust the `publicRoutes` array and role-based logic in `middleware/auth.global.ts` to fit your application's needs.
-   **Clerk Configuration:** Refer to the [Clerk Nuxt documentation](https://clerk.com/docs/references/nuxt/overview) for advanced configuration options.

## Contributing

Feel free to contribute to this starter template by opening issues or pull requests.