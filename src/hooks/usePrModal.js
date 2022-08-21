import { useState, useEffect } from 'react';

const usePrModal = () => {
    const [prModalIsVisible, setPrModalIsVisible] = useState(false);

    const getPrScores = async () => {
        const scores = []
        for (const key in window.me.save) {
            if (typeof window.me.save[key] !== "function") {
                scores.push({ level: key, time: window.me.save[key] })
            }
        }
        return scores
    }

    function togglePrModal() {
        setPrModalIsVisible(!prModalIsVisible);
    }
    return {
        prModalIsVisible,
        togglePrModal,
        getPrScores,
    }
};
export default usePrModal;