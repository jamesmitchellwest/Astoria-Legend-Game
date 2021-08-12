import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import bgImg from '../assets/finish_bg.png';

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
  top: 10%;
  width: 100%;
  z-index: 1000;
`;
const SModal = styled.div`
  background-image: url(${bgImg});
  background-size: 100%;
  align-items: center;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  margin: 1.875rem;
  max-width: 900px;
  min-width: 500px;
  position: relative;
  z-index: 100;
  border: 5px solid #f82ded;
  box-shadow: 0 0 0 5px #ffcc28;
`;
const SHeader = styled.div`
  line-height: 0px;
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 1.875rem 0.9375rem 1.875rem 0.9375rem;
  width: 90%;
`;
const STitle = styled.div`
    font-family: 'PIX_lite';
    margin: 0;
    font-style: normal;
    font-size: 100px;
    -webkit-text-stroke: 3px #ffcc28;
    -webkit-text-fill-color: #f82ded;
    letter-spacing: 2px;
    filter: drop-shadow(0px 0px 5px #50ccf7);
`;
const SSubTitle = styled.div`
    font-family: 'PIX_lite';
    margin: 0;
    font-style: normal;
    line-height: 1;
    font-size: 46px;
    color: #f82ded;
    -webkit-text-stroke: 1px #ffffff;
    filter: drop-shadow(0px 0px 2px #ffffff);
    margin-top: 40px;
`;
const SScores = styled.div`
    background: rgba(255,255,255, .8);
    border-radius: 8px;
    margin: 15px 0;
    width: 100%;
    border: 5px solid #ffcc28;
    max-height: 300px;
    overflow: auto;
`;
const SRow = styled.div`
  font-family: 'PIX_lite';
  color: #000;
  text-transform: lowercase;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ffcc28;
  padding: 10px;
`;
const SCol = styled.div`
  flex: 0 0 33%;
  display: flex;
  align-items: center;
`;
const SScoresHeader = styled.div`
    font-family: 'PIX_lite';
    margin: 0;
    font-style: normal;
    line-height: 1;
    font-size: 30px;
    color: #f82ded;
`;
const SNameInput = styled.input`
    font-family: 'PIX_lite';
    width: 100%;
    margin-bottom: 5px;
    text-align: center;
    text-transform: lowercase;
`;
const SSavebutton = styled.input`
    font-family: 'PIX_lite';
    cursor: pointer;
    letter-spacing: 3px;
    background: #50ccf7;
    outline: none;
    border: none;
    font-family: 'PIX_lite';
    color: #fff;
    font-size: 20px;
    padding: 0px 15px 3px;
`;
const SButton = styled.button`
  cursor: pointer;
  font-family: 'PIX_lite';
  letter-spacing: 3px;
  background: #50ccf7;
  outline: none;
  border: none;
  font-family: 'PIX_lite';
  color: #fff;
  font-size: 20px;
  padding: 5px 15px 8px;
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
    }, [area, isVisible])
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
                            <STitle>finish</STitle>
                            <SSubTitle>leaderboard</SSubTitle>
                            <SScores>
                                <SRow>
                                    <SScoresHeader>rank</SScoresHeader>
                                    <SScoresHeader>player</SScoresHeader>
                                    <SScoresHeader>time</SScoresHeader>
                                </SRow>
                                {highScores.map((score, index)=> {
                                    return (<>
                                        <SRow>
                                            <SCol style={{justifyContent: "flex-start"}}>{index + 1}</SCol>
                                            <SCol style={{textAlign: "center", justifyContent: "center"}}>
                                                {!score.isMine && <span> {score.name}</span>}
                                                {score.isMine && score.saved && <span> {newScoreName}</span>}
                                                {score.isMine && !score.saved && <span>
                                                    <form name="newleader" onSubmit={(e) => { e.preventDefault(); setScores(newScoreName, myScore, area); score.saved = true }}>
                                                        <SNameInput autoComplete="off" placeholder="enter name" onKeyDown={(e) => { e.stopPropagation() }} name="newleader" onChange={(e) => { setNewScoreName(e.target.value) }} value={newScoreName} type='text' />
                                                        <SSavebutton value="save" type="submit" />
                                                    </form>
                                                </span>}
                                            </SCol>
                                            <SCol style={{justifyContent: "flex-end"}}>
                                                <span className="digits">
                                                    {("0" + Math.floor((score.time / 60000) % 60)).slice(-2)}:
                                                </span>
                                                <span className="digits">
                                                    {("0" + Math.floor((score.time / 1000) % 60)).slice(-2)}.
                                                </span>
                                                <span className="digits mili-sec">
                                                    {("0" + ((score.time / 10) % 100)).slice(-2)}
                                                </span>
                                            </SCol>
                                        </SRow>
                                    </>)
                                })}
                            </SScores>
                        </SHeader>
                        <SButton style={{marginBottom: "30px"}} onClick={hideModal}>
                            close
                        </SButton>
                    </SModal>
                </SModalWrapper>
            </React.Fragment>,
            document.body,
        )
        : null;
};
export default Modal;