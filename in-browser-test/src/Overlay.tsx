import styled from "styled-components";
import { FC } from "react";

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
    padding: 1rem;
    background: white;
`;

const Overlay: FC<{close: () => void, show: boolean}> = ({
  close, show, children
}) => (
  <GlassPane show={show} onClick={close}>
    <Container>
      {children}
    </Container>
  </GlassPane>
);

export default Overlay;
