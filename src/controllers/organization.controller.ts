import { Request, Response } from "express";
import { APIService } from "../services/apiService";
import { APIOrganization } from "../interface/saku_api";

const transformOrganization = (org: APIOrganization) => ({
  ...org,
  org_type_name: org.org_type?.name,
  campus_name: org.campus?.name,
});

export const getOrganizationsAll = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const organizations = await APIService.getAllOrganizations();

    if (!organizations || organizations.length === 0) {
      res.status(200).json({
        success: true,
        data: [],
        message: "No organizations found",
      });
      return;
    }

    const transformedOrganizations = organizations.map(transformOrganization);

    res.status(200).json({
      success: true,
      data: transformedOrganizations,
      total: transformedOrganizations.length,
    });
  } catch (error) {
    console.error("Error fetching organizations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch organizations",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getOrganizationById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate ID parameter
    if (!id || typeof id !== "string") {
      res.status(400).json({
        success: false,
        message: "Valid organization ID is required",
      });
      return;
    }

    const organization = await APIService.getOrganizationById(id);

    if (!organization) {
      res.status(404).json({
        success: false,
        message: "Organization not found",
      });
      return;
    }

    const transformedOrganization = transformOrganization(organization);

    res.status(200).json({
      success: true,
      data: transformedOrganization,
    });
  } catch (error) {
    console.error("Error fetching organization by ID:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch organization",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
