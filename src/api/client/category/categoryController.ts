import type { Request, RequestHandler, Response } from "express";

import { categoryService } from "@/api/client/category/categoryService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

interface ICategoryController {
  getCategories: RequestHandler;
}

class CategoryController implements ICategoryController {
  public getCategories: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await categoryService.findAll({ isAdmin: false });
    return handleServiceResponse(serviceResponse, res);
  };
}

export const categoryController = new CategoryController();
