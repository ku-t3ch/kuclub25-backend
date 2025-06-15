import { fetchKUClubData } from "../configs/api";
import { APIProject, APIOrganization } from "../interface/saku_api";

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
    return data.projects.filter((project) => project.organization_orgid === organizationId);
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

  static async getProjectStats() {
    const data = await fetchKUClubData();

    return {
      totalProjects: data.projects.length,
      totalOrganizations: data.organizations.length,
    };
  }

  static async getUniqueCampuses(): Promise<string[]> {
    const data = await fetchKUClubData();
    const campusSet = new Set<string>();

    data.organizations.forEach((org) => {
      if (org.campus?.name) {
        campusSet.add(org.campus.name);
      }
    });

    return Array.from(campusSet).sort();
  }

  static async getUniqueOrganizationTypes(): Promise<string[]> {
    const data = await fetchKUClubData();
    const typeSet = new Set<string>();

    data.organizations.forEach((org) => {
      if (org.org_type?.name) {
        typeSet.add(org.org_type.name);
      }
    });

    return Array.from(typeSet).sort();
  }
}