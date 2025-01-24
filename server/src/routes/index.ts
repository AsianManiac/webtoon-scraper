import scraperRoutes from "./scraperRoutes";
import webtoonRoutes from "./webtoonRoutes";

import bodyParser from "body-parser";
import { type Express, type Request, type Response } from "express";

const useRoutes = (app: Express) => {
  app.get("/", (req: Request, res: Response) => {
    const data = {
      message: `Welcome to 'Scrapper' App API`,
      status: "success",
      documentation: "Documentation here @ https://link.com",
      info: "This application is running successfully on server. You may test other endpoints for certain features checks",
    };
    res.json({ ...data });
  });

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use("/webtoons", webtoonRoutes);
  app.use("/scraper", scraperRoutes);
};

export default useRoutes;
