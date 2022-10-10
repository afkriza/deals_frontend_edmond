import { identity, keys, snakeCase } from 'lodash';
import httpClient from '@/api/http-client';
import serialize from '@/api/json-api/serializer';
import { joinUrlSegments } from '@/api/utils';
import { Preset } from '@/models/groups/Preset.model';
import { saveAs } from '@/utils/file';
import { apify } from '@/api/json-api/apify';

const GROUPS_ENDPOINT = 'groups';

type DealsFilter = {
  filter: {
    partner: string[];
    property: string[];
    status: string;
    user: string[];
    pattern: string;
  };
  page: number;
  per_page: number;
};

type PartnersFilter = {
  filter: {
    country?: string[];
    pattern: string;
  };
  createdAfter?: string;
};

export const fetchPresets = () =>
  httpClient.get(joinUrlSegments(GROUPS_ENDPOINT, 'presets'));

export const createPreset = (preset: Preset) => {
  const presetSerialized = preset.serialize();

  return httpClient.post(
    joinUrlSegments(GROUPS_ENDPOINT, 'presets'),
    serialize(presetSerialized, {
      attributes: keys(presetSerialized)
    })
  );
};

export const editPreset = (preset: Preset) => {
  const presetSerialized = preset.serialize();

  return httpClient.put(
    joinUrlSegments(GROUPS_ENDPOINT, 'presets', preset.id),
    serialize(presetSerialized, {
      attributes: keys(presetSerialized)
    })
  );
};

export const deletePreset = (presetId: Preset['id']) =>
  httpClient.delete(joinUrlSegments(GROUPS_ENDPOINT, 'presets', presetId));

export const fetchGroupsConfiguration = () =>
  httpClient.get(joinUrlSegments(GROUPS_ENDPOINT, 'configuration'));

export const fetchDeals = (filters: DealsFilter) =>
  httpClient.get(joinUrlSegments(GROUPS_ENDPOINT, 'deals'), {
    params: {
      ...filters,
      include:
        'most_recent_event,most_recent_event.user,partner,inquiry,inquiry.user'
    }
  }) as Promise<{ data; meta }>;

export const fetchDeal = (dealId: string) =>
  httpClient.get(joinUrlSegments(GROUPS_ENDPOINT, 'deals', dealId), {
    params: {
      include: `messages,messages.offers,messages.offers.user,messages.offers.property,
        messages.offers.offer_groups,messages.offers.offer_groups.offer_group_units,
        messages.offers.final_offers.final_offer_groups,
        messages.offers.final_offers.final_offer_groups.final_offer_group_units,partner,
        partner.partner_contacts,inquiry,inquiry.user,inquiry.groups,
        inquiry.groups.group_alternatives,inquiry.groups.group_alternatives.group_alternative_items,
        messages.user,messages.comments`
    }
  });

export const createDeal = deal => {
  const dealData = deal.serialize();
  const data = serialize(dealData, {
    attributes: keys(dealData)
  });

  return httpClient.post(joinUrlSegments(GROUPS_ENDPOINT, 'deals'), data, {
    params: {
      include: 'partner,inquiry,inquiry.user'
    }
  });
};

export const deleteDeal = (dealId: string) =>
  httpClient.delete(joinUrlSegments(GROUPS_ENDPOINT, 'deals', dealId));

export const fetchPartners = (filters: PartnersFilter) =>
  httpClient.get(joinUrlSegments(GROUPS_ENDPOINT, 'partners'), {
    params: { ...filters, include: 'partner_contacts' }
  }) as Promise<{ data; meta }>;

export const createPartner = partner => {
  const partnerData = partner.serialize();

  const data = serialize(partnerData, {
    resourceType: 'partners',
    attributes: keys(partnerData)
  });

  return httpClient.post(joinUrlSegments(GROUPS_ENDPOINT, 'partners'), data);
};

export const editPartner = partner => {
  const partnerData = partner.serialize();

  const data = serialize(partnerData, {
    resourceType: 'partners',
    attributes: keys(partnerData)
  });

  return httpClient.put(
    joinUrlSegments(GROUPS_ENDPOINT, 'partners', partner.id),
    data,
    {
      params: {
        include: 'partner_contacts'
      }
    }
  );
};

export const deletePartner = (partnerId: string) =>
  httpClient.delete(joinUrlSegments(GROUPS_ENDPOINT, 'partners', partnerId));

