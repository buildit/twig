import { MultipleGravities, D3Node, GravityPoint } from './../interfaces';
import { multipleGravities } from './multipleGravities';
import { Map } from 'immutable';

describe('multipleGravities', () => {

  describe('assignable', () => {
    let force: MultipleGravities;

    beforeAll(() => {
      force = multipleGravities();
    });

    it('can assign centerX', () => {
      force.centerX(200);
      expect(force.centerX()).toEqual(200);
    });

    it('can assign centerY', () => {
      force.centerY(300);
      expect(force.centerY()).toEqual(300);
    });

    it('can assign gravityPoints if it is an object', () => {
      const gp = {
        gp1: {
          x: 100,
          y: 200,
        },
      };
      force.gravityPoints(gp);
      expect(force.gravityPoints()).toEqual(gp);
    });

    it('can assign gravityPoints if it is a Map', () => {
      const gp = {
        gp1: {
          x: 100,
          y: 200,
        },
      };
      force.gravityPoints(Map(gp));
      expect(force.gravityPoints()).toEqual(gp);
    });

    it('can assign strengthX', () => {
      force.strengthX(400);
      expect(force.strengthX()).toEqual(400);
    });

    it('can assign strengthY', () => {
      force.strengthY(500);
      expect(force.strengthY()).toEqual(500);
    });
  });

  describe('chainable', () => {
    let force: MultipleGravities;

    beforeAll(() => {
      force = multipleGravities();
    });

    it('centerX returns the same force', () => {
      expect(force.centerX(5)).toBe(force);
    });

    it('centerY returns the same force', () => {
      expect(force.centerX(5)).toBe(force);
    });

    it('gravityPoints returns the same force', () => {
      expect(force.gravityPoints({})).toBe(force);
    });

    it('strengthX returns the same force', () => {
      expect(force.strengthX(5)).toBe(force);
    });

    it('strengthY returns the same force', () => {
      expect(force.centerX(5)).toBe(force);
    });
  });

  describe('force acts on nodes', () => {
    let force: MultipleGravities;
    let nodes: D3Node[];
    beforeEach(() => {
      const gp: { [key: string]: GravityPoint } = {
        gp1: {
          x: 50,
          y: 50,
        },
        gp2: {
          x: 300,
          y: 325,
        }
      };
      nodes = [
        {
          gravityPoint: 'gp1',
          id: '1',
          x: 200,
          y: 200,
        },
        {
          gravityPoint: 'gp2',
          id: '2',
          x: 200,
          y: 200,
        },
        {
          gravityPoint: 'gp3',
          id: '3',
          x: 300,
          y: 300,
        },
        {
          id: '4',
          x: 200,
          y: 500,
        },
      ];
      force = multipleGravities();
      force.initialize(nodes);
      force.centerX(200).centerY(200).strengthX(0.5).strengthY(0.5).gravityPoints(gp);
    });

    describe('first node/first gravity point', () => {
      beforeEach(() => {
        force(0.7);
      });

      it('moves the x-values of the node closer to the gravity point', () => {
        expect(nodes[0].x).toEqual(147.5);
      });

      it('moves the y-values of the node closer to the gravity point', () => {
        expect(nodes[0].y).toEqual(147.5);
      });
    });

    describe('second node/second gravity point', () => {
      beforeEach(() => {
        force(0.7);
      });

      it('moves the x-values of the node closer to the gravity point', () => {
        expect(nodes[1].x).toEqual(235);
      });

      it('moves the y-values of the node closer to the gravity point', () => {
        expect(nodes[1].y).toEqual(243.75);
      });
    });

    describe('3rd node is missing the gravity point, so it moves toward the center', () => {
      beforeEach(() => {
        force(0.7);
      });

      it('moves the x-values of the node closer to the center', () => {
        expect(nodes[2].x).toEqual(265);
      });

      it('moves the y-values of the node closer to the center', () => {
        expect(nodes[2].y).toEqual(265);
      });
    });

    describe('4th node has no gravity point so it moves toward the center', () => {
      beforeEach(() => {
        force(0.7);
      });

      it('does not need to move x because it is already centered', () => {
        expect(nodes[3].x).toEqual(200);
      });

      it('moves the y-values of the node closer to the center', () => {
        expect(nodes[3].y).toEqual(395);
      });
    });
  });
});
