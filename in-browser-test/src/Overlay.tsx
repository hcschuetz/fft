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

const Container = styled.div` 
    position: fixed;
    top: 2rem;
    right: 2rem;
    bottom: 2rem;
    left: 2rem;
    overflow: auto;
    padding: 1rem;
    background: white;
`;

const Button = styled.button`
  position: absolute;
  top: 0.2rem;
  right: 0.3rem;
  background: none;
  border: none;
  font-size: 1.5em;
`

const Overlay: FC<{close: () => void, show: boolean}> = ({
  close, show, children
}) => {
  function handleKeyEvent(ev: KeyboardEvent) {
    if (ev.key === "Escape") close();
  }
  useEffect(() => {
    document.addEventListener("keyup", handleKeyEvent, false);
    return () => document.removeEventListener("keyup", handleKeyEvent, false);
  }, [close]);

  return (
  <GlassPane show={show} onClick={close}>
    <Container onClick={ev => { ev.stopPropagation(); }}>
      <Button onClick={close}>✖</Button>
      {children}
    </Container>
  </GlassPane>
);
  }

  export default Overlay;
