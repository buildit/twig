import { TestBed, async, inject } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Map } from 'immutable';
import { ChangeLogService } from './changelog.service';
import { ChangeLog } from '../../interfaces/twiglet';

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
  const mockBackend = new MockBackend();
  beforeEach(() => {
    changeLogService = new ChangeLogService(new Http(mockBackend, new BaseRequestOptions()));
  });

  describe('Observables', () => {
    it('returns an observable with no changelogs at initiation', () => {
      changeLogService.observable.subscribe(response => {
        expect(response.size).toEqual(0);
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
    it('can add multiple logs', () => {
      changeLogService.addLogs(logs);
      changeLogService.observable.subscribe(response => {
        expect(response.size).toEqual(2);
      });
    });

    it('can add a single log', () => {
      changeLogService.addLog(logs[0]);
      changeLogService.observable.subscribe(response => {
        expect(response.size).toEqual(1);
      });
    });
  });

  it('gets the changelog for a twiglet', () => {
    mockBackend.connections.subscribe(connection => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(mockChangelogResponse)
      })));
    });
    changeLogService.getChangelog('id1').subscribe(response => {
      expect(response.changelog.length).toEqual(2);
    });
  });

});

