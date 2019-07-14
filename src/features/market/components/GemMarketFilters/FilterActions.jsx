import React from "react"
import {CutEdgesButton} from "../../../../components/CutEdgesButton";
import styled from "styled-components";

const ActionsFilterGroupsContainer = styled.div`
    padding: 8px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: #383F45;
    margin: 10px 0;
    clip-path: polygon(0 0, 95% 0,100% 10%,100% 90%,95% 100%,0 100%);
    -webkit-clip-path: polygon(0 0,95% 0,100% 10%,100% 90%,95% 100%,0 100%);

    @media(max-width: 800px) {
        margin: 0 10px;
        flex-direction: column;
        width: 120px;
        justify-content: center;
    }
`;

const FilterActions = ({clearFilters, setDefaultFilters}) => {
    return (
        <ActionsFilterGroupsContainer>
            <div style={{margin: "3px 3px", fontWeight: "normal", width: "100px"}}>
                <CutEdgesButton outlineColor={"orange"}
                                backgroundColor={"black"}
                                edgeSizes={[5, 15]}
                                outlineWidth={2}
                                height={32}
                                fontSize={18}
                                content={"Clear"}
                                onClick={() => clearFilters()}/>
            </div>
            <div style={{margin: "3px 3px", fontWeight: "normal", width: "100px"}}>
                <CutEdgesButton outlineColor={"aquamarine"}
                                backgroundColor={"black"}
                                edgeSizes={[5, 15]}
                                outlineWidth={2}
                                height={32}
                                fontSize={18}
                                content={"Default"}
                                onClick={() => setDefaultFilters()}/>
            </div>
        </ActionsFilterGroupsContainer>
    );
};

export default FilterActions;
