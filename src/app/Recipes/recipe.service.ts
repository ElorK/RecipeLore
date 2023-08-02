import { Injectable } from '@angular/core';
import { Recipe } from './Models/recipe';
import { Subject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private recipes: Recipe[] = [];
  private recipesUpdated = new Subject<Recipe[]>();
  private path = "http://localhost:3000/api/recipes/"

  constructor(private http: HttpClient) { }

  getRecipes() {
    this.http.get<{ message: string, recipes: any[] }>(this.path)
      .pipe(map((data) => {
        return data.recipes.map((recipe) => {
          return {
            id: recipe._id,
            name: recipe.name,
            category: recipe.category,
            ingredients: recipe.ingredients,
            process: recipe.process,
            imageUrl: recipe.imageUrl
          }
        }
        )
      }
      ))
      .subscribe((recipes) => {
        this.recipes = recipes;
        this.recipesUpdated.next([...this.recipes]);
      });
  }

  getRecipesUpdateListener() {
    return this.recipesUpdated.asObservable();
  }

  getRecipe(id: string) {
    return this.http.get<{_id: string, name: string, category: string, ingredients: string[], process: string[], imageUrl: string}>(this.path + id);
  }

  addRecipe(newRecipe: Recipe) {
    this.http.post<{ message: string, recipeId: string }>(this.path, newRecipe)
      .subscribe((resData) => {
        const id = resData.recipeId;
        newRecipe.id = id;
        this.recipes.push(newRecipe);
        this.recipesUpdated.next([...this.recipes]);
      });
  }

  updateRecipe(recipe: Recipe) {
    this.http.put(this.path + recipe.id, recipe)
      .subscribe((response) => {
        const updatedRecipes = [...this.recipes];
        const oldRecipeIndex = updatedRecipes.findIndex(r => r.id === recipe.id);
        updatedRecipes[oldRecipeIndex] = recipe;
        this.recipes = updatedRecipes;
        this.recipesUpdated.next([...this.recipes]);
      }
      )
  }

  deleteRecipe(recipeId: string) {
    this.http.delete(this.path + recipeId)
      .subscribe(() => {
        const updateRecipes = this.recipes.filter(recipe => recipe.id !== recipeId);
        this.recipes = updateRecipes;
        this.recipesUpdated.next([...this.recipes])
      })
  }
}
