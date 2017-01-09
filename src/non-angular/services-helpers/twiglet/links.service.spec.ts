import { Map } from 'immutable';
import { LinksService } from './links.service';
import { Link } from '../../interfaces/twiglet';

describe('LinksService', () => {
  let linkService: LinksService;
  beforeEach(() => {
    linkService = new LinksService();
  });

  const initialLinks: Link[] = [
    {
      association: 'First Link',
      id: 'firstLink',
      source: 'node1',
      target: 'node2',
    },
    {
      association: 'Second Link',
      id: 'secondLink',
      source: 'node3',
      target: 'node4',
    },
    {
      association: 'Third Link',
      id: 'thirdLink',
      source: 'node5',
      target: 'node6',
    }
  ];

  describe('Observables', () => {
    it('returns an observable with no links at initiation', () => {
      linkService.observable.subscribe(response => {
        expect(response.size).toEqual(0);
      });
    });
  });

  describe('Adding Links', () => {
    it('can add an array of links as immutable maps', () => {
      linkService.addLinks(initialLinks);
      linkService.observable.subscribe(response => {
        expect(response.size).toEqual(3);
        const firstLink = response.get('firstLink');
        expect(Map.isMap(firstLink)).toEqual(true);
        expect(firstLink.get('association')).toEqual('First Link');
        expect(firstLink.get('id')).toEqual('firstLink');
        expect(firstLink.get('source')).toEqual('node1');
        expect(firstLink.get('target')).toEqual('node2');
        const secondLink = response.get('secondLink');
        expect(Map.isMap(secondLink)).toEqual(true);
        expect(secondLink.get('association')).toEqual('Second Link');
        expect(secondLink.get('id')).toEqual('secondLink');
        expect(secondLink.get('source')).toEqual('node3');
        expect(secondLink.get('target')).toEqual('node4');
        const thirdLink = response.get('thirdLink');
        expect(Map.isMap(thirdLink)).toEqual(true);
        expect(thirdLink.get('association')).toEqual('Third Link');
        expect(thirdLink.get('id')).toEqual('thirdLink');
        expect(thirdLink.get('source')).toEqual('node5');
        expect(thirdLink.get('target')).toEqual('node6');
      });
    });

    it('can add a single link as an immutable map', () => {
      linkService.addLink({
        id: 'singleLink',
        source: 'a source',
        target: 'a target',
      });
      linkService.observable.subscribe(response => {
        expect(response.size).toEqual(1);
        const firstLink = response.get('singleLink');
        expect(Map.isMap(firstLink)).toEqual(true);
        expect(firstLink.get('id')).toEqual('singleLink');
        expect(firstLink.get('source')).toEqual('a source');
        expect(firstLink.get('target')).toEqual('a target');
      });
    });
  });

  describe('updateLinks', () => {
    beforeEach(() => {
      linkService.addLinks(initialLinks);
    });

    it('can update multiple links at a time and still return immutables', () => {
      linkService.updateLinks([
        {
          association: 'New Name',
          id: 'firstLink',
        },
        {
          id: 'secondLink',
          source: 'new source',
        },
        {
          id: 'thirdLink',
          target: 'new target',
        },
      ]);
      linkService.observable.subscribe(response => {
        expect(response.size).toEqual(3);
        const firstLink = response.get('firstLink');
        expect(Map.isMap(firstLink)).toEqual(true);
        expect(firstLink.get('association')).toEqual('New Name'); // updated
        expect(firstLink.get('id')).toEqual('firstLink');
        expect(firstLink.get('source')).toEqual('node1');
        expect(firstLink.get('target')).toEqual('node2');
        const secondLink = response.get('secondLink');
        expect(Map.isMap(secondLink)).toEqual(true);
        expect(secondLink.get('association')).toEqual('Second Link');
        expect(secondLink.get('id')).toEqual('secondLink');
        expect(secondLink.get('source')).toEqual('new source'); // updated
        expect(secondLink.get('target')).toEqual('node4');
        const thirdLink = response.get('thirdLink');
        expect(Map.isMap(thirdLink)).toEqual(true);
        expect(thirdLink.get('association')).toEqual('Third Link');
        expect(thirdLink.get('id')).toEqual('thirdLink');
        expect(thirdLink.get('source')).toEqual('node5');
        expect(thirdLink.get('target')).toEqual('new target'); // updated
      });
    });

    it('can update a single link and leave the link as an immutable', () => {
      linkService.updateLink({
        association: 'New Name',
        id: 'firstLink',
        source: 'new source',
        target: 'new target',
      });
      linkService.observable.subscribe(response => {
        const firstLink = response.get('firstLink');
        expect(Map.isMap(firstLink)).toEqual(true);
        expect(firstLink.get('association')).toEqual('New Name'); // updated
        expect(firstLink.get('id')).toEqual('firstLink');
        expect(firstLink.get('source')).toEqual('new source');
        expect(firstLink.get('target')).toEqual('new target');
      });
    });
  });

  describe('deleteLinks', () => {
    beforeEach(() => {
      linkService.addLinks(initialLinks);
    });

    it('can delete multiple links at a time and leave the remaining as immutables', () => {
      linkService.removeLinks([
        {
          id: 'secondLink',
        },
        {
          id: 'thirdLink',
          source: 'node5',
          target: 'new target',
        },
      ]);
      linkService.observable.subscribe(response => {
        expect(response.size).toEqual(1);
        expect(Map.isMap(response.get('firstLink'))).toEqual(true);
      });
    });

    it('can delete a single link and leave the remaining as immutable', () => {
      linkService.removeLink({
        id: 'secondLink'
      });
      linkService.observable.subscribe(response => {
        expect(response.size).toEqual(2);
        expect(Map.isMap(response.get('firstLink'))).toEqual(true);
        expect(Map.isMap(response.get('thirdLink'))).toEqual(true);
      });
    });
  });
});
