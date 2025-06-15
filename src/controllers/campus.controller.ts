import { Request, Response } from "express";

export const getCampuses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const campuses = [
      "วิทยาเขตบางเขน",
      "วิทยาเขตกำแพงแสน",
      "วิทยาเขตเฉลิมพระเกียรติ จังหวัดสกลนคร",
      "วิทยาเขตศรีราชา",
      "โครงการจัดตั้ง วิทยาเขตสุพรรณบุรี",
      "สถาบันสมทบ"
    ];
    
    res.status(200).json({
      success: true,
      data: campuses
    });
  } catch (error) {
    console.error("Error fetching campuses:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};