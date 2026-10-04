# 📦 Product Inventory Management System

> A full-stack MERN application for managing products, inventory, suppliers, categories, users, and stock movement with secure authentication, role-based access control, and intelligent reorder recommendations.

![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-Backend-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933?style=for-the-badge&logo=node.js&logoColor=white)

---

## 📌 Overview

The **Product Inventory Management System** is a full-stack web application developed using the **MERN stack**.

The system provides a centralized platform for managing products, categories, suppliers, inventory levels, and stock transactions.

It includes secure user authentication and **role-based access control**, allowing administrators to perform management operations while staff members have controlled access to inventory information.

A major feature of the application is the **Smart Reorder Recommendation System**, which analyzes recent inventory movement and provides data-driven recommendations for stock replenishment.

---

## ✨ Key Features

### 🔐 Authentication & Security

- User registration and login
- JWT-based authentication
- Role-based authorization
- Admin and Staff roles
- Google authentication
- Forgot password functionality
- Secure password reset using temporary tokens
- Password hashing
- Protected API routes

---

### 👥 Role-Based Access Control

The application provides different permissions based on the user's role.

| Feature | Admin | Staff |
|---|:---:|:---:|
| View Dashboard | ✅ | ✅ |
| View Products | ✅ | ✅ |
| Add Products | ✅ | ❌ |
| Edit Products | ✅ | ❌ |
| Delete Products | ✅ | ❌ |
| View Categories | ✅ | ✅ |
| Manage Categories | ✅ | ❌ |
| View Suppliers | ✅ | ✅ |
| Manage Suppliers | ✅ | ❌ |
| View Inventory | ✅ | ✅ |
| Record Stock Movement | ✅ | ❌ |
| View Transaction History | ✅ | ✅ |
| View Smart Reorder Recommendations | ✅ | ✅ |

---

## 📊 Dashboard

The dashboard provides a centralized overview of inventory operations.

It includes:

- Total products
- Inventory statistics
- Stock information
- Low-stock information
- Inventory movement
- Smart reorder recommendations
- Navigation to major application modules

---

## 📦 Product Management

Administrators can manage products throughout the system.

### Product Operations

- Add new products
- Update product information
- Delete products
- View product details
- Search products
- Filter products
- Assign categories
- Assign suppliers
- Track stock quantity
- Configure minimum stock levels

Staff members can view product information but cannot perform product management operations.

---

## 🏷️ Category Management

The category module helps organize products into meaningful groups.

Administrators can:

- Create categories
- Update categories
- Delete categories
- Search categories
- View category information

Staff members have read-only access to categories.

---

## 🚚 Supplier Management

The supplier module maintains supplier information associated with products.

Administrators can:

- Add suppliers
- Update supplier details
- Delete suppliers
- View suppliers
- Search suppliers

Products can be associated with suppliers using MongoDB references.

---

## 📈 Inventory Management

The inventory module tracks stock movement throughout the system.

Administrators can record:

- Stock IN
- Stock OUT
- Quantity
- Product
- Inventory transactions

The system maintains transaction history so that inventory activity can be reviewed.

Staff members can view inventory information and transaction history but cannot record stock movements.

---

# 🧠 Smart Reorder Recommendation System

The **Smart Reorder Recommendation System** is one of the main features of the application.

Instead of relying only on the current stock quantity, the system analyzes recent **Stock OUT transactions** to estimate short-term demand.

The system uses the previous **30 days of inventory movement** to generate reorder recommendations.

### How It Works

#### 1. Calculate Total Demand

The system calculates the total quantity of products that went OUT during the last 30 days.

```text
Total OUT Quantity
= Sum of Stock OUT transactions
```

#### 2. Calculate Average Daily Demand

```text
Average Daily Demand
= Total OUT Quantity / 30
```

#### 3. Estimate Seven-Day Demand

```text
Expected 7-Day Demand
= Average Daily Demand × 7
```

