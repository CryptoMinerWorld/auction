import {CutEdgesButton} from "../../../../components/CutEdgesButton";
import React from "react";
import styled from "styled-components";

const PricesContainer = styled.div`
    display: flex;
    justify-content: space-between;
    
    @media(max-width: 800px) {
        width: 240px;
    }
`;

const Arrows = styled.div`
    display: flex;
    flex-direction: column;
    width: 32px;
`;

const Price = styled.div`
    display: flex;
    flex-direction: column;
    font-size: 12px;
    color: black;
    padding-top: 5px;
    align-items: center;
`;

const PriceInput = styled.input`
    width: 55px;
    background-color: #24292F;
    border-width: 0;
    border-radius: 3px;
    padding: 2px;
    font-size: 18px;
    text-align: right;
`;

const Prices = ({unselectedFilters, toggleFilter, maxPrice, minPrice}) => (
    <PricesContainer>
        <Arrows>
            <CutEdgesButton outlineColor={"#E8848E"}
                            backgroundColor={"#542329"}
                            fontColor={"#E8848E"}
                            edgeSizes={15}
                            outlineWidth={1}
                            height={30}
                            fontSize={18}
                            content={"∧"}
                            style={"margin: 2px 0px"}
                            onClick={() => {
                                const newLowPrice = ((isNaN(unselectedFilters.prices[0]) || Number(unselectedFilters.prices[0]) < minPrice) ?
                                    +minPrice + 0.01 : Number(unselectedFilters.prices[0]) + 0.01).toFixed(2);
                                if (isNaN(unselectedFilters.prices[1])) {
                                    console.log("new low, price high:", newLowPrice, unselectedFilters.prices[1]);
                                    toggleFilter(newLowPrice < maxPrice ? newLowPrice : maxPrice, 'min-price')
                                } else {
                                    toggleFilter(newLowPrice < Number(unselectedFilters.prices[1]) ? newLowPrice : unselectedFilters.prices[1], 'min-price')
                                }
                            }}
            />
            <CutEdgesButton outlineColor={"#E8848E"}
                            backgroundColor={"#542329"}
                            fontColor={"#E8848E"}
                            edgeSizes={15}
                            outlineWidth={1}
                            height={30}
                            fontSize={18}
                            content={"∨"}
                            style={"margin: 2px 0px"}
                            onClick={() => {
                                const newLowPrice = (isNaN(unselectedFilters.prices[0]) ? minPrice : Number(unselectedFilters.prices[0]) - 0.01).toFixed(2);
                                toggleFilter(newLowPrice > minPrice ? newLowPrice : minPrice, 'min-price')
                            }}
            />
        </Arrows>
        <Price>
            <span>Low</span>
            <PriceInput
                id={"low-price-input"}
                type="text"
                placeholder="0"
                className="db"
                style={{color: "#F06F7F"}}
                value={document.activeElement.id === "low-price-input" ?
                    unselectedFilters.prices[0] :
                    (isNaN(unselectedFilters.prices[0]) || unselectedFilters.prices[0] < minPrice) ? minPrice : unselectedFilters.prices[0]}
                onChange={e => {
                    toggleFilter(e.target.value, 'min-price')
                }}
            />
        </Price>
        <span style={{fontSize: "12px", marginTop: "25px", color: "black"}}>
            ETH
        </span>
        <Price>
            <span>High</span>
            <PriceInput
                id={"high-price-input"}
                type="text"
                className="db"
                style={{color: "#9AE791"}}
                value={document.activeElement.id === "high-price-input" ?
                    unselectedFilters.prices[1] :
                    (isNaN(unselectedFilters.prices[1]) || unselectedFilters.prices[1] > maxPrice) ? maxPrice : unselectedFilters.prices[1]}
                onChange={e => {
                    toggleFilter(e.target.value, 'max-price')
                }}
            />
        </Price>
        <Arrows>
            <CutEdgesButton outlineColor={"#9AE791"}
                            backgroundColor={"#25511F"}
                            fontColor={"#9AE791"}
                            edgeSizes={15}
                            outlineWidth={1}
                            height={30}
                            fontSize={18}
                            content={"∧"}
                            style={"margin: 2px 0px"}
                            onClick={() => {
                                const newHighPrice = (isNaN(unselectedFilters.prices[1]) ? maxPrice : Number(unselectedFilters.prices[1]) + 0.01).toFixed(2);
                                toggleFilter(newHighPrice < maxPrice ? newHighPrice : maxPrice, 'max-price')
                            }}
            />
            <CutEdgesButton outlineColor={"#9AE791"}
                            backgroundColor={"#25511F"}
                            fontColor={"#9AE791"}
                            edgeSizes={15}
                            outlineWidth={1}
                            height={30}
                            fontSize={18}
                            content={"∨"}
                            style={"margin: 2px 0px"}
                            onClick={() => {
                                const newHighPrice = ((isNaN(unselectedFilters.prices[1]) || Number(unselectedFilters.prices[1]) > maxPrice)
                                    ? +maxPrice - 0.01 : Number(unselectedFilters.prices[1]) - 0.01).toFixed(2);
                                if (isNaN(unselectedFilters.prices[0])) {
                                    toggleFilter(newHighPrice > minPrice ? newHighPrice : minPrice, 'max-price')
                                } else {
                                    console.log("new high", newHighPrice);
                                    toggleFilter(newHighPrice > Number(unselectedFilters.prices[0]) ? newHighPrice : unselectedFilters.prices[0], 'max-price')
                                }
                            }}
            />
        </Arrows>
    </PricesContainer>
)

export default Prices