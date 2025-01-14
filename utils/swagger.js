"use strict";

import swaggerUi from "swagger-ui-express";

const spec = {
  openapi: "3.0.3",
  info: {
    title: "REST API Docs",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:4000/api/v1",
    },
    {
      url: "http://ec2-54-160-205-156.compute-1.amazonaws.com:4000/api/v1",
    },
  ],
  tags: [
    {
      name: "users",
      description: "Operations about user",
    },
    {
      name: "images",
      description: "Operations about images",
    },
  ],
  paths: {
    "/users/signup": {
      post: {
        tags: ["users"],
        summary: "Create user",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/createUser",
              },
            },
            "application/xml": {
              schema: {
                $ref: "#/components/schemas/createUser",
              },
            },
            "application/x-www-form-urlencoded": {
              schema: {
                $ref: "#/components/schemas/createUser",
              },
            },
          },
        },
        responses: {
          201: {
            description: "User created",
          },
        },
      },
    },
    "/users/login": {
      post: {
        tags: ["users"],
        summary: "User login",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/userLogin",
              },
            },
            "application/xml": {
              schema: {
                $ref: "#/components/schemas/userLogin",
              },
            },
            "application/x-www-form-urlencoded": {
              schema: {
                $ref: "#/components/schemas/userLogin",
              },
            },
          },
        },
        responses: {
          200: {
            description: "User logged in",
          },
        },
      },
    },
    "/images": {
      get: {
        tags: ["images"],
        summary: "Query images",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "query",
            in: "query",
            description: "The key word to search",
            required: true,
            explode: true,
            schema: {
              type: "string",
              default: "tree",
            },
          },
        ],
        responses: {
          200: {
            description: "Successful operation",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      createUser: {
        type: "object",
        properties: {
          email: {
            type: "string",
            example: "exampleUser@o0w0o.com",
          },
          password: {
            type: "string",
            example: "StrongPassword123",
          },
          passwordConfirm: {
            type: "string",
            example: "StrongPassword123",
          },
        },
      },
      userLogin: {
        type: "object",
        properties: {
          email: {
            type: "string",
            example: "exampleUser@o0w0o.com",
          },
          password: {
            type: "string",
            example: "StrongPassword123",
          },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

function swaggerDocs(app, port) {
  // Swagger page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));

  // Docs in JSON format
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(spec);
  });

  console.log(`Docs avaiable at http://localhost:${port}/docs`);
}

export default swaggerDocs;
