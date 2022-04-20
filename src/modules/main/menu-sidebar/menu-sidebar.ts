import {IUser} from '@/interfaces/user';
import {Options, Vue} from 'vue-class-component';
import MenuItem from '@/components/menu-item/menu-item.vue';

@Options({
    name: 'app-menu-sidebar',
    components: {
        'app-menu-item': MenuItem
    }
})
export default class MenuSidebar extends Vue {
    public menu = MENU;
    get user(): IUser {
        return this.$store.getters['auth/user'];
    }

    get sidebarSkin() {
        return this.$store.getters['ui/sidebarSkin'];
    }
}

export const MENU = [
    {
        name: 'labels.dashboard',
        path: '/'
    },
    {
        name: 'labels.users',
        path: '/users'
    },
    {
        name: 'labels.fuel',
        path: '/fuel',
        children: [
            {
                name: 'labels.cars',
                path: '/cars'
            },

            {
                name: 'labels.carDrivers',
                path: '/car-drivers'
            },
            {
                name: 'labels.fuelEntries',
                path: '/fuel-entries'
            },
            {
                name: 'labels.fuellings',
                path: '/fuellings'
            },
            {
                name: 'labels.tripTickets',
                path: '/trip-tickets'
            },

        ]
    }
];
