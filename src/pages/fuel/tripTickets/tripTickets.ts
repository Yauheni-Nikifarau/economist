import {ref} from "vue";

export default {
    setup() {
        const apiUrl = process.env.VUE_APP_API_URL + "/trip-tickets";
        const tripTicketsList = ref([]);

        const commonHeaders = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('economist_token')
            },
        };

        const getTripTicketsList = async () => {
            const response = await fetch(apiUrl, {
                ...commonHeaders
            });
            if (!response || response.status != 200) {
                return;
            }
            const json = await response.json();
            tripTicketsList.value = json;
        };
        getTripTicketsList();

        return {
            tripTicketsList
        };
    },
    name: "trip-tickets",
};