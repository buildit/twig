/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { StateService } from './state.service';

describe('StateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],
      providers: [
        StateService,
        MockBackend,
        BaseRequestOptions,
        {
          deps: [MockBackend, BaseRequestOptions],
          provide: Http,
          useFactory: (backend: MockBackend, options: BaseRequestOptions) => {
            return new Http(backend, options);
          },
        }
      ]
    });
  });

  it('should ...', inject([StateService], (service: StateService) => {
    expect(service).toBeTruthy();
  }));

  it('should construct', async(inject([StateService, MockBackend], (service, MockBackend) => {
    expect(service).toBeDefined();
  })));

  describe('getting twiglets', () => {
    const mockTwigletResponse = [
      {
        _id: 'id1',
        links: [],
        model_url: 'twiglet/id1/model',
        name: 'name1',
        nodes: [
          'node1'
        ]
      },
      {
        _id: 'id2',
        links: ['link1'],
        model_url: 'twiglet/id2/model',
        name: 'name2',
        nodes: [
          'node1',
          'node2'
        ]
      }
    ];

    const mockModelResponse = {
      changelog: {
        entities: {
          entity1: {
            type: 'type1'
          },
          entity2: {
            type: 'type2'
          }
        }
      }
    };

    it('should parse twiglets', async(inject([StateService, MockBackend], (service, mockBackend) => {
      mockBackend.connections.subscribe(connection => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockTwigletResponse)
        })));
      });
      service.getTwiglets().subscribe(response => {
        expect(response.length).toEqual(2);
        expect(response[0].name).toEqual('name1');
        expect(response[1].name).toEqual('name2');
      });
    })));

    describe('loading a twiglet', () => {
      it('can set the current twiglet name', async(inject([StateService], (service) => {
        spyOn(service.userState, 'setCurrentTwiglet');
        service.loadTwiglet('id1', 'name1');
        expect(service.userState.setCurrentTwiglet).toHaveBeenCalledWith('name1');
      })));

      it('loads the twiglet and model', async(inject([StateService, MockBackend], (service, mockBackend) => {
        spyOn(service.model, 'addModel');
        spyOn(service.twiglet, 'addNodes');
        spyOn(service.twiglet, 'addLinks');
        mockBackend.connections.subscribe(connection => {
          if (connection.request.url.indexOf('model') >= 0) {
            connection.mockRespond(new Response(new ResponseOptions({
              body: JSON.stringify(mockModelResponse)
            })));
          } else {
            connection.mockRespond(new Response(new ResponseOptions({
              body: JSON.stringify(mockTwigletResponse[0])
            })));
          }
        });

        service.loadTwiglet('id1', 'name1');
        expect(service.model.addModel).toHaveBeenCalledWith({
          entities: {
            entity1: {
              type: 'type1'
            },
            entity2: {
              type: 'type2'
            }
          }
        });
        expect(service.twiglet.addNodes).toHaveBeenCalledWith(['node1']);
        expect(service.twiglet.addLinks).toHaveBeenCalledWith([]);
      })));
    });

  });
});
