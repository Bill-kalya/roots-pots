# Roots & Pots - Backend API Specification

## Base URL
```
http://localhost:8080/api
```

---

## Authentication
All requests should include:
```
Authorization: Bearer {token}
Content-Type: application/json
```

---

# 1. RESTAURANTS

## Get All Restaurants
```
GET /restaurants
```
**Response:**
```json
[
  {
    "id": "rest-1",
    "name": "Roots & Pots",
    "description": "Garden restaurant",
    "address": "123 Main St, Nairobi",
    "latitude": -1.2921,
    "longitude": 36.8219,
    "heroImage": "https://...",
    "modelUrl": "https://..."
  }
]
```

## Get Restaurant by ID
```
GET /restaurants/{id}
```

---

# 2. TABLES

## Get All Tables for Restaurant
```
GET /restaurants/{restaurantId}/tables
```
**Response:**
```json
[
  {
    "id": "table-1",
    "tableNumber": 1,
    "seats": 4,
    "x": 25,
    "y": 30,
    "zone": "Garden",
    "active": true,
    "available": true
  }
]
```

## Get Table Availability
```
GET /restaurants/{restaurantId}/availability?date=2026-07-06
```
**Response:**
```json
[
  {
    "id": "table-1",
    "tableNumber": 1,
    "available": true,
    "availableSlots": ["12:00", "14:00", "19:00", "20:30"]
  }
]
```

## Get Single Table
```
GET /tables/{tableId}
```

---

# 3. MENU

## Get All Menu Items
```
GET /menu
```
**Response:**
```json
[
  {
    "id": "item-1",
    "name": "Grilled Fish",
    "description": "Fresh grilled fish with herbs",
    "category": "Main",
    "price": 1500,
    "image_url": "https://...",
    "available": true,
    "preparationTime": 20
  }
]
```

## Get Menu by Category
```
GET /menu?category=Main
```

## Get Single Menu Item
```
GET /menu/{itemId}
```

---

# 4. RESERVATIONS

## Create Reservation
```
POST /reservations
Content-Type: application/json

{
  "tableId": "table-1",
  "customerName": "John Doe",
  "customerPhone": "+254712345678",
  "date": "2026-07-06",
  "time": "19:00"
}
```
**Response:**
```json
{
  "id": "res-123",
  "tableId": "table-1",
  "tableNumber": 1,
  "customerName": "John Doe",
  "date": "2026-07-06",
  "time": "19:00",
  "status": "PENDING_PAYMENT"
}
```

## Get Reservation by ID
```
GET /reservations/{reservationId}
```

---

# 5. ORDERS

## Create Order
```
POST /orders
Content-Type: application/json

{
  "reservationId": "res-123",
  "items": [
    {
      "menuItemId": "item-1",
      "quantity": 2,
      "notes": "No onions"
    }
  ]
}
```
**Response:**
```json
{
  "id": "order-456",
  "reservationId": "res-123",
  "items": [
    {
      "id": "order-item-1",
      "name": "Grilled Fish",
      "quantity": 2,
      "price": 1500,
      "subtotal": 3000
    }
  ],
  "status": "PAID",
  "subtotal": 3000,
  "tax": 540,
  "total": 3540,
  "createdAt": "2026-07-06T19:00:00Z"
}
```

## Get Order by ID
```
GET /orders/{orderId}
```

## Update Order Status
```
PATCH /orders/{orderId}
Content-Type: application/json

{
  "status": "PREPARING"
}
```
**Status Values:** `PAID`, `PREPARING`, `READY`, `SERVED`, `COMPLETED`, `CANCELLED`

---

# 6. PAYMENTS

## Create Payment
```
POST /payments
Content-Type: application/json

{
  "reservationId": "res-123",
  "amount": 3540,
  "currency": "KES",
  "paymentMethod": "MPESA",
  "status": "PROCESSING"
}
```
**Response:**
```json
{
  "id": "pay-789",
  "reservationId": "res-123",
  "amount": 3540,
  "currency": "KES",
  "status": "PROCESSING",
  "paymentMethod": "MPESA",
  "transactionReference": null,
  "createdAt": "2026-07-06T19:00:00Z"
}
```

## Get Payment by ID
```
GET /payments/{paymentId}
```

## Process M-Pesa Payment (Callback)
```
POST /payments/{paymentId}/verify-mpesa
Content-Type: application/json

{
  "transactionReference": "LIJ1234567890",
  "amount": 3540,
  "status": "SUCCESS"
}
```
**Response:**
```json
{
  "id": "pay-789",
  "status": "COMPLETED",
  "transactionReference": "LIJ1234567890",
  "paidAt": "2026-07-06T19:05:00Z"
}
```

---

# 7. ADMIN - RESERVATIONS

## Get All Reservations (Paginated)
```
GET /admin/reservations?page=0&size=20&date=2026-07-06
```
**Response:**
```json
{
  "content": [
    {
      "id": "res-123",
      "tableNumber": 1,
      "customerName": "John Doe",
      "customerPhone": "+254712345678",
      "date": "2026-07-06",
      "time": "19:00",
      "status": "CONFIRMED"
    }
  ],
  "totalElements": 45,
  "totalPages": 3
}
```

