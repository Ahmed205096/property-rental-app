# PropertyPulse

PropertyPulse is a rental property platform built with Next.js. It allows users to browse rentals, search by location or keyword, view property details, authenticate with social providers, save bookmarks, and manage their own property listings.
Live Demo: [https://khattab-rental-app.vercel.app/]

## Project Status

Estimated completion: **80%**

The main application flow is implemented and working: authentication, property listing, search, details pages, profile management, image upload, and delete actions are in place. The remaining work is mostly production polish, stronger validation, testing,  and UX refinements.

## Features Completed

- Built the application with **Next.js App Router**, React, TypeScript, and Tailwind CSS.
- Added a public home page with hero search, featured properties, recent properties, and skeleton loading states.
- Added a properties page that fetches and displays rental listings from the API.
- Added dynamic property details pages using route params.
- Added search results page powered by the `/api/search` endpoint.
- Added combined keyword and location search from the home hero.
- Added location dropdown data from the `getLocations` server action.
- Added authentication with **NextAuth/Auth.js** using social login providers.
- Added protected routes using Next.js Proxy middleware.
- Added an auth provider wrapper for client session access.
- Added MongoDB connection with Mongoose models for users and properties.
- Added property creation with form validation using Zod.
- Added image uploads to Cloudinary.
- Added clear upload feedback while property images are being uploaded.
- Added profile page with user data, bookmarks, and user-owned listings.
- Added bookmark remove behavior.
- Added owner-only property deletion from the profile page.
- Added loading and skeleton states for data-heavy pages.
- Added fallback images for listings without uploaded images.
- Added API routes for properties, single property details, search, bookmarks, and users.

## Tech Stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **UI:** React, Tailwind CSS, DaisyUI
- **Authentication:** NextAuth/Auth.js
- **Database:** MongoDB with Mongoose
- **Image Storage:** Cloudinary
- **Validation:** Zod
- **Icons:** React Icons
- **File Uploads:** React Dropzone

## Main Routes

- `/` - Home page
- `/login` - Social login page
- `/properties` - All properties
- `/details/[id]` - Single property details
- `/search` - Search results
- `/add-property` - Add or edit a property
- `/profile` - User profile, bookmarks, and listings

## API Routes

- `GET /api/property` - Get all properties
- `POST /api/property` - Create a property
- `DELETE /api/property?id=PROPERTY_ID` - Delete a property owned by the current user
- `GET /api/property/[id]` - Get a single property
- `GET /api/search?search=QUERY` - Search properties
- `PATCH /api/user-listing` - Update user bookmarks
- `GET /api/users/get-all` - Get users
- `/api/auth/[...nextauth]` - Auth.js route handler

## Environment Variables

Create a `.env` file and configure the required values:

```env
NEXT_PUBLIC_URL=http://localhost:3000

MONGO_URI=

NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_CLOUD_KEY=
CLOUDINARY_CLOUD_SECRET=

NEXT_PUBLIC_API_GET_ALL_PROPERTIES=/api/property
NEXT_PUBLIC_API_GET_FEATURED_PROPERTIES=/api/property?featured-properties=
NEXT_PUBLIC_API_GET_RECENT_PROPERTIES=/api/property?recent-properties=
NEXT_PUBLIC_API_GET_SECIFIC_PROPERTIES=/api/property/
NEXT_PUBLIC_API_SEARCH=/api/search/
NEXT_PUBLIC_API_DELETE_PROPERTY=/api/property
NEXT_PUBLIC_API_USER_LISTING=/api/user-listing
NEXT_PUBLIC_API_IS_LISTED=/api/is-listed/
NEXT_PUBLIC_API_GET_ALL_USERS=/api/users/get-all
NEXT_PUBLIC_API_UPDATE_PROPERTY=/api/property
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

Build for production:

```bash
npm run build
```

`

## What Still Needs Work

- Add full form editing support and better update UX for existing properties.
- Add automated tests for API routes, auth callbacks, and main user flows.
- Improve error states across forms and data fetching pages.
- Add stronger server-side authorization and validation checks for all protected actions.
- Add pagination, sorting, and filtering for large property lists.
- Add better empty states for search, bookmarks, and listings.
- Improve accessibility, keyboard navigation, and semantic structure.
- Add admin or moderator tools if the platform needs listing review.

## Notes

This project is currently a strong functional MVP. The core product experience is mostly complete, and the next phase should focus on reliability, tests, production hardening, and UI polish.
