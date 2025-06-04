import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'KU Club Backend API',
      version: '1.0.0',
      description: 'API documentation for KU Club management system',
      contact: {
        name: 'KU Club Team',
        email: 'support@kuclub.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
      {
        url: 'https://api.kuclub.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // Token Response
        TokenResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            expiresIn: { type: 'string', example: '7d' },
            type: { type: 'string', example: 'Bearer' },
          },
        },
        
        // Project Schema
        Project: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Project ID', example: '1' },
            date_start_the_project: {
              type: 'string',
              format: 'date-time',
              description: 'Project start date',
              example: '2024-06-01T00:00:00Z',
            },
            date_end_the_project: {
              type: 'string',
              format: 'date-time',
              description: 'Project end date',
              example: '2024-06-30T23:59:59Z',
            },
            project_location: {
              type: 'string',
              description: 'Project location',
              example: 'Bangkok, Thailand',
            },
            project_name_en: {
              type: 'string',
              description: 'Project name in English',
              example: 'Community Service Project',
            },
            project_name_th: {
              type: 'string',
              description: 'Project name in Thai',
              example: 'โครงการบริการชุมชน',
            },
            activity_hours: {
              type: 'object',
              description: 'Activity hours breakdown',
              example: {
                social_activities: 8,
                university_activities: 4,
                competency_development_activities: {
                  health: 2,
                  virtue: 1,
                  thinking_and_learning: 3,
                  interpersonal_relationships_and_communication: 2,
                },
              },
            },
            activity_format: {
              type: 'array',
              items: { type: 'string' },
              description: 'Activity format',
              example: ['Workshop', 'Seminar', 'Community Service'],
            },
            expected_project_outcome: {
              type: 'array',
              items: { type: 'string' },
              description: 'Expected project outcomes',
              example: ['Improved community engagement', 'Enhanced student skills'],
            },
            schedule: {
              type: 'object',
              description: 'Project schedule',
              example: {
                each_day: [
                  {
                    date: '2024-06-01',
                    time: ['09:00-12:00', '13:00-17:00'],
                    description: 'Opening ceremony and workshops',
                  },
                ],
                location: 'Main auditorium',
              },
            },
            organization_orgid: {
              type: 'string',
              description: 'Organization ID',
              example: '1',
            },
            outside_kaset: {
              type: 'object',
              nullable: true,
              description: 'Location outside Kasetsart University',
              example: { district: 'Chatuchak', province: 'Bangkok' },
            },
            principles_and_reasoning: {
              type: 'string',
              description: 'Project principles and reasoning',
              example: 'To serve the community and develop student leadership skills',
            },
            project_objectives: {
              type: 'array',
              items: { type: 'string' },
              description: 'Project objectives',
              example: ['Enhance community relations', 'Develop student skills'],
            },
            org_name_en: {
              type: 'string',
              description: 'Organization name in English',
              example: 'Student Council',
            },
            org_name_th: {
              type: 'string',
              description: 'Organization name in Thai',
              example: 'สภานักศึกษา',
            },
            org_nickname: {
              type: 'string',
              description: 'Organization nickname',
              example: 'SC',
            },
          },
        },

        // Organization Schema
        Organization: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Organization ID', example: '1' },
            orgnameen: { type: 'string', description: 'Organization name in English', example: 'Student Council' },
            orgnameth: { type: 'string', description: 'Organization name in Thai', example: 'สภานักศึกษา' },
            organizationMark: { type: 'string', description: 'Organization mark', example: 'STUDENT' },
            org_image: { type: 'string', description: 'Organization image URL', example: '/uploads/org_logo.jpg' },
            description: { type: 'string', description: 'Organization description', example: 'Student organization for campus activities' },
            instagram: { type: 'string', description: 'Instagram handle', example: '@ku_student_council' },
            facebook: { type: 'string', description: 'Facebook page', example: 'KU Student Council' },
            views: { type: 'integer', description: 'Number of views', example: 1250 },
            org_nickname: { type: 'string', description: 'Organization nickname', example: 'SC' },
            org_type_name: { type: 'string', description: 'Organization type', example: 'Student Council' },
            campus_name: { type: 'string', description: 'Campus name', example: 'Bang Khen Campus' },
          },
        },

        // Campus Schema
        Campus: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Campus ID', example: '1' },
            name: { type: 'string', description: 'Campus name', example: 'Bang Khen Campus' },
          },
        },

        // Organization Type Schema
        OrganizationType: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Organization type ID', example: '1' },
            name: { type: 'string', description: 'Organization type name', example: 'Student Council' },
          },
        },

        // API Response Schema
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', description: 'Response status', example: true },
            data: { description: 'Response data' },
            message: { type: 'string', description: 'Response message', example: 'Success' },
          },
        },

        // Error Response Schema
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', description: 'Response status', example: false },
            message: { type: 'string', description: 'Error message', example: 'Internal Server Error' },
          },
        },
      },
    },
    paths: {
      // Authentication endpoints
      '/api/auth/get-token': {
        post: {
          tags: ['Authentication'],
          summary: 'Get access token',
          description: 'Generate an access token for API authentication',
          parameters: [
            {
              name: 'x-client-secret',
              in: 'header',
              required: true,
              description: 'Client secret for authentication',
              schema: { type: 'string', example: 'TokenDEV123' },
            },
          ],
          responses: {
            '200': {
              description: 'Token generated successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/TokenResponse' },
                },
              },
            },
            '403': {
              description: 'Invalid client secret',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },

      // Project endpoints
      '/api/projects': {
        get: {
          tags: ['Projects'],
          summary: 'Get all approved projects',
          description: 'Retrieve all projects with status SA1_SD_AT_Approved',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Successfully retrieved projects',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/ApiResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Project' },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized - Token required',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '500': {
              description: 'Internal Server Error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },

      '/api/projects/{id}': {
        get: {
          tags: ['Projects'],
          summary: 'Get project by ID',
          description: 'Retrieve a specific project by its ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'Project ID',
              schema: { type: 'string', example: '1' },
            },
          ],
          responses: {
            '200': {
              description: 'Successfully retrieved project',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/ApiResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/Project' },
                        },
                      },
                    ],
                  },
                },
              },
            },
            '400': {
              description: 'Bad Request - Project ID is required',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '404': {
              description: 'Project not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '500': {
              description: 'Internal Server Error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },

      '/api/projects/organization/{orgId}': {
        get: {
          tags: ['Projects'],
          summary: 'Get projects by organization',
          description: 'Retrieve all approved projects for a specific organization',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'orgId',
              in: 'path',
              required: true,
              description: 'Organization ID',
              schema: { type: 'string', example: '1' },
            },
          ],
          responses: {
            '200': {
              description: 'Successfully retrieved projects',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/ApiResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Project' },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            '400': {
              description: 'Bad Request - Organization ID is required',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '500': {
              description: 'Internal Server Error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },

      // Organization endpoints
      '/api/organizations': {
        get: {
          tags: ['Organizations'],
          summary: 'Get all organizations',
          description: 'Retrieve all organizations with their details',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Successfully retrieved organizations',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/ApiResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Organization' },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '500': {
              description: 'Internal Server Error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },

      '/api/organizations/{id}': {
        get: {
          tags: ['Organizations'],
          summary: 'Get organization by ID',
          description: 'Retrieve a specific organization by its ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'Organization ID',
              schema: { type: 'string', example: '1' },
            },
          ],
          responses: {
            '200': {
              description: 'Successfully retrieved organization',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/ApiResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/Organization' },
                        },
                      },
                    ],
                  },
                },
              },
            },
            '400': {
              description: 'Bad Request - Organization ID is required',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '404': {
              description: 'Organization not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '500': {
              description: 'Internal Server Error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },

      // Campus endpoints
      '/api/campuses': {
        get: {
          tags: ['Campuses'],
          summary: 'Get all campuses',
          description: 'Retrieve all available campuses',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Successfully retrieved campuses',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/ApiResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Campus' },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '500': {
              description: 'Internal Server Error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },

      // Organization Type endpoints
      '/api/organization-types': {
        get: {
          tags: ['Organization Types'],
          summary: 'Get all organization types',
          description: 'Retrieve all available organization types',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Successfully retrieved organization types',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/ApiResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/OrganizationType' },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '500': {
              description: 'Internal Server Error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 20px 0; }
      .swagger-ui .info hgroup.main { margin: 0 0 20px 0; }
      .swagger-ui .scheme-container { margin: 20px 0; padding: 20px; background: #f7f7f7; border-radius: 4px; }
    `,
    customSiteTitle: 'KU Club API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      tryItOutEnabled: true,
      supportedSubmitMethods: ['get', 'post', 'put', 'delete'],
      docExpansion: 'list',
      defaultModelsExpandDepth: 1,
      defaultModelExpandDepth: 1,
    },
  }));

  // Add redirect routes for convenience
  app.get('/docs', (req, res) => {
    res.redirect('/api-docs');
  });

  app.get('/swagger', (req, res) => {
    res.redirect('/api-docs');
  });

  console.log('📚 Swagger documentation available at:');
  console.log(`   - http://localhost:4000/api-docs`);
  console.log(`   - http://localhost:4000/docs (redirect)`);
  console.log(`   - http://localhost:4000/swagger (redirect)`);
};

export default specs;