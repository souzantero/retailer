import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { Food } from "../../domain/models/food"
import { useNotifier } from "./useNotifier"
import { useRepository } from "./useRepository"

export type Result = {
  food?: Food
  isLoading: boolean
}

export function useFood(foodId: string): Result {
  const { notify } = useNotifier()
  const repository = useRepository()
  const { data: food, isLoading, error } = useQuery([`food/${foodId}`], () => repository.food.loadOneById(foodId), {
    refetchOnWindowFocus: true
  })

  useEffect(() => {
    if (error) {
      const description = error instanceof Error ? error.message : ''

      notify({
        status: 'error',
        title: 'Falha ao buscar o alimento.',
        description
      })
    }
  }, [error])

  return { food, isLoading }
}