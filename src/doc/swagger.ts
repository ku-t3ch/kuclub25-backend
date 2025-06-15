import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'KU Club Backend API',
      version: '1.0.0',
      description: 'API for KU Club management system using SAKU API as data source',
      contact: {
        name: 'API Support',
        email: 'support@kuclub.com'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.kuclub.com' 
          : `http://localhost:${process.env.PORT || 4000}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme. Get token from /api/auth/get-token'
        },
        clientSecret: {
          type: 'apiKey',
          in: 'header',
          name: 'x-client-secret',
          description: 'Client secret for getting authentication token'
        }
      },
      schemas: {
        // Authentication Schemas
        TokenRequest: {
          type: 'object',
          description: 'Request token with client secret in header'
        },
        TokenResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            expiresIn: { type: 'string', example: '7d' },
            type: { type: 'string', example: 'Bearer' }
          }
        },

        // Project Schemas
        ActivityHours: {
          type: 'object',
          properties: {
            social_activities: { type: 'number', example: 40 },
            university_activities: { type: 'number', example: 20 },
            competency_development_activities: {
              type: 'object',
              properties: {
                health: { type: 'number', example: 5 },
                virtue: { type: 'number', example: 10 },
                thinking_and_learning: { type: 'number', example: 25 },
                interpersonal_relationships_and_communication: { type: 'number', example: 30 }
              }
            }
          }
        },
        Schedule: {
          type: 'object',
          properties: {
            each_day: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  date: { type: 'string', example: '2024-01-15' },
                  time: { type: 'array', items: { type: 'string' }, example: ['09:00', '17:00'] },
                  description: { type: 'string', example: 'Workshop session' }
                }
              }
            },
            location: { type: 'string', example: 'มหาวิทยาลัยเกษตรศาสตร์' }
          }
        },
        Project: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'proj_123456789' },
            date_start: { type: 'string', format: 'date-time', example: '2024-01-15T09:00:00Z' },
            date_end: { type: 'string', format: 'date-time', example: '2024-01-20T17:00:00Z' },
            location: { type: 'string', example: 'ห้องประชุม A' },
            campus_name: { type: 'string', example: 'วิทยาเขตบางเขน' },
            name_en: { type: 'string', example: 'Environmental Awareness Project' },
            name_th: { type: 'string', example: 'โครงการรณรงค์อนุรักษ์สิ่งแวดล้อม' },
            org_nickname: { type: 'string', example: 'EnviroClub' },
            org_name_en: { type: 'string', example: 'Environmental Club' },
            org_name_th: { type: 'string', example: 'ชมรมสิ่งแวดล้อม' },
            activity_hours: { $ref: '#/components/schemas/ActivityHours' },
            activity_format: { type: 'array', items: { type: 'string' }, example: ['Workshop', 'Seminar'] },
            expected_project_outcome: { type: 'array', items: { type: 'string' }, example: ['Increased awareness', 'Skill development'] },
            schedule: { $ref: '#/components/schemas/Schedule' },
            organization_orgid: { type: 'string', example: 'org_123456789' },
            outside_kaset: {
              type: 'object',
              nullable: true,
              properties: {
                district: { type: 'string', example: 'จตุจักร' },
                province: { type: 'string', example: 'กรุงเทพมหานคร' }
              }
            },
            project_objectives: { type: 'array', items: { type: 'string' }, example: ['Promote environmental awareness', 'Build community engagement'] }
          }
        },

        // Organization Schemas
        Organization: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'org_123456789' },
            orgnameen: { type: 'string', example: 'Environmental Club' },
            orgnameth: { type: 'string', example: 'ชมรมสิ่งแวดล้อม' },
            organizationMark: { type: 'string', example: 'ENV' },
            org_image: { type: 'string', example: 'https://example.com/logo.png' },
            description: { type: 'string', example: 'Organization focused on environmental conservation' },
            instagram: { type: 'string', example: '@enviroclub_ku' },
            facebook: { type: 'string', example: 'EnviroClubKU' },
            views: { type: 'number', example: 1250 },
            org_nickname: { type: 'string', example: 'EnviroClub' },
            org_type_name: { type: 'string', example: 'ชมรมด้านบำเพ็ญประโยชน์' },
            campus_name: { type: 'string', example: 'วิทยาเขตบางเขน' }
          }
        },

        // Statistics Schemas
        ProjectStats: {
          type: 'object',
          properties: {
            totalProjects: { type: 'number', example: 150 },
            totalOrganizations: { type: 'number', example: 45 },
            byCampus: {
              type: 'object',
              additionalProperties: { type: 'number' },
              example: { 'วิทยาเขตบางเขน': 80, 'วิทยาเขตกำแพงแสน': 45 }
            },
            byOrganizationType: {
              type: 'object',
              additionalProperties: { type: 'number' },
              example: { 'ชมรมด้านวิชาการ': 35, 'ชมรมด้านกีฬา': 25 }
            },
            byMonth: {
              type: 'object',
              additionalProperties: { type: 'number' },
              example: { 'มกราคม 2024': 12, 'กุมภาพันธ์ 2024': 15 }
            }
          }
        },
        OrganizationStats: {
          type: 'object',
          properties: {
            totalOrganizations: { type: 'number', example: 45 },
            totalViews: { type: 'number', example: 25000 },
            averageViews: { type: 'number', example: 556 },
            byCampus: {
              type: 'object',
              additionalProperties: { type: 'number' },
              example: { 'วิทยาเขตบางเขน': 25, 'วิทยาเขตกำแพงแสน': 15 }
            },
            byType: {
              type: 'object',
              additionalProperties: { type: 'number' },
              example: { 'ชมรมด้านวิชาการ': 12, 'ชมรมด้านกีฬา': 8 }
            },
            topViewed: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  views: { type: 'number' }
                }
              }
            }
          }
        },

        // Response Schemas
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
            total: { type: 'number' },
            message: { type: 'string' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
            error: { type: 'string' }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'Authentication endpoints'
      },
      {
        name: 'Projects',
        description: 'Project management endpoints'
      },
      {
        name: 'Organizations',
        description: 'Organization management endpoints'
      },
      {
        name: 'Campuses',
        description: 'Campus information endpoints'
      },
      {
        name: 'Organization Types',
        description: 'Organization type endpoints'
      }
    ],
    paths: {
      // Authentication
      '/api/auth/get-token': {
        post: {
          tags: ['Authentication'],
          summary: 'Get authentication token',
          description: 'Get JWT token for API access using client secret',
          security: [{ clientSecret: [] }],
          responses: {
            200: {
              description: 'Token generated successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/TokenResponse' }
                }
              }
            },
            403: {
              description: 'Invalid client secret',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' }
                }
              }
            }
          }
        }
      },

      // Projects
      '/api/projects': {
        get: {
          tags: ['Projects'],
          summary: 'Get all projects',
          description: 'Retrieve all projects from SAKU API',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Projects retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Project' }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            },
            401: { $ref: '#/components/responses/UnauthorizedError' },
            500: { $ref: '#/components/responses/InternalServerError' }
          }
        }
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
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: {
              description: 'Project retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/Project' }
                        }
                      }
                    ]
                  }
                }
              }
            },
            404: {
              description: 'Project not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' }
                }
              }
            }
          }
        }
      },
      '/api/projects/organization/{orgId}': {
        get: {
          tags: ['Projects'],
          summary: 'Get projects by organization',
          description: 'Retrieve all projects for a specific organization',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'orgId',
              in: 'path',
              required: true,
              description: 'Organization ID',
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: {
              description: 'Projects retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Project' }
                          },
                          organizationId: { type: 'string' }
                        }
                      }
                    ]
                  }
                }
              }
            }
          }
        }
      },
      '/api/projects/campus/{campusName}': {
        get: {
          tags: ['Projects'],
          summary: 'Get projects by campus',
          description: 'Retrieve all projects for a specific campus',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'campusName',
              in: 'path',
              required: true,
              description: 'Campus name (URL encoded)',
              schema: { type: 'string', example: 'วิทยาเขตบางเขน' }
            }
          ],
          responses: {
            200: {
              description: 'Projects retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Project' }
                          },
                          campus: { type: 'string' }
                        }
                      }
                    ]
                  }
                }
              }
            }
          }
        }
      },
      '/api/projects/stats': {
        get: {
          tags: ['Projects'],
          summary: 'Get project statistics',
          description: 'Retrieve comprehensive project statistics',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Statistics retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/ProjectStats' }
                        }
                      }
                    ]
                  }
                }
              }
            }
          }
        }
      },

      // Organizations
      '/api/organizations': {
        get: {
          tags: ['Organizations'],
          summary: 'Get all organizations',
          description: 'Retrieve all organizations from SAKU API',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Organizations retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Organization' }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          }
        }
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
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: {
              description: 'Organization retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/Organization' }
                        }
                      }
                    ]
                  }
                }
              }
            },
            404: {
              description: 'Organization not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' }
                }
              }
            }
          }
        }
      },
      '/api/organizations/{id}/views': {
        put: {
          tags: ['Organizations'],
          summary: 'Update organization views',
          description: 'Update view count for an organization (Note: Not supported with external API)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'Organization ID',
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: {
              description: 'Views update response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' },
                      data: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          currentViews: { type: 'number' },
                          note: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/organizations/stats': {
        get: {
          tags: ['Organizations'],
          summary: 'Get organization statistics',
          description: 'Retrieve comprehensive organization statistics',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Statistics retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/OrganizationStats' }
                        }
                      }
                    ]
                  }
                }
              }
            }
          }
        }
      },

      // Campuses
      '/api/campuses': {
        get: {
          tags: ['Campuses'],
          summary: 'Get all campuses',
          description: 'Retrieve list of all available campuses',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Campuses retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'array',
                            items: { type: 'string' },
                            example: [
                              'วิทยาเขตบางเขน',
                              'วิทยาเขตกำแพงแสน',
                              'วิทยาเขตเฉลิมพระเกียรติ จังหวัดสกลนคร',
                              'วิทยาเขตศรีราชา',
                              'โครงการจัดตั้ง วิทยาเขตสุพรรณบุรี',
                              'สถาบันสมทบ'
                            ]
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          }
        }
      },

      // Organization Types
      '/api/organization-types': {
        get: {
          tags: ['Organization Types'],
          summary: 'Get all organization types',
          description: 'Retrieve list of all organization types',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Organization types retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'array',
                            items: { type: 'string' },
                            example: [
                              'องค์การนิสิต',
                              'ชมรมด้านศิลปวัฒนธรรม',
                              'ชมรมด้านบำเพ็ญประโยชน์',
                              'ชมรมด้านวิชาการ',
                              'ชมรมด้านกีฬา',
                              'กลุ่มกิจกรรมนิสิต',
                              'สโมสรนิสิต'
                            ]
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          }
        }
      }
    },
    responses: {
      UnauthorizedError: {
        description: 'Access token is missing or invalid',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' }
          }
        }
      },
      InternalServerError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 20px 0 }
      .swagger-ui .scheme-container { background: #fafafa; padding: 10px; border-radius: 4px; margin: 20px 0 }
    `,
    customSiteTitle: "KU Club API Documentation",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      tryItOutEnabled: true,
      filter: true,
      deepLinking: true
    }
  }));

  console.log(`📚 Swagger documentation available at: http://localhost:${process.env.PORT || 4000}/api-docs`);
};

export default specs;