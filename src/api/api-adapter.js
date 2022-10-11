import { keys, snakeCase } from 'lodash';

import request from '@/api/request';
import serialize from '@/api/json-api/serializer';
import deserialize from '@/api/json-api/deserializer';

const API_NAMESPACE = '/api/v1';
const RESPONSE_AUTHORIZATION_TOKEN = 'X-Authorization-Token';
const REQUEST_AUTHORIZATION_TOKEN = 'Authorization';

export const NAMESPACES = {
  RATES: `${API_NAMESPACE}/rates`,
  ANALYTICS: `${API_NAMESPACE}/analytics`,
  INVENTORIES: `${API_NAMESPACE}/inventories`,
  USERS: `${API_NAMESPACE}/users`,
  ACTIVITY_LOGS: `${API_NAMESPACE}/activity-logs`,
  MEMBERS: `${API_NAMESPACE}/members`,
  SUBSCRIBERS: `${API_NAMESPACE}/subscribers`,
  PROPERTIES: `${API_NAMESPACE}/properties`,
  PASSWORDS: `${API_NAMESPACE}/passwords`,
  DASHBOARDS: `${API_NAMESPACE}/dashboards`,
  AGENCIES: `${API_NAMESPACE}/agencies`,
  WIDGETS: `${API_NAMESPACE}/widgets`,
  WIDGET_CALCULATIONS: `${API_NAMESPACE}/widgets/calculations`,
  WIDGET_EXPORT: `${API_NAMESPACE}/widgets/exports`,
  WIZARD: `${API_NAMESPACE}/wizard`,
  DUPLICATE_WIDGET: `${API_NAMESPACE}/widgets/duplicates`,
  UNIT_TYPES: `${API_NAMESPACE}/unit-types`,
  USER_DASHBOARD_DENSITY: `${API_NAMESPACE}/user-dashboard-density`,
  RATE_SHOPPER: `${API_NAMESPACE}/rate-shopper`,
  FILTER_SETS: `${API_NAMESPACE}/filter-sets`,
  GROUPS: `${API_NAMESPACE}/groups`,
  OVERVIEW: `${API_NAMESPACE}/overview`,
  NOTIFICATIONS: `${API_NAMESPACE}/notifications`
};

class ApiAdapter {
  get authHeaders() {
    return {
      [REQUEST_AUTHORIZATION_TOKEN]: `Bearer ${this.token}`
    };
  }

  setToken(token) {
    this.token = token;
  }

  get(url, payload, signal) {
    return request({
      url,
      method: 'get',
      headers: this.authHeaders,
      data: payload,
      signal
    }).then(response => {
      return response.data ? deserialize(response.data) : response.response;
    });
  }

  post(url, payload) {
    return request({
      url,
      method: 'post',
      headers: this.authHeaders,
      data: payload
    }).then(response => {
      return response.data ? deserialize(response.data) : response.response;
    });
  }

  put(url, payload) {
    return request({
      url,
      method: 'put',
      headers: this.authHeaders,
      data: payload
    }).then(response => {
      return response.data ? deserialize(response.data) : response.response;
    });
  }

  delete(url) {
    return request({
      url,
      method: 'delete',
      headers: this.authHeaders
    }).then(response => {
      return response.data ? deserialize(response.data) : response.response;
    });
  }

  login({ email, password }) {
    const data = serialize(
      {
        email,
        password
      },
      {
        attributes: ['email', 'password']
      }
    );

    return request({
      url: `${NAMESPACES.USERS}/sessions/`,
      method: 'post',
      data
    }).then(response => {
      return {
        user: deserialize(response.data).data,
        token: response.headers.get(RESPONSE_AUTHORIZATION_TOKEN)
      };
    });
  }

  currentUser() {
    return this.get(`${NAMESPACES.USERS}/sessions`);
  }

  fetchFilters(namespace, filtersQuery) {
    return this.get(`${API_NAMESPACE}/${namespace}/filters`, {
      filter: filtersQuery
    });
  }

  loadFilters(namespace) {
    return this.get(`${API_NAMESPACE}/${namespace}/filters`);
  }

  reloadFilters(namespace, filtersQuery) {
    return this.get(`${API_NAMESPACE}/${namespace}/filters`, {
      filter: filtersQuery
    });
  }

