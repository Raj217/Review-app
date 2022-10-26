import styled from "styled-components";
import variables from "../../../index.scss";

const SearchBar = styled.input`
  padding: 3px 8px;
  outline: none;
  width: 15vw;
  border: none;
  border-bottom: 1px solid ${variables.lightGray};
  background-color: transparent;
  color: ${variables.white};
  transition: all 0.1s;
  &:focus {
    border-bottom: 2px solid ${variables.white};
  }
`;

export { SearchBar };
