import { FC } from "react";
import { AudioDemo } from "./AudioDemo";
import { Clockwork } from "./Clockwork";
import { useHash } from "./HashProvider";
import Overlay from "./Overlay";

const Demos: FC = () => {
  const {hash, setHash, clearHash} = useHash();

  const clockworkIsOpen = hash === "ClockworkDemo";
  const openClockwork = () => setHash("ClockworkDemo");

  const audioDemoIsOpen = hash === "AudioDemo";
  const openAudioDemo = () => setHash("AudioDemo");

  return (
    <>
      <button onClick={openClockwork}>Clockwork Demo</button>
      &nbsp;&nbsp;
      <button onClick={openAudioDemo}>Audio Demo</button>

      <Overlay close={clearHash} show={clockworkIsOpen}>
        {clockworkIsOpen && <Clockwork/>}
      </Overlay>
      <Overlay close={clearHash} show={audioDemoIsOpen}>
        {audioDemoIsOpen && <AudioDemo/>}
      </Overlay>
    </>
  )
}

export default Demos;