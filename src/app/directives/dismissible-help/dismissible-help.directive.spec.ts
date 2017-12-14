import { Component, NgModule } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DismissibleHelpDirective } from './dismissible-help.directive';
import { DismissibleHelpDialogComponent } from '../../shared/dismissible-help-dialog/dismissible-help-dialog.component';

@NgModule({
  entryComponents: [
    DismissibleHelpDialogComponent,
  ]
})
class TestModule {}

@Component({
  selector: 'app-dummy-component',
  template: `
    <div>
      <ng-template #helpText>
        <strong id="hello">Hello</strong> World
      </ng-template>
      <i [appDismissibleHelp] class="fa fa-question-circle" id="withoutContent" placement="right-top"></i>
      <i [appDismissibleHelp]="helpText" class="fa fa-question-circle" id="withContent" placement="right-top"></i>
    </div>
  `
})
class DummyComponent { }

describe('DismissibleHelpDirective', () => {
  let fixture: ComponentFixture<DummyComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DummyComponent, DismissibleHelpDirective, DismissibleHelpDialogComponent ],
      imports: [ TestModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DummyComponent);
    fixture.detectChanges();
    element = fixture.nativeElement;
  });


  it('opens the help dialog if the dialog has content', () => {
    const withContent = element.querySelector('#withContent') as HTMLElement;
    withContent.click();
    expect(document.querySelector('app-dismissible-help-dialog')).toBeTruthy();
  });

  it('closes help dialog when close button is pressed', () => {
    const withContent = element.querySelector('#withContent') as HTMLElement;
    withContent.click();
    const closeButton = document.querySelector('.close-button') as HTMLElement;
    closeButton.click();
    expect(document.querySelector('app-dismissible-help-dialog')).toBeFalsy();
  });

  it('closes when clicked outside of the help dialog', () => {
    const withContent = element.querySelector('#withContent') as HTMLElement;
    withContent.click();

    const el = document.createElement('div');
    const click = new MouseEvent('mouseup', {
      relatedTarget: el
    });

    document.dispatchEvent(click);
    expect(document.querySelector('app-dismissible-help-dialog')).toBeFalsy();
  });

  it('does not close when clicked inside of the help dialog', () => {
    const withContent = element.querySelector('#withContent') as HTMLElement;
    withContent.click();
    const hello = document.querySelector('#hello') as HTMLElement;
    hello.click();
    expect(document.querySelector('app-dismissible-help-dialog')).toBeTruthy();
  });

  it('does not open if there is no dialog content', () => {
    const withoutContent = element.querySelector('#withoutContent') as HTMLElement;
    withoutContent.click();
    expect(document.querySelector('app-dismissible-help-dialog')).toBeFalsy();
  });
});
