import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Task} from '../model/task.interface';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = 'http://localhost:8080/api/tasks';

  private httpClient = inject(HttpClient);

  public createTask(task: Task):  Observable<Task>{
    return this.httpClient.post<Task>(this.baseUrl+"/create", task);
  }

  public showAllTasks(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(this.baseUrl+"/all")
  }

  public updateTask(task: Task): Observable<Task>{
    return this.httpClient.put<Task>(this.baseUrl+"/update",task);
  }

  public deleteTask(task: Task): Observable<Task>{
    const contructedUrl = this.baseUrl+"/delete/"+task.id;
    return this.httpClient.delete<Task>(contructedUrl);
  }
}
