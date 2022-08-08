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
  height: 80vh;
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
    text-align: center;
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
                            <STitle>my best times</STitle>
                            <SScores>
                                {highScores.map((score) => {
                                    return (<>
                                        <div>
                                            <span>{score.level}:  </span>
                                            <span className="digits">
                                                {("0" + Math.floor((score.time / 60000) % 60)).slice(-2)}:
                                            </span>
                                            <span className="digits">
                                                {("0" + Math.floor((score.time / 1000) % 60)).slice(-2)}.
                                            </span>
                                            <span className="digits mili-sec">
                                                {("0" + ((score.time / 10) % 100)).slice(-2)}
                                            </span> {score.first} {score.last}
                                        </div>
                                    </>)
                                })}
                            </SScores>
                        </SHeader>
                        <SButton onClick={hideModal}>
                            close
                        </SButton>
                    </SModal>
                </SModalWrapper>
            </React.Fragment>,
            document.body,
        )
        : null;
};
export default PrModal;