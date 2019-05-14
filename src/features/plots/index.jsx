import React, {Component} from "react";
import PlotDisplay from "./components/PlotDisplay";
import UnprocessedItemsDisplay from "./components/UnprocessedItemsDisplay";

class PlotDashboard extends Component {

    componentDidMount() {
        const {} = this.props;
    }

    componentDidUpdate(prevProps) {
        const {} = this.props;
    }

    render() {
        const {userGems, userPlots, userCountryIdList, userId, data} = this.props;

        console.warn("USER PLOTS::", userPlots);
        console.warn("USER GEMS::", userGems);

        const plots = [
            {
                plotId : "111",
                gemMines: {
                    id: "36863",
                    name: "Ame",
                    level: 5,
                    gradeType: 4,
                    gradeValue: 45,
                    image: "https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FGarnet%20Face%20Emoji.png?alt=media&token=09e2d41f-437c-4796-a513-bb55ffeced55"
                }
                ,
                layerPercentages: {
                    0: 30,
                    1: 15,
                    2: 20,
                    3: 15,
                    4: 20
                },
                layerEndPercentages: {
                    0: 30,
                    1: 45,
                    2: 65,
                    3: 80,
                    4: 100,
                },
                currentPercentage: 35,
                deadline: 1556629999,
            },
            {
                plotId: "222",
                gemMines: {
                    id: "36863",
                    name: "Ame",
                    level: 5,
                    gradeType: 4,
                    gradeValue: 45,
                    image: "https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FGarnet%20Face%20Emoji.png?alt=media&token=09e2d41f-437c-4796-a513-bb55ffeced55"
                }
                ,
                layerPercentages: {
                    0: 15,
                    1: 20,
                    2: 30,
                    3: 15,
                    4: 20
                },
                layerEndPercentages: {
                    0: 15,
                    1: 35,
                    2: 65,
                    3: 80,
                    4: 100,
                },
                currentPercentage: 15,
                deadline: 1556627613,
            },
            {
                plotId: "333",
                gemMines: {
                    id: "36863",
                    name: "Ame",
                    level: 5,
                    gradeType: 4,
                    gradeValue: 45,
                    image: "https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FGarnet%20Face%20Emoji.png?alt=media&token=09e2d41f-437c-4796-a513-bb55ffeced55"
                }
                ,
                layerPercentages: {
                    0: 20,
                    1: 15,
                    2: 25,
                    3: 10,
                    4: 30
                },
                layerEndPercentages: {
                    0: 20,
                    1: 35,
                    2: 60,
                    3: 70,
                    4: 100,
                },
                currentPercentage: 60,
                deadline: 1556637613,
            },
            {
                plotId : "121",
                gemMines: {
                    id: "36863",
                    name: "Ame",
                    level: 5,
                    gradeType: 4,
                    gradeValue: 45,
                    image: "https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FGarnet%20Face%20Emoji.png?alt=media&token=09e2d41f-437c-4796-a513-bb55ffeced55"
                }
                ,
                layerPercentages: {
                    0: 30,
                    1: 15,
                    2: 20,
                    3: 15,
                    4: 20
                },
                layerEndPercentages: {
                    0: 30,
                    1: 45,
                    2: 65,
                    3: 80,
                    4: 100,
                },
                currentPercentage: 35,
                deadline: 1556629999,
            },
            {
                plotId: "212",
                // gemMines: {
                //     id: "36863",
                //     name: "Ame",
                //     level: 5,
                //     gradeType: 4,
                //     gradeValue: 45,
                //     image: "https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FGarnet%20Face%20Emoji.png?alt=media&token=09e2d41f-437c-4796-a513-bb55ffeced55"
                // }
                layerPercentages: {
                    0: 15,
                    1: 20,
                    2: 30,
                    3: 15,
                    4: 20
                },
                layerEndPercentages: {
                    0: 15,
                    1: 35,
                    2: 65,
                    3: 80,
                    4: 100,
                },
                currentPercentage: 0,
                deadline: 0,
            },
            {
                plotId: "313",
                gemMines: {
                    id: "36863",
                    name: "Ame",
                    level: 5,
                    gradeType: 4,
                    gradeValue: 45,
                    image: "https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FGarnet%20Face%20Emoji.png?alt=media&token=09e2d41f-437c-4796-a513-bb55ffeced55"
                }
                ,
                layerPercentages: {
                    0: 18,
                    1: 24,
                    2: 22,
                    3: 20,
                    4: 16
                },
                layerEndPercentages: {
                    0: 18,
                    1: 42,
                    2: 64,
                    3: 84,
                    4: 100,
                },
                currentPercentage: 100,
                deadline: 1555421840,
            },
            {
                plotId : "1111",
                gemMines: {
                    id: "36863",
                    name: "Ame",
                    level: 5,
                    gradeType: 4,
                    gradeValue: 45,
                    image: "https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FGarnet%20Face%20Emoji.png?alt=media&token=09e2d41f-437c-4796-a513-bb55ffeced55"
                }
                ,
                layerPercentages: {
                    0: 30,
                    1: 15,
                    2: 20,
                    3: 15,
                    4: 20
                },
                layerEndPercentages: {
                    0: 30,
                    1: 45,
                    2: 65,
                    3: 80,
                    4: 100,
                },
                currentPercentage: 35,
                deadline: 1556629999,
            },
            {
                plotId: "1222",
                gemMines: {
                    id: "36863",
                    name: "Ame",
                    level: 5,
                    gradeType: 4,
                    gradeValue: 45,
                    image: "https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FGarnet%20Face%20Emoji.png?alt=media&token=09e2d41f-437c-4796-a513-bb55ffeced55"
                }
                ,
                layerPercentages: {
                    0: 15,
                    1: 20,
                    2: 30,
                    3: 15,
                    4: 20
                },
                layerEndPercentages: {
                    0: 15,
                    1: 35,
                    2: 65,
                    3: 80,
                    4: 100,
                },
                currentPercentage: 15,
                deadline: 1556627613,
            },
            {
                plotId: "1333",
                gemMines: {
                    id: "36863",
                    name: "Ame",
                    level: 5,
                    gradeType: 4,
                    gradeValue: 45,
                    image: "https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FGarnet%20Face%20Emoji.png?alt=media&token=09e2d41f-437c-4796-a513-bb55ffeced55"
                }
                ,
                layerPercentages: {
                    0: 20,
                    1: 15,
                    2: 25,
                    3: 10,
                    4: 30
                },
                layerEndPercentages: {
                    0: 20,
                    1: 35,
                    2: 60,
                    3: 70,
                    4: 100,
                },
                currentPercentage: 60,
                deadline: 1556637613,
            },
            {
                plotId : "1121",
                gemMines: {
                    id: "36863",
                    name: "Ame",
                    level: 5,
                    gradeType: 4,
                    gradeValue: 45,
                    image: "https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FGarnet%20Face%20Emoji.png?alt=media&token=09e2d41f-437c-4796-a513-bb55ffeced55"
                }
                ,
                layerPercentages: {
                    0: 30,
                    1: 15,
                    2: 20,
                    3: 15,
                    4: 20
                },
                layerEndPercentages: {
                    0: 30,
                    1: 45,
                    2: 65,
                    3: 80,
                    4: 100,
                },
                currentPercentage: 35,
                deadline: 1556629999,
            },
            {
                plotId: "1212",
                // gemMines: {
                //     id: "36863",
                //     name: "Ame",
                //     level: 5,
                //     gradeType: 4,
                //     gradeValue: 45,
                //     image: "https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FGarnet%20Face%20Emoji.png?alt=media&token=09e2d41f-437c-4796-a513-bb55ffeced55"
                // }
                layerPercentages: {
                    0: 15,
                    1: 20,
                    2: 30,
                    3: 15,
                    4: 20
                },
                layerEndPercentages: {
                    0: 15,
                    1: 35,
                    2: 65,
                    3: 80,
                    4: 100,
                },
                currentPercentage: 0,
                deadline: 0,
            },
            {
                plotId: "1313",
                gemMines: {
                    id: "36863",
                    name: "Ame",
                    level: 5,
                    gradeType: 4,
                    gradeValue: 45,
                    image: "https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FGarnet%20Face%20Emoji.png?alt=media&token=09e2d41f-437c-4796-a513-bb55ffeced55"
                }
                ,
                layerPercentages: {
                    0: 18,
                    1: 24,
                    2: 22,
                    3: 20,
                    4: 16
                },
                layerEndPercentages: {
                    0: 18,
                    1: 42,
                    2: 64,
                    3: 84,
                    4: 100,
                },
                currentPercentage: 100,
                deadline: 1555421840,
            }
        ];

        return (
          <div className="plots" style={{padding: "20px 0px 30px 0"}}>
              <PlotDisplay plots={userPlots} userGems={userGems} goToGemWorkshop={this.props.goToGemWorkshop}/>
              {/*<UnprocessedItemsDisplay/>*/}
          </div>
        );
    }
}

export default PlotDashboard;
