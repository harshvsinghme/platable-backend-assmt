# Platable Backend

Platable Backend is the server-side component of the Platable platform, dedicated to managing food donations and distribution.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Project Documentation](#project-documentation)

## Getting Started

### Prerequisites

Make sure you have the following software installed on your machine:

- Node.js
- MongoDB

### Installation

Clone the repository:

```bash
git clone https://github.com/harshvsinghme/platable-backend-assmt.git
```

```bash
Get .env file and save that in the src/config/

Basically, You environment file path will look like:
src/config/.env

.env file content:

     PORT=YOURPORT
     MONGODB_URI=YOURMONGOURL
     ACCESS_TOKEN_SECRET=YOURJWTSECRET
     ACCESS_TOKEN_EXPIRE=YOURJWTEXPIRE
```

### Usage

### Running the Server

#### Install the dependencies

    npm i

#### Run Backend Server

    npm run start

## API Documentation

https://documenter.getpostman.com/view/16741530/2s9YysE2rB

## Project Documentation

https://docs.google.com/document/d/1IZFD9Ccc1kON2sa0N_ExEyWbMpxRwtgUENamKdFgeNg/edit?usp=sharing
