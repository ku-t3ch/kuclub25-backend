import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { setupSwagger } from "./doc/swagger";

// Import routes
import tokenRoutes from "./routes/token.route";
import projectRoutes from "./routes/project.route";
import organizationRoutes from "./routes/organization.route";
import campusRoutes from "./routes/campus.route";
import organizationTypeRoutes from "./routes/organizationType.route";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 9000;

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "https:"],
      },
    },
  })
);

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.ALLOWED_ORIGINS?.split(",") || []
        : [
            `http://${process.env.NETWORK}:8000`,
            ...(process.env.ADDITIONAL_FRONTEND_URLS?.split(",") || []),
          ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-client-secret"],
  })
);

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(
  express.json({
    limit: "10mb",
    verify: (req, res, buf, encoding) => {
      try {
        JSON.parse(buf.toString());
      } catch (err) {
        console.log(
          "❌ Invalid JSON received:",
          buf.toString().substring(0, 100)
        );
      }
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`
      );
    }
  });

  next();
});


setupSwagger(app);

// Basic root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "KU Club Backend API",
    status: "running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      documentation: "/api-docs",
      authentication: "/api/auth/get-token",
      apiInfo: "/api",
    },
  });
});

// API Routes
app.use("/api/auth", tokenRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/campuses", campusRoutes);
app.use("/api/organization-types", organizationTypeRoutes);

// API info endpoint
app.get("/api", (req, res) => {
  res.json({
    name: "KU Club Backend API",
    version: "1.0.0",
    description:
      "API for KU Club management system using SAKU API as data source",
    endpoints: {
      authentication: {
        "POST /api/auth/get-token":
          "Get JWT token (requires x-client-secret header)",
      },
      projects: {
        "GET /api/projects": "Get all projects",
        "GET /api/projects/:id": "Get project by ID",
        "GET /api/projects/organization/:orgId": "Get projects by organization",
      },
      organizations: {
        "GET /api/organizations": "Get all organizations",
        "GET /api/organizations/:id": "Get organization by ID",
        "PUT /api/organizations/:id/views": "Update organization view count",
      },
      utilities: {
        "GET /api/campuses": "Get all campuses",
        "GET /api/organization-types": "Get all organization types",
      },
    },
    documentation: `${req.protocol}://${req.get("host")}/api-docs`,
    note: "All endpoints except authentication require Bearer token authorization",
  });
});

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
    availableEndpoints: "/api",
  });
});

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    suggestion:
      "Try /api for available endpoints or /api-docs for documentation",
  });
});

// Enhanced error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("❌ Error details:", {
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      url: req.url,
      method: req.method,
      headers: req.headers,
      body: req.method !== "GET" ? req.body : undefined,
      timestamp: new Date().toISOString(),
    });

    // Handle specific error types
    if (err instanceof SyntaxError && err.message.includes("JSON")) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format in request body",
        error: "INVALID_JSON",
        hint: "Please check your JSON syntax. For GET requests, ensure no body is sent.",
      });
    }

    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        message: "Request body too large",
        error: "PAYLOAD_TOO_LARGE",
      });
    }

    if (err.name === "UnauthorizedError") {
      return res.status(401).json({
        success: false,
        message: "Invalid or missing authentication token",
        error: "UNAUTHORIZED",
      });
    }

    // Generic error response
    res.status(err.status || 500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : err.message || "Something went wrong!",
      error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      timestamp: new Date().toISOString(),
    });
  }
);

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

  try {
    // Close server
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during graceful shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log("\n🚀 KU Club Backend API Started Successfully!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 Local URL: http://localhost:${PORT}`);
  console.log(
    `🌐 Network URL: http://${process.env.NETWORK || "localhost"}:${PORT}`
  );
  console.log(`📚 Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`📋 API Info: http://localhost:${PORT}/api`);

  console.log("\n📝 Available Endpoints:");
  console.log("   🔓 POST  /api/auth/get-token");
  console.log("   🔒 GET   /api/projects ");
  console.log("   🔒 GET   /api/organizations ");
  console.log("   🔒 GET   /api/campuses");
  console.log("   🔒 GET   /api/organization-types");

  console.log("\n🔑 Authentication:");
  console.log(
    "   1. Get token: POST /api/auth/get-token (with x-client-secret header)"
  );
  console.log("   2. Use token: Authorization: Bearer <token>");
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🎉 Server is ready to accept connections!");
});

export default app;
