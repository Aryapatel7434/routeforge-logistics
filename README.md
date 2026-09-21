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

| Technology | Purpose                      |
| ---------- | ---------------------------- |
| Java 17    | Backend programming language |
| Sp         |                              |
