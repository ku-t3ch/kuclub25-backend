import { Request, Response } from "express";
import { query } from "../configs/db";
import {
  parseActivityHours,
  parseActivityFormat,
  parseExpectedOutcome,
  parseProjectObjectives,
  parseSchedule,
  parseOutsideKaset,
  transformProjectData,
} from "../utils/helperProject";

// Get all projects
export const getAllProjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await query(
      `SELECT 
        p.id, 
        p.date_start_the_project, 
        p.date_end_the_project, 
        p.project_location, 
        p.project_name_en, 
        p.project_name_th, 
        p.activity_hours,
        p.activity_format,
        p.expected_project_outcome,
        p.schedule,
        p.organization_orgid,
        p.outside_kaset,
        p.principles_and_reasoning,
        p.project_objectives,
        o.orgnameen as org_name_en,
        o.orgnameth as org_name_th,
        o.org_nickname,
        c.name as campus_name
      FROM "Project" p
      LEFT JOIN "Organization" o ON p.organization_orgid = o.id
      LEFT JOIN "Campus" c ON o.campusid = c.id
      WHERE p.project_status = 'SA1_SD_AT_Approved'
      ORDER BY p."createdAt" DESC`
    );

    const projectsWithParsedData = result.rows.map(transformProjectData);

    res.status(200).json({
      success: true,
      data: projectsWithParsedData,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get project by ID
export const getProjectById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
      return;
    }

    const result = await query(
      `SELECT 
        p.id, 
        p.date_start_the_project, 
        p.date_end_the_project, 
        p.project_location, 
        p.project_name_en, 
        p.project_name_th, 
        p.activity_hours,
        p.activity_format,
        p.expected_project_outcome,
        p.schedule,
        p.organization_orgid,
        p.outside_kaset,
        p.principles_and_reasoning,
        p.project_objectives,
        o.orgnameen as org_name_en,
        o.orgnameth as org_name_th,
        o.org_nickname,
        c.name as campus_name
      FROM "Project" p
      LEFT JOIN "Organization" o ON p.organization_orgid = o.id
      LEFT JOIN "Campus" c ON o.campusid = c.id
      WHERE p.project_status = 'SA1_SD_AT_Approved'
      AND p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    const projectData = transformProjectData(result.rows[0]);

    res.status(200).json({
      success: true,
      data: projectData,
    });
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get projects by organization
export const getProjectsByOrganization = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { orgId } = req.params;

    if (!orgId) {
      res.status(400).json({
        success: false,
        message: "Organization ID is required",
      });
      return;
    }

    const result = await query(
      `SELECT 
        p.id, 
        p.date_start_the_project, 
        p.date_end_the_project, 
        p.project_location, 
        p.project_name_en, 
        p.project_name_th, 
        p.activity_hours,
        p.activity_format,
        p.expected_project_outcome,
        p.schedule,
        p.organization_orgid,
        p.outside_kaset,
        p.principles_and_reasoning,
        p.project_objectives,
        o.orgnameen as org_name_en,
        o.orgnameth as org_name_th,
        o.org_nickname,
        c.name as campus_name
      FROM "Project" p
      LEFT JOIN "Organization" o ON p.organization_orgid = o.id
      LEFT JOIN "Campus" c ON o.campusid = c.id
      WHERE p.organization_orgid = $1
      AND p.project_status = 'SA1_SD_AT_Approved'
      ORDER BY p."createdAt" DESC`,
      [orgId]
    );

    const projectsWithParsedData = result.rows.map(transformProjectData);

    res.status(200).json({
      success: true,
      data: projectsWithParsedData,
    });
  } catch (error) {
    console.error("Error fetching projects by organization:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
