import {
  Action,
  Module,
  Mutation,
  MutationAction,
  VuexModule
} from 'vuex-module-decorators';
import {
  camelCase,
  get,
  keyBy,
  map,
  mapKeys,
  mapValues,
  omit,
  without,
  uniqueId,
  size,
  find,
  forEach,
  last,
  partial
} from 'lodash';
import { Partner } from '@/models/groups/Partner.model';
import { DealDetails } from '@/components/groups/new-inquiry/models/DealDetails.model.js';
import { CreateFinalOfferDto } from '@/dtos/final-offer.dto';
import { FinalOffer } from '@/models/groups/FinalOffer.model';

import { downloadFileFromStream } from '@/utils/file';
import { BreadcrumbItem } from '@/components/app/Breadcrumbs.vue';

import { CommentMessage, SentOfferMessage } from '@/models/groups/Message';
import Offer from '@/components/groups/new-offer/models/Offer.model';
import { Currency } from '@/models/groups/Currency.model';
import { Language } from '@/models/groups/Language.model';
import { Property } from '@/models/groups/Property.model';
import { RoomType } from '@/models/groups/RoomType.model';
import { Package } from '@/models/groups/Package.model';
import { Preset } from '@/models/groups/Preset.model';
import { PresetDto } from '@/dtos/preset.dto';
import OfferStatus from '@/enums/OfferStatus.enum';
import DealStatus from '@/enums/DealStatus.enum';

import * as GroupsService from '@/api/services/Groups.service';
import { SalesDepartment } from '@/models/SalesDepartment.model';

interface PartnerContact {
  email: string;
  phoneNumber: string;
  primary: boolean;
}

interface Partner {
  id: string;
  name: string;
  address: string;
  postcode: number;
  city: string;
  country: string;
  partnerIdentifier: string;
  partnerContacts: PartnerContact[];
  createdAt: string;
}

interface Inquiry {
  id: string;
  name: string;
  note: string;
  budget: number;
  budgetCurrency: string;
  otherExpenses: number;
  otherExpensesCurrency: string;
  priority: true;
  partnerId: number;
}

interface Deal {
  id: string;
  budget: number;
  budgetCurrency: string;
  messagesCount: number;
  numOfGroups: number;
  otherExpenses: number;
  otherExpensesCurrency: string;
  offers: Offer[];
  messages: CommentMessage[] | SentOfferMessage[];
  inquiry: Inquiry;
}

class BreadcrumbsManager {
  items: BreadcrumbItem[];

  private constructor() {
    this.items = [];
  }

  updateItems(items: BreadcrumbItem[]) {
    this.items = items;
  }

  static create() {
    return new BreadcrumbsManager();
  }
}

interface PriceAnalysisPayload {
  propertyId: string;
  partnerId: string;
  beginDate: string;
  endDate: string;
}

type Configuration = {
  properties: Property[];
  roomTypes: RoomType[];
  packages: Package[];
  languages: Language[];
  currencies: Currency[];
  salesDepartments: SalesDepartment[];
};

const NUMBER_OF_DEALS_PER_PAGE = 50;
@Module({
  name: 'groups',
  namespaced: true
})
export default class GroupsModule extends VuexModule {
  configuration: Configuration = null;

  partnersByIds: { [id: string]: Partner } = null;
  partnersIds: string[] = null;

  filteredPartnersIds: string[] = null;

  dealsByIds: { [id: string]: Deal } = null;
  dealsIds: string[] = null;
  areDealsLoaded = false;

  invalidatePartners = false;
  invalidateDeals = false;
  partnersSearchQuery = '';
  dealsSearchQuery = '';

  arePartnersLazyLoading = false;
  partnersTotalCount = null;

  areDealsLazyLoading = false;
  dealsPageNumber = 1;
  dealsTotalCount = null;

  dealId: Deal['id'] = null;

  breadcrumbsManager = BreadcrumbsManager.create();

  revalidateDeal = false;

  presetsById: Record<Preset['id'], Preset> | null = null;
  presetIds: Preset['id'][] | null = null;

  get presets() {
    return map(this.presetIds, partial(get, this.presetsById));
  }

  get arePresetsLoaded() {
    return Boolean(this.presetIds);
  }

  get isConfigurationLoaded() {
    return Boolean(this.configuration);
  }

  get configurationAttribute() {
    return (attribute: string) => get(this.configuration, attribute, null);
  }

