# Implementation Plan - TransportFlow (Transport Management System)

This document outlines the step-by-step technical plan to develop **TransportFlow**—a MERN-based logistics, tracking, and compliance management system. The plan is organized in progressive, test-driven phases that align with the user-defined global guidelines (TDD, high test coverage, strict type validation, and premium aesthetics).

---

## User Review Required

> [!IMPORTANT]
> **1. Database Integration Pattern (Native MongoDB vs. Mongoose)**
> - The `server/package.json` currently includes the native `"mongodb": "^7.2.0"` driver, but the `README.md` outlines a standard declarative Mongoose schema.
> - **Recommendation:** We propose installing `"mongoose"` (`npm install mongoose @types/mongoose`) for the server to ensure clean schema-level validations, middleware hooks (for automatic cascading status updates), and robust TypeScript typing.
> - **Alternative:** Use raw MongoDB collections and write custom validation layers.
>
> **2. Testing Strategy & API Mocking**
> - Following the strict TDD rule, we must write failing tests before committing code. We will use `vitest` and `supertest` for the backend.
> - **Requirement:** We need to confirm whether to spin up an in-memory MongoDB server (e.g. `mongodb-memory-server`) or use a local dev database instance for integration tests. We recommend using `mongodb-memory-server` to keep testing isolated, fast, and repeatable.

---

## Open Questions

> [!WARNING]
> **1. Email/Notification Dispatch**
> - When vehicle documents (insurance, fitness, permits) are within 30 days of expiry, the system creates dashboard warnings. Do we want an active email notification queue (e.g., Nodemailer or Brevo) for Admins, or should it remain purely dashboard-driven in Phase 1?
>
> **2. Map Integration & Geolocation Tracking**
> - The schema specifies `lat`/`lng` for vehicles and destination points. Should we use actual interactive maps (e.g. Leaflet / Mapbox) or a beautiful mock coordinate update interface for testing live driver locations?

---

## Proposed Changes

We divide the application setup and development into **5 logical, self-contained phases**. Each phase ends with a testing gate ensuring 80%+ coverage before committing.

```
┌─────────────────────────────────────────────────────────────┐
│ Phase 1: Core Backend & Database Infrastructure             │
├─────────────────────────────────────────────────────────────┤
│ Phase 2: Seeding & Core Backend API Endpoints               │
├─────────────────────────────────────────────────────────────┤
│ Phase 3: Frontend Foundations & Shared Context              │
├─────────────────────────────────────────────────────────────┤
│ Phase 4: Frontend Pages & Premium Layouts                   │
├─────────────────────────────────────────────────────────────┤
│ Phase 5: Testing, Full E2E Validation & Polish              │
└─────────────────────────────────────────────────────────────┘
```

---

### Phase 1: Core Backend & Database Infrastructure

Build the core runtime container for the Express application, establish strict database schemas, and create the JWT-based security middleware.

#### [NEW] [db.ts](file:///v:/Developer/travel/server/src/config/db.ts)
- Connect to MongoDB and set up the connection state logger. If Mongoose is selected, initialize connections here.

#### [NEW] [User.ts](file:///v:/Developer/travel/server/src/models/User.ts)
- Hashed passwords using `bcrypt`.
- Role configuration: `admin`, `manager`, `dispatcher`.

#### [NEW] [Vehicle.ts](file:///v:/Developer/travel/server/src/models/Vehicle.ts)
- Strict compliance expiry limits, auto-calculating warning flags on validation.
- Enum statuses: `available`, `in-transit`, `maintenance`, `retired`.

#### [NEW] [Driver.ts](file:///v:/Developer/travel/server/src/models/Driver.ts)
- Profile details, phone matching, license category, rating limits (1–5).
- Reference to `assignedVehicle`.

#### [NEW] [Trip.ts](file:///v:/Developer/travel/server/src/models/Trip.ts)
- Trip progression status, coordinates, link to Vehicle and Driver.
- Pre-save validator verifying both Vehicle and Driver are marked `available`.

#### [NEW] [Delivery.ts](file:///v:/Developer/travel/server/src/models/Delivery.ts)
- Reference to Trip, Priority (`low`, `medium`, `high`, `urgent`), Consignee object, and Proof of Delivery.

#### [NEW] [auth.ts](file:///v:/Developer/travel/server/src/middleware/auth.ts)
- JWT signature verifier, setting active user payload on requests.

#### [NEW] [roles.ts](file:///v:/Developer/travel/server/src/middleware/roles.ts)
- Role-Based Access Control (RBAC) middleware verifying roles against route permission maps.

#### [MODIFY] [server.ts](file:///v:/Developer/travel/server/src/server.ts)
- Wire up middlewares (CORS, Express JSON parser, morgan logger) and hook schemas up to endpoints.

---

### Phase 2: Seeding & Backend RESTful API Endpoints

Write business controller actions, validation inputs, and a database seeder script.

#### [NEW] [seed.ts](file:///v:/Developer/travel/server/src/scripts/seed.ts)
- Clear database collections and insert mock records for Admins, Managers, Dispatchers, compliant vehicles, ready-to-assign drivers, active trips, and pending deliveries.

#### [NEW] [authController.ts](file:///v:/Developer/travel/server/src/controllers/authController.ts)
- Sign-up, login, and active token profile validation (`/api/auth/me`).

