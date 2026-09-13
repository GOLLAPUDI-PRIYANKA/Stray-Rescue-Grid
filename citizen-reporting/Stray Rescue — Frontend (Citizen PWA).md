# Stray Rescue — Frontend (Citizen PWA)

## Short Description

This repository contains the frontend Progressive Web App (PWA) for the **Stray Rescue — Citizen Reporting Experience**.

It is built using:

- **Vite**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Leaflet**

The application implements the citizen-facing reporting flow, including:

- Stray animal report form
- Browser geolocation capture
- Manual map location correction
- Image upload and preview
- Report submission
- Confirmation page
- PWA integration

The frontend is intended to be paired with a backend API, preferably **FastAPI**, using the `POST /tickets` endpoint.

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm, pnpm, or yarn
- A running backend API (optional for UI testing)

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Create Environment File

Copy `.env.example` to `.env` and configure the backend URL.

Minimal configuration:

```env
VITE_API_BASE=http://localhost:8000
```

### 3. Run the Development Server

```bash
npm run dev
```

Open the URL displayed by Vite, typically:

```text
http://localhost:5173
```

---

## Build for Production

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Project Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |

---

## Environment Variables

Create a `.env` file inside the `frontend/` directory.

```env
VITE_API_BASE=http://localhost:8000
```

### Available Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE` | Base URL of the backend API | `http://localhost:8000` |

---

## Project Structure

```text
frontend/
├── package.json
├── vite.config.ts
├── index.html
├── public/
│   ├── pwa icons
│   └── offline.html
│
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    │
    ├── pages/
    │   ├── ReportPage.tsx
    │   └── ConfirmationPage.tsx
    │
    ├── components/
    │   └── MapPicker.tsx
    │
    ├── hooks/
    │   └── useGeolocation.ts
    │
    ├── services/
    │   └── api.ts
    │
    ├── types.ts
    │
    └── utils/
        └── validators/helpers
```

---

## Key Implementation Notes

### Leaflet Map

Leaflet's default marker URL needs to be configured correctly when using Vite.

The provided `MapPicker.tsx` component already contains the required marker icon fix using `import.meta.url`.

**Do not remove this configuration**, otherwise the default Leaflet marker may not appear.

---

### Geolocation

The application requests the user's location **only when the user clicks "Use my location"**.

The map picker also allows the citizen to manually adjust the reported location by tapping or clicking on the map.

This ensures the reporting flow still works when:

- GPS permission is denied
- GPS is inaccurate
- The citizen wants to report an animal at another nearby location

---

### Photo Handling

Selected photos are previewed on the client before submission.

The images are sent to the backend using:

```text
multipart/form-data
```

Expected field names include:

```text
photos
animal_type
description
latitude
longitude
contact
```

---

## Mock API

If the backend is not ready, the frontend can be tested using a mock response.

Edit:

```text
src/services/api.ts
```

and enable the commented mock implementation provided in the project.

This allows the complete citizen reporting flow to be tested without requiring the backend.

---

## PWA

The project uses:

```text
vite-plugin-pwa
```

The PWA configuration is located in:

```text
vite.config.ts
```

PWA icons should be placed inside:

```text
public/
```

Caching strategies can be configured depending on the application's offline requirements.

---

# API Contract

## POST `/tickets`

The frontend expects the backend to provide:

```http
POST /tickets
Content-Type: multipart/form-data
```

### Request Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `animal_type` | string | Yes | Type of stray animal |
| `description` | string | Yes | Description of the incident |
| `latitude` | string/number | Yes | Report latitude |
| `longitude` | string/number | Yes | Report longitude |
| `contact` | string | No | Citizen contact information |
| `photos` | file[] | No | Uploaded animal images |

### Example Response

The backend should return JSON containing at least one of:

```json
{
  "ticket_code": "SR-2026-00123"
}
```

or:

```json
{
  "id": 123
}
```

If the backend uses different field names or response formats, update:

```text
src/services/api.ts
```

accordingly.

---

# Testing & QA

## Manual Testing

### GPS Permission

Test the following scenarios:

- Allow GPS permission
- Deny GPS permission
- Disable location services
- Use manual map placement after GPS denial

The report form should remain usable even when GPS access is unavailable.

### Image Upload

Test:

- Valid images
- Large images
- Invalid file types
- Multiple images
- Image preview
- Removing selected images

Client-side limits should be configured, while the backend must also validate uploaded files.

### Backend Failure

Test the application when the backend is unreachable.

The application should provide an appropriate error state or use the mock API during frontend-only development.

