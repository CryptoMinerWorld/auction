import React, {Component} from "react";
import buyNowImage from "../../../app/images/pinkBuyNowButton.png";
import silverImage from "../../../app/images/dashboard/Silver.png";
import goldImage from "../../../app/images/dashboard/Gold.png";

class UnprocessedItemsDisplay extends Component {

    componentDidMount() {
        const {} = this.props;
    }

    componentDidUpdate(prevProps) {
        const {} = this.props;
    }

    render() {

        const silver = 4;
        const gold = 3;
        const gems = [
            {
                id: "36863",
                name: "Ame",
                level: 5,
                gradeType: 4,
                gradeValue: 45,
                image: "https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FGarnet%20Face%20Emoji.png?alt=media&token=09e2d41f-437c-4796-a513-bb55ffeced55"
            },
            {
                id: "36863",
                name: "Ame",
                level: 5,
                gradeType: 4,
                gradeValue: 45,
                image: "https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FGarnet%20Face%20Emoji.png?alt=media&token=09e2d41f-437c-4796-a513-bb55ffeced55"
            },
            {
                id: "36863",
                name: "Ame",
                level: 5,
                gradeType: 4,
                gradeValue: 45,
                image: "https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FGarnet%20Face%20Emoji.png?alt=media&token=09e2d41f-437c-4796-a513-bb55ffeced55"
            },
            {
                id: "36863",
                name: "Ame",
                level: 5,
                gradeType: 4,
                gradeValue: 45,
                image: "https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FGarnet%20Face%20Emoji.png?alt=media&token=09e2d41f-437c-4796-a513-bb55ffeced55"
            }
        ];


        const silverTokensStyle = {
            width: "80px",
            height: "80px",
            margin: "5px",
            backgroundImage: 'url(' + silverImage + ')',
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            borderRadius: "5px",
            fontSize: "32px",
            fontWeight: "bold",
            textAlign: "center",
            lineHeight: "80px",
            color: "black"
        };
        const goldTokensStyle = {
            width: "80px",
            height: "80px",
            margin: "5px",
            backgroundImage: 'url(' + goldImage + ')',
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            borderRadius: "5px",
            fontSize: "32px",
            fontWeight: "bold",
            textAlign: "center",
            lineHeight: "80px",
            color: "black"
        };
        const gemStyle = {
            width: "80px",
            height: "80px",
            margin: "5px",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: "5px"
        };

        return (
          <div style={{
              display: "flex",
              flexWrap: "wrap",
              padding: "20px 30px"
          }}>
              {silver &&
              <div style={silverTokensStyle}>
                  {silver}
              </div>
              }
              {gold &&
              <div style={goldTokensStyle}>
                  {gold}
              </div>
              }
              {gems && gems.map((gem) =>
              <div style={gemStyle}>
                  <img src={gem.image}/>
              </div>)
              }
          </div>
        );
    }
}

export default UnprocessedItemsDisplay;

