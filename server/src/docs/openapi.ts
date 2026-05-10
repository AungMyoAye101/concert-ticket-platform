export const openApiSpec = {
    openapi: "3.0.3",
    info: {
        title: "Concert Ticket Platform API",
        version: "1.0.0",
        description: "Production-ready concert ticket reservation API with PostgreSQL, locking, validation, and correlation IDs.",
    },
    servers: [{ url: "/api/v1" }],
    paths: {
        "/concerts": {
            get: {
                summary: "List concerts with current available stock",
                responses: {
                    "200": { description: "Concert list fetched" },
                },
            },
            post: {
                summary: "Create a concert",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/CreateConcertRequest" },
                        },
                    },
                },
                responses: {
                    "201": { description: "Concert created" },
                    "400": { $ref: "#/components/responses/BadRequest" },
                },
            },
        },
        "/reserve": {
            post: {
                summary: "Reserve one available ticket for a concert for 5 minutes",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ReserveConcertRequest" },
                        },
                    },
                },
                responses: {
                    "201": { description: "Reservation created" },
                    "409": { $ref: "#/components/responses/Conflict" },
                },
            },
        },
        "/purchase": {
            post: {
                summary: "Convert a pending reservation to completed",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/PurchaseRequest" },
                        },
                    },
                },
                responses: {
                    "201": { description: "Purchase successful" },
                    "404": { description: "Reservation not found" },
                },
            },
        },
        "/cleanup/reservations": {
            post: {
                summary: "Expire pending reservations older than 5 minutes and release stock",
                responses: {
                    "200": { description: "Expired reservations released" },
                },
            },
        },
        "/auth/login": {
            post: {
                summary: "Login with email and password",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/LoginRequest" },
                        },
                    },
                },
                responses: {
                    "200": { description: "Login successful" },
                    "401": { $ref: "#/components/responses/Unauthorized" },
                },
            },
        },
        "/auth/logout": {
            post: {
                summary: "Logout current bearer-token user",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": { description: "Logout successful" },
                    "401": { $ref: "#/components/responses/Unauthorized" },
                },
            },
        },
        "/auth/me": {
            get: {
                summary: "Get current bearer-token user",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": { description: "Current user fetched" },
                    "401": { $ref: "#/components/responses/Unauthorized" },
                },
            },
        },
        "/tickets": {
            get: {
                summary: "List tickets without internal_note or version fields",
                responses: {
                    "200": {
                        description: "Ticket list fetched",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/TicketListResponse" },
                            },
                        },
                    },
                },
            },
            post: {
                summary: "Create a ticket",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/CreateTicketRequest" },
                        },
                    },
                },
                responses: {
                    "201": { description: "Ticket created" },
                    "400": { $ref: "#/components/responses/BadRequest" },
                },
            },
        },
        "/tickets/reserve/optimistic": {
            post: {
                summary: "Reserve a ticket using optimistic locking",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/TicketReservationRequest" },
                        },
                    },
                },
                responses: {
                    "201": { description: "Ticket reserved" },
                    "409": { $ref: "#/components/responses/Conflict" },
                },
            },
        },
        "/tickets/reserve/pessimistic": {
            post: {
                summary: "Reserve a ticket using pessimistic write locking",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/TicketReservationRequest" },
                        },
                    },
                },
                responses: {
                    "201": { description: "Ticket reserved" },
                    "409": { $ref: "#/components/responses/Conflict" },
                },
            },
        },
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
        responses: {
            BadRequest: {
                description: "Validation error",
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/ErrorResponse" },
                    },
                },
            },
            Conflict: {
                description: "Locking or stock conflict",
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/ErrorResponse" },
                    },
                },
            },
            Unauthorized: {
                description: "Authentication failed",
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/ErrorResponse" },
                    },
                },
            },
        },
        schemas: {
            LoginRequest: {
                type: "object",
                additionalProperties: false,
                required: ["email", "password"],
                properties: {
                    email: {
                        type: "string",
                        format: "email",
                        example: "aung@example.com",
                    },
                    password: { type: "string", example: "password123" },
                },
            },
            CreateConcertRequest: {
                type: "object",
                additionalProperties: false,
                required: ["title", "date", "venue", "stock"],
                properties: {
                    title: { type: "string", example: "Rock Revolution 2026" },
                    date: { type: "string", format: "date-time" },
                    venue: { type: "string", example: "Yangon Thuwunna Stadium" },
                    stock: { type: "integer", minimum: 0, example: 500 },
                },
            },
            ReserveConcertRequest: {
                type: "object",
                additionalProperties: false,
                required: ["userId", "concertId"],
                properties: {
                    userId: { type: "string", format: "uuid" },
                    concertId: { type: "string", format: "uuid" },
                    quantity: { type: "integer", minimum: 1, maximum: 5, default: 1 },
                },
            },
            PurchaseRequest: {
                type: "object",
                additionalProperties: false,
                required: ["reservationId"],
                properties: {
                    reservationId: { type: "string", format: "uuid" },
                },
            },
            CreateTicketRequest: {
                type: "object",
                additionalProperties: false,
                required: ["concertId", "seatNumber", "price"],
                properties: {
                    concertId: { type: "string", format: "uuid" },
                    seatNumber: { type: "string", example: "A1" },
                    price: { type: "number", example: 99.99 },
                    category: {
                        type: "string",
                        enum: ["VIP", "GENERAL"],
                        default: "GENERAL",
                    },
                    internalNote: { type: "string" },
                },
            },
            TicketReservationRequest: {
                type: "object",
                additionalProperties: false,
                required: ["userId", "ticketId"],
                properties: {
                    userId: { type: "string", format: "uuid" },
                    ticketId: { type: "string", format: "uuid" },
                    quantity: { type: "integer", minimum: 1, maximum: 5, default: 1 },
                },
            },
            TicketDto: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" },
                    concertId: { type: "string", format: "uuid" },
                    seatNumber: { type: "string" },
                    price: { type: "number" },
                    status: { type: "string" },
                    category: { type: "string" },
                },
            },
            TicketListResponse: {
                type: "object",
                properties: {
                    success: { type: "boolean" },
                    statusCode: { type: "integer" },
                    message: { type: "string" },
                    data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/TicketDto" },
                    },
                },
            },
            ErrorResponse: {
                type: "object",
                properties: {
                    success: { type: "boolean", example: false },
                    statusCode: { type: "integer", example: 409 },
                    error: { type: "string", example: "CONFLICT" },
                    message: { type: "string" },
                    ref: { type: "string", format: "uuid" },
                },
            },
        },
    },
};