  fetchOptions(url, filtersQuery) {
    return this.get(url, { filter: filtersQuery });
  }

  setFilterPin(namespace, data) {
    return request({
      url: `${API_NAMESPACE}/${namespace}/filters`,
      method: 'PUT',
      headers: this.authHeaders,
      data
    }).then(response => {
      return deserialize(response.data).data;
    });
  }

  fetchAnalyticsFilters(filter) {
    return this.get(`${NAMESPACES.ANALYTICS}/filters`, { filter });
  }

  fetchRateShopperFilters(filter) {
    return this.get(`${NAMESPACES.RATE_SHOPPER}/filters`, { filter });
  }

  fetchRates(filter) {
    return this.get(NAMESPACES.RATES, { filter });
  }

  fetchRatesFilters(filter) {
    return this.get(`${NAMESPACES.RATES}/filters`, { filter });
  }

  fetchInventory(filter) {
    return this.get(NAMESPACES.INVENTORIES, { filter });
  }

  fetchInventoryFilters(filter) {
    return this.get(`${NAMESPACES.INVENTORIES}/filters`, { filter });
  }

  fetchRateHistory(payload) {
    return this.get(`${NAMESPACES.ACTIVITY_LOGS}/rates`, payload);
  }

  fetchInventoryHistory(payload) {
    return this.get(`${NAMESPACES.ACTIVITY_LOGS}/inventories`, payload);
  }

  async fetchMembers(payload) {
    const { data, meta } = await this.get(NAMESPACES.MEMBERS, {
      ...payload,
      include: 'reports'
    });

    return {
      members: data,
      hasMore: meta.hasMore
    };
  }

  fetchNextRateHistoryPage(lastCreatedAt) {
    return this.fetchNextHistoryPage(lastCreatedAt, 'rates');
  }

  fetchNextInventoryHistoryPage(lastCreatedAt) {
    return this.fetchNextHistoryPage(lastCreatedAt, 'inventories');
  }

  fetchAgencies(filter, searchApiUrl) {
    return this.get(searchApiUrl || NAMESPACES.AGENCIES, { filter });
  }

  fetchProperties(filter, searchApiUrl) {
    return this.get(searchApiUrl || NAMESPACES.PROPERTIES, { filter });
  }

  updateUser(member) {
    return this.updateMember(member.serialize(), NAMESPACES.USERS);
  }

  updateSubscriber(member) {
    return this.updateMember(member.serialize(), NAMESPACES.SUBSCRIBERS);
  }

  createUser(member) {
    return this.createMember(member.serialize(), NAMESPACES.USERS);
  }

  sendResetPasswordEmail(email) {
    const data = serialize(email, {
      resourceType: 'users',
      attributes: ['email']
    });

    return request({
      url: `${NAMESPACES.USERS}/forgot-password`,
      method: 'post',
      data
    });
  }

  resetPassword({ password, passwordConfirmation, resetPasswordToken }) {
    const data = serialize(
      { resetPasswordToken, password, passwordConfirmation },
      {
        resourceType: 'users',
        attributes: ['resetPasswordToken', 'password', 'passwordConfirmation']
      }
    );

    return request({
      url: `${NAMESPACES.USERS}/forgot-password`,
      method: 'put',
      data
    }).then(response => {
      return deserialize(response.data).data;
    });
  }

  createSubscriber(member) {
    return this.createMember(member.serialize(), NAMESPACES.SUBSCRIBERS);
  }

  deleteUser(id) {
    return this.deleteMember(id, NAMESPACES.USERS);
  }

  deleteSubscriber(id) {
    return this.deleteMember(id, NAMESPACES.SUBSCRIBERS);
  }

  createMember(
    { firstName, email, lastName, role, property, reportMembership },
    namespace
  ) {
    const data = serialize(
      {
        firstName,
        email,
        lastName,
        role,
        property,
        reportMembership
      },
      {
        attributes: ['firstName', 'email', 'lastName', 'role'],
        relationships: ['property', 'reportMembership']
      }
    );

    return request({
      url: namespace,
      method: 'post',
      headers: this.authHeaders,
      data
    }).then(response => {
      return deserialize(response.data);
    });
  }

