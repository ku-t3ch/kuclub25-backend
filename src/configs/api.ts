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

    console.log("Fetching KU Club data from:", url);

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
    console.log("Raw TRPC response:", JSON.stringify(data, null, 2));

    const actualData = data.result?.data?.json;

    if (!actualData) {
      console.warn("No data found in TRPC response");
      return {
        projects: [],
        organizations: [],
      };
    }

    const result: KUClubAPIResponse = {
      projects: Array.isArray(actualData.projects) ? actualData.projects : [],
      organizations: Array.isArray(actualData.organizations) ? actualData.organizations : [],
    };

    console.log(`Fetched ${result.organizations.length} organizations and ${result.projects.length} projects`);
    return result;

  } catch (error) {
    console.error("Error fetching KU Club data:", error);
    return {
      projects: [],
      organizations: [],
    };
  }
};