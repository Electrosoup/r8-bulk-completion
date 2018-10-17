import React from 'react';
import '../App.css';
import * as bs from 'react-bootstrap/lib/'
import PropTypes from 'prop-types';
import {DebounceInput} from 'react-debounce-input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faSun, faCheck } from '@fortawesome/free-solid-svg-icons'

library.add(fab, faSun, faCheck)

class App extends React.Component {

  componentWillMount() {
    this.props.getServerData(this.props.source)
  }

  render () {
  return (
    Object.keys(this.props.qualification).length
      ?
      <div>
      <bs.Grid>
        <bs.Row>
          <QualDropdown
              qualifications={this.props.qualifications}
              onChange={this.props.selectQualification} />
        </bs.Row>
        <br/>
        <bs.Row>
          <bs.Col xs={6} md={4}>
          <DebounceInput
            className="form-control"
            placeholder="search candidates"
            minLength={2}
            debounceTimeout={300}
            onChange={event => this.props.searchCandidates(event.target.value)} />
  
          <br/>
          <Candidates {...this.props}/>
          </bs.Col>
          <bs.Col xs={12} md={8}>
          <bs.Button
            disabled={
              !(this.props.qualificationIsCompletable
                && this.props.someCandidatesSelected)}
            onClick={_e => this.props.toggleDialog()} >
            Bulk Complete
          </bs.Button>
          <br/>
          <br/>
          <Criterias {...this.props} />
          </bs.Col>
        </bs.Row>
      </bs.Grid>
      <ModalComplete {...this.props} />
      </div>
      :
      <bs.Col xs={6} mdOffset={3} xsOffset={2}>
      <bs.Alert bsStyle="warning">
        <center>
        <strong>
          <FontAwesomeIcon icon="check" size="lg" color="green"/>{' '}All qualifications have been completed for candidates.</strong>
        </center>
      </bs.Alert>
      </bs.Col>
              
  )}
}

const filterVisibleCandidates = (candidates, visibleCandidates, term) => 
  Object.keys(visibleCandidates).length
  ?
  candidates.filter(candidate => visibleCandidates[candidate.id] ? true : false)
  :
  term.length ? [] : candidates

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
          Id
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
      {filterVisibleCandidates(
        props.qualification.candidates,
        props.visibleCandidates,
        props.term).map(
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
                {candidate.id}
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
      <bs.Panel
        bsStyle={criteria.completable
        ?
        'success'
        : 
        undefined}
        header={criteria.text}>
      {criteria.groups.map(group => 
      <div key={group.id}>
      {criteria.type === 'MANDATORY'
        ? '' 
        : <h5>Minimum Score: {criteria.minimumScore}</h5>}

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
            {criteria.type !== 'MANDATORY' && criteria.criteria === 'COMPLETE_ON_CREDITS' 
            ? 
            <th style={{ width: '10px', 'textAlign': 'center'}}>Credit</th>
            :
            ''
            }
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
            {criteria.type !== 'MANDATORY' && criteria.criteria === 'COMPLETE_ON_CREDITS' 
            ? 
            <td style={{ width: '10px', 'textAlign': 'center'}}>{unit.credit}</td>
            :
            ''
            }

          </tr>
          )}
        </tbody>
      </bs.Table>
      </div>
      )}
    </bs.Panel>)}
    </div>

export const ModalComplete = (props) => {
  console.log()
  return(
    <bs.Modal show={props.showDialog} onHide={_e => props.toggleDialog()}>
      <bs.Modal.Header closeButton>
            <bs.Modal.Title>{props.qualification.title}</bs.Modal.Title>
      </bs.Modal.Header>
      <bs.ModalBody>
      <h5>Units to complete:</h5>
      <ul>
        {props.selectedUnitTitles.map(item => <li key={item.id}>{item.title}</li>)}
      </ul>
      <h5>Candidates to complete</h5>
      <ul>
        {props.selectedCandidates.map(item => <li key={item.id}>{item.surname}, {item.firstName}</li>)}
      </ul>
      </bs.ModalBody>
      <bs.ModalFooter>
        <bs.Button
          disabled={props.bulkCompleteProcessingStatus} 
          onClick={_e => {
          props.bulkCompleteProcessing()
          props.bulkComplete(props)}
        }>
        Confirm bulk completion
        {' '}
        {props.bulkCompleteProcessingStatus
        ? 
        <FontAwesomeIcon icon="sun" spin size="lg" color="red"/>
        :
        <FontAwesomeIcon icon="sun" size="lg" />
        }
        </bs.Button>
      </bs.ModalFooter>
  </bs.Modal>)}

    
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
      visible: PropTypes.bool,
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