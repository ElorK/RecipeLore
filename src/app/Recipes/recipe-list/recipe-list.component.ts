import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Recipe } from '../Models/recipe';
import { RecipeService } from '../recipe.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipeList: Recipe[] = [];
  private recipeSub?: Subscription;
  selectedRecipe?: Recipe = undefined;


  constructor(public recipeService: RecipeService) { };

  ngOnInit() {
    this.recipeService.getRecipes();
    this.recipeSub = this.recipeService.getRecipesUpdateListener()
      .subscribe((recipeList: Recipe[]) => {
        this.recipeList = recipeList
      });
  }
  ngOnDestroy() {
    this.recipeSub?.unsubscribe();
  }
  onDelete(recipeId: string){
    this.recipeService.deleteRecipe(recipeId);
    this.selectedRecipe = undefined;
  }
  selectRecipe(recipe: Recipe) {
    this.selectedRecipe = recipe;
  }

}
