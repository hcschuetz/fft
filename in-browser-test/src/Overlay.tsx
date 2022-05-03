import styled from "styled-components";
import { FC, useEffect } from "react";

const GlassPane = styled.div<{show: boolean}>`
    z-index: auto;
    display: ${({show}) => (show ? 'block' : 'none')};
    position: fixed;
    top : 0; height: 100vh;
    left: 0; width : 100vw;
    background: rgba(0,0,0,0.5);
`;

const SubWindow = styled.div` 
    position: fixed;
    top: 2rem;
    right: 2rem;
    bottom: 2rem;
    left: 2rem;
    padding: 1rem;
    background: white;
    text-align: center;
`;

const Button = styled.button`
  position: absolute;
  top: 0.2rem;
  right: 0.3rem;
  background: none;
  border: none;
  font-size: 1.5em;
`;

const Container = styled.div`
  display: inline-block;
  text-align: left;
  height: 100%;
  overflow: auto;
  //border: 2px solid black;
`;

const Overlay: FC<{close: () => void, show: boolean}> = ({
  close, show, children
}) => {
  useEffect(() => {
    function handleKeyEvent(ev: KeyboardEvent) {
      if (ev.key === "Escape") close();
    }
    document.addEventListener("keyup", handleKeyEvent, false);
    return () => document.removeEventListener("keyup", handleKeyEvent, false);
  }, [close]);

  return (
    <GlassPane show={show} onClick={close}>
      <SubWindow onClick={ev => { ev.stopPropagation(); }}>
        <Button onClick={close}>✖</Button>
        <Container>
          {children}
        </Container>
      </SubWindow>
    </GlassPane>
  );
}

export default Overlay;