  updateMember({ id, ...memberData }, namespace) {
    const relationshipKeys = [
      'defaultAnalyticsDashboard',
      'defaultRateShopperDashboard',
      'defaultAnalyticsFilterSet',
      'defaultRateShopperFilterSet',
      'property',
      'reportMembership'
    ];

    const structure = Object.keys(memberData).reduce(
      (structure, key) => {
        if (relationshipKeys.includes(key)) {
          structure.relationships.push(key);
        } else {
          structure.attributes.push(key);
        }

        return structure;
      },
      {
        attributes: [],
        relationships: []
      }
    );

    const data = serialize(memberData, structure);

    return request({
      url: `${namespace}/${id}`,
      method: 'put',
      headers: this.authHeaders,
      data
    }).then(response => {
      return deserialize(response.data);
    });
  }

  deleteMember(id, namespace) {
    return request({
      url: `${namespace}/${id}`,
      method: 'delete',
      headers: this.authHeaders
    }).then(response => {
      return deserialize(response.data);
    });
  }

  setPassword({ invitationToken, password }) {
    const data = serialize(
      {
        invitationToken,
        password
      },
      {
        attributes: ['invitationToken', 'password']
      }
    );

    return request({
      url: `${NAMESPACES.PASSWORDS}`,
      method: 'post',
      headers: this.authHeaders,
      data
    }).then(response => {
      return deserialize(response.data).data;
    });
  }

  fetchDeals(payload) {
    payload.include =
      'most_recent_event,most_recent_event.user,partner,inquiry,inquiry.user';

    return this.get(`${NAMESPACES.GROUPS}/deals`, payload);
  }

  fetchDealForDealsPage(id) {
    return this.get(
      `${NAMESPACES.GROUPS}/deals/${id}?include=most_recent_event,most_recent_event.user,partner,inquiry,inquiry.user`
    );
  }

  fetchDeal(id) {
    return this.get(
      `${NAMESPACES.GROUPS}/deals/${id}?include=messages,messages.offers,messages.offers.user,messages.offers.property,messages.offers.offer_groups,messages.offers.offer_groups.offer_group_units,
      messages.offers.final_offers.final_offer_groups,messages.offers.final_offers.final_offer_groups.final_offer_group_units
      ,partner,partner.partner_contacts,inquiry,inquiry.user,inquiry.groups,inquiry.groups.group_alternatives,inquiry.groups.group_alternatives.group_alternative_items,messages.user,messages.comments`
    );
  }

  deleteDeal(id) {
    return request({
      url: `${NAMESPACES.GROUPS}/deals/${id}`,
      method: 'delete',
      headers: this.authHeaders
    });
  }

  fetchGroupsConfiguration(payload) {
    return this.get(`${NAMESPACES.GROUPS}/configuration`, payload);
  }

  fetchAllPartners() {
    return this.get(`${NAMESPACES.GROUPS}/partners?include=partner_contacts`);
  }

  fetchPartners({ filter, createdAfter }) {
    const payload = { filter, createdAfter, include: 'partner_contacts' };

    return this.get(`${NAMESPACES.GROUPS}/partners`, payload);
  }

  updateDealStatus({ dealId, status }) {
    const data = serialize(
      {
        dealId,
        status
      },
      {
        resourceType: 'deal_status_changes',
        attributes: ['dealId', 'status']
      }
    );

    return request({
      url: `${NAMESPACES.GROUPS}/deal-status-changes?include=deal.most_recent_event,deal.most_recent_event.user`,
      method: 'post',
      headers: this.authHeaders,
      data
    }).then(response => {
      return deserialize(response.data);
    });
  }

  updateDealComments({ dealId, comment }) {
    const data = serialize(
      {
        dealId,
        comment
      },
      {
        resourceType: 'deal_comments',
        attributes: ['dealId', 'comment']
      }
    );

    return request({
      url: `${NAMESPACES.GROUPS}/deal-comments`,
      method: 'post',
      headers: this.authHeaders,
      data
    }).then(response => {
      return deserialize(response.data);
    });
  }

  createDeal(deal) {
    const dealData = deal.serialize();
    const data = serialize(dealData, {
      attributes: keys(dealData)
    });

    return this.post(
      `${NAMESPACES.GROUPS}/deals?include=partner,inquiry,inquiry.user`,
      data
    );
  }

