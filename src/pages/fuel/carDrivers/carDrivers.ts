import {reactive} from 'vue';
import {ajaxDelete, ajaxGet, ajaxPost, ajaxPut} from '@/services/ajax';
import {findItemById} from '@/services/helpers';
import {useToast} from 'vue-toastification';

export default {
    setup() {
        const toast = useToast();
        const apiUrl = process.env.VUE_APP_API_URL + '/drivers';
        const pageState = reactive({
            driversList: [],
            isEditSection: false,
            showAddEditSection: false,
            showDeleteDialogue: false,
            currentEditingId: undefined,
            deletingItem: {
                id: '',
                name: '',
                slug: ''
            },
            editSectionData: {
                slug: '',
                name: ''
            }
        });

        const getDriversList = async () => {
            const json = await ajaxGet(apiUrl);
            if (json) {
                pageState.driversList = json.data;
            }
        };

        const initAddProcess = () => {
            resetEditSection();
            showAddSection();
        };

        const submitAddAction = async () => {
            if (!pageState.editSectionData.name) {
                toast.error('Please fill all necessary fields');
                return;
            }
            const json = await ajaxPost(apiUrl, pageState.editSectionData);
            if (json) {
                resetEditSection();
                closeAddSection();
                getDriversList();
            }
        };

        const initEditProcess = (id: number) => {
            const driver = findItemById(pageState.driversList, id);
            if (driver) {
                pageState.isEditSection = true;
                pageState.editSectionData = {
                    slug: driver.slug,
                    name: driver.name
                };
                pageState.showAddEditSection = true;
                pageState.currentEditingId = id;
            }
        };

        const submitEditAction = async () => {
            if (
                !pageState.editSectionData.name ||
                pageState.currentEditingId === undefined
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
                getDriversList();
            }
        };

        const initDeleteProcess = (id: number) => {
            const driver = findItemById(pageState.driversList, id);
            if (driver) {
                pageState.deletingItem = driver;
                showDeleteDialogue();
            }
        };

        const submitDeleteAction = async () => {
            const json = await ajaxDelete(
                apiUrl + '/' + pageState.deletingItem.id
            );
            if (json) {
                closeDeleteDialogue();
                getDriversList();
            }
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
            pageState.editSectionData.slug = '';
            pageState.editSectionData.name = '';
            pageState.currentEditingId = undefined;
            pageState.isEditSection = false;
        };

        getDriversList();

        return {
            pageState,
            showDeleteDialogue,
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
    name: 'car-drivers'
};
