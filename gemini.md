# Google Gemini AI Rules for Nuxt Application

This file outlines basic rules and best practices for integrating Google Gemini AI, TailwindCSS, shadcn, and headless Clerk for user and organization management in a Nuxt application.

---

## 1. Nuxt Application Rules

- Follow Nuxt 3 conventions for file structure and routing.
- Use server-side rendering (SSR) or static site generation (SSG) as appropriate.
- Organize components, composables, and middleware according to Nuxt best practices.
- Reference: [Nuxt Documentation](https://nuxt.com/docs)

## 2. TailwindCSS Usage

- Use utility classes for styling components.
- Customize Tailwind config in `tailwind.config.js` for project-specific needs.
- Avoid inline styles; prefer Tailwind classes for consistency.
- Reference: [TailwindCSS Documentation](https://tailwindcss.com/docs)

## 3. shadcn UI Guidelines

- Use shadcn UI components for accessible, headless UI building blocks.
- Extend or style shadcn components with TailwindCSS.
- Keep UI logic separate from business logic.
- Reference: [shadcn UI Documentation](https://ui.shadcn.com/docs)

## 4. Headless Clerk for User & Organization Management

- Use Clerk's headless SDK for authentication and organization management.
- Store sensitive keys in environment variables (`.env`).
- Implement role-based access control using Clerk Organizations and custom JWT templates.
- Reference: [Clerk Documentation](https://clerk.com/docs)

## 5. Google Gemini AI Integration

- Use Google Gemini AI APIs for generative AI features (e.g., chat, summarization, code generation).
- Store API keys securely in environment variables.
- Follow Google’s usage policies and rate limits.
- Reference: [Google Gemini AI Documentation](https://ai.google.dev/gemini-api/docs)

---

## General Best Practices

- Keep dependencies up to date.
- Document custom rules and logic in code comments.
- Ensure accessibility and performance in all UI components.
- Use environment variables for all sensitive configuration.

---

## References

- Nuxt: https://nuxt.com/docs
- TailwindCSS: https://tailwindcss.com/docs
- shadcn UI: https://ui.shadcn.com/docs
- Clerk: https://clerk.com/docs
- Google Gemini AI: https://ai.google.dev/gemini-api/docs
