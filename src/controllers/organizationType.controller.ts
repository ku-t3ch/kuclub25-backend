import { Request, Response } from 'express';

export const getOrganizationTypes = async (req: Request, res: Response): Promise<void> => {
  try {
    const organizationTypes = [
      "องค์การนิสิต",
      "ชมรมด้านศิลปวัฒนธรรม",
      "ชมรมด้านบำเพ็ญประโยชน์",
      "ชมรมด้านวิชาการ",
      "ชมรมด้านกีฬา",
      "กลุ่มกิจกรรมนิสิต",
      "สโมสรนิสิต"
    ];
    
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
