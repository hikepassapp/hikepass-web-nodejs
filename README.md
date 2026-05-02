# 🏔️ HikePass API (Express + Prisma)

## 📌 Judul & Deskripsi

**HikePass API** adalah backend service berbasis **Express.js** untuk aplikasi pemesanan tiket pendakian gunung. Sistem ini mendukung fitur seperti:

* Manajemen user & autentikasi (JWT)
* Reservasi pendakian
* Check-in & check-out
* Manajemen gunung & kuota
* Laporan kejadian
* Informasi & berita event
* Paket wisata

Backend ini menggunakan **Prisma ORM** untuk manajemen database dan dirancang dengan arsitektur modular agar mudah dikembangkan.

---

## ⚙️ Tech Stack

* **Node.js**
* **Express.js**
* **MySQL** (via Docker)
* **Prisma ORM**
* **JWT Authentication**
* **Jest** (Testing)

---

## 📋 Prasyarat

Pastikan sudah terinstall:

* Node.js ≥ 18.x
* npm ≥ 9.x
* Docker & Docker Compose
* Git

---

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone <repository-url>
cd hikepass-web-nodejs
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Prisma

```bash
npx prisma generate
```

Jika database belum ada:

```bash
npx prisma migrate dev --name init
```

Jika migrasi dari database existing:

```bash
npx prisma db pull
```

---

## 🔐 Konfigurasi ENV

Buat file `.env` di root project:

```env
PORT=3000
DB_HOST=db
DB_PORT=3306
DB_USER=user
DB_PASSWORD=password
DB_NAME=hikepass
NODE_ENV=development

JWT_ACCESS_SECRET=access_secret_key
JWT_REFRESH_SECRET=refresh_secret_key

ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d

DATABASE_URL="mysql://user:password@db:3306/hikepass"
```

---

## ▶️ Cara Menjalankan

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Menggunakan Docker

```bash
docker-compose up --build
```

---

## 📡 Dokumentasi API

Contoh endpoint utama:

### 🔑 Auth

* `POST /auth/login`
* `POST /auth/register`
* `POST /auth/refresh-token`

### 👤 User

* `GET /users`
* `GET /users/:id`

### 🏔️ Mountain

* `GET /mountains`
* `POST /mountains`
* `PUT /mountains/:id`
* `DELETE /mountains/:id`

### 🎟️ Reservation

* `POST /reservations`
* `GET /reservations`

### 📋 Checkin / Checkout

* `POST /checkin`
* `POST /checkout`

### 📰 Informasi & Event

* `GET /informasi`
* `GET /berita`

👉 Disarankan gunakan **Postman Collection** untuk testing API.

---

## 🗂️ Struktur Folder

```
├── prisma              # Schema & migration Prisma
├── src
│   ├── config          # Konfigurasi (DB, env, dll)
│   ├── controllers     # Logic handler (request/response)
│   ├── middlewares     # Middleware (auth, error handler)
│   ├── models          # Model abstraction (optional)
│   ├── routes          # Routing API
│   ├── store           # Data access / service layer
│   ├── utils           # Helper functions
│   └── validators      # Validasi request (Joi/Zod)
└── uploads
    ├── id_card
    ├── images
    ├── informasi
    ├── laporan
    └── mountains
```

---

## 🔒 Keamanan & Pengujian

### 🔐 Keamanan

* JWT Authentication (Access & Refresh Token)
* Environment-based config (.env)
* Validasi input (validator layer)
* Password hashing (bcrypt)

### 🧪 Testing (Jest)

Menjalankan testing:

```bash
npm run test
```

Contoh yang diuji:

* Endpoint API
* Validasi request
* Logic controller

### 🧹 Linting (Opsional)

Gunakan ESLint:

```bash
npm run lint
```

---

## 💡 Catatan

* Gunakan `db` sebagai host database saat menggunakan Docker
* Jangan gunakan `localhost` untuk koneksi antar container
* Pastikan Prisma sudah generate sebelum menjalankan server

---

## 👨‍💻 Author

Developed for **TEAM 6 SE-47-04** 🚀
