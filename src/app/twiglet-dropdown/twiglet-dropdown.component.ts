import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { StateService } from '../state.service';

@Component({
  selector: 'app-twiglet-dropdown',
  styleUrls: ['./twiglet-dropdown.component.scss'],
  templateUrl: './twiglet-dropdown.component.html',
})
export class TwigletDropdownComponent implements OnInit {
  twiglets: string[];

  constructor(private stateService: StateService) { }

  ngOnInit() {
    this.stateService.getTwiglets().subscribe(response => {
      console.log(response);
      this.twiglets = response;
      console.log(this.twiglets);
    });
  }

}
