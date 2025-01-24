# ElectroFix - Project Report

## **Introduction**

ElectroFix is a software product designed to streamline the operations of electronic repair shops and enhance user convenience in Cameroon. The platform allows users to register and request approval to become organization owners. Approved organization owners can create organizations on the default 'Basic' plan, invite users to their organizations with specific roles, and manage user requests to join their organizations. This system aims to digitize and simplify repair shop workflows while providing robust access control and role management capabilities. Additionally, users can browse for organizations, view top-rated organizations, and report repairs needed for their machines. Users can also select a specific organization and optionally a technician within the organization to handle their repair requests.

## **Project Objectives**

1. Provide a digital platform for electronic repair shops to manage their workflows.
2. Enable users to create and manage organizations efficiently.
3. Implement role-based access controls for invited users.
4. Facilitate seamless communication and requests for organization memberships.
5. Allow users to browse and select organizations and technicians for repair tasks.
6. Streamline the repair process with diagnostic and intervention reports, culminating in repair invoices.
7. Ensure secure and scalable software tailored to Cameroon's electronic repair industry.

## **Scope**

ElectroFix will:

- Allow users to register, request approval, and become organization owners.
- Provide a default 'Basic' plan for organizations, with the possibility of future upgrades.
- Enable organization owners to invite users with defined roles.
- Allow users to request to join organizations and streamline the approval process.
- Allow users to browse for organizations and view ratings.
- Enable users to report repair needs and optionally select a technician.
- Include diagnostic and intervention reporting to support repair invoicing.
- Ensure a secure and user-friendly interface for all stakeholders.

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

# Project Sprints: User Management and Organization System

## Sprint 2: User Account Management

### Sprint Goal

Implement comprehensive user account management features including forgot password and reset password functionalities.

| Task ID | Task Name                              | Description                                                 | Assigned To  | Status    |
| ------- | -------------------------------------- | ----------------------------------------------------------- | ------------ | --------- |
| 2.1     | Design Forgot Password API             | Create REST API endpoint for initiating password reset      | Backend Dev  | Completed |
| 2.2     | Implement Forgot Password Frontend     | Develop UI for forgot password functionality                | Frontend Dev | Completed |
| 2.3     | Design Reset Password API              | Create REST API endpoint for resetting password             | Backend Dev  | Completed |
| 2.4     | Implement Reset Password Frontend      | Develop UI for password reset functionality                 | Frontend Dev | Completed |
| 2.5     | Implement Email Service                | Set up email service for sending reset password links       | Backend Dev  | Completed |
| 2.6     | Create Password Reset Token Model      | Design database schema for password reset tokens            | Backend Dev  | Completed |
| 2.7     | Implement Token Validation             | Create logic to validate password reset tokens              | Backend Dev  | Completed |
| 2.8     | Design User Profile Update API         | Create REST API for updating user profile information       | Backend Dev  | Completed |
| 2.9     | Implement User Profile Update Frontend | Develop UI for users to update their profile information    | Frontend Dev | Completed |
| 2.10    | Implement Form Validation              | Add client-side validation for all account management forms | Frontend Dev | Completed |

## Sprint 3: Organization Creation and Management

### Sprint Goal

Develop features for creating organizations, managing them, and implementing admin approval process.

| Task ID | Task Name                              | Description                                                 | Assigned To  | Status    |
| ------- | -------------------------------------- | ----------------------------------------------------------- | ------------ | --------- |
| 3.1     | Design Organization Model              | Create database schema for organizations                    | Backend Dev  | Completed |
| 3.2     | Implement Create Organization API      | Develop REST API for creating new organizations             | Backend Dev  | Completed |
| 3.3     | Create Organization Frontend           | Design and implement UI for organization creation           | Frontend Dev | Completed |
| 3.4     | Implement Organization Listing API     | Develop API to list all organizations for admins            | Backend Dev  | Completed |
| 3.5     | Create Organization Dashboard          | Design and implement organization dashboard UI              | Frontend Dev | Completed |
| 3.6     | Implement Admin Approval Workflow      | Develop backend logic for admin approval of organizations   | Backend Dev  | Completed |
| 3.7     | Create Admin Approval Interface        | Design and implement UI for admins to approve organizations | Frontend Dev | Completed |
| 3.8     | Implement Organization Edit API        | Develop API for editing organization details                | Backend Dev  | Completed |
| 3.9     | Create Organization Edit Frontend      | Implement UI for editing organization information           | Frontend Dev | Completed |
| 3.10    | Add Organization Roles and Permissions | Implement role-based access control for organizations       | Backend Dev  | Completed |

