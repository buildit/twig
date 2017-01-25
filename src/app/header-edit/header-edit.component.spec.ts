/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NgbModal, NgbModule, NgbTooltipModule, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

import { CopyPasteNodeComponent } from '../copy-paste-node/copy-paste-node.component';
import { FontAwesomeToggleButtonComponent } from '../font-awesome-toggle-button/font-awesome-toggle-button.component';
import { AddNodeByDraggingButtonComponent } from '../add-node-by-dragging-button/add-node-by-dragging-button.component';
import { KeyValuesPipe } from '../key-values.pipe';
import { StateService, StateServiceStub } from '../state.service';
import { HeaderEditComponent } from './header-edit.component';

describe('HeaderEditComponent', () => {
  let component: HeaderEditComponent;
  let fixture: ComponentFixture<HeaderEditComponent>;
  const stateService = new StateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CopyPasteNodeComponent,
        HeaderEditComponent,
        FontAwesomeToggleButtonComponent,
        AddNodeByDraggingButtonComponent,
        KeyValuesPipe,
      ],
      imports: [ NgbTooltipModule, NgbModule.forRoot(), ],
      providers: [ NgbTooltipConfig, NgbModal, { provide: StateService, useValue: stateService} ]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display save and discard buttons when user is editing', () => {
    stateService.userState.setEditing(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fa-check')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.fa-times')).toBeTruthy();
  });

  it('should not display save and discard buttons if user is not editing', () => {
    stateService.userState.setEditing(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fa-check')).toBeNull();
    expect(fixture.nativeElement.querySelector('.fa-times')).toBeNull();
  });

  it('should load the current twiglet when discard changes is clicked', () => {
    stateService.userState.setCurrentTwiglet('name1', 'id1');
    stateService.userState.setEditing(true);
    fixture.detectChanges();
    spyOn(stateService.twiglet, 'loadTwiglet');
    fixture.nativeElement.querySelector('.fa-times').click();
    expect(stateService.twiglet.loadTwiglet).toHaveBeenCalledWith('id1', 'name1');
  });
});
