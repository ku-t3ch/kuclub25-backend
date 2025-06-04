import { Request, Response } from "express";
import { query } from "../configs/db";

export const getCampuses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await query(
      `SELECT id, name FROM "Campus"`
    );
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error("Error fetching campuses:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};