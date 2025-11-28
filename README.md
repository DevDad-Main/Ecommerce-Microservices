# Ecommerce Microservices

A modern, scalable e-commerce platform built with microservices architecture using Turborepo for monorepo management. This project demonstrates best practices for building distributed systems with separate concerns for products, orders, payments, and administration.

## 🏗️ Architecture

This monorepo consists of multiple services and applications, each handling specific business domains:

### Applications

- **Client** (`apps/client`): Customer-facing Next.js application for browsing products, managing cart, and checkout
- **Admin** (`apps/admin`): Administrative dashboard for managing products, categories, and orders

### Microservices

- **Product Service** (`apps/product-service`): REST API for product and category management using Express.js
- **Order Service** (`apps/order-service`): Order processing service using Fastify
- **Payment Service** (`apps/payment-service`): Stripe payment processing with webhooks using Hono

### Shared Packages

- **Types** (`packages/types`): Shared TypeScript interfaces and schemas
- **BullMQ** (`packages/bullmq`): Background job processing for Stripe operations
- **Product DB** (`packages/product-db`): Prisma ORM for PostgreSQL product database
- **Order DB** (`packages/order-db`): Mongoose ODM for MongoDB order database
- **ESLint Config** (`packages/eslint-config`): Shared linting configuration
- **TypeScript Config** (`packages/typescript-config`): Shared TypeScript configuration

## 🚀 Features

### Customer Features

- Product catalog with categories, sizes, colors, and images
- Shopping cart with persistent state
- Secure checkout with Stripe integration
- User authentication via Clerk
- Order history and tracking
- Responsive design with Tailwind CSS

### Admin Features

- Product management (CRUD operations)
- Category management
- Order overview and management
- Dashboard with analytics
- Image upload and management
- Real-time data updates

### Technical Features

- Asynchronous job processing with BullMQ
- Stripe webhook handling for payment confirmations
- Database migrations with Prisma
- Type-safe APIs with Zod validation
- Background job queues for Stripe product sync
- Monorepo tooling with Turborepo

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Clerk** - Authentication
- **Stripe Elements** - Payment UI

### Backend Services

- **Express.js** - REST API framework
- **Fastify** - High-performance web framework
- **Hono** - Lightweight web framework for payments
- **Prisma** - Database ORM
- **Mongoose** - MongoDB ODM
- **BullMQ** - Job queue system

### Infrastructure

- **PostgreSQL** - Primary database for products
- **MongoDB** - Document database for orders
- **Redis** - Queue storage
- **Stripe** - Payment processing
- **Turborepo** - Monorepo build system

## 📋 Prerequisites

- Node.js >= 18
- pnpm package manager
- PostgreSQL database
- MongoDB database
- Redis instance
- Stripe account

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/Devdad-Main/Ecommerce-Microservices.git
   cd Ecommerce-Microservices/
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Copy the example environment files and configure:
   - Database URLs (PostgreSQL, MongoDB)
   - Redis connection
   - Stripe API keys
   - Clerk authentication keys

4. **Set up databases**

   ```bash
   # Generate Prisma client and run migrations
   pnpm run db:generate
   pnpm run db:migrate
   ```

5. **Start development servers**

   ```bash
   pnpm run dev
   ```

   This will start all services concurrently:
   - Client: http://localhost:3002
   - Admin: http://localhost:3003
   - Product Service: http://localhost:8000
   - BullMQ Board: http://localhost:8000/admin/queues
   - Order Service: http://localhost:8001
   - Payment Service: http://localhost:8002

## 📁 Project Structure

```
ecommerce-microservices/
├── apps/
│   ├── admin/          # Admin dashboard (Next.js)
│   ├── client/         # Customer frontend (Next.js)
│   ├── order-service/  # Order processing (Fastify)
│   ├── payment-service/# Payment processing (Hono)
│   └── product-service/# Product management (Express)
├── packages/
│   ├── bullmq/         # Job queue system
│   ├── eslint-config/  # Shared ESLint config
│   ├── order-db/       # Order database models
│   ├── product-db/     # Product database schema
│   ├── types/          # Shared TypeScript types
│   └── typescript-config/ # Shared TS config
├── package.json
├── turbo.json
└── pnpm-workspace.yaml
```

## 🔧 Available Scripts

- `pnpm run dev` - Start all services in development mode
- `pnpm run build` - Build all applications and packages
- `pnpm run lint` - Run ESLint across the monorepo
- `pnpm run check-types` - Run TypeScript type checking
- `pnpm run db:generate` - Generate Prisma client
- `pnpm run db:migrate` - Run database migrations

## 🔒 Authentication

The application uses Clerk for authentication with role-based access:

- **Customers**: Can browse products, manage cart, place orders
- **Admins**: Full access to product and order management

## 💳 Payment Processing

Stripe handles all payment processing with:

- Secure checkout sessions
- Webhook handling for payment confirmations
- Asynchronous order creation via job queues
- Support for multiple currencies

## 🔄 Background Jobs

BullMQ manages asynchronous operations:

- Stripe product creation/deletion
- Order processing after successful payments
- Image processing and optimization

## 📊 Database Schema

### Products (PostgreSQL)

- Products with variants (sizes, colors)
- Categories with slug-based routing
- Image storage with color-specific images

### Orders (MongoDB)

- Order history with user association
- Product snapshots at time of purchase
- Payment status tracking

## 🤝 Contributing

1. Follow the existing code style and conventions
2. Use TypeScript for all new code
3. Add tests for new features
4. Update documentation as needed
5. Use conventional commits

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Built with modern web technologies and best practices
- Inspired by scalable e-commerce architectures
- Uses open-source tools and frameworks
