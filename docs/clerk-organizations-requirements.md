# Clerk Organizations Requirements Document

## Current State (Assumed)
The current application likely uses a flat role-based system or a simple user-level role assignment. This document outlines the transition to a more robust organization-based role management using Clerk Organizations.

## New Requirement: Clerk Organizations for Role Management

### 1. Organization Types
We will introduce two primary types of organizations:
*   **Host Organizations:** These organizations are responsible for hosting events.
*   **Attendee Organizations:** These organizations represent groups of attendees or individual attendees.

### 2. User Roles within Organizations
Within each organization, users can have specific roles. For the initial implementation, we will define two main roles:
*   **Admin:** Has full administrative privileges within that specific organization (e.g., managing members, editing organization details, managing events for a Host Org).
*   **Member:** A standard user within the organization with limited privileges (e.g., viewing organization details, participating in events for an Attendee Org).

### 3. Global User Roles (if applicable)
There might be global roles outside of specific organizations, such as a "Super Admin" who can manage all organizations and users across the platform. This document focuses on organization-specific roles, but global roles should be considered for integration.

### 4. Specific User Role Combinations

#### 4.1. Host Admin
A user who is an 'Admin' within a 'Host Organization'. This user can manage the host organization and its associated events.

#### 4.2. Attendee Admin
A user who is an 'Admin' within an 'Attendee Organization'. This user can manage the attendee organization and its members.

#### 4.3. Host Member
A user who is a 'Member' within a 'Host Organization'. This user can participate in hosting activities but without administrative control over the organization.

#### 4.4. Attendee Member
A user who is a 'Member' within an 'Attendee Organization'. This user can attend events and participate as a standard attendee.

### 5. Edge Case: User as both Host and Attendee

A critical requirement is to support users who need to act as both a host and an attendee simultaneously. This means a single user account can be:
*   A 'Member' (or 'Admin') of one or more 'Host Organizations'.
*   A 'Member' (or 'Admin') of one or more 'Attendee Organizations'.

The system must allow the user to seamlessly switch contexts or have their permissions aggregated to reflect their combined roles. For example, a user might host an event through their Host Organization and also attend an event as part of their Attendee Organization. The UI and backend logic must accommodate this dual identity without requiring separate accounts.

### 6. Implementation Considerations
*   Utilize Clerk's Organization features for creating and managing organizations and assigning roles to users within them.
*   Update authentication and authorization middleware to check for organization-specific roles.
*   Modify UI components (e.g., dashboards, navigation) to reflect the user's current active organization and roles.
*   Ensure data models are updated to link events and other resources to organizations rather than just individual users.
