import express, { type Express } from "express";

export const initializeApp = async (app: Express) => {
  app.use("/public/", express.static(__dirname + "/public"));
};