## Update Reservation Status
```
PATCH /admin/reservations/{reservationId}
Content-Type: application/json

{
  "status": "CHECKED_IN"
}
```
**Status Values:** `PENDING_PAYMENT`, `CONFIRMED`, `CHECKED_IN`, `COMPLETED`, `CANCELLED`, `NO_SHOW`

## Get Reservation Statistics
```
GET /admin/stats
```
**Response:**
```json
{
  "total": 150,
  "today": 12,
  "confirmed": 10,
  "checkedIn": 3,
  "availableTables": 8,
  "occupiedTables": 4,
  "revenue": 45000
}
```

---

# 8. ADMIN - ORDERS

## Get All Orders (Paginated)
```
GET /admin/orders?page=0&size=20&date=2026-07-06&status=PREPARING
```
**Response:**
```json
{
  "content": [
    {
      "id": "order-456",
      "tableNumber": 1,
      "items": [
        {
          "name": "Grilled Fish",
          "quantity": 2,
          "price": 1500
        }
      ],
      "status": "PREPARING",
      "total": 3540,
      "createdAt": "2026-07-06T19:00:00Z"
    }
  ],
  "totalElements": 24,
  "totalPages": 2
}
```

## Get Orders by Date
```
GET /admin/orders?date=2026-07-06
```

## Get Orders by Table
```
GET /admin/orders/table/{tableNumber}
```

## Update Order Status
```
PATCH /admin/orders/{orderId}
Content-Type: application/json

{
  "status": "READY"
}
```
**Status Values:** `PAID`, `PREPARING`, `READY`, `SERVED`, `COMPLETED`, `CANCELLED`

## Get Order Statistics
```
GET /admin/orders/stats
```
**Response:**
```json
{
  "totalOrders": 24,
  "pending": 2,
  "preparing": 5,
  "ready": 3,
  "served": 14,
  "averagePreparationTime": 22,
  "totalRevenue": 85000
}
```

---

# 9. ADMIN - TABLES

## Create Table
```
POST /admin/tables
Content-Type: application/json

{
  "restaurantId": "rest-1",
  "tableNumber": 1,
  "capacity": 4,
  "floor": "Ground",
  "zone": "Garden"
}
```

## Batch Create Tables
```
POST /admin/tables/batch
Content-Type: application/json

{
  "tables": [
    {
      "tableNumber": 1,
      "seats": 4,
      "x": 25,
      "y": 30,
      "zone": "Garden"
    }
  ]
}
```

## Update Table
```
PATCH /admin/tables/{tableId}
Content-Type: application/json

{
  "status": "MAINTENANCE"
}
```
**Status Values:** `ACTIVE`, `INACTIVE`, `MAINTENANCE`, `RESERVED`

## Get All Tables
```
GET /admin/tables?restaurantId=rest-1
```

---

# 10. ADMIN - MENU

## Create Menu Item
```
POST /admin/menu
Content-Type: application/json

{
  "name": "Grilled Fish",
  "description": "Fresh fish with herbs",
  "category": "Main",
  "price": 1500,
  "image_url": "https://...",
  "available": true,
  "preparationTime": 20
}
```

## Update Menu Item
```
PATCH /admin/menu/{itemId}
Content-Type: application/json

{
  "price": 1600,
  "available": false
}
```

## Delete Menu Item
```
DELETE /admin/menu/{itemId}
```

## Get All Menu Items (Admin)
```
GET /admin/menu
```

---

# 11. ADMIN - RESTAURANTS

## Create Restaurant
```
POST /admin/restaurants
Content-Type: application/json

{
  "name": "Roots & Pots",
  "description": "Garden restaurant",
  "address": "123 Main St",
  "latitude": -1.2921,
  "longitude": 36.8219,
  "heroImage": "https://..."
}
```

## Update Restaurant
```
PATCH /admin/restaurants/{restaurantId}
```

## Get All Restaurants (Admin)
```
GET /admin/restaurants
```

---

# 12. PAYMENTS - ADMIN

## Get All Payments
```
GET /admin/payments?date=2026-07-06&status=COMPLETED
```
**Response:**
```json
[
  {
    "id": "pay-789",
    "reservationId": "res-123",
    "amount": 3540,
    "currency": "KES",
    "status": "COMPLETED",
    "paymentMethod": "MPESA",
    "transactionReference": "LIJ1234567890",
    "paidAt": "2026-07-06T19:05:00Z",
    "createdAt": "2026-07-06T19:00:00Z"
  }
]
```

## Get Payment Statistics
```
GET /admin/payments/stats
```
**Response:**
```json
{
  "totalTransactions": 45,
  "totalRevenue": 250000,
  "completedPayments": 42,
  "pendingPayments": 2,
  "failedPayments": 1,
  "averageTransactionAmount": 5555
}
```

---

# 13. WEBSOCKET (Real-Time Updates)

## Connect to WebSocket
```
WS ws://localhost:8080/ws/kitchen
WS ws://localhost:8080/ws/waiter
```

