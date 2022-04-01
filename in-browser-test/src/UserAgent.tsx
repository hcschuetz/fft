import { FC } from "react";
import styled from "styled-components";

const DeEmphasized = styled.span`
  color: #888;
`;
const Emphasized = styled.span`
  color: #000;
  font-weight: bolder;
  background: #ddd;
  padding-left: 3px;
  padding-right: 3px;
`;

/**
 * Guess which of the browser names in the user-agent string actually represents
 * the current browser and emphasize it.
 */
const UserAgent: FC = () => {
  let userAgent = navigator.userAgent;
  for (const re of [
    // The order of regular expressions does matter here!
    // TODO Test on all kinds of browsers.
    /^(.*\s)?(OPR\/\S+)(.*)$/,
    /^(.*\s)?(Edg\/\S+)(.*)$/,
    /^(.*\s)?(Chrome\/\S+)(.*)$/,
    /^(.*\s)?(Safari\/\S+)(.*)$/,
    /^(.*\s)?(Firefox\/\S+)(.*)$/,
    /^(.*\s)?(MSIE\s+[^ ;)]*)(.*)$/,
  ]) {
    const m = re.exec(userAgent as string);
    if (m) {
      return (<DeEmphasized>{m[1]}<Emphasized>{m[2]}</Emphasized>{m[3]}</DeEmphasized>);
    }
  }
  return (<span>userAgent</span>);
};

export default UserAgent;