#### [NEW] [vehicleController.ts](file:///v:/Developer/travel/server/src/controllers/vehicleController.ts)
- CRUD operations. Automatically enforces role limits (Dispatcher has read-only access).

#### [NEW] [driverController.ts](file:///v:/Developer/travel/server/src/controllers/driverController.ts)
- CRUD operations. Handle direct link/unlink relationships to Vehicles.

#### [NEW] [tripController.ts](file:///v:/Developer/travel/server/src/controllers/tripController.ts)
- Trip state machine actions. Triggers cascading status updates (e.g. starting a trip marks both vehicle and driver as busy).

#### [NEW] [deliveryController.ts](file:///v:/Developer/travel/server/src/controllers/deliveryController.ts)
- Delivery logging, failure reschedules, and PoD validations.

#### [NEW] [dashboardController.ts](file:///v:/Developer/travel/server/src/controllers/dashboardController.ts)
- Aggregate reporting endpoints (fleet distribution, monthly stats, and active compliance warning alerts).

---

### Phase 3: Frontend Foundations & Shared Context

Bootstrapping client-side modules, routing frameworks, context wrappers, and premium baseline variables.

#### [MODIFY] [package.json](file:///v:/Developer/travel/client/package.json)
- Add required client libraries: `react-router-dom`, `lucide-react`, `recharts`, `axios`.

#### [NEW] [api.ts](file:///v:/Developer/travel/client/src/utils/api.ts)
- Custom Axios instance injecting JWT bearer token from storage on requests, redirecting to login on 401.

#### [NEW] [AuthContext.tsx](file:///v:/Developer/travel/client/src/context/AuthContext.tsx)
- Session persistence, login routing, role-mapping inside the React hierarchy.

#### [NEW] [ProtectedRoute.tsx](file:///v:/Developer/travel/client/src/components/layout/ProtectedRoute.tsx)
- Route guard validating authentication state and specific role access permissions.

#### [NEW] [Sidebar.tsx](file:///v:/Developer/travel/client/src/components/layout/Sidebar.tsx) & [Navbar.tsx](file:///v:/Developer/travel/client/src/components/layout/Navbar.tsx)
- Fully responsive sidebar featuring custom icons, active page indicators, profile badge displays, and intuitive layout transitions.

#### [MODIFY] [index.css](file:///v:/Developer/travel/client/src/index.css)
- Integrate Tailwind v4 custom styles, color configurations (premium dark-mode values, dynamic state colors), and uniform glassmorphic overlays.

---

### Phase 4: Frontend Pages & Premium Layouts

Construct interactive dashboard feeds, grid/list controls, and contextual overlays.

#### [NEW] [Login.tsx](file:///v:/Developer/travel/client/src/pages/Login.tsx)
- Premium, animated login split screen with custom interactive gradients and responsive field validators.

#### [NEW] [Dashboard.tsx](file:///v:/Developer/travel/client/src/pages/Dashboard.tsx)
- Responsive dashboard layout including dynamic statistics cards, Recharts fleet utilization pie metrics, monthly progress bar graphs, and an urgent document compliance alerts feed.

#### [NEW] [Vehicles.tsx](file:///v:/Developer/travel/client/src/pages/Vehicles.tsx)
- Grid display of vehicles, compliance expiry visual warnings, edit/create modals, status selectors, and license key mappings.

#### [NEW] [Drivers.tsx](file:///v:/Developer/travel/client/src/pages/Drivers.tsx)
- Comprehensive driver profile roster, interactive experience bars, custom assignment controls, and rating elements.

#### [NEW] [Trips.tsx](file:///v:/Developer/travel/client/src/pages/Trips.tsx)
- Visual step progression of trip states, smart-check validators ensuring allocated assets are currently available, and easy destination route feeds.

#### [NEW] [Deliveries.tsx](file:///v:/Developer/travel/client/src/pages/Deliveries.tsx)
- Prioritized delivery lists, Proof of Delivery (PoD) visual overlay, signatures field simulator, and simple status triggers.

---

### Phase 5: Testing, Full E2E Validation & Polish

Verification phase to validate requirements and fix performance bottlenecks.

#### [NEW] [auth.test.ts](file:///v:/Developer/travel/server/src/tests/auth.test.ts) & [trips.test.ts](file:///v:/Developer/travel/server/src/tests/trips.test.ts)
- High-coverage unit tests checking routes, RBAC limitations, and state transitions using Vitest.

---

## Verification Plan

### Automated Tests
- **Vitest Suite:** Run backend tests to verify authentication paths, validation rules, and state machine integrity.
  ```bash
  cd server && npm run test
  ```
- **Lint Check:** Ensure code is clean of unused variables/imports and fits formatting rules.
  ```bash
  cd client && npm run lint
  ```

### Manual Verification
1. Boot the application using concurrently:
   ```bash
   npm run dev
   ```
2. Navigate to `http://localhost:3000` (or active Vite local IP) and log in using seeded credentials (`admin@transport.com`, `manager@transport.com`, `dispatcher@transport.com`).
3. Verify Dashboard stats change in real-time when adding a vehicle or changing a trip's status.
4. Try accessing the Admin/Manager routes as a Dispatcher to verify the RBAC block.
5. Manually edit an expiry date to within 30 days and verify a compliance warning card instantly renders.
