import { CommonModule } from '@angular/common';
import { MaterialModule } from './../material.module';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [SignupComponent, LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    MaterialModule
  ]
})
export class AuthModule {}
