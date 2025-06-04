import { Request, Response } from 'express';
import { query } from '../configs/db';
import { OrganizationType } from '../interface/organizationType';

export const getOrganizationTypes = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await query(
        'SELECT id, name FROM "OrganizationType" ORDER BY name ASC'
    );
    
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error("Error fetching organization types:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};
