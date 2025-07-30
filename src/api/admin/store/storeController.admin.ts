import type { Request, RequestHandler, Response } from "express";

import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { storeService } from "./storeService.admin";

interface IStoreController {
  getStores: RequestHandler;
}

class StoreController implements IStoreController {
  public getStores: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await storeService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };
}

export const storeController = new StoreController();