  createOffer(offer) {
    const offerData = offer.serialize();
    const data = serialize(offerData, {
      attributes: keys(offerData)
    });

    return this.post(
      `${NAMESPACES.GROUPS}/offers?include=offer_groups,offer_groups.offer_group_units,property,final_offers,final_offers.final_offer_groups,final_offers.final_offer_groups.final_offer_group_units`,
      data
    );
  }

  submitInquiry({
    budget,
    comment,
    dateRanges,
    expenses,
    expirationDate,
    partnerId,
    priority,
    properties,
    rooms
  }) {
    const data = serialize(
      {
        budget: budget.amount,
        budgetCurrency: budget.currency,
        otherExpenses: expenses.amount,
        otherExpensesCurrency: expenses.currency,
        expirationDate,
        comment,
        priority,
        partnerId,
        rooms,
        properties,
        dateRanges
      },
      {
        resourceType: 'inquiries',
        attributes: [
          'budget',
          'budgetCurrency',
          'otherExpenses',
          'otherExpensesCurrency',
          'expirationDate',
          'comment',
          'priority',
          'partnerId',
          'rooms',
          'properties',
          'dateRanges',
          'expenses'
        ]
      }
    );

    return request({
      url: `${NAMESPACES.GROUPS}/inquiries`,
      method: 'post',
      headers: this.authHeaders,
      data
    }).then(response => {
      return deserialize(response.data);
    });
  }

  updateInquiry({
    budget,
    dateRanges,
    expenses,
    expirationDate,
    partnerId,
    properties,
    rooms,
    comment,
    id
  }) {
    const data = serialize(
      {
        id,
        budget: budget.amount,
        budgetCurrency: budget.currency,
        otherExpenses: expenses.amount,
        otherExpensesCurrency: expenses.currency,
        expirationDate,
        partnerId,
        rooms,
        comment,
        properties,
        dateRanges
      },
      {
        resourceType: 'inquiry',
        attributes: [
          'budget',
          'budgetCurrency',
          'otherExpenses',
          'otherExpensesCurrency',
          'expirationDate',
          'partnerId',
          'rooms',
          'comment',
          'properties',
          'dateRanges',
          'expenses'
        ]
      }
    );

    return request({
      url: `${NAMESPACES.GROUPS}/inquiries/${id}`,
      method: 'put',
      headers: this.authHeaders,
      data
    }).then(response => {
      return deserialize(response.data);
    });
  }

  deleteInquiry(id) {
    return request({
      url: `${NAMESPACES.GROUPS}/inquiries/${id}`,
      method: 'delete',
      headers: this.authHeaders
    });
  }

  // createOffer({ property, dateRange, offerData, id }) {
  //   const data = serialize(
  //     {
  //       dealId: id,
  //       bookingPeriodStart: dateRange.from,
  //       bookingPeriodEnd: dateRange.to,
  //       offerUnitsAttributes: offerData,
  //       propertyId: property.id
  //     },
  //     {
  //       resourceType: 'offer',
  //       attributes: [
  //         'dealId',
  //         'bookingPeriodStart',
  //         'bookingPeriodEnd',
  //         'offerUnitsAttributes',
  //         'propertyId'
  //       ]
  //     }
  //   );
  //
  //   return request({
  //     url: `${NAMESPACES.GROUPS}/offers`,
  //     method: 'post',
  //     headers: this.authHeaders,
  //     data
  //   }).then(response => {
  //     return deserialize(response.data);
  //   });
  // }

  downloadOffer(id) {
    return this.get(`${NAMESPACES.GROUPS}/offers/${id}`);
  }

  createPartner(partner) {
    const partnerData = partner.serialize();

    const data = serialize(partnerData, {
      resourceType: 'partners',
      attributes: keys(partnerData)
    });

    return request({
      url: `${NAMESPACES.GROUPS}/partners`,
      method: 'post',
      headers: this.authHeaders,
      data
    }).then(response => {
      return deserialize(response.data);
    });
  }

  editPartner(partner) {
    const partnerData = partner.serialize();

    const data = serialize(partnerData, {
      resourceType: 'partners',
      attributes: keys(partnerData)
    });

    return request({
      url: `${NAMESPACES.GROUPS}/partners/${partner.id}?include=partner_contacts`,
      method: 'put',
      headers: this.authHeaders,
      data
    }).then(response => {
      return deserialize(response.data);
    });
  }

