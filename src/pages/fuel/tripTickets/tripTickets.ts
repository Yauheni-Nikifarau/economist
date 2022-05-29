import {ref} from 'vue';
import {ajaxGet} from '@/services/ajax';

export default {
    setup() {
        const apiUrl = process.env.VUE_APP_API_URL + '/trip-tickets';
        const tripTicketsList = ref([]);

        const getTripTicketsList = async () => {
            const json = await ajaxGet(apiUrl);
            if (json) {
                tripTicketsList.value = json.data;
            }
        };
        getTripTicketsList();

        return {
            tripTicketsList
        };
    },
    name: 'trip-tickets'
};
