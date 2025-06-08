import { Request, Response } from "express";
import { query } from "../configs/db";
import { Organization } from "../interface/organization";

export const getOrganizationsAll = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await query(
      `SELECT 
        o.id, 
        o.orgnameen, 
        o.orgnameth, 
        o."organizationMark", 
        o.org_image, 
        o.description,
        o.instagram,
        o.facebook,
        o.views, 
        o.org_nickname,
        ot.name as org_type_name,
        c.name as campus_name
      FROM "Organization" o
      LEFT JOIN "OrganizationType" ot ON o.org_typeid = ot.id
      LEFT JOIN "Campus" c ON o.campusid = c.id
      ORDER BY o.views DESC`
    );
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error("Error fetching organizations:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};

export const getOrganizationById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const orgId = req.params.id;
  if (!orgId) {
    res.status(400).json({ 
      success: false,
      message: "Organization ID is required" 
    });
    return;
  }
  try {
    const result = await query(
      `SELECT 
        o.id, 
        o.orgnameen, 
        o.orgnameth, 
        o.details,
        o."organizationMark", 
        o.org_image, 
        o.description, 
        o.instagram, 
        o.facebook, 
        o.views, 
        o.org_nickname,
        ot.name as org_type_name,
        c.name as campus_name
      FROM "Organization" o
      LEFT JOIN "OrganizationType" ot ON o.org_typeid = ot.id
      LEFT JOIN "Campus" c ON o.campusid = c.id
      WHERE o.id = $1`,
      [orgId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ 
        success: false,
        message: "Organization not found" 
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Error fetching organization by ID:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};