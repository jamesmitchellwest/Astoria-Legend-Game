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
  top: 50%;
  transform: translateY(-50%);
  outline: 0;
  overflow-x: hidden;
  overflow-y: auto;
  position: absolute;
  width: 100%;
  max-height: 95%;
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
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 1vw;
  width: 90%;
  overflow: hidden;
`;
const STitle = styled.div`
    font-family: 'PIX_lite';
    margin: 0;
    font-style: normal;
    font-size: clamp(40px, 4vw, 100px);
    -webkit-text-stroke: clamp(0.4px,0.2vw,3px) #ffcc28;;
    -webkit-text-fill-color: #f82ded;
    letter-spacing: 2px;
    line-height: .8;
    filter: drop-shadow(0px 0px 5px #50ccf7);
    text-align: center;
    margin-bottom: 1vw;
`;
const SScores = styled.div`
    background: rgba(255,255,255,.8);
    border-radius: 8px;
    margin: 15px 0;
    width: 100%;
    border: 5px solid #ffcc28;
    max-height: 300px;
    overflow: auto;
    font-family: 'PressStart2P';
    color: #f82ded;
    text-shadow: 2px 1px 1px #fd9f61;
    text-transform: uppercase;
    min-height: 30vh;
`;
const SScore = styled.div`
    display: flex;
    padding: 10px;
    border-bottom: 1px dotted;
`;
const SLevel = styled.div`

`;
const STime = styled.div`

`;
const SxButton = styled.div`
    cursor: pointer;
    background: #50ccf7;
    position: absolute;
    right: 0px;
    top: 0px;
    padding: 7px 7px 5px 11px;
    font-family: PressStart2P;
    text-align: right;
`;
const PrModal = ({ prModalIsVisible, hideModal, getPrScores }) => {
    const [highScores, setHighScores] = useState([]);
    useEffect(async () => {
        if (prModalIsVisible) {
            const scores = await getPrScores()

            setHighScores(scores)
            // setHighScores(sorted)

        }
    }, [prModalIsVisible])
    return prModalIsVisible
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
                            <STitle>personal bests</STitle>
                            <SScores>
                                {highScores.map((score) => {
                                    return (<>
                                        <SScore>
                                            <SLevel>{score.level}&nbsp;-&nbsp;  </SLevel>
                                            <STime>
                                                {!!score.time && <>
                                                    <span className="digits">
                                                        {("0" + Math.floor((score.time / 60000) % 60)).slice(-2)}:
                                                    </span>
                                                    <span className="digits">
                                                        {("0" + Math.floor((score.time / 1000) % 60)).slice(-2)}.
                                                    </span>
                                                    <span className="digits mili-sec">
                                                        {("0" + ((score.time / 10) % 100)).slice(-2)}
                                                    </span> {score.first} {score.last}
                                                </>}
                                                {!score.time && <span className="digits">{"--:--:--"}</span>}
                                            </STime>

                                        </SScore>
                                    </>)
                                })}
                            </SScores>
                        </SHeader>
                        <SxButton onClick={hideModal}>
                            X
                        </SxButton>
                    </SModal>
                </SModalWrapper>
            </React.Fragment>,
            document.body,
        )
        : null;
};
export default PrModal;