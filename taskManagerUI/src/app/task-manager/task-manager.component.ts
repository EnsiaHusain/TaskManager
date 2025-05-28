import {Component, inject, OnInit} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {TaskService} from '../services/task-service.service';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {MatListOption, MatSelectionList, MatSelectionListChange} from '@angular/material/list';
import {Task} from '../model/task.interface';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectionList,
    MatListOption
  ],
  templateUrl: './task-manager.component.html',
  styleUrl: './task-manager.component.scss'
})
export class TaskManagerComponent implements OnInit{

  taskForm!: FormGroup;
  taskName!: FormControl;

  taskList: Task[] = [];

  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);

  ngOnInit() {
    this.taskName = new FormControl('', Validators.required);
    this.taskForm = this.fb.group({taskName: this.taskName});

    this.fetchAllTasks();
  }

  onSubmit(){
    if(this.taskForm.valid){
      const task = {
        name: this.taskForm.get('taskName')?.value,
        status: "PENDING"
      }
      this.taskService.createTask(task).subscribe({
        next: (result) => {
          console.log('Task added:', result);
          this.fetchAllTasks();
        },
        error: (error) => console.error("Error Occurred", error)
        }
      );
    }
  }

  async fetchAllTasks(){
   this.taskList = await firstValueFrom<Task[]>(this.taskService.showAllTasks());
   this.taskList.forEach(task => {
    task.isChecked = task.status === 'COMPLETE' ? true: false;
   });
  }

  async onTaskToggle(task: Task){
      if(task.isChecked){
        task.status = 'COMPLETE';
      }else{
        task.status = 'PENDING';
      }
      const updatedTask = await firstValueFrom(this.taskService.updateTask(task));
      console.log("Updated Task = ", updatedTask);
  }

  editTask(task: Task){

  }

  deleteTask(task: Task){
    this.taskService.deleteTask(task).subscribe({
        next: (result) => {
          console.log('Task added:', result);
          this.fetchAllTasks();
        },
        error: (error) => console.error("Error Occurred", error),
      }
    );
  }


}