  get properties() {
    return this.configurationAttribute('properties');
  }

  get roomTypes() {
    return this.configurationAttribute('roomTypes');
  }

  get packages() {
    return this.configurationAttribute('packages');
  }

  get languages() {
    return this.configurationAttribute('languages');
  }

  get currencies() {
    return this.configurationAttribute('currencies');
  }

  get salesDepartments() {
    return this.configurationAttribute('salesDepartments');
  }

  get deal(): Deal {
    return get(this.dealsByIds, this.dealId);
  }

  get deals(): Deal[] {
    if (!this.areDealsLoaded) {
      return null;
    }

    return map(this.dealsIds, dealId => this.dealsByIds[dealId]);
  }

  get partners(): Partner[] {
    if (!this.partnersIds) {
      return null;
    }

    return map(this.partnersIds, partnerId => this.partnersByIds[partnerId]);
  }

  get filteredPartners(): Partner[] {
    if (!this.filteredPartnersIds) {
      return null;
    }

    return map(
      this.filteredPartnersIds,
      partnerId => this.partnersByIds[partnerId]
    );
  }

  get lastPartnerCreatedAt() {
    return get(last(this.filteredPartners), 'createdAt');
  }

  get hasPartnersToLoad() {
    return size(this.filteredPartners) < this.partnersTotalCount;
  }

  get hasDealsToLoad() {
    return size(this.deals) < this.dealsTotalCount;
  }

  @Mutation
  SET_PARTNERS(partners) {
    this.partnersByIds = keyBy(partners, 'id');
    this.partnersIds = map(partners, 'id');
  }

  @Mutation
  SET_FILTERED_PARTNERS(partners) {
    this.partnersByIds = { ...this.partnersByIds, ...keyBy(partners, 'id') };
    this.filteredPartnersIds = map(partners, 'id');
  }

  @Mutation
  DELETE_PARTNER(partnerId) {
    this.partnersIds = without(this.partnersIds, partnerId);
    this.partnersByIds = omit(this.partnersByIds, [partnerId]);

    this.filteredPartnersIds = without(this.filteredPartnersIds, partnerId);
  }

  @Mutation
  SET_DEALS(deals) {
    this.dealsIds = map(deals, 'id');
    this.dealsByIds = { ...keyBy(deals, 'id'), ...this.dealsByIds };
  }

  @Mutation
  SET_ARE_DEALS_LOADED(flag: boolean) {
    this.areDealsLoaded = flag;
  }

  @Mutation
  UPDATE_DEAL(deal) {
    this.dealsByIds = { ...this.dealsByIds, [deal.id]: deal };
  }

  @Mutation
  UPDATE_DEAL_ATTR_VALUE({ dealId, attr, value }) {
    const deal = get(this.dealsByIds, dealId);

    deal[attr] = value;
  }

  @Mutation
  DELETE_DEAL(dealId) {
    this.dealsIds = without(this.dealsIds, dealId);
  }

  @Mutation
  SET_DEAL(deal: Deal) {
    this.dealsByIds = { ...this.dealsByIds, [deal.id]: deal };

    this.dealId = deal.id;
  }

  @Mutation
  ADD_MESSAGE(message) {
    const deal = this.dealsByIds[this.dealId];

    deal.messages = [message, ...deal.messages];
  }

  @Mutation
  UPDATE_OFFER_STATUS({ offerId, status }) {
    const offerMessage = find(this.dealsByIds[this.dealId].messages, [
      'offer.id',
      offerId
    ]);

    if (!offerMessage) {
      return;
    }

    offerMessage.offer.status = status;
  }

  @Mutation
  UPDATE_BREADCRUMBS(items) {
    this.breadcrumbsManager.updateItems(items);
  }

  @Mutation
  SET_REVALIDATE_DEAL(flag: boolean) {
    this.revalidateDeal = flag;
  }

  @Mutation
  CREATE_PRESET(preset: Preset) {
    this.presetIds = [...this.presetIds, preset.id];
    this.presetsById = { ...this.presetsById, [preset.id]: preset };
  }

  @Mutation
  EDIT_PRESET(preset: Preset) {
    this.presetsById = { ...this.presetsById, [preset.id]: preset };
  }

  @Mutation
  DELETE_PRESET(presetId: Preset['id']) {
    this.presetIds = without(this.presetIds, presetId);
  }

