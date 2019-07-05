import React, {Fragment} from "react"
import {CutEdgesButton} from "../../../../components/CutEdgesButton";
import styled from "styled-components";

const AdjustContainer = styled.div`
    display: flex;
    margin-left: .3vw;
    flex: 1 3;
    @media(min-width: 801px) and (max-width: 1494px) {
        flex: 1
    }
`;

const FilterActionsContainer = styled.div`
    display: flex;
    flex-direction: column; 
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 8px;
    background-color: #24292F;
    clip-path: polygon(10% 0, 90% 0, 100% 10%, 100% 90%,90% 100%, 10% 100%, 0 90%, 0% 10%);
    -webkit-clip-path: polygon(10% 0, 90% 0, 100% 10%, 100% 90%,90% 100%, 10% 100%, 0 90%, 0% 10%);
    font-size: 16px;
    
    @media(max-width: 800px) {
        width: 100px;
        font-size: 14px;
        margin: 0 10px;
    }
`;

const FilterAction = styled.div`
    @media (min-width: 1820px) {
        font-size: 1rem;
        width: 100%;    
    }
    
    margin: 3px 3px; 
    font-weight: normal; 
    width: 4.5em;
    
`;

const FilterActions = ({clearFilters, setDefaultFilters}) => {
    return (
        <AdjustContainer>
            <FilterActionsContainer>
                <FilterAction>
                    <CutEdgesButton outlineColor={"orange"}
                                    backgroundColor={"black"}
                                    edgeSizes={[7, 20]}
                                    outlineWidth={2}
                                    height={32}
                                    content={"Clear"}
                                    onClick={() => clearFilters()}/>
                </FilterAction>
                <FilterAction>
                    <CutEdgesButton outlineColor={"aquamarine"}
                                    backgroundColor={"black"}
                                    edgeSizes={[7, 20]}
                                    outlineWidth={2}
                                    height={32}
                                    content={"Default"}
                                    onClick={() => setDefaultFilters()}/>
                </FilterAction>
            </FilterActionsContainer>
        </AdjustContainer>
    );
};

export default FilterActions;
