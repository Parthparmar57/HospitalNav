declare module 'init-db' {
    import { Model } from 'mongoose';
    
    interface Doctor {
      name: string;
      specialty: string;
      availability: string[];
    }
  
    interface Hospital {
      name: string;
      location: {
        type: string;
        coordinates: number[];
      };
      departments: string[];
      doctors: Doctor[];
      emergencyContacts: string[];
      waitTimes: {
        emergency: number;
        general: number;
      };
    }
  
    const Hospital: Model<Hospital>;
    const sampleHospitals: Hospital[];
    function initDB(): Promise<Hospital[] | boolean>;
    
    export { Hospital, initDB, sampleHospitals };
  }