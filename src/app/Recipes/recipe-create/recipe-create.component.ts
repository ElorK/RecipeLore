import { Component } from '@angular/core';
import { Recipe } from '../Models/recipe';
import { FormArray, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css']
})
export class RecipeCreateComponent {
  form!: FormGroup;
  imageUrl = "assets/placeholder.png";
  isLoading = false;

  // For Edit Mode
  currentRecipe?: Recipe;
  private _mode = 'create';
  private _recipeId?: string;
  //

  constructor(public dialog: MatDialog, public recipeService: RecipeService, private _formBuilder: FormBuilder, public route: ActivatedRoute) {
    this.form = this._formBuilder.group({
      id: 0,
      name: ['', Validators.required],
      category: ['', Validators.required],
      ingredients: this._formBuilder.array([this.addStringField()]),
      process: this._formBuilder.array([this.addStringField()]),
      imageUrl: ['', Validators.required],
      image: [null, { validators: [Validators.required], asyncValidators: [mimeType] }]
    });
  }

  ngOnInit() {
    // For Edit Mode
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('recipeId')) {
        this._mode = 'edit';
        this._recipeId = paramMap.get('recipeId')!;
        this.isLoading = true;
        this.recipeService.getRecipe(this._recipeId).subscribe(recipe => {
          this.isLoading = false;
          this.currentRecipe = {
            id: recipe._id,
            name: recipe.name,
            category: recipe.category,
            ingredients: recipe.ingredients,
            process: recipe.process,
            imageUrl: recipe.imageUrl
          };
          this.imageUrl = recipe.imageUrl;
          this.form = this._formBuilder.group({
            id: this.currentRecipe!.id,
            name: [this.currentRecipe!.name, Validators.required],
            category: [this.currentRecipe!.category, Validators.required],
            ingredients: this._formBuilder.array([]),
            process: this._formBuilder.array([]),
            imageUrl: [this.currentRecipe!.imageUrl, Validators.required],
            image: [null, { validators: [Validators.required], asyncValidators: [mimeType] }]
          });
          
          this.currentRecipe!.ingredients.forEach(string => {
            this.subArrayAdd(this.ingArray, string);
          });
          this.currentRecipe!.process.forEach(string => {
            this.subArrayAdd(this.procArray, string);
          });
        });
      }
      else {
        this._mode = 'create';
        this._recipeId = undefined;
        this.form = this._formBuilder.group({
          id: 0,
          name: ['', Validators.required],
          category: ['', Validators.required],
          ingredients: this._formBuilder.array([this.addStringField()]),
          process: this._formBuilder.array([this.addStringField()]),
          imageUrl: ['', Validators.required],
          image: [null, { validators: [Validators.required], asyncValidators: [mimeType] }]
        });
      }
    })
    //
  }
  addStringField(string?: string) {
    if (!string) {
      return this._formBuilder.group({
        text: ['', Validators.required]
      })
    }
    else {
      return this._formBuilder.group({
        text: [string, Validators.required]
      })
    }
  }

  get ingArray() {
    return <FormArray>this.form.get('ingredients');
  }
  get procArray() {
    return <FormArray>this.form.get('process');
  }

  subArrayAdd(subArr: FormArray<any>, string?: string) {
    if (!string) {
      subArr.push(this.addStringField());
    }
    else {
      subArr.push(this.addStringField(string));
    }
  }

  subArrayDelete(subArr: FormArray<any>, i: number) {
    if (subArr.length - 1 <= 0) {
      this.dialog.open(PopupDialog);
    }
    else {
      subArr.removeAt(i);
    }
  }
  subArrayReset(subArr: FormArray<any>) {
    for (let i = subArr.length; i >= 1; i--) {
      subArr.removeAt(i);
    }
  }


  onUpload(e: Event) {
    const file = (e.target as HTMLInputElement).files![0];
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  submitHandler(formDirective: FormGroupDirective) {
    if (this.form.value.imageUrl != ''){
      this.form.controls['image'].clearValidators();
      this.form.controls['image'].clearAsyncValidators();
      this.form.controls['image'].updateValueAndValidity();
    }
    if (this.form.value.image != null){
      this.form.controls['imageUrl'].clearValidators();
      this.form.controls['imageUrl'].updateValueAndValidity();
    }
    if (this.form.valid) {
      this.isLoading = true;
      if (this._mode === 'create') {
        const newRecipe: Recipe = {
          id: '',
          name: this.form.value.name,
          category: this.form.value.category,
          ingredients: (this.ingArray.value as Array<any>).map(object => object.text),
          process: (this.procArray.value as Array<any>).map(object => object.text),
          imageUrl: this.form.value.imageUrl
        };
        this.recipeService.addRecipe(newRecipe, this.form.value.image);
        this.subArrayReset(this.ingArray);
        this.subArrayReset(this.procArray);
        formDirective.resetForm();
        this.form.reset();
      }
      else {
        this.currentRecipe!.name = this.form.value.name;
        this.currentRecipe!.category = this.form.value.category;
        this.currentRecipe!.ingredients = (this.ingArray.value as Array<any>).map(object => object.text),
          this.currentRecipe!.process = (this.procArray.value as Array<any>).map(object => object.text),
          this.currentRecipe!.imageUrl = this.form.value.imageUrl
        this.recipeService.updateRecipe(this.currentRecipe!, this.form.value.image);
      };
    }
  }
}

@Component({
  selector: 'popup-dialog',
  templateUrl: './popup-dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class PopupDialog { }