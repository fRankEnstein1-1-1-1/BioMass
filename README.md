# BioMass Project

This is a full-stack application built to process and analyze drone imagery, leveraging the **MERN** stack and **WebODM** (OpenDroneMap).

## Tech Stack & Architecture

This project is based on the **MERN** stack:
- **MongoDB**: NoSQL database used to store user, project, and processed data (managed via Mongoose).
- **Express.js**: Backend web application framework used to build the RESTful API.
- **React.js**: Frontend library used for building the user interface.
- **Node.js**: JavaScript runtime environment for the backend server.

### Additional Technologies:
- **Frontend**: 
  - **Vite**: Next-generation frontend tooling for faster, leaner builds.
  - **Tailwind CSS**: Utility-first CSS framework for rapid and modern UI styling.
  - **React Router DOM**: Declarative routing for React.
  - **React Dropzone**: For handling drag-and-drop file uploads (essential for image processing).
  - **Lucide React**: Beautiful and consistent icons.
- **Backend**:
  - **Axios & Form-Data**: Used for making HTTP requests and handling multipart data uploads.
  - **Multer**: Middleware for handling `multipart/form-data` (file uploads) on the server.
  - **Dotenv**: For managing environment variables securely.
- **Processing Engine**:
  - **WebODM**: Open source drone image processing software used via its API to create 2D maps and 3D models from aerial imagery.

---

## Project Structure

```text
BioMass/
├── Backend/           # Express server, MongoDB models, API routes, WebODM services
└── frontend/          # React + Vite frontend application
```

---

## How to Run the Project

To get the full application up and running locally, you'll need to run three separate processes: WebODM, the Backend server, and the Frontend development server.

### Prerequisites
- **Node.js** and **npm** installed on your machine.
- **Docker** and **Docker Compose** installed (required for running WebODM locally).
- A running **MongoDB** instance (local or MongoDB Atlas URI).

### 1. Start WebODM
The backend relies on WebODM for image processing services. You need to start the WebODM Docker containers.

Navigate to the directory where you have cloned/installed WebODM, and run:
```bash
./webodm.sh start
```
*(Wait until WebODM finishes starting up and is accessible, usually at `http://localhost:8000`)*

### 2. Start the Backend Server
Open a new terminal window and navigate to the backend directory:
```bash
cd Backend
```

Install the backend dependencies:
```bash
npm install
```

Make sure you configure your environment variables. You should have a `.env` file in the `Backend` directory containing your `MONGO_URI`, WebODM credentials, port, etc.

Start the backend server (runs on `http://localhost:5000` by default):
```bash
npx nodemon server.js
# OR
node server.js
```

### 3. Start the Frontend Application
Open another new terminal window and navigate to the frontend directory:
```bash
cd frontend
```

Install the frontend dependencies:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```

The frontend will start and can be accessed in your browser at `http://localhost:5173`.
