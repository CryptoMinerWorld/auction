import React from 'react';
import PropTypes from 'prop-types';
import Select from 'antd/lib/select';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';

require('antd/lib/input/style/css');
require('antd/lib/icon/style/css');
require('antd/lib/select/style/css');

const MintForm = ({
                      randomGradeValue,
                      handleNetworkChange,
                      contractAddress,
                      color,
                      level,
                      gradeType,
                      gradeValue,
                      handleChange,
                      handleSubmit,
                      handleGradeValueChange,
                  }) => (
  <form
    id="mint_form"
    className="bg-white br3"
    onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(contractAddress, color, level, gradeType, gradeValue);
    }}
  >
      <fieldset>
          <legend>Mint A New Gem</legend>

          <Select
            required
            id="helperoptions.address"
            defaultValue="Mainnet"
            style={{width: 120}}
            onChange={handleNetworkChange}
          >
              <Select.Option value="0x93b86262455D79705e0D14bC105c92Aa07022a3a">Ropsten</Select.Option>
              <Select.Option value="0x5671823feaDb896eC6e3BD2f6F6cD5a561AdE9D3">Mainnet</Select.Option>
          </Select>

          <Select
            required
            id="helper_color"
            defaultValue="Sapphire (September)"
            style={{width: 120}}
            onChange={handleChange('color')}
          >
              <Select.Option value="1">Garnet (January)</Select.Option>
              <Select.Option value="2">Amethyst (February)</Select.Option>
              <Select.Option value="3">Aquamarine (March)</Select.Option>
              <Select.Option value="4">Diamond (April)</Select.Option>
              <Select.Option value="5">Emerald (May)</Select.Option>
              <Select.Option value="6">Pearl (June)</Select.Option>
              <Select.Option value="7">Ruby (July)</Select.Option>
              <Select.Option value="8">Peridot (August)</Select.Option>
              <Select.Option value="9">Sapphire (September)</Select.Option>
              <Select.Option value="10">Opal (October)</Select.Option>
              <Select.Option value="11">Topaz (November)</Select.Option>
              <Select.Option value="12">Turquoise (December)</Select.Option>
          </Select>

          <Select
            required
            id="helper_level"
            defaultValue="1"
            style={{width: 120}}
            onChange={handleChange('level')}
          >
              <Select.Option value="1">1</Select.Option>
              <Select.Option value="2">2</Select.Option>
              <Select.Option value="3">3</Select.Option>
              <Select.Option value="4">4</Select.Option>
              <Select.Option value="5">5</Select.Option>
          </Select>

          <Select
            required
            id="helper_grade_type"
            defaultValue="D"
            style={{width: 120}}
            onChange={handleChange('gradeType')}
          >
              <Select.Option value="1">D</Select.Option>
              <Select.Option value="2">C</Select.Option>
              <Select.Option value="3">B</Select.Option>
              <Select.Option value="4">A</Select.Option>
              <Select.Option value="5">AA</Select.Option>
              <Select.Option value="6">AAA</Select.Option>
          </Select>

          {/*<Input*/}
            {/*placeholder="1000000 or less."*/}
            {/*type="number"*/}
            {/*id="grade_value"*/}
            {/*min="0"*/}
            {/*max="999999"*/}
            {/*required*/}
            {/*value={gradeValue}*/}
            {/*onChange={e => handleGradeValueChange(e.target.value)}*/}
            {/*addonAfter={<Icon type="sync" onClick={randomGradeValue}/>}*/}
          {/*/>*/}
      </fieldset>
      <Input type="submit" value="Mint" className="pointer"/>
  </form>
);

export default MintForm;

MintForm.propTypes = {
    contractAddress: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
    gradeType: PropTypes.string.isRequired,
    gradeValue: PropTypes.number.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleNetworkChange: PropTypes.func.isRequired,
    randomGradeValue: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleGradeValueChange: PropTypes.func.isRequired,
};
