import { TrainingService } from './../training.service';
import { StopTrainingComponent } from './stop-training.component';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {
  @Output() trainingExit = new EventEmitter();
  progress=0;
  timer: number;

  constructor(private dailog: MatDialog, private trainingService: TrainingService) { }

  ngOnInit(): void {
    this.startOrResumeTimer();
  }

  startOrResumeTimer(){
    const step = this.trainingService.getRunningExercise().duration/100 * 1000;
    this.timer = setInterval(() => {
      this.progress = this.progress + 1;
      if(this.progress >= 100){
        this.trainingService.completeExercise();
        clearInterval(this.timer);
      }
    }, step);
  }

  onStop(){
    clearInterval(this.timer);
    const dailogRef = this.dailog.open(StopTrainingComponent, {data: {
      progress: this.progress
    }});

    dailogRef.afterClosed().subscribe( result =>{
      if(result)
      {
        this.trainingService.cancelExercise(this.progress);
      }else{
        this.startOrResumeTimer();
      }
    });
  }

}
