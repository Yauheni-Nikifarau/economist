import {ref} from 'vue';
import {ajaxGet} from '@/services/ajax';

export default {
    setup() {
        const apiUrl = process.env.VUE_APP_API_URL + '/cars';
        const carsList = ref([]);

        const getCarsList = async () => {
            const json = await ajaxGet(apiUrl);
            if (json) {
                carsList.value = json.data;
            }
        };
        getCarsList();

        return {
            carsList
        };
    },
    name: 'cars'
};
