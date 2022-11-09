import { Injectable } from '@angular/core';
import { Assignment } from '../assignments/assignment.model';
import { Observable, of } from 'rxjs';
import { LoggingService } from './logging.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import{ catchError, map, tap } from 'rxjs/operators';

@Injectable({ // injecter tous les services qui ont provideIn root à la racine directement
  // Permet d'éviter d'ajouter les services dans les modules
  providedIn: 'root'
})
export class AssignmentsService {
  private HttpOptions ={
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  assignments:Assignment[] = []

  constructor(private loggingService:LoggingService,
              private http:HttpClient) { }

  url = "http://localhost:8010/api/assignments";
  
  getAssignments():Observable<Assignment[]>{
    return this.http.get<Assignment[]>(this.url)
    //return of(this.assignments); // Tranforme le tableau en un observable
  }

  getAssignment(id:number):Observable<Assignment|undefined>{
    return this.http.get<Assignment>(this.url + "/" + id).
    pipe(map(a => {
      a.nom += "transformé avec un pipe...";
      return a;
    }),
    tap(_ => {
      console.log("tap: assignment avec id = " + id + " requête GET envoyée sur MongDB cloud");
    }),
    catchError(this.handleError<Assignment>(`getAssignment(id=${id})`))
    );
  }

  private handleError<T>(operation: any, result?: T) {
    return (error: any): Observable<T> => {
      console.log(error); // pour afficher dans la console
      console.log(operation + ' a échoué ' + error.message);
 
      return of(result as T);
    }
 };
 

  // Ajout d'un assignment
  addAssignment(assignment: Assignment): Observable<any>{
    // this.assignments.push(assignment); // Ajout d'un assignment

    // this.loggingService.log(assignment.nom, "ajouté");

    // return of('Assignment ajouté'); // on retourne une chaine de caractère
    return this.http.post<Assignment>(this.url, assignment, this.HttpOptions);
  }

  // Modification d'un assignment
  updateAssignment(assignment: Assignment): Observable<any>{
    return this.http.put<Assignment>(this.url, assignment);
    //return of('Assignment service: assignment modifié !'); // on retourne une chaine de caractère
  }

  // Supprimer
  deleteAssignment(assignment:Assignment):Observable<any>{
    //let pos = this.assignments.indexOf(assignment);
    //this.assignments.splice(pos, 1);
    //return of("Assignment service: assignment supprimé !")

    let deleteURI = this.url + '/' + assignment._id;
    return this.http.delete(deleteURI);
  }
}