import styled from "styled-components";

export const Avatar = styled.img`
    @media(max-width: 800px) {
        height: 2rem;
        width: auto;
        padding: 0 5px;
    }
    
    @media(min-width: 801px) {
        height: 4rem;
        width: auto;
        padding: 0 1rem;
    }
`;

export const SilverGoldBalance = styled.div`
    @media(min-width: 900px) {
        position: absolute;
        right: 0;
        top: 15px;
        z-index: 2;
    }
    
    @media(max-width: 800px) {
        img {
            display: none;
        }
        #gold-label {
            margin-top: 4px;
        }
        #silver-label {
            margin-top: 4px;
        }
        margin: 0 5px;
    }
    
    @media(min-width: 801px) {
        #gold-label, #silver-label {
            display: none;
        }
    }
`;

export const Username = styled.h1`
    color: #fff !important;
    margin: 10px 0;
    @media(max-width: 800px) {
        margin: 0 10px 0 0;
        font-size: 24px;
    }
`;

export const GemCombinationButton = styled.img`

    @media(min-width: 900px) {
        left: -100px;
    }

    position: relative;
    left: 0;
    right: 0;
    margin: auto;
    width: 325px;
    cursor: pointer;
    order: 3;
`;