import styled from "styled-components";

export const Table = styled.table`
  border-collapse: collapse;
`;

export const TDInput = styled.td`
  padding: 0 1ex;
`;

export const TDOutput = styled.td`
  width: 3em;
  text-align: right;
`;

export const TD = styled.td`
  border: 1px solid black;
  padding: 3px;
  vertical-align: top;
`;

export const TH = styled.th<{left?: boolean}>`
  border: 1px solid black;
  padding: 3px;
  vertical-align: top;
  ${props => props.left ? "text-align: start;" : ""}
`;
