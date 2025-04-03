# EazyEmailer

EazyEmailer is a **Next.js**-based email automation SaaS that allows startups and entrepreneurs to send bulk emails efficiently at scale. It uses **PostgreSQL** with **Drizzle ORM**, **Tailwind CSS** for styling, and is hosted on **AWS EC2** with deployment automation via **GitHub Actions**.

## 📂 Folder Structure

```
EazyEmailer/
│── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── campaigns/
│   │   ├── contacts/
│   │   ├── dash/
│   │   ├── health/
│   │   ├── settings/
│   │   ├── templates/
│   │   ├── workflows/
│   ├── dashboard/
│   │   ├── campaigns/
│   │   ├── contacts/
│   │   ├── settings/
│   │   ├── templates/
│   │   ├── workflows/
│   ├── login/
│
│── db/
│   ├── migrations/
│
│── lib/
│   ├── auth/
│   ├── db/
│   ├── utils/
│
│── .github/
│   ├── workflows/
│
│── public/
│── styles/
│── components/
│── pages/
│── next.config.js
│── package.json
│── pnpm-lock.yaml
│── .env.example
│── README.md
```

## 🚀 Setup & Installation

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/eazyemailer.git
cd eazyemailer
```

### 2️⃣ Set Up Environment Variables
Create a `.env` file in the root directory and add the following variables:

#### Required Environment Variables
```env
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
NEXTAUTH_URL="https://yourapp.host.com"
NEXTAUTH_SECRET=""
DATABASE_URL="postgresql://<your-db-user>:<your-db-password>@<your-db-host>:5432/postgres"
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION="ap-south-1"
```

#### Explanation of Each Variable:
- **GOOGLE_CLIENT_ID** – Obtained from Google Cloud Console when setting up OAuth 2.0 authentication.
- **GOOGLE_CLIENT_SECRET** – Secret key for Google OAuth authentication.
- **NEXTAUTH_URL** – The URL of the deployed application, required for NextAuth authentication.
- **NEXTAUTH_SECRET** – A random secret key used for NextAuth encryption (can be generated using `openssl rand -base64 32`).
- **DATABASE_URL** – Connection string for PostgreSQL. If using Supabase, get this from the Supabase dashboard under "Database Settings".
- **AWS_ACCESS_KEY_ID** – AWS IAM user access key for connecting to AWS services.
- **AWS_SECRET_ACCESS_KEY** – AWS IAM user secret access key.
- **AWS_REGION** – AWS region where services like S3 or EC2 are deployed (e.g., `ap-south-1` for India).

### 3️⃣ Set Up PostgreSQL with Supabase
1. Create a free [Supabase](https://supabase.com/) project.
2. Get the database connection string (`DATABASE_URL`) and update it in the `.env` file.
3. Run the migrations using **Drizzle ORM**:
   ```sh
   pnpm drizzle:push
   ```

### 4️⃣ Install Dependencies
Use **pnpm** to install the required dependencies:
```sh
pnpm install
```

### 5️⃣ Start the Development Server
```sh
pnpm dev
```
This will start the Next.js app at `http://localhost:3000`.

## 🌍 Deployment on AWS EC2

### 1️⃣ Create an EC2 Instance
1. Launch an **Ubuntu 22.04** EC2 instance.
2. Install Node.js and PM2:
   ```sh
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   npm install -g pnpm pm2
   ```

### 2️⃣ Deploy the Application
1. SSH into the instance:
   ```sh
   ssh ubuntu@your-ec2-ip-address
   ```
2. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/eazyemailer.git
   cd eazyemailer
   ```
3. Set up environment variables (`.env` file).
4. Install dependencies:
   ```sh
   pnpm install
   ```
5. Build and run the project:
   ```sh
   pnpm build
   pm2 start pnpm --name eazyemailer -- start
   pm2 save
   pm2 startup
   ```
6. Configure **NGINX** as a reverse proxy (optional but recommended).

### 3️⃣ Automate Deployment using GitHub Actions
- The repository includes a **GitHub Actions workflow** in `.github/workflows`.
- On every `push` to the `main` branch, it triggers an automatic deployment to the EC2 instance.

## 🎨 Tech Stack
- **Next.js** – Frontend & API
- **PostgreSQL** – Database
- **Drizzle ORM** – Database Migrations
- **Tailwind CSS** – Styling
- **AWS EC2** – Hosting
- **PM2** – Process Manager
- **GitHub Actions** – CI/CD

## 🛠️ Commands Summary
| Command                 | Description                         |
|-------------------------|-------------------------------------|
| `pnpm install`         | Install dependencies               |
| `pnpm dev`             | Start development server           |
| `pnpm build`           | Build production version           |
| `pnpm start`           | Start production server            |
| `pnpm drizzle:push`    | Apply database migrations          |
| `pm2 start pnpm --name eazyemailer -- start` | Run app with PM2 |

## 📢 Contributing
Feel free to fork, submit PRs, and improve EazyEmailer!

## 📜 License
MIT License © 2025 EazyEmailer

