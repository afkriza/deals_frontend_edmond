import { forEach, isUndefined, map, reject } from 'lodash';
import { formatISO } from 'date-fns';
import * as mutationTypes from 'store/mutation-types';
import { genericApiAction } from 'utils/store';
import filtersFactory from 'classes/filters/factory';
import { deserialize } from 'models/overview/Graph';
import { apify, deapify } from '@/api/json-api/apify';
import { OverviewCalculation } from '@/models/overview/OverviewCalculation';
import { notificationsModule } from '@/store';
import * as FiltersService from 'api/services/Filters.service';
import * as OverviewService from 'api/services/Overview.service';

export async function fetchFilters({ commit }) {
  try {
    commit(mutationTypes.OVERVIEW_FILTERS_REQUEST);

    const { data: filtersDto } = await FiltersService.fetchFilters('overview', {
      include: 'options,numerator_options,denominator_options'
    });

    const filters = map(filtersDto, filtersFactory);

    commit(mutationTypes.OVERVIEW_FILTERS_SUCCESS, { data: filters });
  } catch (e) {
    commit(mutationTypes.OVERVIEW_FILTERS_FAILURE);
  }
}

export async function fetchItems({ commit, getters }, { view, year, month }) {
  const additionalFilters = { view, year };
  if (!isUndefined(month)) {
    additionalFilters.month = month;
  }

  const filters = { ...getters.filtersQuery, ...additionalFilters };

  const { data } = await genericApiAction(
    OverviewService.fetchOverviewData,
    { commit },
    filters,
    mutationTypes.OVERVIEW_DATA_REQUEST,
    data => {
      data.calculations = map(
        data.calculations,
        OverviewCalculation.deserialize
      );

      return data;
    }
  );

  return data;
}

export async function fetchItemData(
  { commit, getters },
  { bookingPeriod, periodEndDate }
) {
  const filters = {
    bookingPeriod,
    property: getters.filtersQuery.property
  };

  const { data, meta } = await genericApiAction(
    OverviewService.fetchOverviewItemDetails,
    { commit },
    apify(filters),
    mutationTypes.OVERVIEW_ITEM_DETAILS_REQUEST,
    data => {
      return reject(
        data.map(({ chartData, bookingDate }) => {
          return deserialize({
            ...deapify(JSON.parse(chartData.replace(/\bNaN\b/g, 'null'))),
            date: formatISO(periodEndDate, { representation: 'date' })
          });
        }),
        isUndefined
      );
    }
  );

  const graphs = data;
  const {
    notifications,
    totalUnseenNotificationsCount,
    allNotificationsCount,
    unseenNotificationsCount
  } = meta;

  const notificationsTransformed = map(notifications, notification => ({
    ...notification,
    property: { id: notification.propertyId }
  }));
  forEach(notificationsTransformed, notification =>
    notificationsModule.MARK_NOTIFICATION_SEEN(notification)
  );
  notificationsModule.SET_TOTAL_UNSEEN_NOTIFICATIONS_COUNT(
    totalUnseenNotificationsCount
  );
  notificationsModule.SET_PAGE_NOTIFICATIONS_COUNT({
    scope: filters.property,
    allCount: allNotificationsCount,
    unseenCount: unseenNotificationsCount
  });

  return { graphs, notifications };
}

export function triggerSeen({ commit }, calculation) {
  if (calculation.notifications.seen) {
    return;
  }

  commit(mutationTypes.OVERVIEW_NOTIFICATIONS_SEEN, calculation);
}
