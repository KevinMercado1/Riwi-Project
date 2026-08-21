# Riwi Management API

This is a robust REST API built with **Node.js**, **TypeScript**, and a relational ORM to manage coders, team leaders, clans, and learning routes within the **Riwi** ecosystem.

The project follows a clean, layered architecture (Controllers, Models, Routes, Middlewares, and DTOs) to ensure scalability, strict data typing, and structural request validation.

---

## Project Structure

Below is the directory breakdown of the `src` folder, illustrating how responsibility is segregated across the codebase:

- **`config/`**: Contains core application and environment configurations.
  - `db.ts`: Handles the database connection instance and initialization logic.
- **`models/`**: The data layer defining database schemas and object-relational mapping.
  - Contains individual entity definitions (`coder.ts`, `clan.ts`, etc.).
  - `associations.ts`: Centralizes the definition of foreign keys and entity relationships (e.g., One-to-Many, Many-to-One).
- **`dto/`**: Data Transfer Objects. Defines the structural validation contracts (e.g., Zod or Joi schemas) for request bodies during creation and authentication.
- **`middlewares/`**: Intermediary software functions processing requests prior to controller execution.
  - `validateRequests.ts`: Intercepts inbound HTTP requests and validates their payloads against the respective DTO schemas.
- **`controllers/`**: The business logic layer. Orchestrates data operations, processes incoming HTTP requests via models, and handles status code responses.
- **`routes/`**: Exposes the REST endpoints grouped by business entity, including a dedicated router for handling user authentication (`authRoutes.ts`).
- **`app.ts`**: The application entry point. Bootstraps the Express framework, registers global middlewares, injects the master routing tables, and starts the HTTP server.

---

## Model Structure & Relationships

The data layer models the academic ecosystem of Riwi. Entities are written as individual classes with strong TypeScript definitions. Their relationships, foreign keys, and cascading behaviors are centralized and instantiated inside `src/models/associations.ts`.

### Entity-Relationship Diagram (ERD) Mapping

The following table details how the architectural schemas map to database tables, including data types and structural constraints:

| Entity Model         | Database Table    | Primary Key | Key Attributes                                           | Foreign Keys (Relations)                                                                                                                                                                                                          |
| :------------------- | :---------------- | :---------- | :------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`Identification`** | `identifications` | `id` (Int)  | `type`, `number`                                         | None                                                                                                                                                                                                                              |
| **`City`**           | `cities`          | `id` (Int)  | `name`                                                   | None                                                                                                                                                                                                                              |
| **`Role`**           | `roles`           | `id` (Int)  | `name`                                                   | None                                                                                                                                                                                                                              |
| **`Clan`**           | `clans`           | `id` (Int)  | `name`                                                   | None                                                                                                                                                                                                                              |
| **`RouteRiwi`**      | `routes_riwi`     | `id` (Int)  | `name`                                                   | None                                                                                                                                                                                                                              |
| **`Address`**        | `addresses`       | `id` (Int)  | `address`                                                | `cityId` $\rightarrow$ `City(id)`                                                                                                                                                                                                 |
| **`Coder`**          | `coders`          | `id` (Int)  | `name`, `surname`, `email`, `password`, `numer_telefonu` | `identificationId` $\rightarrow$ `Identification(id)` <br> `addressId` $\rightarrow$ `Address(id)` <br> `roleId` $\rightarrow$ `Role(id)` <br> `clanId` $\rightarrow$ `Clan(id)` <br> `routeRiwild` $\rightarrow$ `RouteRiwi(id)` |
| **`TeamLeader`**     | `team_leaders`    | `id` (Int)  | `name`, `surname`, `email`, `password`, `numer_telefonu` | `roleId` $\rightarrow$ `Role(id)` <br> `clanId` $\rightarrow$ `Clan(id)` <br> `routeRiwild` $\rightarrow$ `RouteRiwi(id)`                                                                                                         |

_Note: Every table automatically tracks record changes using `createdAt` and `updatedAt` timestamp fields._

### Data Architectural Definitions

- **Single Source of Truth (`associations.ts`)**: Models are declared independently to avoid circular dependency errors during boot time. Relationships are injected dynamically in this file before the database synchronization hook runs.
- **Typing Constraints**: Standard attributes like names, emails, and passwords map to variable-length character fields. Phone metrics utilize string structures to capture country formatting extensions natively without truncation issues (`numer_telefonu`).

---

## Request Lifecycle Flow

Every inbound HTTP request flows linearly through the architectural layers to guarantee security and data integrity:

1. **Routing Layer (`routes/`)**: Receives the HTTP request and identifies the target endpoint.
2. **Middleware Layer (`middlewares/validateRequests.ts`)**: Intercepts the request payload and checks it against the target schema in the `dto/` folder. Invalid requests are rejected immediately with a `400 Bad Request`.
3. **Controller Layer (`controllers/`)**: Executes business rules and communicates with the persistent storage layer.
4. **Data Layer (`models/`)**: Queries or updates the database.
5. **Response Execution**: The controller sends back the formatted JSON data along with the corresponding HTTP status code to the client.

---

## Prerequisites

Ensure you have the following environments configured before running the application:

- **Node.js** (v18.0.0 or higher recommended)
- **npm** or **yarn** package manager
- An active, accessible relational database instance matching your `db.ts` setup

---

## Installation & Deployment

1. **Clone the repository:**

   ```bash
   git clone <REPOSITORY_URL>
   cd <PROJECT_DIR>
   ```

2. **Install project dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and define the following variables:

   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_NAME=riwi_db
   JWT_SECRET=your_jwt_signing_key
   ```

4. **Run in Development Mode (with hot-reloading):**

   ```bash
   npm run dev
   ```

5. **Compile TypeScript to Production JavaScript:**

   ```bash
   npm run build
   ```

6. **Start Production Server:**

   ```bash
   npm start
   ```
