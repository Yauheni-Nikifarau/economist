import mutations from './mutations';
import actions from './actions';
import getters from './getters';
import {IAuthModule} from '@/interfaces/state';

const authModule: IAuthModule = {
    namespaced: true,
    state: {
        token: localStorage.getItem('economist_token'),
        user: JSON.parse(localStorage.getItem('economist_user')),
    },
    mutations,
    actions,
    getters
};

export default authModule;
