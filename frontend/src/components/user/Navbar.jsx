import React from "react";
import { BsSunFill } from "react-icons/bs";
import styled from "styled-components";
import { Button, Container, List, SearchBar } from "../global/GlobalComponents";

export default function Navbar() {
  return (
    <Container>
      <Logo src="./logo.png" alt="5Star MRP" />
      <List>
        <Button padding={"10px"}>
          <BsSunFill size={15} />
        </Button>
        <SearchBar placeholder={"search..."} type={"text"}></SearchBar>
        <Button>Login</Button>
      </List>
    </Container>
  );
}

const Logo = styled.img`
  height: 30px;
`;
