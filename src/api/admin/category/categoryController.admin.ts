import type { Request, RequestHandler, Response } from "express";

import { handleServiceResponse } from "@/common/utils/httpHandlers";
import type { CreateCategoryPayload, UpdateCategoryPayload } from "./categoryModel.admin";
import { categoryService } from "./categoryService.admin";

interface ICategoryController {
  getCategories: RequestHandler;
  getCategory: RequestHandler;
  createCategory: RequestHandler;
  deleteCategory: RequestHandler;
  updateCategory: RequestHandler;
}

class CategoryController implements ICategoryController {
  public getCategories: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await categoryService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };
  public getCategory: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await categoryService.findById(req, res);
    return handleServiceResponse(serviceResponse, res);
  };
  public createCategory: RequestHandler = async (req: Request<any, any, CreateCategoryPayload>, res: Response) => {
    const serviceResponse = await categoryService.create(req);
    return handleServiceResponse(serviceResponse, res);
  };
  public deleteCategory: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await categoryService.delete(req);
    return handleServiceResponse(serviceResponse, res);
  };
  public updateCategory: RequestHandler = async (req: Request<any, any, UpdateCategoryPayload>, res: Response) => {
    const serviceResponse = await categoryService.update(req);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const categoryController = new CategoryController();
