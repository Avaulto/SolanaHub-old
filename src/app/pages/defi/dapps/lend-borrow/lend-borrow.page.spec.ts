import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LendBorrowPage } from './lend-borrow.page';

describe('LendBorrowPage', () => {
  let component: LendBorrowPage;
  let fixture: ComponentFixture<LendBorrowPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LendBorrowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
