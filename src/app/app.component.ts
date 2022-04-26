import { Component } from '@angular/core';
import { UserService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private userService:UserService) { }
  async ngOnInit(): Promise<void> {
    this.userService.populate();    
  }

}
