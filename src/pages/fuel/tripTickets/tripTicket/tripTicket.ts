import {reactive, ref} from 'vue';
import {useRoute} from 'vue-router';
import router from '@/router';
import {ajaxDelete, ajaxGet, ajaxPost, ajaxPut} from '@/services/ajax';
import {findItemById} from '@/services/helpers';

export default {
    setup() {
        const route = useRoute();
        const id = route.params.id;
        const endOfApiUrl = id === 'new' ? '' : '/' + id;
        const apiUrl =
            process.env.VUE_APP_API_URL + '/trip-tickets' + endOfApiUrl;
        const allowEdit = ref(false);
        const driversList = ref([]);
        const carsList = ref([]);
        const tripTicketCarLimits = ref([]);
        const tripTicketInfo = reactive({
            car_id: <number>undefined,
            driver_id: '',
            meta: {
                approved_actions: <any>{
                    '1': {
                        key: '',
                        description: '',
                        value: '',
                        approver: ''
                    }
                }
            }
        });

        const getTripTicketInfo = async () => {
            const json = await ajaxGet(apiUrl);
            if (json) {
                tripTicketInfo.car_id = json.data.car_id;
                tripTicketInfo.driver_id = json.data.driver_id;
                if (json.data.meta) {
                    tripTicketInfo.meta = json.data.meta;
                }
            }
        };

        const getCarsList = async () => {
            const json = await ajaxGet(process.env.VUE_APP_API_URL + '/cars-full');
            if (json) {
                console.log(json)
                carsList.value = json.data;
            }
        };

        const getCarLimits = async () => {
            const car = findItemById(carsList.value, tripTicketInfo.car_id);
            tripTicketCarLimits.value = car.meta.limits;
        };

        const getDriversList = async () => {
            const json = await ajaxGet(
                process.env.VUE_APP_API_URL + '/drivers'
            );
            if (json) {
                driversList.value = json.data;
            }
        };

        const initEditProcess = () => {
            allowEdit.value = true;
        };

        const submitEditAction = async () => {
            const requestBody = <any>{
                car_id: tripTicketInfo.car_id,
                driver_id: tripTicketInfo.driver_id
            };
            for (const id in tripTicketInfo.meta.approved_actions) {
                requestBody['approved_actions-' + id + '-key'] =
                    tripTicketInfo.meta.approved_actions[id]['key'];
                requestBody['approved_actions-' + id + '-description'] =
                    tripTicketInfo.meta.approved_actions[id][
                        'description'
                    ];
                requestBody['approved_actions-' + id + '-quantity'] =
                    tripTicketInfo.meta.approved_actions[id]['quantity'];
                requestBody['approved_actions-' + id + '-approver'] =
                    tripTicketInfo.meta.approved_actions[id]['approver'];
            }
            let json: undefined;

            if (id === 'new') {
                json = await ajaxPost(apiUrl, requestBody);
            } else {
                json = await ajaxPut(apiUrl, requestBody);
            }

            if (json) {
                router.push('/fuel/trip-tickets');
            }
        };

        const addAction = () => {
            const keys = Object.keys(
                tripTicketInfo.meta.approved_actions
            );
            let key = keys.reduce((prev, cur) => {
                return parseInt(prev) > parseInt(cur) ? prev : cur;
            });
            key = parseInt(key) + 1 + '';

            tripTicketInfo.meta.approved_actions[key] = {
                key: '',
                description: '',
                quantity: '',
                approver: ''
            };
        };

        const deleteAction = (id: any) => {
            delete tripTicketInfo.meta.approved_actions[id];
        };

        const deleteTripTicket = async () => {
            const json = await ajaxDelete(apiUrl);
            if (json) {
                router.push('/fuel/trip-tickets');
            }
        };

        const existingTripTicketFlow = async () => {
            await getTripTicketInfo();
            await getCarsList();
            await getDriversList();
            await getCarLimits();
        };

        if (id === 'new') {
            initEditProcess();
            getCarsList();
            getDriversList();
        } else {
            existingTripTicketFlow();
        }

        return {

            tripTicketInfo,
            allowEdit,
            carsList,
            driversList,
            tripTicketCarLimits,
            initEditProcess,
            submitEditAction,
            addAction,
            deleteAction,
            deleteTripTicket,
            getCarLimits
        };
    },
    name: 'trip-ticket'
};
