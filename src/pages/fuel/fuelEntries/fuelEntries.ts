import {reactive} from 'vue';
import {ajaxDelete, ajaxGet, ajaxPost, ajaxPut} from '@/services/ajax';
import {findItemById} from '@/services/helpers';
import {useToast} from 'vue-toastification';

export default {
    setup() {
        const toast = useToast();
        const apiUrl = process.env.VUE_APP_API_URL + '/fuel-entries';
        const pageState = reactive({
            isEditSection: false,
            showAddEditSection: false,
            showDeleteDialogue: false,
            currentEditingId: undefined,
            deletingItem: {
                id: '',
                fuel_type: '',
                amount: '',
                date: ''
            },
            editSectionData: {
                amount: '',
                fuel_type: ''
            },
            fuelEntriesList: []
        });

        const getFuelEntriesList = async () => {
            const json = await ajaxGet(apiUrl);
            if (json) {
                pageState.fuelEntriesList = json.data;
            }
        };

        const initAddProcess = () => {
            resetEditSection();
            showAddSection();
        };

        const submitAddAction = async () => {
            if (
                !pageState.editSectionData.fuel_type ||
                !pageState.editSectionData.amount
            ) {
                toast.error('Please fill all necessary fields');
                return;
            }
            const json = await ajaxPost(apiUrl, pageState.editSectionData);
            if (json) {
                resetEditSection();
                closeAddSection();
                getFuelEntriesList();
            }
        };

        const initEditProcess = (id: number) => {
            const fuelEntry = findItemById(pageState.fuelEntriesList, id);
            if (fuelEntry) {
                pageState.isEditSection = true;
                pageState.editSectionData = {
                    amount: fuelEntry.amount,
                    fuel_type: fuelEntry.fuel_type
                };
                pageState.showAddEditSection = true;
                pageState.currentEditingId = id;
            }
        };

        const submitEditAction = async () => {
            if (
                !pageState.editSectionData.fuel_type ||
                pageState.currentEditingId === undefined ||
                !pageState.editSectionData.amount
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
                getFuelEntriesList();
            }
        };

        const initDeleteProcess = (id: number) => {
            const fuelEntry = findItemById(pageState.fuelEntriesList, id);
            if (fuelEntry) {
                pageState.deletingItem = fuelEntry;
                showDeleteDialogue();
            }
        };

        const submitDeleteAction = async () => {
            const json = await ajaxDelete(
                apiUrl + '/' + pageState.deletingItem.id
            );
            if (json) {
                closeDeleteDialogue();
                getFuelEntriesList();
            }
        };

        const showAddSection = () => {
            resetEditSection();
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
            pageState.editSectionData.amount = '';
            pageState.editSectionData.fuel_type = '';
            pageState.currentEditingId = undefined;
            pageState.isEditSection = false;
        };

        getFuelEntriesList();

        return {
            pageState,
            initAddProcess,
            initEditProcess,
            initDeleteProcess,
            closeAddSection,
            submitEditAction,
            submitAddAction,
            closeDeleteDialogue,
            submitDeleteAction
        };
    },
    name: 'fuel-entries'
};
