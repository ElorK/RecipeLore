import { Injectable } from '@angular/core';
import { Recipe } from './Models/recipe';
import { Subject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private recipes: Recipe[] = [];
  private recipesUpdated = new Subject<Recipe[]>();
  private path = "http://localhost:3000/api/recipes/";

  constructor(private http: HttpClient, private router: Router) { }

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
        })
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
    return this.http.get<{ _id: string, name: string, category: string, ingredients: string[], process: string[], imageUrl: string }>(this.path + id);
  }

  addRecipe(newRecipe: Recipe, image?: File) {
    let recipeObject;
    if (image) {
      recipeObject = this.formDataCreator(newRecipe, image);
    }
    else {
      recipeObject = newRecipe;
    }
    this.http.post<{ message: string, recipeId: string }>(this.path, recipeObject)
      .subscribe((resData) => {
        const id = resData.recipeId;
        newRecipe.id = id;
        this.recipes.push(newRecipe);
        this.recipesUpdated.next([...this.recipes]);
        this.onFinish();
      });
  }

  updateRecipe(recipe: Recipe, image?: File) {
    let recipeObject;
    if (image) {
      recipeObject = this.formDataCreator(recipe, image);
    }
    else {
      recipeObject = recipe;
    }
    console.log(recipeObject);
    this.http.put(this.path + recipe.id, recipeObject)
      .subscribe((response) => {
        const updatedRecipes = [...this.recipes];
        const oldRecipeIndex = updatedRecipes.findIndex(r => r.id === recipe.id);
        updatedRecipes[oldRecipeIndex] = recipe;
        this.recipes = updatedRecipes;
        this.recipesUpdated.next([...this.recipes]);
        this.onFinish();
      }
      )
  }

  deleteRecipe(recipeId: string) {
    this.http.delete(this.path + recipeId)
      .subscribe(() => {
        const updateRecipes = this.recipes.filter(recipe => recipe.id !== recipeId);
        this.recipes = updateRecipes;
        this.recipesUpdated.next([...this.recipes])
        this.onFinish();
      })
  }
  onFinish() {
    this.router.navigate(['/'])
  }
  formDataCreator(recipe: Recipe, image: File){
    const recipeData = new FormData();
    Object.entries(recipe).forEach(([key, value]) => {
      if (typeof value == "string") {
        recipeData.append(key, value);
      }
      else {
        for (let i = 0; i < value.length; i++) {
          recipeData.append(key, value[i]);
        }
      }
    });
    recipeData.append("image", image, recipe.name);
    return recipeData;
  }
}