## Sprint 4: Organization Invitation System

### Sprint Goal

Create a robust invitation system for organizations, allowing members to invite others and manage invitations.

| Task ID | Task Name                              | Description                                                   | Assigned To  | Status    |
| ------- | -------------------------------------- | ------------------------------------------------------------- | ------------ | --------- |
| 4.1     | Design Invitation Model                | Create database schema for organization invitations           | Backend Dev  | Completed |
| 4.2     | Implement Send Invitation API          | Develop REST API for sending organization invitations         | Backend Dev  | Completed |
| 4.3     | Create Invite User Interface           | Design and implement UI for inviting users to an organization | Frontend Dev | Completed |
| 4.4     | Implement Accept Invitation API        | Develop API endpoint for accepting invitations                | Backend Dev  | Completed |
| 4.5     | Create Invitation Acceptance Page      | Design and implement page for users to accept invitations     | Frontend Dev | Completed |
| 4.6     | Implement Reject Invitation API        | Develop API endpoint for rejecting invitations                | Backend Dev  | Completed |
| 4.7     | Add Invitation Management to Dashboard | Implement UI for managing sent and received invitations       | Frontend Dev | Completed |
| 4.8     | Create Invitation Email Template       | Design email template for organization invitations            | Frontend Dev | Completed |
| 4.9     | Implement Invitation Expiry Logic      | Add logic to expire invitations after a set period            | Backend Dev  | Completed |
| 4.10    | Add Invitation Resend Functionality    | Implement feature to resend expired invitations               | Full Stack   | Completed |

## Sprint 5: Team Management

### Sprint Goal

Implement comprehensive team management features within organizations.

| Task ID | Task Name                             | Description                                           | Assigned To  | Status      |
| ------- | ------------------------------------- | ----------------------------------------------------- | ------------ | ----------- |
| 5.1     | Design Team Model                     | Create database schema for teams within organizations | Backend Dev  | Completed   |
| 5.2     | Implement Create Team API             | Develop REST API for creating new teams               | Backend Dev  | Completed   |
| 5.3     | Create Team Creation Interface        | Design and implement UI for creating teams            | Frontend Dev | To Do       |
| 5.4     | Implement Team Member Assignment API  | Develop API for assigning members to teams            | Backend Dev  | In Progress |
| 5.5     | Create Team Member Management UI      | Implement interface for managing team members         | Frontend Dev | To Do       |
| 5.6     | Implement Team Roles and Permissions  | Add role-based access control within teams            | Backend Dev  | In Progress |
| 5.7     | Create Team Dashboard                 | Design and implement team-specific dashboard          | Frontend Dev | Completed   |
| 5.8     | Implement Team Update and Delete APIs | Develop APIs for updating and deleting teams          | Backend Dev  | To Do       |
| 5.9     | Add Team Edit and Delete UI           | Implement interfaces for editing and deleting teams   | Frontend Dev | To Do       |
| 5.10    | Create Team Activity Log              | Implement logging system for team activities          | Full Stack   | To Do       |

## Sprint 6: Payment Integration and Subscription Management

### Sprint Goal

Integrate payment system and implement subscription management for organizations.

| Task ID | Task Name                            | Description                                                 | Assigned To  | Status    |
| ------- | ------------------------------------ | ----------------------------------------------------------- | ------------ | --------- |
| 6.1     | Design Subscription Model            | Create database schema for subscription plans               | Backend Dev  | Completed |
| 6.2     | Integrate Payment Gateway API        | Set up and integrate chosen payment gateway                 | Backend Dev  | Completed |
| 6.3     | Implement Subscription Purchase API  | Develop API for purchasing organization subscriptions       | Backend Dev  | Completed |
| 6.4     | Create Subscription Management UI    | Design and implement UI for managing subscriptions          | Frontend Dev | Completed |
| 6.5     | Implement Payment Processing Logic   | Develop backend logic for processing payments               | Backend Dev  | Completed |
| 6.6     | Create Payment UI                    | Design and implement payment interface                      | Frontend Dev | Completed |
| 6.7     | Implement Subscription Renewal Logic | Add logic for automatic subscription renewals               | Backend Dev  | Completed |
| 6.8     | Create Billing History API           | Develop API for retrieving billing history                  | Backend Dev  | Completed |
| 6.9     | Implement Billing History UI         | Design and implement billing history interface              | Frontend Dev | Completed |
| 6.10    | Add Payment Notification System      | Implement system for payment and subscription notifications | Full Stack   | Completed |

