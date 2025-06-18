import { Request, Response } from "express";
import { APIService } from "../services/apiService";
import { APICampus } from "../interface/saku_api";

export const getCampuses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const campuses = await APIService.getAllCampuses();
    res.status(200).json({
      success: true,
      data: campuses,
    });
  } catch (error) {
    console.error("Error fetching campuses:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
