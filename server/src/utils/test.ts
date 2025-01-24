import { markdownToDocx } from "./markdownToDocx";
import { markdownToJpeg } from "./markdownToJpeg";
import { markdownToPdf } from "./markdownToPdf";
import { markdownToPpt } from "./markdownToPpt";
import { markdownToTxt } from "./markdownToTxt";

const markdownContent = `
# Product Backlog

## Features and Tasks

| **ID** | **Title**                        | **Description**                                                                                                                                     | **Priority** | **Estimation (Story Points)** |
| ------ | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ----------------------------- |
| 1      | User Registration                | As a user, I want to register an account with email, phone number, username and password.                                                           | High         | 3                             |
| 2      | User Roles Management            | As an admin, I want to assign roles "technician" or "secretary" or "manager" or "admin" to organization members.                                    | High         | 5                             |
| 3      | Subscription System              | As a user, I want to subscribe monthly to become an organization owner.                                                                             | High         | 8                             |
| 4      | Machine Registration             | As a customer, I want to register my machine in the system for repair.                                                                              | Medium       | 5                             |
| 5      | Assign Technician                | As an organization owner, I want to assign a technician to a customer's machine for repair.                                                         | Medium       | 5                             |
| 6      | Random Technician Assignment     | I need the system to be able to select a random technician from the selected organization.                                                          | Medium       | 3                             |
| 7      | Dashboard for Organization Owner | As an organization owner, I want a dashboard showing subscriptions, team members, reports, invoices. And all these will be displayed based on role. | Medium       | 8                             |
| 8      | Notifications                    | As a user, I want to receive notifications about subscription renewal and repair updates.                                                           | Low          | 5                             |

# Sprint 1: Registration and Subscription

## Sprint Goal

Enable basic user registration, role management, and subscription functionality.

## Sprint Backlog

| **Task ID** | **Task Name**                  | **Description**                                                                         | **Assigned To** | **Status**  |
| ----------- | ------------------------------ | --------------------------------------------------------------------------------------- | --------------- | ----------- |
| 1.1         | Design Registration API        | Create REST API for user registration.                                                  | Backend Dev     | Completed   |
| 1.2         | Build Registration Frontend    | Develop UI for user registration.                                                       | Frontend Dev    | Completed   |
| 1.3         | Design role and permission API | Create API and middlewares which checks and assigns roles for users in an organization. | Backend Dev     | In Progress |
| 1.4         | Setup Subscription Models      | Create database schema for subscriptions.                                               | Backend Dev     | To Do       |
| 1.5         | Integrate Payment Gateway      | Implement payment processing for subscriptions.                                         | Backend Dev     | To Do       |

# Software Requirement Specification (SRS)

## Functional Requirements

1. Users can register with email/phone number and password.
2. Admins can assign roles to team members.
3. Customers can register machines for repairs.
4. Customers can select technician for repairs.
5. Diagnostics can be done on machines.
6. Reports can be can be sent to management.
7. Invoices can be generated for repair costs.
8. Organization owners can subscribe for a membership plan and upgrade the plan.
9. Payments for subscriptions are processed monthly. Payment gateway intergrated using MOMO API.
10. Organisation owners can pay a periodic fee for advertisment of services.

## Non-Functional Requirements

1. Handle 1000 concurrent users.
2. Payment processing complies with PCI-DSS standards.
<!-- 3. System uptime is 99.9%. -->

# System Design Document (SDD)

## Architecture

- **Backend**: Node.js with Express and TypeScript
- **Database**: MongoDB with Mongoose
- **Frontend**: React with TypeScript

# React Frontend Development Guidelines

## Naming Conventions

- Components

## Coding Standards

- Use TypeScript for type safety.
- Functional components with React Hooks.
- Decentralize API calls.

# Node.js Backend Development Guidelines

## Naming Conventions

## Code Standards

- Use TypeScript for type safety.
- Adhere to RESTful principles.
- Use Mongoose for MongoDB models.

---

## Weekly Progress

- **Project Name**: ElectroFix
- **Week**: Week 2
- **Submission Date**: Saturday 14 December 2024
- **Group Members**: TAYIWOH BUO KUM, NDANKIBENG FAVOUR NKANDAWA, DIONE NDIP AJANG

## Backend Progress

1. Completed system authentication.

- User registration
- User login
- Forgot password implemented
- OTP verification implemented

2. RBAC setup.

- Roles and permissions implemented with relationships
- User relation and assigment of role upon registration
- Enabled role and permissions access to recources and api access with use of middlewares

3. Setup interfaces for models and class services.

## Frontend Progress

1. Implementation system authentication.

- User registration
- User login

2. RBAC setup.

- Roles and permissions access to specific routes and components.

`;

const outputPath = "./output/sample.pdf";

try {
  // Convert Markdown to TXT
  // bun run src/test.ts
  markdownToTxt("./test[1].md", "./output.txt");

  // Convert Markdown to PPT
  markdownToPpt("./test[1].md", "./output.pptx");

  // Convert Markdown to JPEG
  markdownToDocx("./test[1].md", "./output.docx");
  markdownToJpeg("./test[1].md", "./output.jpeg");
  markdownToPdf("./report.md", outputPath).then(() =>
    console.log(`PDF generated successfully at ${outputPath}`)
  );
} catch (err) {
  console.error("Error generating PDF:", err);
}
