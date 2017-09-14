import { fromJS } from 'immutable';

export function twigletsList() {
  return fromJS([
    {
      changelog_url: 'changelogurl',
      description: '',
      googlesheet: '',
      model_url: 'modelurl',
      name: 'name1',
      orgModel: 'mynewmodel',
      twiglet: '',
      url: 'twigleturl',
      views_url: 'viewsurl'
    },
    {
      changelog_url: 'changelogurl2',
      description: '',
      googlesheet: '',
      model_url: 'modelurl2',
      name: 'name2',
      orgModel: 'bsc',
      twiglet: '',
      url: 'twigleturl2',
      views_url: 'viewsurl2'
    },
  ]);
}
