import React from 'react';
import '../App.css';
import * as bs from 'react-bootstrap/lib/'
import PropTypes from 'prop-types';

export const App = (props) => {
  return (
    <div>
    <bs.Grid>
      <bs.Row>
        <QualDropdown
            qualifications={props.qualifications}
            onChange={props.selectQualification} />
      </bs.Row>
      <br/>
      <bs.Row>
        <bs.Button
          disabled={
            !(props.qualificationIsCompletable
              && props.someCandidatesSelected)}
          onClick={_e => props.toggleDialog()} >
          Bulk Complete
        </bs.Button>
      </bs.Row>
      <br/>
      <bs.Row>
        <bs.Col xs={6} md={4}>
        <Candidates {...props}/>
        </bs.Col>
        <bs.Col xs={12} md={8}>
        <Criterias {...props} />
        </bs.Col>
      </bs.Row>
    </bs.Grid>
    <ModalComplete {...props} />
    </div>
  )
}

export const QualDropdown = (props) => 
  <div>
  <bs.FormControl
    id="qualification-dropdown"
    componentClass="select"
    onChange={(e) => props.onChange(e.target.value)}>
      {props.qualifications.map(item =>
        <option key={item.id} value={item.id}>
          {item.title}
        </option>
      )}
    </bs.FormControl>
  </div>

export const Candidates = (props) =>
  <div>
  {props.qualification.candidates.length ?
  <bs.Table striped bordered condensed hover>
    <thead>
      <tr>
        <th>
          <bs.Checkbox
            id='toggleAllCandidates'
            style={{marginTop:'0px', marginBottom:'0px'}}
            checked={props.allCandidatesSelected} 
            onClick={(e) => props.toggleAllCandidates()} />
        </th>
        <th>
          Surname
        </th>
        <th>
          Firstname
        </th>
      </tr>
    </thead>
    <tbody className='candidates-list'>
      {props.qualification.candidates.map(
          candidate =>
            <tr key={candidate.id}>
              <td>
                <bs.Checkbox
                  className='candidateSelected'
                  style={{marginTop:'0px', marginBottom:'0px'}}
                  checked={candidate.selected} 
                  onClick={(e) => props.toggleCandidate(candidate.id)} />
              </td>
              <td>
                {candidate.surname}
              </td>
              <td>
                {candidate.firstName}
              </td>
            </tr>
      )}
    </tbody>
  </bs.Table>
  :
  <h5 className='no-candidates' >No Candidates</h5>}
  </div>

const typeOfBadge = (option) =>
  option === 'MANDATORY'
  ? 
  <bs.Label bsStyle="danger">M</bs.Label>
  :
  <bs.Label bsStyle="success">O</bs.Label>

export const Criterias = (props) =>
  <div>
    {props.criteria.map(criteria => 
      <bs.Panel key={criteria.id} bsStyle={criteria.completable ? 'success' : undefined} header={criteria.text}>
      {criteria.groups.map(group => 
      <div key={group.id}>
      <h5>Min Score: {criteria.minimumScore}</h5>
      <h5>{group.title}</h5>
      <bs.Table striped bordered condensed hover>
        <thead>
          <tr>
          <th>
          </th>
          <th>
          </th>
            <th>
              id
            </th>
            <th>
              title
            </th>
          </tr>
        </thead>
        <tbody>
          {group.units.map(unit => 
          <tr key={unit.id}>
            <td style={{ width: '5px' }}>
              <bs.Checkbox
                className="unitSelected"
                checked={unit.selected}
                onChange={_e => {props.toggleUnit(unit.id)}}
              />
            </td>
            <td style={{ width: '10px' }}>{typeOfBadge(criteria.type)}</td>
            <td style={{ width: '100px' }}>{unit.id}</td>
            <td style={{ width: '350px' }}>{unit.title}</td>
          </tr>
          )}
        </tbody>
      </bs.Table>
      </div>
      )}
    </bs.Panel>)}
    </div>

export const ModalComplete = (props) =>
    <bs.Modal show={props.showDialog} onHide={_e => props.toggleDialog()}>
      <bs.Modal.Header closeButton>
            <bs.Modal.Title>{props.qualification.title}</bs.Modal.Title>
      </bs.Modal.Header>
      <bs.ModalBody>
      <h5>Units to complete:</h5>
      <ul>
        {props.selectedUnitTitles.map(item => <li>{item}</li>)}
      </ul>
      <h5>Candidates to complete</h5>
      <ul>
        {props.selectedCandidates.map(item => <li>{item.surname}, {item.firstName}</li>)}
      </ul>
      </bs.ModalBody>
      <bs.ModalFooter>
        <bs.Button>Confirm bulk completion</bs.Button>
      </bs.ModalFooter>

    </bs.Modal>

    
App.propTypes = {
  qualification: PropTypes.exact({
    id: PropTypes.string,
    title: PropTypes.string,
    completionCriteria: PropTypes.number,
    units: PropTypes.arrayOf(
      PropTypes.exact({
        id: PropTypes.string,
        manditory: PropTypes.bool,
        credit: PropTypes.number,
        title: PropTypes.string,
        selected: PropTypes.bool,
      })
    ),
    candidates: PropTypes.arrayOf(PropTypes.exact({
      id: PropTypes.number,
      firstName: PropTypes.string,
      surname: PropTypes.string,
      qualifications: PropTypes.arrayOf(PropTypes.string),
      selected: PropTypes.bool,
    }))
  }),
  qualifications: PropTypes.arrayOf(
    PropTypes.exact({
      id: PropTypes.string,
      title: PropTypes.string,
      units: PropTypes.arrayOf(PropTypes.number),
      completionCriteria: PropTypes.number,
      candidates: PropTypes.arrayOf(PropTypes.number)}))
}

export default App;