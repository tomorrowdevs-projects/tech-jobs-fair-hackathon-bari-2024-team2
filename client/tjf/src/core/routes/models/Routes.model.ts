import React from "react";

export interface RoutesModel{
    list: {
        path: string;
        component: React.ComponentType<any>;
        name: string;
        permissions?: string[] 
    }[],
    redirect: string
}