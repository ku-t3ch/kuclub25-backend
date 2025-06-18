import { fetchKUClubData } from "../configs/api";
import {
  APIProject,
  APIOrganization,
  APICampus,
  APIOrganizationType,
} from "../interface/saku_api";

export class APIService {
  static async getAllProjects(): Promise<APIProject[]> {
    const data = await fetchKUClubData();
    return data.projects;
  }

  static async getProjectById(projectId: string): Promise<APIProject | null> {
    const data = await fetchKUClubData();
    return data.projects.find((project) => project.id === projectId) || null;
  }

  static async getProjectsByOrganization(
    organizationId: string
  ): Promise<APIProject[]> {
    const data = await fetchKUClubData();
    return data.projects.filter(
      (project) => project.organization_orgid === organizationId
    );
  }

  static async getAllOrganizations(): Promise<APIOrganization[]> {
    const data = await fetchKUClubData();
    return data.organizations;
  }

  static async getOrganizationById(
    organizationId: string
  ): Promise<APIOrganization | null> {
    const data = await fetchKUClubData();
    return data.organizations.find((org) => org.id === organizationId) || null;
  }

  static async getAllCampuses(): Promise<APICampus[]> {
    const data = await fetchKUClubData();
    return data.campuses;
  }

  static async getAllOrganizationTypes(): Promise<APIOrganizationType[]> {
    const data = await fetchKUClubData();
    return data.organizationsType;
  }

  static async updateOrganizationViewCount(
    organizationId: string
  ): Promise<APIOrganization | null> {
    try {
      const updateUrl = `${process.env.SAKU_API_URL}/api/organization/${organizationId}/view`;
      const response = await fetch(updateUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SECRET_KEY_KUCLUB}`,
        },
        body: JSON.stringify({
          action: "increment_view",
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update view count: ${response.status}`);
      }
      const updatedData = await response.json();
      return updatedData.organization || null;
    } catch (error) {
      console.error("Error updating view count:", error);
      return null;
    }
  }
}
