import { GeoPoint } from "firebase/firestore";
import { create } from "zustand";


type Driver = { 
    name:string,
    plate:string,
    status:string,
    location:GeoPoint,
    ruta:GeoPoint[]
}
interface clientState {
    drivers: Driver[];
    loading:boolean;
    obtenerDrivers: () => Promise<void>;
}

export const useClientStore = create<clientState>((set)=>({
    loading:false,
    drivers:[],
    obtenerDrivers: async () =>{

    }
}))
