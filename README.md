# About The Project

This **Next.js & NestJS** project allows users to **create accounts, download their own clients, and manage them via a dashboard**. The backend handles **authentication, user management, and file downloads**, ensuring **secure password policies** and **individual client control**.

## Built With

- Web
  - [NextJS](https://nextjs.org/)
  - [typescript](https://www.npmjs.com/package/typescript)
  - [tailwindcss](https://www.npmjs.com/package/tailwindcss)
- Server
  - [NestJS](https://nestjs.com/)
  - [typescript](https://www.npmjs.com/package/typescript)
  - [Prisma](https://www.npmjs.com/package/prisma)
- Client
  - [Python](https://www.python.org/)
  - [Socket.IO](https://socket.io/)

<!-- GETTING STARTED DEVELOPMENT  -->

# Getting Started Development

This is an example of setting up your project locally.
To get a local copy up and running follow these simple example steps.

## Prerequisites Development

This project requires NodeJS (version 20 or later), Yarn VScode. Node, Yarn and VScode are really easy to install. To make sure you have them available on your machine, try running the following command.

- node

  ```sh
  node -v
  v22.11.0
  ```

## Installation Development

- Clone the repo

  ```sh
  git clone https://github.com/Jonaskop44/PhantomControl.git
  cd PhantomControl
  code .
  ```

### Web Development

1. install packages

   ```sh
   npm install
   ```

2. start dev server

   ```sh
   npm run dev
   ```

3. Generate RSA key for the server

   ```sh
   openssl genpkey -algorithm RSA -out server_private.pem
   openssl rsa -pubout -in server_private.pem -out server_public.pem
   ```

4. Generate RSA key for the client

   ```sh
   openssl genpkey -algorithm RSA -out client_private.pem
   openssl rsa -pubout -in client_private.pem -out client_public.pem
   ```

<!-- ROADMAP -->

# Roadmap

See the [open issues](https://github.com/Jonaskop44/PhantomControl/issues) for a list of proposed features (and known issues).

<!-- CONTRIBUTING -->

# Contributing

Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- CONTACT -->

# Contact

Email - jonas@codeflexx.com

Discord - Jonaskop44

Telegram - [Jonaskop44](https://t.me/Jonaskop44)
