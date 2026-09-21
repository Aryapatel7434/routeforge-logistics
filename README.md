# RouteForge 🚚

### Intelligent Logistics Route Optimization Platform

RouteForge is a full-stack logistics and delivery route optimization platform designed to help businesses manage **branches, customers, vehicles, dispatches, and optimized delivery routes** from a centralized system.

The platform combines **Spring Boot, PostgreSQL, GraphHopper, Jsprit, and Leaflet** to transform delivery jobs into optimized vehicle routes while considering operational constraints such as vehicle capacity, delivery compatibility, geographic locations, and scheduling requirements.

> **RouteForge = Route + Forge**
> A platform that intelligently forges efficient delivery routes from real-world logistics data.

---

## 📌 Table of Contents

* [Overview](#-overview)
* [Problem Statement](#-problem-statement)
* [Solution](#-solution)
* [Key Features](#-key-features)
* [System Architecture](#-system-architecture)
* [Technology Stack](#-technology-stack)
* [Project Structure](#-project-structure)
* [Core Domain Model](#-core-domain-model)
* [Route Optimization Workflow](#-route-optimization-workflow)
* [Routing Engine](#-routing-engine)
* [Optimization Engine](#-optimization-engine)
* [Frontend Workflow](#-frontend-workflow)
* [API Reference](#-api-reference)
* [Prerequisites](#-prerequisites)
* [Local Setup](#-local-setup)
* [Backend Configuration](#-backend-configuration)
* [Frontend Setup](#-frontend-setup)
* [Running the Application](#-running-the-application)
* [Example Workflow](#-example-workflow)
* [Engineering Highlights](#-engineering-highlights)
* [Current Limitations](#-current-limitations)
* [Future Improvements](#-future-improvements)
* [Project Background](#-project-background)
* [License](#-license)
* [Author](#-author)

---

# 🚀 Overview

Modern delivery operations often involve multiple:

* Warehouses or branches
* Customers
* Delivery requests
* Vehicles
* Capacity constraints
* Delivery time requirements
* Geographic locations
* Driver assignments

Manually deciding the order in which a vehicle should visit customers can become inefficient as the number of deliveries increases.

RouteForge addresses this problem by providing a workflow where logistics data can be created and managed through a web interface and delivery routes can then be optimized automatically.

The platform separates the system into:

```text
Data Management
      ↓
Dispatch & Vehicle Assignment
      ↓
Constraint Validation
      ↓
Distance / Travel-Time Calculation
      ↓
Route Optimization
      ↓
Optimized Stop Sequence
      ↓
Route Geometry
      ↓
Interactive Map Visualization
```

---

# 🎯 Problem Statement

A logistics company may have:

* Multiple delivery locations
* Different vehicle capacities
* Different vehicle types
* Multiple delivery jobs
* Geographic constraints
* Delivery windows or ranges
* Different dispatch requirements

A simple approach such as:

```text
Visit customers in the order they were created
```

does not necessarily produce an efficient route.

RouteForge therefore models the logistics problem as a **Vehicle Routing Problem (VRP)** and uses routing and optimization engines to generate a better delivery sequence.

---

# 💡 Solution

RouteForge provides a centralized workflow for:

1. Creating branches and depots
2. Registering customers
3. Registering vehicles
4. Creating dispatch jobs
5. Assigning dispatches to vehicles
6. Validating assignment compatibility
7. Calculating travel distances and durations
8. Building a vehicle routing problem
9. Optimizing the delivery sequence
10. Generating route geometry
11. Displaying the optimized route on an interactive map

The result is a logistics workflow that connects **business data → optimization → visualization**.

---

# ✨ Key Features

## 🏢 Branch Management

Manage warehouse or depot locations used as route origins and destinations.

Capabilities include:

* Create branches
* Retrieve branch information
* Store geographic coordinates
* Use branches as routing locations

---

## 👥 Customer Management

Maintain customer delivery information.

Capabilities include:

* Create customers
* Retrieve customer information
* Store delivery coordinates
* Associate customers with dispatch jobs

---

## 📦 Dispatch Management

Represent individual delivery jobs inside the system.

Capabilities include:

* Create dispatches
* Retrieve dispatches
* Retrieve individual dispatch details
* Create multiple dispatches
* Associate delivery jobs with customers
* Store delivery requirements

---

## 🚚 Vehicle Management

Manage the vehicles available for delivery operations.

Capabilities include:

* Create vehicles
* Retrieve vehicles
* Store vehicle characteristics
* Associate vehicles with dispatch jobs
* Validate compatible delivery assignments

---

## 🔗 Dispatch-Vehicle Assignment

RouteForge provides a dedicated relationship between vehicles and assigned dispatches.

The system can:

```text
Vehicle
   ↓
Assigned Dispatches
   ↓
Validate compatibility
   ↓
Generate optimized route
```

This separates **vehicle management** from **delivery-job management** and allows route planning to operate on explicit assignments.

---

## 🗺️ Interactive Route Visualization

Optimized routes are visualized using an interactive web map.

The frontend displays:

* Vehicle information
* Delivery sequence
* Route geometry
* Delivery stops
* Total distance
* Estimated duration
* Optimized route
* Outbound/return route information

---

## ⚙️ Automated Route Optimization

Instead of manually selecting the delivery sequence, RouteForge builds a routing problem and sends it through the optimization pipeline.

```text
Delivery Jobs
     ↓
Coordinates
     ↓
Distance Matrix
     ↓
Vehicle Routing Problem
     ↓
Optimization
     ↓
Optimized Sequence
```

---

# 🏗️ System Architecture

RouteForge follows a layered full-stack architecture.

```text
┌─────────────────────────────────────────────┐
│                 Frontend                    │
│                                             │
│ HTML / CSS / JavaScript / Bootstrap        │
│ Leaflet Map Visualization                   │
└──────────────────────┬──────────────────────┘
                       │
                       │ REST API
                       ▼
┌─────────────────────────────────────────────┐
│                 Backend                     │
│                                             │
│ Spring Boot                                 │
│ Controllers                                 │
│ Services                                    │
│ Repositories                                │
│ Domain Entities                             │
│ Optimization Services                       │
└───────────────┬──────────────┬──────────────┘
                │              │
                ▼              ▼
       ┌──────────────┐   ┌──────────────┐
       │ PostgreSQL   │   │ Routing /    │
       │ Database     │   │ Optimization │
       │              │   │ Engines      │
       └──────────────┘   └──────────────┘
```

### Backend Layers

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
PostgreSQL
```

The optimization pipeline is integrated into the service layer and uses dedicated routing/optimization components.

---

# 🧰 Technology Stack

## Backend

| Technology        | Purpose                              |
| ----------------- | ------------------------------------ |
| Java 17           | Backend programming language         |
| Spring Boot       | Backend application framework        |
| Spring Data / JPA | Data persistence                     |
| PostgreSQL        | Relational database                  |
| Maven             | Dependency management and build      |
| GraphHopper       | Routing and travel calculations      |
| Jsprit            | Vehicle Routing Problem optimization |

## Frontend

| Technology | Purpose          |
| ---------- | ---------------- |
| HTML5      | Page structure   |
| CSS3       | Styling          |
| JavaScript | Frontend logic   |
| Bootstrap  | Responsive UI    |
| Leaflet    | Interactive maps |

## Infrastructure / Tools

| Tool                    | Purpose                |
| ----------------------- | ---------------------- |
| Docker                  | PostgreSQL environment |
| Git                     | Version control        |
| GitHub                  | Source-code hosting    |
| Postman                 | API testing            |
| IntelliJ IDEA / VS Code | Development            |

---

# 📁 Project Structure

```text
routeforge-logistics/
│
├── README.md
├── .gitignore
│
├── routing_backend/
│   │
│   ├── pom.xml
│   ├── docker-compose.yml
│   ├── mvnw
│   ├── mvnw.cmd
│   │
│   └── src/
│       ├── main/
│       │
│       │   ├── java/
│       │   │   └── com/example/routing_backend/
│       │   │
│       │   │       ├── config/
│       │   │       ├── controller/
│       │   │       ├── dto/
│       │   │       ├── entity/
│       │   │       ├── enums/
│       │   │       ├── opt/
│       │   │       ├── repository/
│       │   │       ├── service/
│       │   │       └── utility/
│       │   │
│       │   └── resources/
│       │       └── application.yml
│       │
│       └── test/
│
└── routing_frontend/
    │
    ├── index.html
    ├── index.js
    ├── helper.js
    │
    ├── img/
    │
    └── pages/
        ├── home/
        ├── dispatch/
        ├── add-dispatch/
        ├── dispatch-details/
        ├── dispatch-distribution/
        └── routing/
```

---

# 🧩 Core Domain Model

RouteForge revolves around five primary business entities.

## Branch

Represents a warehouse, depot, or operational location.

```text
Branch
 ├── id
 ├── location
 └── coordinates
```

---

## Customer

Represents a delivery destination.

```text
Customer
 ├── id
 ├── customer information
 └── delivery coordinates
```

---

## Dispatch

Represents a delivery job.

```text
Dispatch
 ├── id
 ├── customer
 ├── delivery information
 └── operational constraints
```

---

## Vehicle

Represents a vehicle available for deliveries.

```text
Vehicle
 ├── id
 ├── vehicle type
 ├── capacity
 └── availability information
```

---

## DispatchVehicle

Connects a vehicle with its assigned dispatch jobs.

```text
DispatchVehicle
 ├── vehicle
 └── assigned dispatches
```

This relationship becomes the input for route optimization.

---

# 🧠 Route Optimization Workflow

The core RouteForge workflow can be represented as:

```text
1. Select Vehicle
       ↓
2. Select / Load Compatible Dispatches
       ↓
3. Validate Constraints
       ↓
4. Build Geographic Locations
       ↓
5. Calculate Distance & Travel Time
       ↓
6. Build Vehicle Routing Problem
       ↓
7. Run Optimization
       ↓
8. Generate Optimized Stop Sequence
       ↓
9. Generate Route Geometry
       ↓
10. Return Route Response
       ↓
11. Visualize on Leaflet Map
```

---

# 🗺️ Routing Engine

RouteForge uses **GraphHopper** for geographic routing and travel calculations.

The routing layer is responsible for converting geographic locations into useful routing information such as:

* Distance
* Travel time
* Route geometry
* Location-to-location travel information

The backend contains a dedicated distance-matrix abstraction:

```text
DistanceProvider
       │
       └── GraphHopperDistanceProvider
```

This separation makes the routing implementation easier to maintain and extend.

---

# 📊 Distance Matrix

Before optimization, the system needs information about how costly it is to travel between locations.

Conceptually:

```text
          A       B       C       D
      ┌──────────────────────────────
A     │  0      12      18      25
B     │ 12       0       9      17
C     │ 18       9       0      11
D     │ 25      17      11       0
```

The values can represent travel distance or travel time depending on the routing configuration.

This information becomes an input to the optimization stage.

---

# 🚛 Optimization Engine

RouteForge models delivery planning as a **Vehicle Routing Problem (VRP)**.

The optimization stage considers the available vehicle and its assigned delivery jobs and attempts to determine an efficient sequence.

Conceptually:

```text
Depot
  │
  ├── Customer A
  ├── Customer B
  ├── Customer C
  └── Customer D
```

Instead of simply visiting:

```text
A → B → C → D
```

the optimization engine determines an optimized sequence based on the routing problem.

The optimized output can then be converted into a geographic route for visualization.

---

# 🖥️ Frontend Workflow

The frontend provides separate screens for major logistics operations.

```text
Dashboard
   │
   ├── Branch Management
   ├── Customer Management
   ├── Vehicle Management
   ├── Dispatch Management
   ├── Dispatch Distribution
   ├── Dispatch Details
   └── Route Optimization
```

### Route Planning UI

The routing page allows users to:

1. Select a vehicle
2. View compatible dispatches
3. Generate the optimized route
4. View route information
5. Inspect delivery sequence
6. Visualize the route on the map

---

# 🔌 API Reference

The backend exposes REST APIs for the major logistics entities.

## Branches

### Get branches

```http
GET /branches
```

### Create branch

```http
POST /branches
```

---

## Customers

### Get customers

```http
GET /customers
```

### Create customer

```http
POST /customers
```

---

## Dispatches

### Get all dispatches

```http
GET /dispatches
```

### Get dispatch by ID

```http
GET /dispatches/{id}
```

### Create dispatch

```http
POST /dispatches
```

### Create multiple dispatches

```http
POST /dispatches/bulk
```

---

## Dispatch Vehicles

### Get dispatch vehicles

```http
GET /dispatch-vehicles
```

### Get dispatch vehicle by ID

```http
GET /dispatch-vehicles/{id}
```

### Create dispatch-vehicle assignment

```http
POST /dispatch-vehicles
```

### Generate route

```http
GET /dispatch-vehicles/route/{id}
```

---

## Vehicles

### Get vehicles

```http
GET /vehicles
```

### Get vehicle by ID

```http
GET /vehicles/{id}
```

### Create vehicle

```http
POST /vehicles
```

---

# 📦 Example Route Response

A successful route-generation request returns information such as:

```json
{
  "totalDistance": "...",
  "totalDurationMinutes": "...",
  "totalDurationFormatted": "...",
  "vehicle": {},
  "dispatches": [],
  "routes": [],
  "geometry": {},
  "unassignedJobs": []
}
```

The response can then be consumed by the frontend to display:

```text
Vehicle
   ↓
Total Distance
   ↓
Estimated Duration
   ↓
Delivery Sequence
   ↓
Route Geometry
   ↓
Interactive Map
```

---

# 🛠️ Prerequisites

Before running RouteForge locally, install:

* Java 17
* Maven or Maven Wrapper
* Node.js
* npm
* Docker Desktop
* PostgreSQL environment
* Git

Recommended development environments:

* IntelliJ IDEA
* Visual Studio Code

---

# ⚙️ Local Setup

## 1. Clone the repository

```bash
git clone https://github.com/Aryapatel7434/routeforge-logistics.git
```

```bash
cd routeforge-logistics
```

---

# 🐘 2. Start PostgreSQL

The backend contains a Docker Compose configuration.

Navigate to:

```bash
cd routing_backend
```

Start PostgreSQL:

```bash
docker compose up -d
```

Verify running containers:

```bash
docker ps
```

---

# 🗄️ 3. Create the Database

Create the database expected by the backend configuration.

For example:

```bash
docker compose exec postgresql psql -U username -d username
```

Then:

```sql
CREATE DATABASE routing;
```

Exit PostgreSQL:

```sql
\q
```

> Database username, password, port, and database configuration should match the values in `routing_backend/src/main/resources/application.yml`.

---

# 🗺️ 4. Routing Data

Graph-based routing requires geographic map data.

The project is designed to use an OpenStreetMap `.osm.pbf` dataset compatible with the routing configuration.

For example, a regional dataset can be downloaded from **Geofabrik**:

```text
https://download.geofabrik.de/
```

Place the required `.osm.pbf` file in the routing data directory configured by the backend.

Example:

```text
routing_backend/
└── .data/
    └── <regional-map-data>.osm.pbf
```

### Important

Large map datasets should generally **not be committed to Git**.

The project's `.gitignore` is intended to keep local routing data outside the Git history.

---

# ☕ 5. Start the Backend

From:

```text
routing_backend/
```

Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

Linux/macOS:

```bash
./mvnw spring-boot:run
```

The backend runs on the configured Spring Boot port.

Example:

```text
http://localhost:8070
```

---

# 🌐 6. Start the Frontend

Open another terminal:

```bash
cd routing_frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend using the project's configured frontend workflow.

For example, if a local static server is used:

```bash
npx http-server .
```

The exact frontend serving command can be adjusted according to the local development environment.

---

# 🔄 Complete Local Development Flow

```text
Clone Repository
       ↓
Start Docker
       ↓
Start PostgreSQL
       ↓
Create routing database
       ↓
Configure map/routing data
       ↓
Start Spring Boot backend
       ↓
Start frontend
       ↓
Open application
       ↓
Create Branch
       ↓
Create Customers
       ↓
Create Vehicles
       ↓
Create Dispatches
       ↓
Assign Dispatches
       ↓
Generate Route
       ↓
View Optimized Route
```

---

# 🧪 Testing the Backend

The repository contains backend test infrastructure under:

```text
routing_backend/src/test/
```

Run tests with:

```powershell
.\mvnw.cmd test
```

or:

```bash
./mvnw test
```

---

# 🔍 Engineering Highlights

RouteForge demonstrates several practical software-engineering concepts.

### Layered Backend Architecture

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

### Separation of Routing Concerns

Routing logic is separated through dedicated distance-provider components.

### Domain-Driven Modeling

The backend models logistics concepts explicitly:

```text
Branch
Customer
Dispatch
Vehicle
DispatchVehicle
```

### RESTful API Design

The frontend communicates with the backend through HTTP APIs.

### Optimization Pipeline

The project connects:

```text
Business Data
      ↓
Geographic Data
      ↓
Distance Matrix
      ↓
VRP
      ↓
Optimization
      ↓
Route Visualization
```

### Interactive Visualization

Leaflet provides a geographic interface for understanding the optimized route rather than displaying only raw coordinates or JSON.

---

# 📈 Example Business Scenario

Imagine a logistics company has:

```text
1 Warehouse
5 Customers
2 Vehicles
5 Delivery Jobs
```

The dispatcher selects a vehicle and assigns compatible delivery jobs.

RouteForge processes:

```text
Warehouse
   ↓
Delivery Locations
   ↓
Vehicle Constraints
   ↓
Travel Distances
   ↓
Optimization
```

The system can then produce:

```text
Vehicle 01

Warehouse
   ↓
Customer C
   ↓
Customer A
   ↓
Customer D
   ↓
Customer B
   ↓
Warehouse
```

The frontend visualizes the resulting route on the map together with distance and estimated duration information.

---

# ⚠️ Current Limitations

RouteForge is currently a development-oriented logistics optimization platform.

Potential limitations include:

* Routing performance depends on the geographic dataset and hardware.
* Large geographic datasets require significant disk space.
* Route optimization performance can change as the number of jobs and constraints increases.
* Production deployment would require additional authentication and authorization controls.
* Monitoring, centralized logging, and distributed deployment are not currently the primary focus.
* Real-time vehicle tracking is not currently implemented.
* Production-grade external routing infrastructure would require additional configuration.

---

# 🔮 Future Improvements

Potential production improvements include:

## Real-Time Vehicle Tracking

Integrate GPS/telematics data to monitor vehicles in real time.

```text
Vehicle GPS
    ↓
Tracking Service
    ↓
Route Monitoring
    ↓
Live Map
```

## Dynamic Re-Routing

Recalculate routes when:

* Traffic changes
* A vehicle becomes unavailable
* A new delivery is added
* A delivery is cancelled
* A driver deviates significantly from the planned route

---

## Driver Management

Add:

* Driver accounts
* Driver assignment
* Driver availability
* Driver performance
* Delivery completion tracking

---

## Authentication & Authorization

Add role-based access:

```text
ADMIN
  ↓
DISPATCHER
  ↓
DRIVER
```

---

## Delivery Status Tracking

Introduce statuses such as:

```text
CREATED
   ↓
ASSIGNED
   ↓
IN_TRANSIT
   ↓
DELIVERED
```

---

## Analytics Dashboard

Add operational metrics such as:

* Total deliveries
* Vehicle utilization
* Route distance
* Delivery completion rate
* Average delivery duration
* Unassigned jobs
* Route efficiency

---

## Production Deployment

Potential production infrastructure:

```text
                ┌───────────────┐
                │ Load Balancer │
                └───────┬───────┘
                        │
                ┌───────▼───────┐
                │ Spring Boot   │
                │ Application   │
                └───────┬───────┘
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
     PostgreSQL     Redis        Monitoring
```

---

# 📚 Project Background

RouteForge was developed by extending an existing open-source routing application foundation and substantially adapting it into a logistics-focused route optimization platform.

The work on this repository focuses on the logistics domain and application workflow, including areas such as:

* Dispatch management
* Vehicle management
* Customer and branch workflows
* Dispatch-vehicle assignment
* Route-generation workflow
* Routing integration
* Optimization workflow
* API integration
* Frontend route visualization
* Project documentation

The original project's license and applicable attribution should be preserved according to the terms of the source project.

For projects that reuse or modify existing code, the applicable license determines what reuse, modification, and distribution are permitted.

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

A typical contribution workflow is:

```text
Fork / Branch
     ↓
Make Changes
     ↓
Test Changes
     ↓
Commit
     ↓
Push
     ↓
Open Pull Request
```

Before submitting changes:

* Keep changes focused.
* Follow the existing project structure.
* Test backend changes.
* Avoid committing secrets or local configuration.
* Do not commit large routing datasets.
* Update documentation when behavior changes.

---

# 🔐 Security

Do not commit:

* Database passwords
* API keys
* Access tokens
* Private credentials
* Production configuration
* Large local routing datasets

Use environment variables or an appropriate secret-management solution for production deployments.

If you discover a security issue, avoid publicly exposing sensitive details in an issue.

---

# 📄 License

The license for this repository should be kept consistent with the license and attribution requirements of the underlying project and any third-party components used by RouteForge.

If this repository is distributed under the MIT License, include a `LICENSE` file containing the applicable MIT License text and required copyright attribution. GitHub's documentation notes that licenses determine how code can be reused and what attribution requirements apply.

---

# 👨‍💻 Author

### Arya Patel

B.Tech Information Technology Student
Dharmsinh Desai University

**GitHub:**
https://github.com/Aryapatel7434

**RouteForge:**
https://github.com/Aryapatel7434/routeforge-logistics

---

# ⭐ Project Summary

RouteForge brings together:

```text
Spring Boot
     +
PostgreSQL
     +
GraphHopper
     +
Jsprit
     +
REST APIs
     +
Leaflet
     +
Logistics Domain Modeling
     +
Vehicle Routing Optimization
```

to create an end-to-end platform for **delivery dispatch management and intelligent route planning**.

> **Build systems that solve real operational problems.**