# Project Sprints: User Management and Organization System (Continued)

## Sprint 7: Reporting and Analytics

### Sprint Goal

Implement comprehensive reporting and analytics features for organizations and administrators.

| Task ID | Task Name                               | Description                                           | Assigned To    | Status |
| ------- | --------------------------------------- | ----------------------------------------------------- | -------------- | ------ |
| 7.1     | Design Analytics Dashboard              | Create wireframes for the analytics dashboard         | UI/UX Designer | To Do  |
| 7.2     | Implement User Activity Tracking        | Develop backend system to track user activities       | Backend Dev    | To Do  |
| 7.3     | Create User Analytics API               | Develop API endpoints for user-related analytics      | Backend Dev    | To Do  |
| 7.4     | Implement Organization Analytics API    | Create API for organization-level analytics           | Backend Dev    | To Do  |
| 7.5     | Develop Analytics Dashboard Frontend    | Build the frontend for the analytics dashboard        | Frontend Dev   | To Do  |
| 7.6     | Create Custom Report Generator          | Implement a system for generating custom reports      | Full Stack     | To Do  |
| 7.7     | Implement Data Visualization Components | Develop reusable charts and graphs components         | Frontend Dev   | To Do  |
| 7.8     | Create PDF Report Export Feature        | Add functionality to export reports as PDFs           | Backend Dev    | To Do  |
| 7.9     | Implement Real-time Analytics Updates   | Add WebSocket support for real-time analytics updates | Full Stack     | To Do  |
| 7.10    | Create Analytics Access Control         | Implement role-based access to analytics features     | Backend Dev    | To Do  |

## Sprint 8: Advanced Search and Filtering

### Sprint Goal

Enhance the application with advanced search and filtering capabilities across all major features.

| Task ID | Task Name                             | Description                                                 | Assigned To    | Status |
| ------- | ------------------------------------- | ----------------------------------------------------------- | -------------- | ------ |
| 8.1     | Design Search UI Components           | Create reusable search and filter UI components             | UI/UX Designer | To Do  |
| 8.2     | Implement Backend Search API          | Develop a robust search API with multiple parameters        | Backend Dev    | To Do  |
| 8.3     | Create Full-text Search Functionality | Implement full-text search capabilities in the backend      | Backend Dev    | To Do  |
| 8.4     | Develop Frontend Search Components    | Build frontend components for advanced search and filtering | Frontend Dev   | To Do  |
| 8.5     | Implement Search History Feature      | Add functionality to save and reuse search queries          | Full Stack     | To Do  |
| 8.6     | Create Filtered Views for Dashboards  | Implement filtered views in various dashboards              | Frontend Dev   | To Do  |
| 8.7     | Optimize Search Performance           | Improve search speed and efficiency                         | Backend Dev    | To Do  |
| 8.8     | Implement Faceted Search              | Add faceted search capabilities to refine search results    | Full Stack     | To Do  |
| 8.9     | Create Search Analytics               | Develop analytics for tracking popular searches             | Backend Dev    | To Do  |
| 8.10    | Implement Search Permissions          | Add role-based permissions for search capabilities          | Backend Dev    | To Do  |

## Sprint 9: Integration and API Development

### Sprint Goal

Develop a robust API for third-party integrations and create integrations with popular services.

| Task ID | Task Name                             | Description                                                      | Assigned To      | Status |
| ------- | ------------------------------------- | ---------------------------------------------------------------- | ---------------- | ------ |
| 9.1     | Design Public API Architecture        | Plan the structure and endpoints for the public API              | System Architect | To Do  |
| 9.2     | Implement API Authentication          | Develop secure authentication for API access                     | Backend Dev      | To Do  |
| 9.3     | Create API Documentation              | Write comprehensive documentation for the public API             | Technical Writer | To Do  |
| 9.4     | Develop API Rate Limiting             | Implement rate limiting for API requests                         | Backend Dev      | To Do  |
| 9.5     | Create API Dashboard for Developers   | Build a dashboard for developers to manage API access            | Frontend Dev     | To Do  |
| 9.6     | Implement Webhook System              | Develop a system for sending webhooks to integrated applications | Backend Dev      | To Do  |
| 9.7     | Create Slack Integration              | Develop an integration with Slack for notifications              | Full Stack       | To Do  |
| 9.8     | Implement Google Calendar Integration | Add functionality to sync with Google Calendar                   | Full Stack       | To Do  |
| 9.9     | Develop API Analytics                 | Create a system to track API usage and performance               | Backend Dev      | To Do  |
| 9.10    | Build API Playground                  | Develop an interactive API testing environment for developers    | Frontend Dev     | To Do  |

