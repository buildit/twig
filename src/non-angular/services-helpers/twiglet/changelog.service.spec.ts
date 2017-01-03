import { Map } from 'immutable';
import { ChangeLogService } from './changelog.service';
import { ChangeLog } from '../../interfaces/twiglet';

describe('ChangeLogService', () => {
  let changeLogService: ChangeLogService;
  beforeEach(() => {
    changeLogService = new ChangeLogService();
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

});

