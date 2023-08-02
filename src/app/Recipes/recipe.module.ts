import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeCreateComponent } from './recipe-create/recipe-create.component';
import { FlexLayoutModule } from "@angular/flex-layout";
import { RecipePageComponent } from './recipe-page/recipe-page.component';
import { AppRoutingModule } from '../app-routing.module';



@NgModule({
  declarations: [
    RecipeListComponent,
    RecipeCreateComponent,
    RecipePageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    MatListModule,
    MatGridListModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatDialogModule,
    FlexLayoutModule
  ],
  exports: [
    RecipeListComponent,
    RecipeCreateComponent
  ]
})
export class RecipeModule { }
