import { Component, Input } from '@angular/core';
import { Recipe } from '../Models/recipe';

@Component({
  selector: 'recipe-page',
  templateUrl: './recipe-page.component.html',
  styleUrls: ['./recipe-page.component.css']
})
export class RecipePageComponent {
  @Input() recipe!: Recipe
}
