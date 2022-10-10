import { join } from 'lodash';

export const joinUrlSegments = (...urlSegments: string[]) => {
    const url = join(urlSegments, '/');
    if (url.endsWith('/')) {
        return url
    } else {
        return url + '/'
    }
}
