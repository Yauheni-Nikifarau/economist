import {ref, reactive} from 'vue';
import {ajaxDelete, ajaxGet, ajaxPost, ajaxPut} from '@/services/ajax';
import {useToast} from 'vue-toastification';
import {findItemById} from '@/services/helpers';

export default {
    setup() {
        const toast = useToast();
        const apiUrl = process.env.VUE_APP_API_URL + '/fuellings';
        const driversList = ref([]);
        const carsList = ref([]);
        const pageState = reactive({
            isEditSection: false,
            showAddEditSection: false,
            showDeleteDialogue: false,
            currentEditingId: undefined,
            deletingItem: {
                id: '',
                fuel_type: '',
                amount: '',
                date: '',
                driver: '',
                car: ''
            },
            editSectionData: {
                driver_id: '',
                car_id: <any>'',
                fuel_type: '',
                amount: ''
            },
            fuellingsList: []
        });

        const getFuellingsList = async () => {
            const json = await ajaxGet(apiUrl);
            if (json) {
                pageState.fuellingsList = json.data;
            }
        };
        getFuellingsList();

        const getCarsList = async () => {
            const json = await ajaxGet(process.env.VUE_APP_API_URL + '/cars');
            if (json) {
                carsList.value = json.data;
            }
        };
        getCarsList();

        const getDriversList = async () => {
            const json = await ajaxGet(
                process.env.VUE_APP_API_URL + '/drivers'
            );
            if (json) {
                driversList.value = json.data;
            }
        };
        getDriversList();

        const initAddProcess = () => {
            resetEditSection();
            showAddSection();
        };

        const submitAddAction = async () => {
            if (
                !pageState.editSectionData.fuel_type ||
                !pageState.editSectionData.amount ||
                !pageState.editSectionData.car_id ||
                !pageState.editSectionData.driver_id
            ) {
                toast.error('Please fill all necessary fields');
                return;
            }
            const json = await ajaxPost(apiUrl, pageState.editSectionData);
            if (json) {
                resetEditSection();
                closeAddSection();
                getFuellingsList();
            }
        };

        const initEditProcess = (id: number) => {
            const fuelling = findItemById(pageState.fuellingsList, id);
            if (fuelling) {
                pageState.isEditSection = true;
                pageState.editSectionData = {
                    driver_id: fuelling.driver.id,
                    car_id: fuelling.car.id,
                    fuel_type: fuelling.fuel_type,
                    amount: fuelling.amount
                };
                pageState.currentEditingId = id;
                showAddSection();
            }
        };

        const submitEditAction = async () => {
            if (
                pageState.currentEditingId === undefined ||
                !pageState.editSectionData.fuel_type ||
                !pageState.editSectionData.amount ||
                !pageState.editSectionData.car_id ||
                !pageState.editSectionData.driver_id
            ) {
                toast.error('Please fill all necessary fields');
                return;
            }

            const json = await ajaxPut(
                apiUrl + '/' + pageState.currentEditingId,
                pageState.editSectionData
            );
            if (json) {
                resetEditSection();
                closeAddSection();
                getFuellingsList();
            }
        };

        const initDeleteProcess = (id: number) => {
            const fuelling = findItemById(pageState.fuellingsList, id);
            if (fuelling) {
                pageState.deletingItem.id = fuelling.id;
                pageState.deletingItem.fuel_type = fuelling.fuel_type;
                pageState.deletingItem.amount = fuelling.amount;
                pageState.deletingItem.date = fuelling.date;
                pageState.deletingItem.driver = fuelling.driver.name;
                pageState.deletingItem.car = fuelling.car.name;
                showDeleteDialogue();
            }
        };

        const submitDeleteAction = async () => {
            const json = await ajaxDelete(
                apiUrl + '/' + pageState.deletingItem.id
            );
            if (json) {
                closeDeleteDialogue();
                getFuellingsList();
            }
        };

        const setFuelType = () => {
            const car = findItemById(
                carsList.value,
                pageState.editSectionData.car_id
            );
            pageState.editSectionData.fuel_type = car.fuel_type;
        };

        const showAddSection = () => {
            pageState.showAddEditSection = true;
        };

        const closeAddSection = () => {
            pageState.showAddEditSection = false;
        };

        const showDeleteDialogue = () => {
            pageState.showDeleteDialogue = true;
        };

        const closeDeleteDialogue = () => {
            pageState.showDeleteDialogue = false;
        };

        const resetEditSection = () => {
            pageState.editSectionData.driver_id = '';
            pageState.editSectionData.car_id = '';
            pageState.editSectionData.fuel_type = '';
            pageState.editSectionData.amount = '';
            pageState.currentEditingId = undefined;
            pageState.isEditSection = false;
        };

        return {
            pageState,
            carsList,
            driversList,
            initAddProcess,
            initDeleteProcess,
            initEditProcess,
            showDeleteDialogue,
            submitEditAction,
            submitAddAction,
            closeDeleteDialogue,
            closeAddSection,
            submitDeleteAction,
            setFuelType
        };
    },
    name: 'fuellings'
};
