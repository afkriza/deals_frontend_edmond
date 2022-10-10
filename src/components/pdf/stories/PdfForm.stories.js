import PdfForm from '../PdfForm';
import Deal from '@/components/groups/new-inquiry/models/Deal.model';
import Group from '@/components/groups/new-inquiry/models/Group.model';
import GroupAlternative from '@/components/groups/new-inquiry/models/GroupAlternative.model';
import GroupAlternativeItem from '@/components/groups/new-inquiry/models/GroupAlternativeItem.model';
import GroupAlternativeItemEntry from '@/components/groups/new-inquiry/models/GroupAlternativeItemEntry.model';
import Offer from '@/components/groups/new-offer/models/Offer.model';

export default {
  title: 'PdfForm'
};

const template = `
  <PdfForm 
    :offer="offer" 
    :properties="properties" 
    :unit-types="unitTypes" 
    :services="services"
  >
  </PdfForm>
`;

export const Default = () => ({
  template,
  components: { PdfForm },

  data() {
    const properties = [
      { id: '1', name: 'AC Polari' },
      { id: '2', name: 'Hotel Lone' },
      { id: '3', name: 'Grand Park Hotel Rovinj' }
    ];

    const unitTypes = [
      { id: '1', name: 'Single bed' },
      { id: '2', name: 'Double bed' },
      { id: '3', name: 'Triple bed' }
    ];

    const services = [
      { id: '1', name: 'Half board' },
      { id: '2', name: 'Full board' },
      { id: '3', name: 'Bed and breakfast' }
    ];

    const deal = new Deal({
      id: '1444',
      budget: 11730,
      note:
        'I think we can go with a lower price here because they could potentially become a big client in the future.',
      otherExpenses: 550,
      groups: [
        new Group({
          name: 'Group 1',
          groupAlternatives: [
            new GroupAlternative({
              dateRange: {
                from: new Date(2021, 4, 10),
                to: new Date(2021, 4, 11)
              },
              properties: [properties[5]],
              groupAlternativeItems: [
                new GroupAlternativeItem({
                  bookingDate: '2021-05-10',
                  entries: [
                    new GroupAlternativeItemEntry({
                      roomType: unitTypes[0],
                      packages: [services[0]],
                      quantity: 10
                    }),
                    new GroupAlternativeItemEntry({
                      roomType: unitTypes[2],
                      packages: [services[1]],
                      quantity: 20
                    })
                  ]
                }),
                new GroupAlternativeItem({
                  bookingDate: '2021-05-11',
                  entries: [
                    new GroupAlternativeItemEntry({
                      roomType: unitTypes[0],
                      packages: [services[0]],
                      quantity: 10
                    })
                  ]
                })
              ]
            }),
            new GroupAlternative({
              dateRange: {
                from: new Date(2021, 5, 1),
                to: new Date(2021, 5, 3)
              },
              properties: [properties[8]],
              groupAlternativeItems: [
                new GroupAlternativeItem({
                  bookingDate: '2021-06-01',
                  entries: [
                    new GroupAlternativeItemEntry({
                      roomType: unitTypes[0],
                      packages: [services[0]],
                      quantity: 10
                    })
                  ]
                }),
                new GroupAlternativeItem({
                  bookingDate: '2021-06-02',
                  entries: [
                    new GroupAlternativeItemEntry({
                      roomType: unitTypes[0],
                      packages: [services[0]],
                      quantity: 10
                    })
                  ]
                }),
                new GroupAlternativeItem({
                  bookingDate: '2021-06-03',
                  entries: [
                    new GroupAlternativeItemEntry({
                      roomType: unitTypes[0],
                      packages: [services[0]],
                      quantity: 10
                    }),
                    new GroupAlternativeItemEntry({
                      roomType: unitTypes[1],
                      packages: [services[0], services[1]],
                      quantity: 2
                    }),
                    new GroupAlternativeItemEntry({
                      roomType: unitTypes[4],
                      packages: [services[1], services[2]],
                      quantity: 5
                    })
                  ]
                })
              ]
            })
          ]
        }),
        new Group({
          name: 'Group 2',
          groupAlternatives: [
            new GroupAlternative({
              dateRange: {
                from: new Date(2021, 5, 10),
                to: new Date(2021, 5, 11)
              },
              properties: [properties[1], properties[2], properties[3]],
              groupAlternativeItems: [
                new GroupAlternativeItem({
                  bookingDate: '2021-06-10',
                  entries: [
                    new GroupAlternativeItemEntry({
                      roomType: unitTypes[0],
                      packages: [],
                      quantity: 10
                    })
                  ]
                }),
                new GroupAlternativeItem({
                  bookingDate: '2021-06-11',
                  entries: [
                    new GroupAlternativeItemEntry({
                      roomType: unitTypes[0],
                      packages: [services[0]],
                      quantity: 12
                    })
                  ]
                })
              ]
            })
          ]
        })
      ]
    });

    return {
      properties,
      unitTypes,
      services,
      offer: Offer.from(deal, services[0])
    };
  }
});
