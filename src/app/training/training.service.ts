import { Injectable } from '@angular/core';
//import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import { Exercises } from './exercise.model';
import { map } from 'rxjs/operators';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class TrainingService{

  exerciseChanged = new Subject<Exercises>();
  exercisesChanged = new Subject<Exercises[]>();
  finishedExercisesChanged = new Subject<Exercises[]>();
  private  availableExercises: Exercises[] = [];
  private runningExercise: Exercises;

  constructor(private db: AngularFirestore) { }

  fetchAvailableExercises(){
    this.db
    .collection('availableExercises')
    .snapshotChanges()
    .pipe(map(docArray => {
      return docArray.map(doc => {
        return {
          id: doc.payload.doc.id,
          name: doc.payload.doc.data()['name'],
          duration : doc.payload.doc.data()['duration'],
          calories : doc.payload.doc.data()['calories']
        };
      });
    }))
    .subscribe((exercises : Exercises[]) =>{
      this.availableExercises = exercises;
      this.exercisesChanged.next([...this.availableExercises]);
    });
  }

  startExercise(selectedId: string){
    this.runningExercise = this.availableExercises.find(
      ex => ex.id === selectedId );
      this.exerciseChanged.next({...this.runningExercise});
  }

  completeExercise(){
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration,
      calories: this.runningExercise.calories,
      date: new Date(),
      state: 'completed'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number){
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress/100),
      calories: this.runningExercise.calories * (progress/100),
      date: new Date(),
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise(){
    return {...this.runningExercise };
  }

  fetchCompletedOrCancelledExercises(){
    this.db.collection('finishedExercises').valueChanges()
    .subscribe((exercises : Exercises[]) => {
      this.finishedExercisesChanged.next(exercises);
    });
  }

  private addDataToDatabase(exercise: Exercises){
    this.db.collection('finishedExercises').add(exercise);
  }
}