  @Mutation
  SET_DEALS_SEARCH_QUERY(searchQuery: string) {
    this.dealsSearchQuery = searchQuery;
  }

  @Mutation
  SET_PARTNERS_SEARCH_QUERY(searchQuery: string) {
    this.partnersSearchQuery = searchQuery;
  }

  @Mutation
  SET_PARTNERS_LAZY_LOADING(flag: boolean) {
    this.arePartnersLazyLoading = flag;
  }

  @Mutation
  SET_INVALIDATE_PARTNERS(flag: boolean) {
    this.invalidatePartners = flag;
  }

  @Mutation
  SET_INVALIDATE_DEALS(flag: boolean) {
    this.invalidateDeals = flag;
  }

  @Mutation
  INCREMENT_DEAL_PAGE_NUMBER() {
    this.dealsPageNumber++;
  }

  @Mutation
  RESET_DEALS_PAGE_NUMBER() {
    this.dealsPageNumber = 1;
  }

  @Mutation
  SET_DEALS_LAZY_LOADING(flag: boolean) {
    this.areDealsLazyLoading = flag;
  }

  @Mutation
  SET_PARTNERS_TOTAL_COUNT(partnersCount) {
    this.partnersTotalCount = partnersCount;
  }

  @Mutation
  SET_DEALS_TOTAL_COUNT(dealsCount) {
    this.dealsTotalCount = dealsCount;
  }

  @MutationAction({ mutate: ['presetIds', 'presetsById'] })
  async loadPresets() {
    const { data: presetDtos }: { data: PresetDto[] } =
      await GroupsService.fetchPresets();

    const presets = map(presetDtos, Preset.deserialize);

    return {
      presetIds: map(presets, 'id'),
      presetsById: keyBy(presets, 'id')
    };
  }

  @Action({ rawError: true })
  async createPreset(preset: Preset) {
    const { data: newPreset }: { data: PresetDto } =
      await GroupsService.createPreset(preset);

    this.CREATE_PRESET(Preset.deserialize(newPreset));
  }

  @Action({ rawError: true })
  async editPreset(preset: Preset) {
    const { data: editedPreset }: { data: PresetDto } =
      await GroupsService.editPreset(preset);

    this.EDIT_PRESET(Preset.deserialize(editedPreset));
  }

  @Action
  async deletePreset(presetId: Preset['id']) {
    await GroupsService.deletePreset(presetId);

    this.DELETE_PRESET(presetId);
  }

  @MutationAction({ mutate: ['configuration'] })
  async fetchConfiguration() {
    const { data } = await GroupsService.fetchGroupsConfiguration();

    const {
      property: properties,
      roomType: roomTypes,
      package: packages,
      language: languages,
      currency: currencies,
      department: salesDepartments
    } = mapValues(
      mapKeys(keyBy(data, 'id'), (v, k) => camelCase(k)),
      'options'
    );

    return {
      configuration: {
        properties,
        roomTypes,
        packages,
        languages,
        currencies,
        salesDepartments
      }
    };
  }

  @Action({ rawError: true })
  async loadDeals() {
    this.RESET_DEALS_PAGE_NUMBER();
    const deals = await this.fetchDeals();

    this.SET_DEALS(deals);
    this.SET_ARE_DEALS_LOADED(true);
  }

  @Action({ rawError: true })
  async loadDeal(dealId: string) {
    const deal = await this.fetchDeal(dealId);

    this.SET_DEAL(deal);
    this.SET_REVALIDATE_DEAL(false);
  }

  @Action({ rawError: true })
  async fetchDeals() {
    const filtersQuery =
      this.context.rootGetters['groupsFilters/dealsFilters/filtersQuery'];

    const filter = {
      ...filtersQuery,
      pattern: this.dealsSearchQuery || ''
    };

    const payload = {
      filter,
      page: this.dealsPageNumber,
      per_page: NUMBER_OF_DEALS_PER_PAGE
    };

    const {
      data: deals,
      meta: { count: dealsCount }
    }: { data: { deals: Array<Deal> }; meta: { count: number } } =
      await GroupsService.fetchDeals(payload);

    this.SET_DEALS_TOTAL_COUNT(dealsCount);
    this.INCREMENT_DEAL_PAGE_NUMBER();

    return deals;
  }