### Offline Behavior

The PWA should be tested with the device/network disconnected.

A future offline queue can be implemented to store reports locally and submit them when connectivity returns.

---

# Automated Testing

Automated testing can be added in future development.

### Unit and Component Testing

Recommended tools:

```text
Vitest
React Testing Library
```

### End-to-End Testing

Recommended tool:

```text
Playwright
```

Potential test flow:

```text
Open application
      ↓
Open report form
      ↓
Select animal type
      ↓
Enter description
      ↓
Capture/select location
      ↓
Upload photo
      ↓
Submit report
      ↓
Verify confirmation page
      ↓
Verify ticket code
```

---

# Development Workflow

Follow a feature-branch workflow.

```text
main
 │
 ├── feature/citizen-report
 ├── feature/map-picker
 └── feature/pwa
```

Recommended workflow:

1. Create a feature branch.
2. Implement the feature.
3. Test locally.
4. Commit changes.
5. Push the branch.
6. Open a pull request.
7. Review and merge into `main`.

### API Contract Changes

Any breaking API contract changes should be discussed with the backend owner (**Member 4**) before implementation or merging.

This prevents frontend and backend integration issues.

---

# Recommended Architecture

As the application grows, organize UI functionality into feature-specific modules.

For example:

```text
src/
├── features/
│   ├── reporting/
│   │   ├── ReportForm.tsx
│   │   ├── reportApi.ts
│   │   └── reportTypes.ts
│   │
│   ├── map/
│   │   └── MapPicker.tsx
│   │
│   └── authentication/
│       └── Auth.tsx
│
├── components/
├── hooks/
├── services/
└── utils/
```

Keep components small and focused on a single responsibility.

---

# Optional Immediate Improvements

### React Query

Add:

```bash
npm install @tanstack/react-query
```

Use React Query to manage:

- Ticket submission
- Request states
- Retries
- Server responses
- Mutation handling

### Form Validation

Recommended:

```text
react-hook-form
Zod
@hookform/resolvers
```

This provides structured validation for the citizen report form.

### Offline Queue

Implement an IndexedDB-based queue using:

```text
localForage
```

or:

```text
idb-keyval
```

This would allow reports to be stored locally when the device is offline and submitted once connectivity is restored.

### Notifications

Firebase Cloud Messaging can be added later for:

- Report status updates
- Volunteer assignment notifications
- Citizen updates

This requires corresponding backend support.

---

# Troubleshooting

## Leaflet Marker Not Appearing

Check that:

- `leaflet` is installed.
- `@types/leaflet` is installed.
- `MapPicker.tsx` contains the Leaflet icon fix.
- The marker asset paths are correctly configured.

Install dependencies if required:

```bash
npm install leaflet
npm install -D @types/leaflet
```

---

## Cannot POST to Backend

Check:

1. The backend server is running.
2. `VITE_API_BASE` points to the correct backend URL.
3. The backend allows requests from the frontend origin.
4. CORS is correctly configured.
5. The request field names match the API contract.

Example:

```env
VITE_API_BASE=http://localhost:8000
```

---

## Geolocation Is Inaccurate

The citizen can manually correct the location using the map picker.

This is especially useful when:

- GPS accuracy is low.
- The animal is not at the citizen's exact location.
- The report is being submitted after leaving the incident location.

---

# Contributing

1. Fork the repository.
2. Create a feature branch.
3. Implement your changes.
4. Test the application.
5. Commit your changes.
6. Push the branch.
7. Open a pull request against `main`.

For larger changes, use the issue tracker to discuss the proposed implementation before development.

Add unit tests for new components and important application behavior whenever possible.

---

# Team Roles

### Member 2 — Frontend

Responsible for:

- Citizen PWA
- Citizen report form
- Map picker
- Geolocation
- Image upload and preview
- PWA integration
- Frontend-backend API integration

### Other Members

Other team members are responsible for:

- Backend API
- Dispatcher features
- Volunteer features
- Facility features

Refer to the project blueprint for the complete team structure.

---

# Data & Security Guidelines

Do not use real citizen personal information in development or demonstrations.

Use:

- Seed/demo data
- Fake contact information
- Test images
- Mock ticket IDs

Sensitive information should be handled securely by the backend and should not be exposed unnecessarily in the frontend.

---

# License

This project is intended to use the **MIT License**.

See the `LICENSE` file in the project root if provided.

---

# Contact & Support

For project-specific issues, coordinate with the relevant frontend, backend, and integration team members.

For API-related issues, verify the API contract and backend availability before modifying frontend request logic.