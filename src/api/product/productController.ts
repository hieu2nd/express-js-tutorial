import type { Request, RequestHandler, Response } from "express";

import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { logger } from "@/server";
import { CreateProductPayload, UpdateProductPayload } from "./productModel";
import { productService } from "./productService";

class ProductController {
  public getProducts: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await productService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };

  public getProduct: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await productService.findById(req, res);
    return handleServiceResponse(serviceResponse, res);
  };
  public createProduct: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await productService.create(req);
    return handleServiceResponse(serviceResponse, res);
  };
  public deleteProduct: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await productService.delete(req);
    return handleServiceResponse(serviceResponse, res);
  };
  public updateProduct: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await productService.update(req);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const productController = new ProductController();
