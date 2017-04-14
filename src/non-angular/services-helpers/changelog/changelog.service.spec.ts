import { async, inject, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Map } from 'immutable';
import { BehaviorSubject, Observable } from 'rxjs/Rx';

import { ChangeLog } from '../../interfaces/twiglet';
import { ChangeLogService } from './changelog.service';

describe('ChangeLogService', () => {
  const mockChangelogResponse = {
    changelog: [
      {
        message: 'first change',
        timestamp: '111some time',
        user: 'testuser1@riglet.io',
      },
      {
        message: 'second change',
        timestamp: '222a different time',
        user: 'testuser2@riglet.io',
      }
    ]
  };
  let changeLogService: ChangeLogService;
  let bs: BehaviorSubject<Map<string, any>>;
  let mockBackend;
  beforeEach(() => {
    mockBackend = new MockBackend();
    bs = new BehaviorSubject<Map<string, any>>(Map({}));
    const parent = {
      observable: bs.asObservable(),
    };
    changeLogService = new ChangeLogService(new Http(mockBackend, new BaseRequestOptions()), parent);
  });

  describe('Observables', () => {
    it('returns an observable with no changelogs at initiation', () => {
      changeLogService.observable.subscribe(response => {
        expect(response.size).toEqual(1);
      });
    });
  });

  describe('addLog', () => {
    const logs: ChangeLog[] = [
      {
        message: 'first change',
        timestamp: '111some time',
        user: 'testuser1@riglet.io',
      },
      {
        message: 'second change',
        timestamp: '222a different time',
        user: 'testuser2@riglet.io',
      }
    ];
  });

  it ('only makes a call if the changelogUrl exists', () => {
    mockBackend.connections.subscribe(connection => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(mockChangelogResponse)
      })));
    });
    bs.next(Map({}));
    changeLogService.observable.subscribe(response => {
      expect(response.size).toEqual(1);
    });
  });

  it('gets the changelog for a twiglet', () => {
    mockBackend.connections.subscribe(connection => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(mockChangelogResponse)
      })));
    });
    bs.next(Map({ changelog_url: 'some url'}));
    changeLogService.observable.subscribe(response => {
      expect(response.size).toEqual(2);
    });
  });

});

