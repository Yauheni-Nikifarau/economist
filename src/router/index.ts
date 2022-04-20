import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';
import store from '@/store/index';

import Main from '@/modules/main/main.vue';
import Login from '@/modules/login/login.vue';
import Register from '@/modules/register/register.vue';

import Dashboard from '@/pages/dashboard/dashboard.vue';
import Profile from '@/pages/profile/profile.vue';
import ForgotPassword from '@/modules/forgot-password/forgot-password.vue';
import RecoverPassword from '@/modules/recover-password/recover-password.vue';
import PrivacyPolicy from '@/modules/privacy-policy/privacy-policy.vue';
import SubMenu from '@/pages/main-menu/sub-menu/sub-menu.vue';
import Blank from '@/pages/blank/blank.vue';
import Fuel from '@/pages/fuel/fuel.vue';
import CarDrivers from '@/pages/fuel/carDrivers/carDrivers.vue';
import Cars from '@/pages/fuel/cars/cars.vue';
import FuelEntries from '@/pages/fuel/fuelEntries/fuelEntries.vue';
import TractorOperators from '@/pages/fuel/tractorOperators/tractorOperators.vue';
import Tractors from '@/pages/fuel/tractors/tractors.vue';
import Trucks from '@/pages/fuel/trucks/trucks.vue';
import TruckDrivers from '@/pages/fuel/truckDrivers/truckDrivers.vue';
import Car from "@/pages/fuel/cars/car/car.vue";
import Fuellings from "@/pages/fuel/fuellings/fuellings.vue";
import TripTickets from "@/pages/fuel/tripTickets/tripTickets.vue";
import TripTicket from "@/pages/fuel/tripTickets/tripTicket/tripTicket.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Main',
        component: Main,
        meta: {
            requiresAuth: true
        },
        children: [
            {
                path: 'profile',
                name: 'Profile',
                component: Profile,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'blank',
                name: 'Blank',
                component: Blank,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'fuel',
                name: 'Fuel',
                component: Fuel,
                meta: {
                    requiresAuth: true
                },
                children: [
                    {
                        path: 'cars',
                        name: 'Cars',
                        component: Cars,
                        meta: {
                            requiresAuth: true
                        }
                    },
                    {
                        path: 'car/:slug',
                        name: 'Car',
                        component: Car,
                        meta: {
                            requiresAuth: true
                        }
                    },
                    {
                        path: 'trip-tickets',
                        name: 'TripTickets',
                        component: TripTickets,
                        meta: {
                            requiresAuth: true
                        }
                    },
                    {
                        path: 'trip-ticket/:id',
                        name: 'TripTicket',
                        component: TripTicket,
                        meta: {
                            requiresAuth: true
                        }
                    },
                    {
                        path: 'car-drivers',
                        name: 'CarDrivers',
                        component: CarDrivers,
                        meta: {
                            requiresAuth: true
                        }
                    },
                    {
                        path: 'fuel-entries',
                        name: 'FuelEntries',
                        component: FuelEntries,
                        meta: {
                            requiresAuth: true
                        }
                    },
                    {
                        path: 'fuellings',
                        name: 'Fuellings',
                        component: Fuellings,
                        meta: {
                            requiresAuth: true
                        }
                    },
                ],
            },
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            requiresUnauth: true
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: {
            requiresUnauth: true
        }
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !store.getters['auth/token']) {
        next('/login');
    } else if (to.meta.requiresUnauth && !!store.getters['auth/token']) {
        next('/');
    } else {
        next();
    }
});

export default router;
