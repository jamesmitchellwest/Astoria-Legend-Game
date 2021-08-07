import { useState, useEffect } from 'react';
import { stringify } from 'flatted';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { getApps } from "firebase/app";
const useModal = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [area, setArea] = useState(false);
    const getScores = async (area) => {
        let numApps = 0
        try {
            const fbApps = await getApps()
            numApps = fbApps.length

            if (numApps == 0) {
                const firebaseApp = initializeApp({
                    apiKey: 'AIzaSyBv8ACuYEyAqio0dxgRs59DNQ_hIMDbeSw',
                    authDomain: 'astoria-legend.firebaseapp.com',
                    projectId: 'astoria-legend'
                });
            }
            const db = getFirestore();
            debugger
            const querySnapshot = await getDocs(collection(db, `leaders-${area}`));
            return querySnapshot.docs.map(doc => doc.data());

        } catch (ex) {
        }
    }
    const setScores = async (name, time, area) => {
        debugger
        let numApps = 0
        try {
            const fbApps = await getApps()
            numApps = fbApps.length

            if (numApps == 0) {
                const firebaseApp = initializeApp({
                    apiKey: 'AIzaSyBv8ACuYEyAqio0dxgRs59DNQ_hIMDbeSw',
                    authDomain: 'astoria-legend.firebaseapp.com',
                    projectId: 'astoria-legend'
                });
            }
            const db = getFirestore();
            try {
                const docRef = await addDoc(collection(db, `leaders-${area}`), {
                    name,
                    time
                });
                console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
            const querySnapshot = await getDocs(collection(db, "leaders"));
            return querySnapshot.docs.map(doc => doc.data());

        } catch (ex) {
        }
    }
    function toggleModal(area) {
        setIsVisible(!isVisible);
        setArea(area);
    }
    return {
        area,
        isVisible,
        toggleModal,
        getScores,
        setScores,
    }
};
export default useModal;