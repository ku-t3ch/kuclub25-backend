import { Request, Response } from "express";
import { APIService } from "../services/apiService";
import { transformProjectData } from "../utils/helperProject";
import { APIProject } from "../interface/saku_api";

// Helper function to transform project data
const transformProject = (project: APIProject) => {
  const transformedProject = {
    ...project,
    org_name_en: project.Organization?.orgnameen,
    org_name_th: project.Organization?.orgnameth,
    org_nickname: project.Organization?.org_nickname,
    campus_name: project.Organization?.campus?.name,
  };
  return transformProjectData(transformedProject);
};

// Get all projects
export const getAllProjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const projects = await APIService.getAllProjects();

    if (!projects || projects.length === 0) {
      res.status(200).json({
        success: true,
        data: [],
        message: "No projects found",
      });
      return;
    }

    const projectsWithParsedData = projects.map(transformProject);

    res.status(200).json({
      success: true,
      data: projectsWithParsedData,
      total: projectsWithParsedData.length,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error:
        process.env.NODE_ENV === "development"
          ? (error as Error).message
          : undefined,
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

    // Validate ID parameter
    if (!id || typeof id !== "string") {
      res.status(400).json({
        success: false,
        message: "Valid project ID is required",
      });
      return;
    }

    const project = await APIService.getProjectById(id);

    if (!project) {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    const projectData = transformProject(project);

    res.status(200).json({
      success: true,
      data: projectData,
    });
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
      error:
        process.env.NODE_ENV === "development"
          ? (error as Error).message
          : undefined,
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

    if (!orgId || typeof orgId !== "string") {
      res.status(400).json({
        success: false,
        message: "Valid organization ID is required",
      });
      return;
    }

    const projects = await APIService.getProjectsByOrganization(orgId);

    if (!projects || projects.length === 0) {
      res.status(200).json({
        success: true,
        data: [],
        message: "No projects found for this organization",
      });
      return;
    }

    const projectsWithParsedData = projects.map(transformProject);

    res.status(200).json({
      success: true,
      data: projectsWithParsedData,
      total: projectsWithParsedData.length,
      organizationId: orgId,
    });
  } catch (error) {
    console.error("Error fetching projects by organization:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects for organization",
      error:
        process.env.NODE_ENV === "development"
          ? (error as Error).message
          : undefined,
    });
  }
};
