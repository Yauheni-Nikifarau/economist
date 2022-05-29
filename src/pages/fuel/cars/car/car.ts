import {reactive, ref} from 'vue';
import {useRoute} from 'vue-router';
import router from '@/router';
import {ajaxGet, ajaxPost, ajaxPut, ajaxDelete} from '@/services/ajax';

export default {
    setup() {
        const route = useRoute();
        const slug = route.params.slug;
        const endOfApiUrl = slug === 'new' ? '' : '/' + slug;
        const apiUrl = process.env.VUE_APP_API_URL + '/cars' + endOfApiUrl;
        const carInfo = reactive({
            slug: '',
            name: '',
            fuel_type: '',
            meta: {
                plates: '',
                limits: <any>{
                    '1': {
                        title: '',
                        description: '',
                        value: '',
                        measure: ''
                    }
                }
            }
        });
        const allowEdit = ref(false);

        const getCarInfo = async () => {
            const json = await ajaxGet(apiUrl);
            if (json) {
                carInfo.slug = json.data.slug;
                carInfo.name = json.data.name;
                carInfo.fuel_type = json.data.fuel_type;
                carInfo.meta = json.data.meta;
            }
        };

        const initEditProcess = () => {
            allowEdit.value = true;
        };

        const submitEditAction = async () => {
            const requestBody = <any>{
                slug: carInfo.slug,
                name: carInfo.name,
                fuel_type: carInfo.fuel_type,
                plates: carInfo.meta.plates
            };
            for (const id in carInfo.meta.limits) {
                requestBody['limits-' + id + '-title'] =
                    carInfo.meta.limits[id]['title'];
                requestBody['limits-' + id + '-description'] =
                    carInfo.meta.limits[id]['description'];
                requestBody['limits-' + id + '-value'] =
                    carInfo.meta.limits[id]['value'];
                requestBody['limits-' + id + '-measure'] =
                    carInfo.meta.limits[id]['measure'];
            }
            let json: undefined;

            if (slug === 'new') {
                json = await ajaxPost(apiUrl, requestBody);
            } else {
                json = await ajaxPut(apiUrl, requestBody);
            }

            if (json) {
                router.push('/fuel/cars');
            }
        };

        const addLimit = () => {
            const keys = Object.keys(carInfo.meta.limits);
            let key = keys.reduce((prev, cur) => {
                return parseInt(prev) > parseInt(cur) ? prev : cur;
            });
            key = parseInt(key) + 1 + '';

            carInfo.meta.limits[key] = {
                title: '',
                description: '',
                value: '',
                measure: ''
            };
        };

        const deleteLimit = (id: any) => {
            delete carInfo.meta.limits[id];
        };

        const deleteCar = async () => {
            const json = await ajaxDelete(apiUrl);
            if (json) {
                router.push('/fuel/cars');
            }
        };

        if (slug === 'new') {
            initEditProcess();
        } else {
            getCarInfo();
        }

        return {
            carInfo,
            allowEdit,
            initEditProcess,
            submitEditAction,
            addLimit,
            deleteLimit,
            deleteCar
        };
    },
    name: 'car'
};
