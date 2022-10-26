import styled from "styled-components";
import variables from "../../../index.scss";

const Container = styled.div`
  background-color: ${variables.bgColor};
  padding: ${variables.paddingVertical} ${variables.paddingHorizontal};
  display: flex;
  width: 100%;
  box-shadow: 0 3px 5px ${variables.bgColor};
  justify-content: space-between;
`;

export { Container };
