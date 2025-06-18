import dotenv from "dotenv";
import { KUClubAPIResponse } from "../interface/saku_api";

dotenv.config();

interface TRPCResponse {
  result?: {
    data?: {
      json?: KUClubAPIResponse;
    };
  };
}

export const fetchKUClubData = async (
  organizationId?: string
): Promise<KUClubAPIResponse> => {
  try {
    let url = `${process.env.SAKU_API_URL_GET_KUCLUB}`;

    if (organizationId) {
      const params = new URLSearchParams({
        input: JSON.stringify({ organizationId }),
      });
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} - ${response.statusText}`
      );
    }

    const data = (await response.json()) as TRPCResponse;

    const actualData = data.result?.data?.json;

    if (!actualData) {
      console.warn("No data found in TRPC response");
      return {
        projects: [],
        organizations: [],
        campuses: [],
        organizationsType: [],
      };
    }

    // Transform projects to map public_id to id
    const transformedProjects = (actualData.projects || []).map((project) => {
      const { public_id, ...rest } = project as any;
      return {
        ...rest,
        id: public_id || project.id, // Use public_id if available, fallback to id
      };
    });

    const result: KUClubAPIResponse = {
      projects: transformedProjects,
      organizations: Array.isArray(actualData.organizations)
        ? actualData.organizations
        : [],
      campuses: Array.isArray(actualData.campuses)
        ? actualData.campuses
        : Array.isArray(actualData.campus)
        ? actualData.campus
        : [], // Handle both 'campuses' and 'campus' field names
      organizationsType: Array.isArray(actualData.organizationsType)
        ? actualData.organizationsType
        : Array.isArray(actualData.organizationType)
        ? actualData.organizationType
        : [], // Handle both field name variations
    };

    return result;
  } catch (error) {
    console.error("Error fetching KU Club data:", error);

    // Return empty structure on error
    return {
      projects: [],
      organizations: [],
      campuses: [],
      organizationsType: [],
    };
  }
};
