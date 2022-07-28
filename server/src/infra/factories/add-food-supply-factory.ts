import { PrismaClient } from "@prisma/client";
import { AddFoodSupply } from "../../domain/usecases/add-food-supply";
import { FoodSupplyPrismaRepository } from "../repositories/prisma/food-supply-prisma-repository";
import { UuidAdapter } from "../adapters/uuid-adapter";
import { FoodPrismaRepository } from "../repositories/prisma/food-prisma-repository";

export const makeAddFoodSupply = (prisma: PrismaClient) => {
  const uuidAdapter = new UuidAdapter()
  const foodSupplyRepository = new FoodSupplyPrismaRepository(prisma)
  const foodRepository = new FoodPrismaRepository(prisma)
  return new AddFoodSupply(uuidAdapter, foodSupplyRepository, foodRepository)
}