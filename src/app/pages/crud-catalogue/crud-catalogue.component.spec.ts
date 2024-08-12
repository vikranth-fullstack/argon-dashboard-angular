import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudCatalogueComponent } from './crud-catalogue.component';

describe('CrudCatalogueComponent', () => {
  let component: CrudCatalogueComponent;
  let fixture: ComponentFixture<CrudCatalogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudCatalogueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
