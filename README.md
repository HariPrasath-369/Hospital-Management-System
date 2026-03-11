# Hospital Appointment System

This is a full-stack Hospital Appointment and Doctor Scheduling System built with React, Spring Boot, and PostgreSQL.

## Features

- **Role-Based Access**: Separate portals for Admin, Doctor, and Patient.
- **Appointment Booking**: Patients can search for doctors and book available time slots.
- **Overlap Prevention**: Backend automatically rejects conflicting appointments.
- **Schedule Management**: Doctors can create availability slots and confirm/complete appointments.
- **Reporting**: Admins can view system-wide stats and revenue reports.

## Tech Stack

- **Backend**: Java 21, Spring Boot 3.4.3, Spring Security, Spring Data JPA, PostgreSQL
- **Frontend**: React 18, React Router v6, Tailwind CSS, Axios, Lucide React

## Setup Instructions

### 1. Database Setup
1. Ensure PostgreSQL is installed and running.
2. Create a database named `hospital_db`:
   ```sql
   CREATE DATABASE hospital_db;
   ```
3. Default credentials expected by the application:
   - Username: `postgres`
   - Password: `postgres`
   *(Update `application.properties` in the backend if your credentials differ)*

### 2. Backend Setup
1. Navigate to the `backend` directory.
2. Run the application using Maven:
   ```bash
   # Windows
   ./mvnw.cmd spring-boot:run
   
   # Mac/Linux
   ./mvnw spring-boot:run
   ```
   *The backend will start on `http://localhost:8080`. Hibernate will automatically create the tables.*

### 3. Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   *The frontend will open in your browser at `http://localhost:3000`.*

## Testing the Application

1. Open `http://localhost:3000` in your browser.
2. Click **Register** to create accounts:
   - Create an `ADMIN` account.
   - Create a `DOCTOR` account (requires Specialization).
   - Create a `PATIENT` account.
3. **Login as Doctor**: Add available slots for today via the dashboard.
4. **Login as Patient**: Search for the doctor, view their slots, and book an appointment.
5. **Login as Doctor**: Confirm or Complete the booked appointment.
6. **Login as Admin**: View the aggregated statistics and reports.
