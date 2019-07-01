import React, {Component} from 'react';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {withRouter} from "react-router-dom";
import styled from 'styled-components';


class Msig extends Component {

    render() {
        return (
          <Container className="bg-off-black" data-testid="market-page"
                     style={{paddingTop: '0px', padding: '0 20px 20px', color: "white"}}>
              Sorry, the game is being updated. This is when Gems are born
          </Container>
        )
    }
}

export default Msig;

const Container = styled.div`
    
    color: white;
    font-size: 26px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;


    h3, h4 {
        color: white
    }
    
    >div {
        background-color: #333333;
        margin: 5px 10px;
        padding: 5px;
        border-radius: 10px;
    }
    
    div {
        color: #eeeeee
    }    
      
    input, button {
        color: #333333
    }  
`;