## **Technologies Used**

- **Backend:** Node.js, Express, TypeScript
- **Frontend:** React with ShadCN, Axios, TanStack React Query, TanStack Tables, Zustand, and Zod
  - **ShadCN:** For streamlined and customizable UI components.
  - **Axios:** To handle HTTP requests for efficient data fetching.
  - **TanStack React Query:** For managing server state and caching API responses.
  - **TanStack Tables:** For creating dynamic and customizable data tables.
  - **Zustand:** For lightweight and scalable state management.
  - **Zod:** For schema validation and ensuring data integrity.
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens), Role-Based Access Control (RBAC)
- **Hosting:**
  - **Backend:** AWS EC2 instance with VPC, subnets, and route tables configured.
  - **Frontend:** AWS Amplify for HTTPS-enabled hosting.
  - **Storage:** AWS S3 bucket for image storage.
  - **Email:** Google Gmail Apps for email communication.
- **Payments:** Stripe and MTN Mobile Money for subscription processing. Webhooks are used for real-time payment updates and notifications.
  - **Why Webhooks?** Webhooks ensure immediate notification and synchronization of payment statuses between the payment gateways and the platform.
- **Version Control:** Git
- **Project Management:** Jira, Trello
- **Deployment:** CI/CD pipelines for automated deployments to the EC2 instance.

## **System Architecture**

[Section for diagrams such as system architecture, component diagrams, and deployment diagrams.]

## **Software Development Life Cycle (SDLC)**

### **1. Introduction to SDLC**

The development of ElectroFix follows the Agile methodology to ensure flexibility and adaptability to user requirements. Agile's iterative nature allows for frequent feedback and continuous improvement throughout the development cycle.

### **2. Phases of SDLC**

#### a. **Planning**

- Identified user requirements through surveys and stakeholder interviews.
- Defined project goals and deliverables.

#### b. **Requirements Analysis**

- Collected functional and non-functional requirements.
- Documented requirements in user stories and use case diagrams.

#### c. **System Design**

- Created system architecture diagrams, database schemas (ER diagrams), and wireframes for the user interface.

#### d. **Development**

- Used Node.js and TypeScript for backend APIs and React for the frontend interface.
- Implemented modular and scalable code architecture.

#### e. **Testing**

- Conducted unit testing, integration testing, and user acceptance testing (UAT).
- Ensured compatibility across devices and browsers.

#### f. **Deployment**

- Deployed the application on cloud hosting platforms.
- Configured CI/CD pipelines for automated deployments.

#### g. **Maintenance**

- Established a feedback loop for bug reporting and feature requests.
- Scheduled regular updates and system performance monitoring.

### **3. Tools Used in SDLC**

- **Project Management:** Jira, Trello
- **Development:** Visual Studio Code, Postman
- **Design:** Figma, Lucidchart
- **Testing:** Jest, Selenium
- **Deployment:** Docker, Kubernetes

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

## React Frontend Development Guidelines

### Naming Conventions

- Components
- Hooks: `camelCase` (e.g., `useAuth.ts`)
- Files: `kebab-case` (e.g., `user-card.tsx`)

### Coding Standards

- Use TypeScript for type safety.
- Functional components with React Hooks.
- Decentralize API calls.

## Node.js Backend Development Guidelines

### Naming Conventions

- Controllers: `PascalCase` (e.g., `UserController.ts`)
- Services: `PascalCase` (e.g., `UserService.ts`)
- Models: `PascalCase` (e.g., `UserModel.ts`)
- Routes: `PascalCase` (e.g., `UserRoutes.ts`)
- Utitilies: `kebab-case` (e.g., `send-mailer.ts`)

### Code Standards