#### 4. Determine Target Stock

The product's minimum stock level is used as the safety stock.

```text
Safety Stock
= Minimum Stock

Target Stock
= Safety Stock + Expected 7-Day Demand
```

#### 5. Calculate Recommended Order

```text
Recommended Order
= Target Stock - Current Stock
```

If the calculated recommendation is negative, the system returns zero because no additional stock is required.

### Stock Status

| Status | Meaning |
|---|---|
| 🟢 **HEALTHY** | Current stock is sufficient |
| 🟠 **REORDER** | Additional stock should be ordered |
| 🔴 **URGENT** | Current stock has reached or fallen below the minimum stock level |

This feature provides a simple data-driven approach to inventory replenishment.

---

## 🔄 Inventory Workflow

```text
                    ┌──────────────────┐
                    │      Product     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Inventory Record │
                    └────────┬─────────┘
                             │
                ┌────────────┴────────────┐
                ▼                         ▼
          ┌──────────┐              ┌───────────┐
          │ STOCK IN │              │ STOCK OUT │
          └────┬─────┘              └─────┬─────┘
               │                          │
               └────────────┬─────────────┘
                            ▼
                 ┌─────────────────────┐
                 │ Transaction History │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Smart Reorder Logic │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Reorder Recommendation │
                 └─────────────────────┘
```

---

# 🏗️ System Architecture

```text
┌───────────────────────────────────────────────┐
│                 React Frontend                │
│                                               │
│ Dashboard | Products | Inventory | Suppliers │
│ Categories | Authentication | User Interface │
└───────────────────────┬───────────────────────┘
                        │
                        │ REST API
                        ▼
┌───────────────────────────────────────────────┐
│              Express.js + Node.js             │
│                                               │
│ Routes → Controllers → Middleware → Models   │
│                                               │
│ JWT Authentication                            │
│ Role-Based Authorization                      │
│ Inventory Business Logic                      │
└───────────────────────┬───────────────────────┘
                        │
                        │ Mongoose
                        ▼
┌───────────────────────────────────────────────┐
│                    MongoDB                    │
│                                               │
│ Users | Products | Categories | Suppliers    │
│ Inventory Transactions                        │
└───────────────────────────────────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

- React.js
- React Router
- Axios
- JavaScript
- CSS
- Vite

## Backend

- Node.js
- Express.js
- REST API
- JWT
- Nodemailer
- Google OAuth

## Database

- MongoDB
- Mongoose

## Development Tools

- Visual Studio Code
- Git
- GitHub
- Postman
- MongoDB

---

# 📁 Project Structure

```text
product-inventory-management/
│
├── Backend/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── inventoryController.js
│   │   ├── productController.js
│   │   └── supplierController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   │
│   ├── migrations/
│   │   ├── migrateProductCategories.js
│   │   └── migrateProductSuppliers.js
│   │
│   ├── models/
│   │   ├── Category.js
│   │   ├── InventoryTransaction.js
│   │   ├── Product.js
│   │   ├── Supplier.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── inventoryRoutes.js
│   │   ├── productRoutes.js
│   │   └── supplierRoutes.js
│   │
│   ├── package.json
│   └── server.js
│
├── Frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

# 🚀 Getting Started

Follow the steps below to run the project locally.

## 1. Clone the Repository

```bash
git clone https://github.com/Disha-dot-13/product-inventory-management.git
```

Navigate into the project:

```bash
cd product-inventory-management
```

---

# ⚙️ Backend Setup

Navigate to the Backend directory:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `Backend` folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=your_google_client_id

EMAIL_USER=your_gmail_address

EMAIL_PASS=your_gmail_app_password

FRONTEND_URL=http://localhost:5173
```

> ⚠️ **Important:** Never commit your `.env` file to GitHub.

Start the backend:

```bash
npm start
```

The backend will run on:

```text
http://localhost:5000
```

---

# 💻 Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

# 🔑 Authentication Flow

```text
User
 │
 ▼
