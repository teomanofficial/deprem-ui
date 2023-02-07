// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";
import { environment } from '../../../../environments/environment';

export const firebaseApp = initializeApp(environment.firebase);
export const database = getDatabase(firebaseApp);
