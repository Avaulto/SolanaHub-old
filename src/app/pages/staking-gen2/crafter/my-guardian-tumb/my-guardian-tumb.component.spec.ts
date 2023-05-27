import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyGuardianTumbComponent } from './my-guardian-tumb.component';

describe('MyGuardianTumbComponent', () => {
  let component: MyGuardianTumbComponent;
  let fixture: ComponentFixture<MyGuardianTumbComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyGuardianTumbComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyGuardianTumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
