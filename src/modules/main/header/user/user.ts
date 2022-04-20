import {IUser} from '@/interfaces/user';
import {Options, Vue} from 'vue-class-component';
import Dropdown from '@/components/dropdown/dropdown.vue';
import {DateTime} from 'luxon';
import axios from "axios";

@Options({
    name: 'user-dropdown',
    components: {
        'app-dropdown': Dropdown
    }
})
export default class User extends Vue {
    get user(): IUser {
        return this.$store.getters['auth/user'];
    }

    private logout() {
        const token = localStorage.getItem('economist_token');
        axios.post(process.env.VUE_APP_API_URL + '/logout', {},{
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        }).then((r) => {
            console.log(r)
        });
        this.$store.dispatch('auth/logout');
    }

    get readableCreatedAtDate() {
        return DateTime.fromISO(this.user.created_at).toFormat('dd LLLL yyyy');
    }
}
