import { join } from 'lodash';

export const joinUrlSegments = (...urlSegments: string[]) =>
  join(urlSegments, '/');
