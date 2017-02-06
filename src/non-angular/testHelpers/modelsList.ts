import { fromJS } from 'immutable';

export function modelsList () {
  return fromJS([
    {
      _id: 'bsc',
      url: 'modelurl'
    },
    {
      _id: 'bsc - clone',
      url: 'modelurl2'
    },
  ]);
}