  @Action({ rawError: true })
  async fetchNextDealsPage() {
    const filtersQuery =
      this.context.rootGetters['groupsFilters/dealsFilters/filtersQuery'];

    const filter = {
      ...filtersQuery,
      pattern: this.dealsSearchQuery || ''
    };

    const payload = {
      filter,
      page: this.dealsPageNumber,
      per_page: NUMBER_OF_DEALS_PER_PAGE
    };

    this.SET_DEALS_LAZY_LOADING(true);

    const {
      data: deals,
      meta: { count: dealsCount }
    }: { data: { deals: Array<Deal> }[]; meta: { count: number } } =
      await GroupsService.fetchDeals(payload);

    this.SET_DEALS([...this.deals, ...map(deals, DealDetails.deserialize)]);
    this.SET_DEALS_TOTAL_COUNT(dealsCount);
    this.SET_DEALS_LAZY_LOADING(false);
    this.INCREMENT_DEAL_PAGE_NUMBER();
  }

  @Action({ rawError: true })
  async fetchDeal(dealId: string) {
    if (!this.isConfigurationLoaded) {
      await this.fetchConfiguration();
    }

    const { data: dealDetailsDto } = await GroupsService.fetchDeal(dealId);

    return DealDetails.deserialize(dealDetailsDto, this.configuration);
  }

  @Action({ rawError: true })
  async createDeal(dealDto) {
    const { data } = await GroupsService.createDeal(dealDto);
    this.SET_INVALIDATE_DEALS(true);

    return DealDetails.deserialize(data, this.configuration);
  }

  @Action({ rawError: true })
  async deleteDeal(dealId) {
    await GroupsService.deleteDeal(dealId);

    this.DELETE_DEAL(dealId);
    this.SET_REVALIDATE_DEAL(true);
  }

  @Action({ rawError: true })
  async loadPartners() {
    const partners = await this.fetchPartners();

    this.SET_PARTNERS(partners);
    this.SET_FILTERED_PARTNERS(partners);
  }

  @Action({ rawError: true })
  async fetchFilteredPartners() {
    const filtersQuery =
      this.context.rootGetters['groupsFilters/partnersFilters/filtersQuery'];

    const filter = {
      ...filtersQuery,
      pattern: this.partnersSearchQuery || ''
    };

    const {
      data,
      meta: { count: partnersCount }
    } = await GroupsService.fetchPartners({
      filter
    });
    this.SET_PARTNERS_TOTAL_COUNT(partnersCount);

    return map(data, Partner.deserialize);
  }

  @Action({ rawError: true })
  async fetchNextPartnersPage() {
    const filtersQuery =
      this.context.rootGetters['groupsFilters/partnersFilters/filtersQuery'];

    const filter = {
      ...filtersQuery,
      pattern: this.partnersSearchQuery || ''
    };

    const createdAfter = this.lastPartnerCreatedAt;

    const payload = {
      filter,
      createdAfter
    };

    this.SET_PARTNERS_LAZY_LOADING(true);
    const {
      data,
      meta: { count: partnersCount }
    }: { data: Array<Partner>; meta: { count: number } } =
      await GroupsService.fetchPartners(payload);

    this.SET_PARTNERS_TOTAL_COUNT(partnersCount);
    this.SET_PARTNERS_LAZY_LOADING(false);

    this.SET_FILTERED_PARTNERS([
      ...this.filteredPartners,
      ...map(data, Partner.deserialize)
    ]);
  }

  @Action({ rawError: true })
  async fetchPartners(pattern = '') {
    const filter = { pattern };
    const {
      data,
      meta: { count: partnersCount }
    } = await GroupsService.fetchPartners({
      filter
    });
    this.SET_PARTNERS_TOTAL_COUNT(partnersCount);

    return map(data, Partner.deserialize);
  }

  @Action({ rawError: true })
  async createPartner(partner) {
    const { data: partnerDto } = await GroupsService.createPartner(partner);

    this.SET_INVALIDATE_PARTNERS(true);

    return Partner.deserialize(partnerDto);
  }

  @Action({ rawError: true })
  async editPartner(partner) {
    const { data: partnerDto } = await GroupsService.editPartner(partner);

    this.SET_INVALIDATE_PARTNERS(true);

    return Partner.deserialize(partnerDto);
  }

  @Action({ rawError: true })
  async deletePartner(partnerId) {
    await GroupsService.deletePartner(partnerId);

    this.DELETE_PARTNER(partnerId);
  }

