import {ref, reactive} from "vue";

export default {
    setup() {
        const apiUrl = process.env.VUE_APP_API_URL + "/fuel-entries";
        const fuelEntriesList = ref([]);
        const conditionAddSection = ref(false);
        const isEditSection = ref(false);
        const editSectionType = ref('');
        const editSectionValue = ref('');
        const deletingEntry = reactive({
            id: '',
            fuel_type: '',
            amount: '',
            date: ''
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

        const getFuelEntriesList = async () => {
            const response = await fetch(apiUrl, {
                ...commonHeaders
            });
            if (!response || response.status != 200) {
                return;
            }
            const json = await response.json();
            fuelEntriesList.value = json;
        };
        getFuelEntriesList();

        const showAddSection = () => {
            editSectionValue.value = '';
            editSectionType.value = '';
            isEditSection.value = false;
            conditionAddSection.value = true;
        }

        const closeAddSection = () => {
            conditionAddSection.value = false;
        }

        const callEditProcess = (id: any) => {
            const fuelEntry = fuelEntriesList.value.find((item) => {
                return id === item.id;
            });
            isEditSection.value = true;
            editSectionType.value = fuelEntry.fuel_type;
            editSectionValue.value = fuelEntry.amount;
            conditionAddSection.value = true;
            currentEditingId = id;
        }

        const submitEditAction = async () => {
            if (!editSectionType.value || currentEditingId === undefined || !editSectionValue.value) return;
            const response = await fetch(apiUrl + '/' + currentEditingId, {
                method: 'PUT',
                ...commonHeaders,
                body: JSON.stringify({
                    fuel_type: editSectionType.value,
                    amount: editSectionValue.value
                })
            });
            console.log(await response.json());
            if (response.ok) {
                editSectionValue.value = '';
                editSectionType.value = '';
                currentEditingId = undefined;
                closeAddSection();
                getFuelEntriesList();
            }
        }

        const submitAddAction = async () => {
            if (!editSectionType.value || !editSectionValue.value) return;
            const response = await fetch(apiUrl, {
                method: 'POST',
                ...commonHeaders,
                body: JSON.stringify({
                    fuel_type: editSectionType.value,
                    amount: editSectionValue.value
                })
            });
            if (response.ok) {
                editSectionValue.value = '';
                editSectionType.value = '';
                currentEditingId = undefined;
                closeAddSection();
                getFuelEntriesList();
            }
        }

        const callDeleteProcess = (id: any) => {
            const fuelEntry = fuelEntriesList.value.find((item) => {
                return item.id === id;
            })
            deletingEntry.id = fuelEntry.id;
            deletingEntry.fuel_type = fuelEntry.fuel_type;
            deletingEntry.amount = fuelEntry.amount;
            deletingEntry.date = fuelEntry.date;
            showDeleteDialogue.value = true;
        }

        const closeDeleteDialogue = () => {
            showDeleteDialogue.value = false
        }

        const submitDeleteAction = async () => {
            const response = await fetch(apiUrl + '/' + deletingEntry.id, {
                method: 'DELETE',
                ...commonHeaders
            });
            if (response.ok) {
                closeDeleteDialogue();
                getFuelEntriesList();
            }
        }

        return {
            fuelEntriesList,
            conditionAddSection,
            isEditSection,
            editSectionType,
            editSectionValue,
            showDeleteDialogue,
            deletingEntry,
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
    name: "fuel-entries",
};