export const createOffer = offer => {
  const offerData = offer.serialize();
  const data = serialize(offerData, {
    attributes: keys(offerData)
  });

  return httpClient.post(joinUrlSegments(GROUPS_ENDPOINT, 'offers'), data, {
    params: {
      include:
        'offer_groups,offer_groups.offer_group_units,property,final_offers,final_offers.final_offer_groups,final_offers.final_offer_groups.final_offer_group_units'
    }
  });
};

export const updateDealStatus = (dealId: string, status: string) =>
  httpClient.post(
    joinUrlSegments(GROUPS_ENDPOINT, 'deal-status-changes'),
    serialize(
      {
        dealId,
        status
      },
      {
        resourceType: 'deal_status_changes',
        attributes: ['dealId', 'status']
      }
    ),
    {
      params: {
        include: 'deal.most_recent_event,deal.most_recent_event.user'
      }
    }
  );

export const updateDealComments = (dealId: string, comment: string) => {
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

  return httpClient.post(
    joinUrlSegments(GROUPS_ENDPOINT, 'deal-comments'),
    data
  );
};

export const changeOfferStatus = (offerId: string, status: string) => {
  const statusDto = { status: snakeCase(status) };

  return httpClient.post(
    joinUrlSegments(GROUPS_ENDPOINT, 'offers', offerId, 'offer-status-changes'),
    serialize(statusDto, {
      attributes: keys(statusDto)
    })
  );
};

export const fetchFinalOffers = (offerId: string) =>
  httpClient.get(
    joinUrlSegments(GROUPS_ENDPOINT, 'offers', offerId, 'final-offers')
  );

export const fetchFinalOffer = (finalOfferId: string) =>
  httpClient.get(
    joinUrlSegments(GROUPS_ENDPOINT, 'final-offers', finalOfferId),
    {
      params: {
        include:
          'final_offer_groups,final_offer_groups.final_offer_group_units,property'
      }
    }
  );

export const createFinalOffer = (offerId: string, name: string) => {
  const createFinalOfferDto = { name };

  const data = serialize(createFinalOfferDto, {
    attributes: keys(createFinalOfferDto)
  });

  return httpClient.post(
    joinUrlSegments(GROUPS_ENDPOINT, 'offers', offerId, 'final-offers'),
    data,
    {
      params: {
        include:
          'final_offer_groups,final_offer_groups.final_offer_group_units,property'
      }
    }
  );
};

export const updateFinalOffer = (finalOfferId: string, finalOfferDto) => {
  const data = serialize(finalOfferDto, {
    attributes: keys(finalOfferDto)
  });

  return httpClient.put(
    joinUrlSegments(GROUPS_ENDPOINT, 'final-offers', finalOfferId),
    data,
    {
      params: {
        include:
          'final_offer_groups,final_offer_groups.final_offer_group_units,property'
      }
    }
  );
};

export const duplicateFinalOffer = (finalOfferId: string, name: string) => {
  const data = serialize(
    { name },
    {
      attributes: ['name']
    }
  );

  return httpClient.post(
    joinUrlSegments(
      GROUPS_ENDPOINT,
      'final-offers',
      finalOfferId,
      'duplicates'
    ),
    data
  );
};

export const deleteFinalOffer = (finalOfferId: string) =>
  httpClient.delete(
    joinUrlSegments(GROUPS_ENDPOINT, 'final-offers', finalOfferId)
  );

export const fetchFinalOfferPdf = (finalOfferId: string) =>
  httpClient.get(
    joinUrlSegments(GROUPS_ENDPOINT, 'final-offers', finalOfferId, 'pdf'),
    {
      responseType: 'arraybuffer',
      transformResponse: identity
    }
  ) as Promise<ArrayBuffer>;

export const downloadFinalOfferPdf = async (finalOfferId: string) => {
  return saveAs('offer', new Blob([await fetchFinalOfferPdf(finalOfferId)]));
};

export const fetchDisplacementAnalysis = payload =>
  httpClient.post(
    joinUrlSegments(GROUPS_ENDPOINT, 'displacement-analysis'),
    serialize(payload, {
      attributes: keys(payload)
    })
  );

export const fetchPriceAnalysis = filter =>
  httpClient.get(joinUrlSegments(GROUPS_ENDPOINT, 'price-analysis-details'), {
    params: {
      filter: apify(filter)
    }
  });
