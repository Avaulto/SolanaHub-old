import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dashboard2Page } from './dashboard2.page';

describe('Dashboard2Page', () => {
  let component: Dashboard2Page;
  let fixture: ComponentFixture<Dashboard2Page>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(Dashboard2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
