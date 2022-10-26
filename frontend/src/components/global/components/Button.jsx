import styled from "styled-components";
import variables from "../../../index.scss";

const Button = styled.div`
  background-color: ${variables.lightGray};
  font-weight: 600;
  font-size: 0.7rem;
  color: ${variables.white};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.padding || "8px 20px"};
  border-radius: 10px;
  &:hover {
    cursor: pointer;
  }
`;

export { Button };