  @Action({ rawError: true })
  async createOffer(offer) {
    const { data: offerDto } = await GroupsService.createOffer(offer);

    const newOffer = Offer.deserialize(offerDto, this.configuration);

    this.ADD_MESSAGE(
      SentOfferMessage.from({
        id: uniqueId(),
        offer: newOffer,
        createdAt: new Date(),
        user: this.context.rootGetters['currentUser']
      })
    );
    this.UPDATE_DEAL_ATTR_VALUE({
      dealId: offer.dealId,
      attr: 'offers',
      value: [newOffer, ...this.dealsByIds[offer.dealId].offers]
    });
  }

  @Action({ rawError: true })
  async cancelDeal(dealId) {
    await GroupsService.updateDealStatus(dealId, DealStatus.Canceled);

    this.UPDATE_DEAL_ATTR_VALUE({
      dealId,
      attr: 'status',
      value: DealStatus.Canceled
    });

    forEach(this.dealsByIds[dealId].messages, message => {
      if (message.offer) {
        this.UPDATE_OFFER_STATUS({
          offerId: message.offer.id,
          status: OfferStatus.Canceled
        });
      }
    });
  }

  @Action({ rawError: true })
  async comment(comment) {
    const { data: commentMessageDto } = await GroupsService.updateDealComments(
      this.dealId,
      comment
    );

    this.ADD_MESSAGE(
      CommentMessage.from({
        ...commentMessageDto,
        createdAt: new Date(),
        user: this.context.rootGetters['currentUser']
      })
    );
  }

  @Action({ rawError: true })
  async changeOfferStatus({ offerId, status }) {
    await GroupsService.changeOfferStatus(offerId, status);

    this.UPDATE_OFFER_STATUS({ offerId, status });

    if (status === OfferStatus.Fixed) {
      this.UPDATE_DEAL_ATTR_VALUE({
        dealId: this.dealId,
        attr: 'status',
        value: DealStatus.Fixed
      });
    }
  }

  @Action({ rawError: true })
  async fetchFinalOffers(offerId: string): Promise<FinalOffer[]> {
    const { data: finalOffers } = await GroupsService.fetchFinalOffers(offerId);

    return finalOffers;
  }

  @Action({ rawError: true })
  async fetchFinalOffer(finalOfferId): Promise<FinalOffer> {
    if (!this.isConfigurationLoaded) {
      await this.fetchConfiguration();
    }

    const { data: finalOfferDto } = await GroupsService.fetchFinalOffer(
      finalOfferId
    );

    return FinalOffer.deserialize(finalOfferDto, this.configuration);
  }

  @Action({ rawError: true })
  fetchFinalOfferPdf(finalOfferId) {
    return GroupsService.fetchFinalOfferPdf(finalOfferId);
  }

  @Action({ rawError: true })
  downloadFinalOfferPdf(finalOfferId) {
    return GroupsService.downloadFinalOfferPdf(finalOfferId);
  }

  @Action({ rawError: true })
  async createFinalOffer({ offerId, name }: CreateFinalOfferDto) {
    const { data: finalOfferDto } = await GroupsService.createFinalOffer(
      offerId,
      name
    );

    this.SET_REVALIDATE_DEAL(true);

    return FinalOffer.deserialize(finalOfferDto, this.configuration);
  }

  @Action({ rawError: true })
  async updateFinalOffer({ finalOfferId, finalOfferDto }) {
    const { data: finalOffer } = await GroupsService.updateFinalOffer(
      finalOfferId,
      finalOfferDto
    );

    return FinalOffer.deserialize(finalOffer, this.configuration);
  }

  @Action({ rawError: true })
  async duplicateFinalOffer({ name, finalOfferId }) {
    const { data: finalOfferDuplicate } =
      await GroupsService.duplicateFinalOffer(finalOfferId, name);

    this.SET_REVALIDATE_DEAL(true);

    return finalOfferDuplicate;
  }

  @Action({ rawError: true })
  async deleteFinalOffer(finalOfferId: string) {
    await GroupsService.deleteFinalOffer(finalOfferId);

    this.SET_REVALIDATE_DEAL(true);
  }

  @Action({ rawError: true })
  async fetchPriceAnalysis(priceAnalysisPayload: PriceAnalysisPayload) {
    const { data: priceAnalysisData } = await GroupsService.fetchPriceAnalysis(
      priceAnalysisPayload
    );

    return priceAnalysisData.details;
  }
}
