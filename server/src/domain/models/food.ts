import { SuppliedFoodModel } from "./supplied-food"

export type FoodModel = {
  id: string
  name: string
  createdAt: Date
  updatedAt?: Date
  deletedAt?: Date
  suppliedFoods?: SuppliedFoodModel[]
}