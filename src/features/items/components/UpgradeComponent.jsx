import React from 'react';

export default class UpgradeComponent extends React.Component {

    gradeConverter = gradeValue => ({
        1: 'D',
        2: 'C',
        3: 'B',
        4: 'A',
        5: 'AA',
        6: 'AAA',
    }[gradeValue]);

    constructor(props) {
        super(props);
        this.state = {
            cost: 15,
            total: 25,
            grade: props.grade + 1,
            level: props.level + 1,
            initialGrade: props.grade,
            initialLevel: props.level,
        };
    }


    render() {
        const {metal} = this.props;
        return (
              <div
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                style={{display: 'flex', height: '20rem', width: '35%', maxWidth: '50rem', backgroundColor: '#dedede',
                    margin: 'auto', flexDirection: 'row', alignItems: 'stretch', position: 'relative',
                    cursor: 'default'
                }}>
                  <div style={{flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                      {metal === 'silver' ?
                        (<span style={{fontSize: '120px'}}>{this.state.level}</span>) : ""
                      }
                      {metal === 'gold' ?
                        (<span style={{fontSize: '80px'}}>{this.gradeConverter(this.state.grade)}</span>) : ""
                      }
                  </div>
                  <div style={{
                      flex: '1',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center'
                  }}>
                      <div style={{fontSize: '60px', cursor: 'pointer'}}
                           onClick={() => {
                               switch (metal) {
                                   case 'silver':
                                       if (this.state.level < 5) {
                                           this.setState({
                                               level: this.state.level + 1,
                                               cost: this.state.cost + 5
                                           });
                                       }
                                       break;
                                   case 'gold':
                                       if (this.state.grade < 6) {
                                           this.setState({grade: this.state.grade + 1, cost: this.state.cost + 5});
                                       }
                                       break;
                               }
                           }}>
                          ▲
                      </div>
                      <div style={{fontSize: '60px', cursor: 'pointer'}}
                           onClick={() => {
                               switch (metal) {
                                   case 'silver':
                                       if (this.state.level > this.state.initialLevel + 1) {
                                           this.setState({
                                               level: this.state.level - 1,
                                               cost: this.state.cost - 5
                                           });
                                       }
                                       break;
                                   case 'gold':
                                       if (this.state.grade > this.state.initialGrade + 1) {
                                           this.setState({grade: this.state.grade - 1, cost: this.state.cost - 5});
                                       }
                                       break;
                               }
                           }}>▼</div>
                  </div>
                  <div style={{flex: '3', flexDirection: 'column', display: 'flex'}}>
                      <div style={{
                          flex: '1',
                          display: 'flex',
                          justifyContent: 'space-around',
                          alignItems: 'flex-end',
                          fontSize: '20px'
                      }}>
                          <span>COST</span>
                          <span>TOTAL</span>
                      </div>
                      <div style={{
                          flex: '2',
                          display: 'flex',
                          justifyContent: 'space-evenly',
                          alignItems: 'center',
                          fontSize: '30px'
                      }}>
                          <span>{this.state.cost}</span>
                          <span>/</span>
                          <span>26</span>
                      </div>
                      <div style={{flex: '1'}}></div>
                  </div>
                  <div style={{
                      position: 'absolute',
                      bottom: '20px',
                      left: '0',
                      right: '0',
                      margin: 'auto',
                      width: '200px',
                      textAlign: 'center',
                      padding: '10px 0px',
                      backgroundColor: this.state.cost <= this.state.total ? 'magenta' : 'grey'
                  }}>
                      CONFIRM
                  </div>
              </div>

        );
    }
}