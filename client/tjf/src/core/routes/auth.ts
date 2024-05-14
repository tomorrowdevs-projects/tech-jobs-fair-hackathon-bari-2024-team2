import Home from "../../features/home/Home";
import { RoutesModel } from "./models/Routes.model";

const auth: RoutesModel = {
    list: [
        {
            path: '/',
            name: 'home.index',
            component: Home
        },
        
    ],
    redirect: '/home'
}

export default auth;
