import { SelectFilter } from '@/components/filters/models/SelectFilter.model';

const filterData = {
  id: 'property',
  type: 'select',
  name: 'Property',
  prefix: null,
  required: false,
  placeholder: false,
  pinned: false,
  defaultValue: null,
  searchApiUrl: null
};

const options = [
  { id: '80', name: 'AC Polari', available: true, type: 'property' },
  { id: '81', name: 'AC Amarin', available: true, type: 'property' },
  { id: '82', name: 'AC Porto Sole', available: true, type: 'property' },
  { id: '83', name: 'Hotel Eden', available: false, type: 'property' }
];

let selectFilter = null;

beforeEach(() => {
  selectFilter = new SelectFilter({
    value: null,
    options,
    ...filterData
  });
});

test('selects an option', function() {
  selectFilter.select(selectFilter.options[0]);

  expect(selectFilter.value).toEqual(options[0]);
});

test('successively selects options', function() {
  selectFilter.select(selectFilter.options[0]);
  expect(selectFilter.value).toEqual(options[0]);

  selectFilter.select(selectFilter.options[1]);
  expect(selectFilter.value).toEqual(options[1]);

  selectFilter.select(selectFilter.options[2]);
  expect(selectFilter.value).toEqual(options[2]);
});
