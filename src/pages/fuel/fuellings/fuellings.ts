import {ref, reactive} from "vue";

export default {
    setup() {
        const apiUrl = process.env.VUE_APP_API_URL + "/fuellings";
        const fuellingsList = ref([]);
        const conditionEditSection = ref(false);
        const isEditSection = ref(false);
        const editSectionDriver = ref('');
        const editSectionCar = ref('');
        const editSectionType = ref('');
        const editSectionValue = ref('');
        const drivers = ref([]);
        const cars = ref([]);
        const deletingFuelling = reactive({
            id: '',
            fuel_type: '',
            amount: '',
            date: '',
            driver: '',
            car: ''
        });
        const commonHeaders = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('economist_token')
            },
        };
        const showDeleteDialogue = ref(false);
        let currentEditingId: any = undefined;

        const getFuellingsList = async () => {
            const response = await fetch(apiUrl, {
                ...commonHeaders
            });
            if (!response || response.status != 200) {
                return;
            }
            const json = await response.json();
            fuellingsList.value = json;
        };
        getFuellingsList();

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
        getCarsList();

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
        getDriversList();

        const showEditSection = () => {
            editSectionValue.value = '';
            editSectionType.value = '';
            isEditSection.value = false;
            conditionEditSection.value = true;
        }

        const closeEditSection = () => {
            conditionEditSection.value = false;
        }

        const callEditProcess = (id: any) => {
            const fuelling = fuellingsList.value.find((item) => {
                return id === item.id;
            });
            isEditSection.value = true;
            editSectionDriver.value = fuelling.driver.id;
            editSectionCar.value = fuelling.car.id;
            editSectionType.value = fuelling.fuel_type;
            editSectionValue.value = fuelling.amount;
            conditionEditSection.value = true;
            currentEditingId = id;
        }

        const submitEditAction = async () => {
            if (!editSectionType.value || currentEditingId === undefined || !editSectionValue.value) return;
            const response = await fetch(apiUrl + '/' + currentEditingId, {
                method: 'PUT',
                ...commonHeaders,
                body: JSON.stringify({
                    fuel_type: editSectionType.value,
                    amount: editSectionValue.value,
                    car_id: editSectionCar.value,
                    driver_id: editSectionDriver.value
                })
            });
            if (response.ok) {
                editSectionValue.value = '';
                editSectionType.value = '';
                currentEditingId = undefined;
                closeEditSection();
                getFuellingsList();
            }
        }

        const submitAddAction = async () => {
            if (!editSectionType.value || !editSectionValue.value) return;
            const response = await fetch(apiUrl, {
                method: 'POST',
                ...commonHeaders,
                body: JSON.stringify({
                    fuel_type: editSectionType.value,
                    amount: editSectionValue.value,
                    car_id: editSectionCar.value,
                    driver_id: editSectionDriver.value
                })
            });
            if (response.ok) {
                editSectionValue.value = '';
                editSectionType.value = '';
                currentEditingId = undefined;
                closeEditSection();
                getFuellingsList();
            }
        }

        const callDeleteProcess = (id: any) => {
            const fuelling = fuellingsList.value.find((item) => {
                return item.id === id;
            })
            deletingFuelling.id = fuelling.id;
            deletingFuelling.fuel_type = fuelling.fuel_type;
            deletingFuelling.amount = fuelling.amount;
            deletingFuelling.date = fuelling.date;
            deletingFuelling.driver = fuelling.driver.name;
            deletingFuelling.car = fuelling.car.name;
            showDeleteDialogue.value = true;
        }

        const closeDeleteDialogue = () => {
            showDeleteDialogue.value = false
        }

        const submitDeleteAction = async () => {
            const response = await fetch(apiUrl + '/' + deletingFuelling.id, {
                method: 'DELETE',
                ...commonHeaders
            });
            if (response.ok) {
                closeDeleteDialogue();
                getFuellingsList();
            }
        }

        const setFuelType = () => {
            const car = cars.value.find((item) => {
                return item.id === editSectionCar.value;
            })
            editSectionType.value = car.fuel_type;
        }

        return {
            fuellingsList,
            conditionEditSection,
            isEditSection,
            editSectionCar,
            editSectionDriver,
            cars,
            drivers,
            editSectionType,
            editSectionValue,
            showDeleteDialogue,
            deletingFuelling,
            callEditProcess,
            callDeleteProcess,
            showEditSection,
            closeEditSection,
            submitEditAction,
            submitAddAction,
            closeDeleteDialogue,
            submitDeleteAction,
            setFuelType
        };
    },
    name: "fuellings",
};
