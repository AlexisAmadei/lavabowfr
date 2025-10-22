import { BsDatabaseFill } from "react-icons/bs";
import { BsPeopleFill } from 'react-icons/bs';

export const ADMIN_MENU_ITEMS = [
    {
        label: 'Contenus',
        icon: BsDatabaseFill,
        path: '/admin/dashboard'
    },
    {
        label: 'CRM',
        icon: BsPeopleFill,
        path: '/admin/users'
    }
]
