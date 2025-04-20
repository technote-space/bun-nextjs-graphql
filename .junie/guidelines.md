# Junie Guidelines for TODO Application

This document provides guidelines for development and maintenance of the TODO application using Junie AI assistance.

## Project Overview

This is a modern TODO application built with:
- **Frontend**: Next.js with App Router
- **API**: GraphQL with Apollo Server
- **Database**: Prisma ORM (configured for SQLite, but adaptable to other databases)
- **Authentication**: Auth0
- **Architecture**: Clean Architecture with clear separation of concerns
- **Runtime**: Bun for fast JavaScript execution

## Code Structure

The project follows a clean architecture approach with the following structure:

```
src/
├── app/                  # Next.js App Router components and pages
├── gql/                  # GraphQL client-side code
├── graphql-schema/       # GraphQL schema definitions
├── lib/                  # Utility libraries
├── middleware.ts         # Authentication middleware
└── server/               # Server-side code
```

## Development Guidelines

### General Principles

1. **Follow Clean Architecture**: Maintain clear separation between:
   - Domain (core business entities and rules)
   - Use Cases (application-specific business rules)
   - Interface Adapters (adapters between the application and external interfaces)
   - Frameworks (external frameworks and tools)

2. **Type Safety**: Use TypeScript for all code to ensure type safety.

3. **Testing**: Write tests for all new functionality, especially for API endpoints.

### GraphQL Guidelines

1. **Schema-First Development**: Define GraphQL schemas first, then implement resolvers.

2. **Authentication & Authorization**: 
   - Ensure all mutations and queries have proper authentication checks
   - Follow the permission rules defined in the API documentation
   - Regular users should only access their own data
   - Admin users can access all data

3. **Pagination**: Use the established pagination pattern for list operations.

### Frontend Guidelines

1. **Component Structure**: 
   - Keep components small and focused on a single responsibility
   - Use the App Router pattern for routing

2. **State Management**: 
   - Use Apollo Client for GraphQL state management
   - Use React hooks for local state management

3. **Authentication**: 
   - Use Auth0 for authentication
   - Follow the established patterns for protected routes

### Database Guidelines

1. **Prisma Usage**: 
   - Use Prisma migrations for database schema changes
   - Define clear models with appropriate relationships

2. **Data Access**: 
   - Access database only through repository patterns
   - Keep database logic separate from business logic

## AI Assistance Guidelines

When using Junie or other AI tools for this project:

1. **Code Generation**: 
   - Use AI to generate boilerplate code following the established patterns
   - Always review and test AI-generated code before committing

2. **Documentation**: 
   - Use AI to help generate and maintain documentation
   - Ensure documentation is clear, concise, and accurate

3. **Code Optimization**: 
   - Use AI suggestions for code optimization
   - Validate optimizations with performance testing

4. **Problem Solving**: 
   - Use AI to help debug issues and suggest solutions
   - Always understand the suggested solutions before implementing them

## Environment Setup

Refer to the README.md for detailed instructions on:
- Auth0 configuration
- Environment variables setup
- Development server execution

## Default Accounts

The application includes default accounts for testing:

### Regular User
- **Name**: 田中太郎
- **Email**: tanaka.tarou@example.com
- **Password**: Test1234
- **Role**: EDITOR

### Administrator
- **Name**: 管理者
- **Email**: admin@example.com
- **Password**: Test1234
- **Role**: ADMIN

## Additional Resources

For more information on the technologies used in this project:
- [Next.js Documentation](https://nextjs.org/docs)
- [GraphQL Documentation](https://graphql.org/learn/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Auth0 Documentation](https://auth0.com/docs)