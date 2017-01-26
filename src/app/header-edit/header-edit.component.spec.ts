/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NgbModal, NgbModule, NgbTooltipModule, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

import { CopyPasteNodeComponent } from '../copy-paste-node/copy-paste-node.component';
import { FontAwesomeToggleButtonComponent } from '../font-awesome-toggle-button/font-awesome-toggle-button.component';
import { AddNodeByDraggingButtonComponent } from '../add-node-by-dragging-button/add-node-by-dragging-button.component';
import { KeyValuesPipe } from '../key-values.pipe';
import { StateService } from '../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';
import { HeaderEditComponent } from './header-edit.component';

describe('HeaderEditComponent', () => {
  let component: HeaderEditComponent;
  let fixture: ComponentFixture<HeaderEditComponent>;
  const stateServiceStubbed = stateServiceStub();

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
      providers: [ NgbTooltipConfig, NgbModal, { provide: StateService, useValue: stateServiceStubbed } ]

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
    stateServiceStubbed.userState.setEditing(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fa-check')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.fa-times')).toBeTruthy();
  });

  it('should not display save and discard buttons if user is not editing', () => {
    stateServiceStubbed.userState.setEditing(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fa-check')).toBeNull();
    expect(fixture.nativeElement.querySelector('.fa-times')).toBeNull();
  });

  it('should load the current twiglet when discard changes is clicked', () => {
    stateServiceStubbed.userState.setCurrentTwigletId('id1');
    stateServiceStubbed.userState.setEditing(true);
    fixture.detectChanges();
    spyOn(stateServiceStubbed.twiglet, 'loadTwiglet');
    fixture.nativeElement.querySelector('.fa-times').click();
    expect(stateServiceStubbed.twiglet.loadTwiglet).toHaveBeenCalledWith('id1');
  });
});