## Kitchen Events
```json
{
  "type": "NEW_ORDER",
  "data": {
    "orderId": "order-456",
    "tableNumber": 1,
    "items": [{"name": "Grilled Fish", "quantity": 2}],
    "timestamp": "2026-07-06T19:00:00Z"
  }
}
```

```json
{
  "type": "ORDER_STATUS_CHANGE",
  "data": {
    "orderId": "order-456",
    "status": "READY",
    "timestamp": "2026-07-06T19:20:00Z"
  }
}
```

## Waiter Events
```json
{
  "type": "ORDER_READY",
  "data": {
    "tableNumber": 1,
    "orderId": "order-456",
    "timestamp": "2026-07-06T19:20:00Z"
  }
}
```

```json
{
  "type": "TABLE_AVAILABLE",
  "data": {
    "tableNumber": 5,
    "timestamp": "2026-07-06T19:45:00Z"
  }
}
```

---

# 14. ERROR RESPONSES

All error responses follow this format:

```json
{
  "status": 400,
  "message": "Invalid request",
  "errors": [
    {
      "field": "customerName",
      "message": "Name is required"
    }
  ],
  "timestamp": "2026-07-06T19:00:00Z"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (e.g., table already reserved)
- `500` - Internal Server Error

---

# 15. REDIS USAGE

## Table Locking
When a customer selects a table, lock it for 10 minutes:
```
SETEX LOCK:TABLE:{tableId} 600 {reservationId}
```

Check if locked:
```
GET LOCK:TABLE:{tableId}
```

Release lock after payment:
```
DEL LOCK:TABLE:{tableId}
```

## Menu Cache
Cache menu items for 1 hour:
```
SETEX MENU:{itemId} 3600 {json_data}
```

## Order Status Pub/Sub
Publish order status changes:
```
PUBLISH ORDER_STATUS_CHANGE {orderId}:{status}
```

---

# 16. DATABASE SCHEMA (Flyway Migrations)

## V1__Initial_Schema.sql

```sql
CREATE TABLE restaurants (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  address VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  hero_image VARCHAR(500),
  model_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE restaurant_tables (
  id VARCHAR(36) PRIMARY KEY,
  restaurant_id VARCHAR(36) NOT NULL,
  table_number INT NOT NULL,
  capacity INT NOT NULL,
  floor VARCHAR(50),
  zone VARCHAR(100),
  status ENUM('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'RESERVED') DEFAULT 'ACTIVE',
  x DECIMAL(5, 2),
  y DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
  UNIQUE KEY unique_table_per_restaurant (restaurant_id, table_number)
);

CREATE TABLE menu_items (
  id VARCHAR(36) PRIMARY KEY,
  restaurant_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(500),
  available BOOLEAN DEFAULT true,
  preparation_time INT DEFAULT 15,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reservations (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  table_id VARCHAR(36) NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_start TIME NOT NULL,
  reservation_end TIME,
  guest_count INT DEFAULT 1,
  special_requests TEXT,
  status ENUM('PENDING_PAYMENT', 'CONFIRMED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED', 'NO_SHOW') DEFAULT 'PENDING_PAYMENT',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (table_id) REFERENCES restaurant_tables(id),
  INDEX idx_date_status (reservation_date, status)
);

CREATE TABLE orders (
  id VARCHAR(36) PRIMARY KEY,
  reservation_id VARCHAR(36) NOT NULL,
  order_number VARCHAR(20) UNIQUE,
  status ENUM('PAID', 'PREPARING', 'READY', 'SERVED', 'COMPLETED', 'CANCELLED') DEFAULT 'PAID',
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (reservation_id) REFERENCES reservations(id),
  INDEX idx_status (status)
);

CREATE TABLE order_items (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  menu_item_id VARCHAR(36) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

CREATE TABLE payments (
  id VARCHAR(36) PRIMARY KEY,
  reservation_id VARCHAR(36) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'KES',
  status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
  payment_method ENUM('MPESA', 'CARD', 'CASH') NOT NULL,
  transaction_reference VARCHAR(100),
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (reservation_id) REFERENCES reservations(id),
  INDEX idx_status (status)
);
```

---

# 17. IMPLEMENTATION NOTES

1. **Table Locking**: When a customer selects a table, use Redis to lock it for 10 minutes. If payment fails, release the lock.

2. **Order Status**: Orders should only transition through valid states:
   - PAID → PREPARING → READY → SERVED → COMPLETED
   - Any status → CANCELLED (at any point)

3. **Reservation Status**: After successful payment, set reservation to `CONFIRMED`. When customer arrives, mark as `CHECKED_IN`.

4. **WebSocket**: Use Spring WebSocket + Redis Pub/Sub to broadcast kitchen and waiter events.

5. **M-Pesa Integration**: Use M-Pesa STK Push for payment. Backend should have a callback endpoint to verify payment status.

6. **Tax Calculation**: 18% VAT on food items. Reservation deposit (500 KES) is non-taxable.

7. **Preparation Time**: Sum of all order items' preparation times = estimated wait time.

8. **Pagination**: All list endpoints should support `page`, `size`, `sort`, and filter parameters.

---
