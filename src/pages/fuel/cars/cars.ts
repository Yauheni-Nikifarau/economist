import {ref} from "vue";

export default {
    setup() {
        const apiUrl = process.env.VUE_APP_API_URL + "/cars";
        const carsList = ref([]);

        const commonHeaders = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('economist_token')
            },
        };

        const getCarsList = async () => {
            const response = await fetch(apiUrl, {
                ...commonHeaders
            });
            if (!response || response.status != 200) {
                return;
            }
            const json = await response.json();
            carsList.value = json;
        };
        getCarsList();

        return {
            carsList
        };
    },
    name: "cars",
};