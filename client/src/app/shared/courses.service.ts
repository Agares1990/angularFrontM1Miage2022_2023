import { Injectable } from "@angular/core";
import { Course } from "../models/course.model";
import { forkJoin, Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { initialCourses } from "./data";

@Injectable( { // injecter tous les services qui ont provideIn root à la racine directement
	// Permet d'éviter d'ajouter les services dans les modules
	providedIn: "root"
} )

export class CoursesService
{
	private HttpOptions = {
		headers: new HttpHeaders( {
			"Content-Type": "application/json"
		} )
	};

	courses: Course[] = [];

	constructor( private http: HttpClient ) { }

	url = "http://localhost:8010/api/courses";
	//url = "https://api-cours-angular-2023.herokuapp.com/api/courses";

	getCourses(): Observable<Course[]>
	{
		return this.http.get<Course[]>( this.url );
	}

	getCourse( id: number ): Observable<Course>
	{
		return this.http.get<Course>( this.url + "/" + id );
	}

	// Ajout
	addCourse( course: Course ): Observable<any>
	{
		return this.http.post<Course>( this.url, course, this.HttpOptions );
	}

	// Modification
	updateCourse( course: Course ): Observable<any>
	{
		return this.http.put<Course>( this.url, course );
	}

	// Supprimer
	deleteCourse( course: Course ): Observable<any>
	{
		return this.http.delete( this.url + "/" + course._id );
	}

	// Peuplement
	peuplerBDAvecForkJoin(): Observable<any>
	{
		const appelsVersAddCourse: any = [];

		initialCourses.forEach( ( a ) =>
		{
			const newCourse: any = new Course();
			newCourse.id = a.id;
			newCourse.nom = a.nom;
			newCourse.teacherName = a.teacherName;
			newCourse.teacherAvatar = a.teacherAvatar;

			appelsVersAddCourse.push( this.addCourse( newCourse ) );
		} );

		return forkJoin( appelsVersAddCourse ); // renvoie un seul Observable pour dire que c'est fini
	}
}