import {ref} from "vue";
import {useRoute} from "vue-router";
import router from "@/router";

export default {
    setup() {
        const route = useRoute();
        const id = route.params.id;
        const endOfApiUrl = id === 'new' ? '' : '/' + id;
        const apiUrl = process.env.VUE_APP_API_URL + "/trip-tickets" + endOfApiUrl;
        const tripTicketInfo = ref<any>({});
        const allowEdit = ref(false);
        const drivers = ref([]);
        const cars = ref([]);
        const tripTicketCarLimits = ref([]);

        const commonHeaders = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('economist_token')
            },
        };

        const getCarsList = async () => {
            const response = await fetch(process.env.VUE_APP_API_URL + '/cars', {
                ...commonHeaders
            });
            if (!response || response.status != 200) {
                return;
            }
            const json = await response.json();
            cars.value = json;
        };

        const getCarLimits = async () => {
            const car = cars.value.find((item) => {
                return item.id === tripTicketInfo.value.car_id;
            })
            tripTicketCarLimits.value = car.meta.limits;
        }

        const getDriversList = async () => {
            const response = await fetch(process.env.VUE_APP_API_URL + '/drivers', {
                ...commonHeaders
            });
            if (!response || response.status != 200) {
                return;
            }
            const json = await response.json();
            drivers.value = json;
        };

        const getTripTicketInfo = async () => {
            console.log('getTripTicketInfo')
            const response = await fetch(apiUrl, {
                ...commonHeaders
            });
            if (!response || response.status != 200) {
                return;
            }
            const json = await response.json();
            tripTicketInfo.value = json;
            if (!tripTicketInfo.value.meta) {
                tripTicketInfo.value.meta = {
                    approved_actions: {
                        '1': {
                            key: '',
                            description: '',
                            quantity: '',
                            approver: ''
                        }
                    }
                }
            }
            if (!tripTicketInfo.value.meta.approved_actions) {
                tripTicketInfo.value.meta.approved_actions = {
                    '1': {
                        key: '',
                        description: '',
                        quantity: '',
                        approver: ''
                    }
                };
            }
        };

        const initEdit = () => {
            allowEdit.value = true;
        }

        const submitEdit = async () => {
            console.log(tripTicketInfo.value)
            let requestBody = <any>{
                car_id: tripTicketInfo.value.car_id,
                driver_id: tripTicketInfo.value.driver_id,
            }
            for (const id in tripTicketInfo.value.meta.approved_actions) {
                requestBody['approved_actions-' + id + '-key'] = tripTicketInfo.value.meta.approved_actions[id]['key'];
                requestBody['approved_actions-' + id + '-description'] = tripTicketInfo.value.meta.approved_actions[id]['description'];
                requestBody['approved_actions-' + id + '-quantity'] = tripTicketInfo.value.meta.approved_actions[id]['quantity'];
                requestBody['approved_actions-' + id + '-approver'] = tripTicketInfo.value.meta.approved_actions[id]['approver'];
            }
            requestBody = JSON.stringify(requestBody);
            let restMethod = 'PUT';
            if (id === 'new') {
                restMethod = 'POST';
            }
            const response = await fetch(apiUrl, {
                method: restMethod,
                ...commonHeaders,
                body: requestBody
            });
            if (response.ok) {
                router.push('/fuel/trip-tickets');
            }
        }

        const addAction = () => {
            const keys = Object.keys(tripTicketInfo.value.meta.approved_actions);
            let key = keys.reduce((prev, cur) => {
                return parseInt(prev) > parseInt(cur) ? prev : cur;
            });
            key = (parseInt(key) + 1) + '';

            tripTicketInfo.value.meta.approved_actions[key] = {
                key: '',
                description: '',
                quantity: '',
                approver: ''
            }
        }

        const deleteAction = (id: any) => {
            delete tripTicketInfo.value.meta.approved_actions[id];
        }

        const deleteTripTicket = async () => {
            const response = await fetch(apiUrl, {
                method: 'DELETE',
                ...commonHeaders
            });
            if (response.ok) {
                router.push('/fuel/trip-tickets');
            }
        }

        const existingTripTicketFlow = async () => {
          await getTripTicketInfo();
          await getCarsList();
          await getDriversList();
          await getCarLimits();
        }

        if (id === 'new') {
            tripTicketInfo.value = {
                car_id: '',
                driver_id: '',
                meta: {
                    approved_actions: {
                        '1': {
                            key: '',
                            description: '',
                            value: '',
                            approver: ''
                        }
                    }
                }
            };
            initEdit();
            getCarsList();
            getDriversList();
        } else {
            existingTripTicketFlow()
        }

        return {
            tripTicketInfo,
            allowEdit,
            cars,
            drivers,
            tripTicketCarLimits,
            initEdit,
            submitEdit,
            addAction,
            deleteAction,
            deleteTripTicket,
            getCarLimits
        };
    },
    name: "trip-ticket",
};
