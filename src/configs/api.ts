import dotenv from "dotenv";
import { KUClubAPIResponse } from "../interface/saku_api";

dotenv.config();

const SAKU_API_URL = process.env.SAKU_API_URL;

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
    let url = SAKU_API_URL;

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
      return {
        projects: [],
        organizations: [],
      };
    }

    const result: KUClubAPIResponse = {
      projects: Array.isArray(actualData.projects) ? actualData.projects : [],
      organizations: Array.isArray(actualData.organizations) ? actualData.organizations : [],
    };

    return result;

  } catch (error) {
    return {
      projects: [],
      organizations: [],
    };
  }
};