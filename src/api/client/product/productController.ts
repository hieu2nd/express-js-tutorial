import type { Request, RequestHandler, Response } from "express";

import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { productService } from "./productService";

interface IProductController {
  getProducts: RequestHandler;
  getProduct: RequestHandler;
}

class ProductController implements IProductController {
  public getProducts: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await productService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };

  public getProduct: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await productService.findById(req, res);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const productController = new ProductController();
