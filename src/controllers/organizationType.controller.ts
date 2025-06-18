import { Request, Response } from 'express';
import { APIService } from "../services/apiService";
import { APIOrganizationType } from '../interface/saku_api';

export const getOrganizationTypes = async (req: Request, res: Response): Promise<void> => {
  try {
    const organizationTypes = await APIService.getAllOrganizationTypes();
    res.status(200).json({
      success: true,
      data: organizationTypes
    });
  } catch (error) {
    console.error("Error fetching organization types:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};