- Use TypeScript for type safety.
- Adhere to RESTful principles.
- Use Mongoose for MongoDB models.

### Example File: `UserController.ts`

```typescript
import { Request, Response } from "express";
import { UserService } from "services/UserService";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Get a user by ID
   * @param req Express request object
   * @param res Express response object
   */
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const user = await this.userService.getUserById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json(user);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error fetching user", error: error.message });
    }
  }
}
```

## **Implementation Details**

### **Core Features**

- **Organization Management:** Users can create organizations and manage memberships and roles.
- **User Interaction:** Users can browse organizations, view ratings, and select organizations or technicians for repairs.
- **Repair Workflow:**
  - Users can report repair issues for their machines.
  - Diagnostic reports are generated after a thorough diagnosis.
  - Intervention reports detail the repair process.
  - The intervention report is used to create an invoice for the repair, which is sent to the user.

## **Challenges and Solutions**

During the research, we found that organizational hierarchy often supports having a system to contract repair activities, but technicians were resistant. Employees expressed reluctance to handle repairs and record activities digitally. This resistance was especially pronounced in small organizations. Furthermore, many organizations lack a company website and primarily operate through Facebook, showing hesitation in adopting a digital system. To address these challenges, we:

- Conducted awareness campaigns to highlight the benefits of digitization.
- Focused on creating an intuitive user interface to minimize learning curves.
- Introduced pilot testing and incremental implementation to build trust with stakeholders.

## **Testing and Results**

[Details on testing strategies, tools, and outcomes. Include any relevant metrics or screenshots.]

## **Conclusion**

ElectroFix successfully addresses the needs of electronic repair shops in Cameroon by providing a robust, scalable, and user-friendly platform. By following Agile SDLC, the project maintained high adaptability to requirements and delivered a quality solution.

## **Future Enhancements**

1. Introduce advanced subscription plans for organizations.
2. Implement analytics and reporting dashboards.
3. Add multilingual support for a broader audience.
4. Expand the platform to cover additional industries beyond electronic repairs.

---

### **Diagrams Section**

#### 1. UML Diagrams

- Use Case Diagrams
- Sequence Diagrams
- Class Diagrams

#### 2. ER Diagrams

[Space to include database design and entity relationships.]

#### 3. Other Diagrams

- Component Diagrams
- Deployment Diagrams

### **Key Resources Referenced**

1. **Bun Ecosystem PM2 Guide**
   Bun Ecosystem Documentation. [link](https://bun.sh/guides/ecosystem/pm2)

2. **Bun CI/CD Guide**
   Bun Runtime Documentation. [link](https://bun.sh/guides/runtime/cicd)

3. **Using GitHub Actions with Bun**
   Jonas Scholz, _Posted on 7 Oct 2023_. [link](https://dev.to/code42cate/using-github-actions-with-bun-g0o)

4. **Deploy React App to AWS Amplify**
   AWS Getting Started Guide. [link](https://aws.amazon.com/getting-started/hands-on/build-react-app-amplify-graphql/module-one/)

5. **React TypeScript Vite Amplify Setup**
   Lloyd Marcelino, _Posted on 8 May 2023, Edited on_. [link](https://dev.to/ethanlloyd21/react-typescript-vite-amplify-setup-052023-25ge)

6. **Vite Setup on AWS Tutorial**
   YouTube Tutorial. [link](https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://www.youtube.com/watch%3Fv%3DwwZy_K3LORQ&ved=2ahUKEwit0qGX_-yKAxW_0gIHHQ6dMTkQwqsBegQIDxAF&usg=AOvVaw18Uv0anqfgaBNK9DnUCnqB)

7. **Working with AWS S3 using Node.js**
   Mahtab Haider, _Posted on 2 Nov 2024_. [link](https://medium.com/@haider.mtech2011/how-to-work-with-aws-s3-using-node-js-a7eecf194cc5)

8. **Setting Up a Custom VPC for AWS Projects**
   Gabriel Okom, _Posted on 19 Apr 2024_. [link](https://ougabriel.medium.com/how-to-set-up-a-customvpc-for-your-aws-project-and-deploy-ec2-instances-with-private-and-public-cdbd9afc8aaf)

9. **Adding SEO feature to React**
   Geeks For Geeks Okom, _Posted on 31 Jul 2024_. [link](https://www.geeksforgeeks.org/react-helmet-seo-for-reactjs-apps/)
