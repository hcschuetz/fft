import styled from "styled-components";

export const Table = styled.table`
  border-collapse: collapse;
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
