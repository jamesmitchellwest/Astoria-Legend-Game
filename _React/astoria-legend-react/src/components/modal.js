import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

const SModalOverlay = styled.div`
  background-color: #999999;
  height: 100vh;
  left: 0;
  opacity: 0.5;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 500;
`;
const SModalWrapper = styled.div`
  display: flex;
  justify-content: center;
  left: 0;
  outline: 0;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  top: 25%;
  width: 100%;
  z-index: 1000;
`;
const SModal = styled.div`
  align-items: center;
  background: white;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  margin: 1.875rem;
  max-width: 900px;
  min-width: 500px;
  position: relative;
  z-index: 100;
`;
const SHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 1.875rem 0.9375rem 1.875rem 0.9375rem;
`;
const STitle = styled.h5`
  color:black;
  margin-bottom: 0.3125rem;
`;
const SButton = styled.button`
  border-top: 1px solid #F0F0F0;
  color: #6D087C;
  cursor: pointer;
  font-weight: bold;
  padding: 0.9375rem;
  width: 100%;
`;
const SDescription = styled.span`
  color: #C1C1C1;
  text-align: center;
`;
const Modal = ({ area, isVisible, hideModal, getScores, setScores, myScore }) => {
    const [highScores, setHighScores] = useState([]);
    const [isHighScore, setIsHighScore] = useState();
    const [newScoreName, setNewScoreName] = useState();
    const [onLeaderBoard, setOnLeaderBoard] = useState();
    useEffect(async () => {
        if (isVisible && area) {
            const scores = await getScores(area)
            scores.push({ time: myScore, isMine: true, saved: false })
            const sorted = scores.sort((a, b) => ((+a.time) - (+b.time)))
            const scoreArray = sorted.reduce((acc, sc) => acc.concat(sc.time), []).slice(0, 100)
            // got the lowest time
            setIsHighScore(myScore < scoreArray[0])
            // is in top 100    
            setOnLeaderBoard(true)//myScore < scoreArray[scoreArray.length - 1])

            setHighScores(sorted)
        }
    }, [area,isVisible])
    return isVisible
        ? createPortal(
            <React.Fragment>
                <SModalOverlay />
                <SModalWrapper
                    aria-modal={true}
                    aria-hidden={true}
                    tabIndex={-1}
                    role="dialog"
                >
                    <SModal>
                        <SHeader>
                            <STitle>High Scores</STitle>
                            <SDescription>
                                {highScores.map(score => {
                                    return (<>
                                        <div>
                                            <span className="digits">
                                                {("0" + Math.floor((score.time / 60000) % 60)).slice(-2)}:
                                            </span>
                                            <span className="digits">
                                                {("0" + Math.floor((score.time / 1000) % 60)).slice(-2)}.
                                            </span>
                                            <span className="digits mili-sec">
                                                {("0" + ((score.time / 10) % 100)).slice(-2)}
                                            </span>
                                            {!score.isMine && <span> {score.name}</span>}
                                            {score.isMine && score.saved && <span> {newScoreName}</span>}
                                            {score.isMine && !score.saved && <span>
                                                <form name="newleader" onSubmit={(e) => { e.preventDefault(); setScores(newScoreName, myScore, area); score.saved = true }}>
                                                    <input onKeyDown={(e) => { e.stopPropagation() }} name="newleader" onChange={(e) => { setNewScoreName(e.target.value) }} value={newScoreName} type='text' />
                                                    <input value="Save" type="submit" />
                                                </form>
                                            </span>}
                                        </div>
                                    </>)
                                })}
                            </SDescription>
                        </SHeader>
                        <SButton onClick={hideModal}>
                            Close
                        </SButton>
                    </SModal>
                </SModalWrapper>
            </React.Fragment>,
            document.body,
        )
        : null;
};
export default Modal;