  deletePartner(partnerId) {
    return request({
      url: `${NAMESPACES.GROUPS}/partners/${partnerId}`,
      method: 'delete',
      headers: this.authHeaders
    });
  }

  fetchDisplacementAnalysis(body) {
    const data = serialize(body, {
      attributes: keys(body)
    });

    return this.post(`${NAMESPACES.GROUPS}/displacement-analysis`, data);
  }

  fetchPriceAnalysis(filter) {
    return this.get(`${NAMESPACES.GROUPS}/price-analysis-details`, { filter });
  }

  fetchOffer(offerId) {
    return this.get(
      `${NAMESPACES.GROUPS}/offers/${offerId}?include=property,user,final_offers`
    );
  }

  changeOfferStatus(offerId, status) {
    const statusDto = { status: snakeCase(status) };

    return this.post(
      `${NAMESPACES.GROUPS}/offers/${offerId}/offer-status-changes`,
      serialize(statusDto, {
        attributes: keys(statusDto)
      })
    );
  }

  fetchFinalOffers(offerId) {
    return this.get(`${NAMESPACES.GROUPS}/offers/${offerId}/final-offers`);
  }

  fetchFinalOffer(finalOfferId) {
    return this.get(
      `${NAMESPACES.GROUPS}/final-offers/${finalOfferId}?include=final_offer_groups,final_offer_groups.final_offer_group_units,property`
    );
  }

  fetchFinalOfferPdf(finalOfferId) {
    return fetch(`${NAMESPACES.GROUPS}/final-offers/${finalOfferId}/pdf`, {
      headers: this.authHeaders
    });
  }

  createFinalOffer(offerId, name) {
    const createFinalOfferDto = { name };

    const data = serialize(createFinalOfferDto, {
      attributes: keys(createFinalOfferDto)
    });

    return this.post(
      `${NAMESPACES.GROUPS}/offers/${offerId}/final-offers?include=final_offer_groups,final_offer_groups.final_offer_group_units,property`,
      data
    );
  }

  updateFinalOffer(finalOfferId, finalOfferDto) {
    const data = serialize(finalOfferDto, {
      attributes: keys(finalOfferDto)
    });

    return this.put(
      `${NAMESPACES.GROUPS}/final-offers/${finalOfferId}?include=final_offer_groups,final_offer_groups.final_offer_group_units,property`,
      data
    );
  }

  duplicateFinalOffer(finalOfferId, name) {
    const data = serialize(
      { name },
      {
        attributes: ['name']
      }
    );

    return this.post(
      `${NAMESPACES.GROUPS}/final-offers/${finalOfferId}/duplicates`,
      data
    );
  }

  deleteFinalOffer(finalOfferId) {
    return request({
      url: `${NAMESPACES.GROUPS}/final-offers/${finalOfferId}`,
      method: 'delete',
      headers: this.authHeaders
    });
  }

  fetchNotifications(params) {
    return this.get(`${NAMESPACES.NOTIFICATIONS}`, params);
  }

  markAllNotificationsAsSeen(propertyId) {
    const data = propertyId
      ? serialize(
          {
            propertyId: parseInt(propertyId)
          },
          {
            resourceType: 'notifications',
            attributes: ['propertyId']
          }
        )
      : {};

    return this.post(`${NAMESPACES.NOTIFICATIONS}`, data);
  }

  fetchPresets() {
    return this.get(`${NAMESPACES.GROUPS}/presets`);
  }

  createPreset(presetDto) {
    const payload = serialize(presetDto, {
      attributes: keys(presetDto)
    });

    return this.post(`${NAMESPACES.GROUPS}/presets`, payload);
  }

  editPreset(presetDto) {
    const payload = serialize(presetDto, {
      attributes: keys(presetDto)
    });

    return this.put(`${NAMESPACES.GROUPS}/presets/${presetDto.id}`, payload);
  }

  deletePreset(presetId) {
    return this.delete(`${NAMESPACES.GROUPS}/presets/${presetId}`);
  }

  fetchMembersConfiguration() {
    return this.get(`${NAMESPACES.MEMBERS}/configuration`);
  }
}

export default new ApiAdapter();
