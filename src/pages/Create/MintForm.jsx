import React from 'react';
import PropTypes from 'prop-types';
import { Select, Input, Icon } from 'antd';

const { Option } = Select;

const MintForm = ({ randomGradeValue, handleNetworkChange, contractAddress, color, level, gradeType, gradeValue, handleChange, handleSubmit, handleGradeValueChange }) => (
  <form
    id="mint_form"
    className="bg-white br3"
    onSubmit={e => {
      e.preventDefault();
      handleSubmit(contractAddress, color, level, gradeType, gradeValue);
    }}
  >
    <fieldset>
      <legend>Mint A New Gem</legend>
      <div>
        <label htmlFor="helper_address">
          Select Network:
                      <Select
            required
            id="helper_address"
            defaultValue="rinkeby"
            style={{ width: 120 }}
            onChange={handleNetworkChange}
          >
            <Option value="0x6afd5f5f431279b0cac7f5ff406f13d804b183c9">Rinkeby</Option>
            <Option value="0x0">Mainnet</Option>
          </Select>
        </label>
      </div>
      <div>
        <label htmlFor="helper_color">
          Select a Color:
                      <Select
            required
            id="helper_color"
            defaultValue="Sapphire (September)"
            style={{ width: 120 }}
            onChange={handleChange('color')}
          >
            <Option value="9">Sapphire (September)</Option>
            <Option value="10">Opal (October)</Option>

            <Option value="1">Garnet (January)</Option>
            <Option value="2">Amethyst (February)</Option>
          </Select>
        </label>
      </div>

      <div>
        <label htmlFor="helper_level">
          Select a Level:
                      <Select
            required
            id="helper_level"
            defaultValue="1"
            style={{ width: 120 }}
            onChange={handleChange('level')}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </Select>
        </label>
      </div>

      <div>
        <label htmlFor="helper_grade_type">
          Select a Grade:
                      <Select
            required
            id="helper_grade_type"
            defaultValue="D"
            style={{ width: 120 }}
            onChange={handleChange('gradeType')}
          >
            <option value="1">D</option>
            <option value="2">C</option>
            <option value="3">B</option>
            <option value="4">A</option>
            <option value="5">AA</option>
            <option value="6">AAA</option>
          </Select>
        </label>
      </div>

      <div>
        <label htmlFor="grade_value">
          Grade Value
                      <Input
            placeholder="1000000 or less."
            type="number"
            id="grade_value"
            min="0"
            max="999999"
            required
            value={gradeValue}
            onChange={e => handleGradeValueChange(e.target.value)}
            addonAfter={<Icon type="sync" onClick={randomGradeValue} />}
          />
        </label>
      </div>
    </fieldset>
    <Input type="submit" value="Mint" className='pointer' />
  </form>
)

export default MintForm

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
}