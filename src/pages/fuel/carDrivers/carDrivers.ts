import {ref, reactive} from "vue";

export default {
    setup() {
        const apiUrl = process.env.VUE_APP_API_URL + "/drivers";
        const driversList = ref([]);
        const conditionAddSection = ref(false);
        const isEditSection = ref(false);
        const editSectionSlug = ref('');
        const editSectionName = ref('');
        const deletingDriver = reactive({
            id: '',
            name: '',
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

        const getDriversList = async () => {
            const response = await fetch(apiUrl, {
                ...commonHeaders
            });
            if (!response || response.status != 200) {
                return;
            }
            const json = await response.json();
            driversList.value = json;
        };
        getDriversList();

        const showAddSection = () => {
            editSectionSlug.value = '';
            editSectionName.value = '';
            isEditSection.value = false;
            conditionAddSection.value = true;
        }

        const closeAddSection = () => {
            conditionAddSection.value = false;
        }

        const callEditProcess = (id: any) => {
            const driver = driversList.value.find((item) => {
                return id === item.id;
            });
            isEditSection.value = true;
            editSectionSlug.value = driver.slug;
            editSectionName.value = driver.name;
            conditionAddSection.value = true;
            currentEditingId = id;
        }

        const submitEditAction = async () => {
            if (currentEditingId === undefined || !editSectionName.value) return;
            const response = await fetch(apiUrl + '/' + currentEditingId, {
                method: 'PUT',
                ...commonHeaders,
                body: JSON.stringify({
                    slug: editSectionSlug.value,
                    name: editSectionName.value
                })
            });
            if (response.ok) {
                editSectionSlug.value = '';
                editSectionName.value = '';
                currentEditingId = undefined;
                closeAddSection();
                getDriversList();
            }
        }

        const submitAddAction = async () => {
            if (!editSectionName.value) return;
            const response = await fetch(apiUrl, {
                method: 'POST',
                ...commonHeaders,
                body: JSON.stringify({
                    slug: editSectionSlug.value ? editSectionSlug.value : '',
                    name: editSectionName.value
                })
            });
            if (response.ok) {
                editSectionSlug.value = '';
                editSectionName.value = '';
                currentEditingId = undefined;
                closeAddSection();
                getDriversList();
            }
        }

        const callDeleteProcess = (id: any) => {
            const driver = driversList.value.find((item) => {
                return item.id === id;
            })
            deletingDriver.id = driver.id;
            deletingDriver.name = driver.name;
            showDeleteDialogue.value = true;
        }

        const closeDeleteDialogue = () => {
            showDeleteDialogue.value = false
        }

        const submitDeleteAction = async () => {
            const response = await fetch(apiUrl + '/' + deletingDriver.id, {
                method: 'DELETE',
                ...commonHeaders
            });
            if (response.ok) {
                closeDeleteDialogue();
                getDriversList();
            }
        }

        return {
            driversList,
            conditionAddSection,
            isEditSection,
            editSectionSlug,
            editSectionName,
            showDeleteDialogue,
            deletingDriver,
            callEditProcess,
            callDeleteProcess,
            showAddSection,
            closeAddSection,
            submitEditAction,
            submitAddAction,
            closeDeleteDialogue,
            submitDeleteAction
        };
    },
    name: "car-drivers",
};
