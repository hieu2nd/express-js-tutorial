import type { Request, RequestHandler, Response } from "express";

import { categoryService } from "@/api/category/categoryService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class CategoryController {
  public getCategories: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await categoryService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };

  public getCategory: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await categoryService.findById(req, res);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const categoryController = new CategoryController();