Login / Register
 │
 ▼
Backend Authentication
 │
 ▼
Password Verification
 │
 ▼
JWT Token Generated
 │
 ▼
Authenticated Session
 │
 ▼
Protected Routes
 │
 ▼
Role Authorization
 │
 ├─────────────────┐
 ▼                 ▼
ADMIN             STAFF
 │                 │
 ▼                 ▼
Full Access     Read Access
```

---

# 🔐 Password Recovery

The application provides a password recovery workflow using temporary reset tokens.

```text
Forgot Password
       │
       ▼
Enter Email
       │
       ▼
Generate Reset Token
       │
       ▼
Store Hashed Token
       │
       ▼
Send Reset Email
       │
       ▼
Open Reset Link
       │
       ▼
Create New Password
       │
       ▼
Password Updated
```

Reset tokens are temporary and expire after a limited period.

---

# 🔌 API Modules

The backend provides REST API endpoints for the major application modules.

```text
/api/auth
/api/products
/api/inventory
/api/categories
/api/suppliers
```

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/google
POST /api/auth/forgot-password
POST /api/auth/reset-password/:token
```

### Products

```text
GET    /api/products
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Categories

```text
GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

### Suppliers

```text
GET    /api/suppliers
POST   /api/suppliers
PUT    /api/suppliers/:id
DELETE /api/suppliers/:id
```

### Inventory

```text
GET  /api/inventory
POST /api/inventory
```

The inventory module also provides transaction history, inventory summaries, and smart reorder recommendations.

---

# 🧪 Testing

The backend APIs can be tested using tools such as **Postman**.

Important areas to test include:

- User registration
- User login
- JWT authentication
- Role authorization
- Product CRUD operations
- Category management
- Supplier management
- Stock IN
- Stock OUT
- Transaction history
- Smart reorder recommendations
- Forgot password
- Password reset

---

# 🛡️ Security

The application implements several security practices:

- JWT-based authentication
- Password hashing
- Protected API routes
- Role-based authorization
- Temporary password-reset tokens
- Expiring password-reset tokens
- Environment variables for sensitive configuration
- Restricted administrative operations
- CORS configuration

Sensitive credentials such as database connection strings, JWT secrets, and email app passwords are stored using environment variables rather than directly in the source code.

---

# 🎯 Project Objectives

The main objectives of this project are to:

1. Build a centralized inventory management platform.
2. Simplify product and stock management.
3. Implement secure authentication and authorization.
4. Provide separate permissions for Admin and Staff users.
5. Track inventory transactions.
6. Monitor stock levels.
7. Provide data-driven reorder recommendations.
8. Provide a responsive and user-friendly interface.
9. Demonstrate full-stack MERN development.

---

# 🌟 Project Highlights

### Full-Stack MERN Architecture

The project demonstrates integration between the frontend, backend, and database:

```text
React
  ↓
Axios / REST API
  ↓
Express.js
  ↓
Node.js
  ↓
Mongoose
  ↓
MongoDB
```

### Smart Inventory Management

The Smart Reorder Recommendation System analyzes recent inventory movement and estimates short-term demand to recommend whether additional stock may be required.

### Role-Based Access

The application provides different capabilities to Admin and Staff users based on their assigned roles.

### Secure Authentication

The application includes JWT authentication, protected routes, Google authentication, and password recovery functionality.

---

# 🔮 Future Enhancement

- 🧠 **Smart Reorder Recommendation System** – Further improve inventory demand analysis and reorder recommendations using more advanced prediction techniques.

---

# 👩‍💻 Author

## Disha Shetty

**Bachelor's Degree in Data Science**  
**PES College of Engineering, Mandya**

---

# 📄 License

This project is developed for educational and portfolio purposes.

---

## ⭐ Project

**Product Inventory Management System**

**Built with ❤️ using the MERN Stack**