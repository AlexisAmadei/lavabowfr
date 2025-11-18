import AdminContent from "@/views/Admin/AdminContent";
import CloudStatus from "@/views/Admin/CloudStatus/CloudStatus";
import AdminCRM from "@/views/Admin/AdminCRM";
import AdminMerchandise from "@/views/Admin/AdminMerchandise";
import { BsCloud, BsDatabaseFill } from "react-icons/bs";
import { BsPeopleFill } from 'react-icons/bs';
import { BsCart } from 'react-icons/bs';

export const ADMIN_MENU_ITEMS = [
    {
        label: 'Contenus',
        icon: BsDatabaseFill,
        path: '/admin/dashboard/content',
        component: AdminContent
    },
    {
        label: 'CRM',
        icon: BsPeopleFill,
        path: '/admin/dashboard/users',
        component: AdminCRM
    },
    {
        label: 'Merchandising',
        icon: BsCart,
        path: '/admin/dashboard/merchandise',
        component: AdminMerchandise
    },
    {
        label: 'Cloud Status',
        icon: BsCloud,
        path: '/admin/dashboard/supabase-status',
        component: CloudStatus
    }
]
