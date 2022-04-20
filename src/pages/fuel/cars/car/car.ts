import {ref} from "vue";
import { useRoute } from "vue-router";
import router from "@/router";

export default {
    setup() {
        const route = useRoute();
        const slug = route.params.slug;
        const endOfApiUrl = slug === 'new' ? '' : '/' + slug;
        const apiUrl = process.env.VUE_APP_API_URL + "/cars" + endOfApiUrl;
        const carInfo = ref<any>({});
        const allowEdit= ref(false);

        const commonHeaders = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('economist_token')
            },
        };

        const getCarInfo = async () => {
            const response = await fetch(apiUrl, {
                ...commonHeaders
            });
            if (!response || response.status != 200) {
                return;
            }
            const json = await response.json();
            console.log(json)
            carInfo.value = json;
        };

        const initEdit = () => {
            allowEdit.value = true;
        }

        const submitEdit = async () => {
            let requestBody = <any> {
                slug: carInfo.value.slug,
                name: carInfo.value.name,
                fuel_type: carInfo.value.fuel_type,
                plates: carInfo.value.meta.plates,
            }
            for (const id in carInfo.value.meta.limits) {
                requestBody['limits-' + id + '-title'] = carInfo.value.meta.limits[id]['title'];
                requestBody['limits-' + id + '-description'] = carInfo.value.meta.limits[id]['description'];
                requestBody['limits-' + id + '-value'] = carInfo.value.meta.limits[id]['value'];
                requestBody['limits-' + id + '-measure'] = carInfo.value.meta.limits[id]['measure'];
            }
            requestBody = JSON.stringify(requestBody);
            let restMethod = 'PUT';
            if (slug === 'new') {
                restMethod = 'POST';
            }
            const response = await fetch(apiUrl, {
                method: restMethod,
                ...commonHeaders,
                body: requestBody
            });
            if (response.ok) {
                router.push('/fuel/cars');
            }
        }

        const addLimit = () => {
            const keys = Object.keys(carInfo.value.meta.limits);
            let key = keys.reduce((prev, cur) => {
                return parseInt(prev) > parseInt(cur) ? prev : cur;
            });
            key = (parseInt(key) + 1) + '';
            console.log(key);

            carInfo.value.meta.limits[key] = {
                title: '',
                description: '',
                value: '',
                measure: ''
            }
        }

        const deleteLimit = (id: any) => {
            delete carInfo.value.meta.limits[id];
        }

        const deleteCar = async () => {
            const response = await fetch(apiUrl, {
                method: 'DELETE',
                ...commonHeaders
            });
            if (response.ok) {
                router.push('/fuel/cars');
            }
        }

        if (slug === 'new') {
            carInfo.value = {
                slug: '',
                name: '',
                fuel_type: '',
                meta: {
                    plates: '',
                    limits: {
                        '1': {
                            title: '',
                            description: '',
                            value: '',
                            measure: ''
                        }
                    }
                }
            };
            initEdit();
        } else {
            getCarInfo();
        }

        return {
            carInfo,
            allowEdit,
            initEdit,
            submitEdit,
            addLimit,
            deleteLimit,
            deleteCar
        };
    },
    name: "car",
};
