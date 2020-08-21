import { UIService } from './../../shared/ui.service';
import { Subscription } from 'rxjs';
import { AuthService } from './../auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  maxDate;
  isLoading = false;
  private loadingSubs: Subscription;

  constructor(private authservice: AuthService,
              private uiService: UIService) { }

  ngOnInit() {
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  onSubmit(form: NgForm){
    this.authservice.registerUser({
      email : form.value.email,
      password : form.value.password
    });
  }

  ngOnDestroy() {
    if(this.loadingSubs)
    {
      this.loadingSubs.unsubscribe();
    }
  }
}
