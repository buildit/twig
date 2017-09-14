import { fromJS } from 'immutable';

export function modelsList () {
  return fromJS([
    {
      name: 'model1',
      url: 'modelurl'
    },
    {
      name: 'model2',
      url: 'modelurl2'
    },
  ]);
}
