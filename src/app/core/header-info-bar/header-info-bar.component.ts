import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Map, OrderedMap } from 'immutable';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';

import { Model } from './../../../non-angular/interfaces/model/index';
import { StateService } from '../../state.service';
import { Twiglet } from './../../../non-angular/interfaces/twiglet';
import { UserState } from '../../../non-angular/interfaces';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header-info-bar',
  styleUrls: ['./header-info-bar.component.scss'],
  templateUrl: './header-info-bar.component.html',
})
export class HeaderInfoBarComponent implements OnChanges {
  userState: OrderedMap<string, any> = OrderedMap({});
  // @Input() twiglet: OrderedMap<string, any> = OrderedMap({});
  // @Input() model: OrderedMap<string, any> = OrderedMap({});
  // modelUrl: boolean;
  // twigletUrl: boolean;
  // simulatingString = 'simulating';
  // simulatingIndex: number;
  // simulatingSubscription: Subscription;

  constructor(private stateService: StateService, private cd: ChangeDetectorRef, public router: Router,
    public modalService: NgbModal) {

    stateService.userState.observable.subscribe(userState => {
      this.userState = userState;
      this.cd.markForCheck();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (changes.userState) {
    //   if (!Map.isMap(changes.userState.previousValue)
    //       || (changes.userState.currentValue.get('isSimulating') !== changes.userState.previousValue.get('isSimulating'))) {
    //     if (changes.userState.currentValue.get('isSimulating')) {
    //       this.startSimulating();
    //     } else {
    //       this.stopSimulating();
    //     }
    //   }
    // }
  }

  // startSimulating() {
  //   const msPerLetter = Math.round(1000 / this.simulatingString.length);
  //   this.simulatingSubscription = Observable.interval(msPerLetter).subscribe(count => {
  //     let ss = this.simulatingString.toLowerCase();
  //     const index = count % this.simulatingString.length;
  //     ss = `${ss.substring(0, index)}${ss[index].toUpperCase()}${ss.substring(index + 1)}`;
  //     this.simulatingString = ss;
  //     this.cd.markForCheck();
  //   });
  // }

  // stopSimulating() {
  //   if (this.simulatingSubscription) {
  //     this.simulatingSubscription.unsubscribe();
  //     this.simulatingSubscription = undefined;
  //   }
  // }
}

