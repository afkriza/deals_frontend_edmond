export const sidebarItems = [
    {
        component: 'MidtermBooking',
        title: 'Midterm Booking',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec turpis augue, dictum vitae eros nec, dictum blandit nisi. Pellentesque finibus lacus eu nisl efficitur gravida. Aliquam lectus tortor, aliquet in ultrices nec, gravida ac urna. Cras porttitor augue nunc, a mattis velit semper nec. In ut aliquam ligula. Aenean nec tellus euismod, ultricies diam ut, varius lorem. Praesent rutrum ligula ut eros bibendum, sed dapibus tortor volutpat. ',
        props: {
            booking: 150,
            mean: 120,
            std: 15
        }
    },
    {
        component: 'ChannelBreakdown',
        title: 'Channel vs expected cancellation breakdown',
        description:
            'Nunc in vestibulum dolor. Cras faucibus lorem est, a tristique metus facilisis vitae. Aenean fermentum, dolor eu maximus tincidunt, eros mi fermentum sapien, et venenatis felis tortor ut nunc. Nam mattis elementum maximus. Pellentesque vehicula, purus in aliquam commodo, ligula diam interdum turpis, in pretium massa ex eget neque. Donec id odio a elit malesuada finibus non sed purus. Vestibulum porttitor, dui vel lobortis egestas, nunc diam eleifend turpis, id cursus ligula sapien ac arcu. Nam finibus bibendum neque, pellentesque vulputate neque eleifend sed. Nullam viverra fermentum sem ornare congue. Morbi cursus elit eget sagittis pharetra. Sed posuere gravida sem, eget dapibus justo commodo a. Aenean vel nunc lacus. Donec aliquam viverra leo, ut commodo sem viverra sed. Morbi lobortis consequat nunc facilisis tincidunt. ',
        props: {
            channels: ['B2B', 'Ind', 'Alo', 'Ost'],
            nettoBookings: [55, 48, 30, 25],
            expectedCancellations: [40, 20, 10, 0]
        }
    },
    {
        component: 'RoomBreakdown',
        title: 'Booking vs room breakdown',
        description:
            'In hac habitasse platea dictumst. Donec hendrerit ultrices dui, et iaculis tortor ornare sit amet. Aenean id porta neque. Morbi ac velit justo. Suspendisse quis congue ipsum. Quisque quam ante, iaculis sit amet porttitor sit amet, fringilla sit amet lectus. Aliquam dignissim ultricies leo, in rutrum diam malesuada vel. Nulla rutrum metus blandit dui consectetur lacinia. Integer finibus augue ac ligula ornare convallis. Nam mauris dui, facilisis in interdum in, pharetra id orci. ',
        props: {
            rooms: ['A2', 'CC2', 'FA2', 'G2', 'J2', 'HA3G', 'HA42L'],
            bookings: [65, 28, 16, 20, 10, 8, 0]
        }
    },
    {
        component: 'TwinsAnalysis',
        title: 'Twins analysis',
        description:
            'In hac habitasse platea dictumst. Donec hendrerit ultrices dui, et iaculis tortor ornare sit amet. Aenean id porta neque. Morbi ac velit justo. Suspendisse quis congue ipsum. Quisque quam ante, iaculis sit amet porttitor sit amet, fringilla sit amet lectus. Aliquam dignissim ultricies leo, in rutrum diam malesuada vel. Nulla rutrum metus blandit dui consectetur lacinia. Integer finibus augue ac ligula ornare convallis. Nam mauris dui, facilisis in interdum in, pharetra id orci. ',
        props: {
            dates: ['-14', '-7', '-2', '-1', 'Today', '+1', '+2', '+7', '+14'],
            numberOfRooms: [250, 238, 235, 232, 220, 230, 237, 244, 250]
        }
    }
];
