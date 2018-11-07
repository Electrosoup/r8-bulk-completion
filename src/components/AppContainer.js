import App from './App'
import React from 'react'
import * as actions from '../actions/actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getQualification, getQualifications, getCriteria, qualificationCompleteable } from '../reducers/reducer'

const Container = (props) =>
    <App {...props}/>

const mapStateToProps = (state, _ownProps) => ({
  bulkCompleteProcessingStatus: state.defaultReducer.bulkCompleteProcessing,
  qualification: getQualification(state.defaultReducer),
  criteria: getCriteria(state.defaultReducer),
  qualifications: getQualifications(state.defaultReducer.qualifications),
  allCandidatesSelected: state.defaultReducer.allCandidatesSelected,
  someCandidatesSelected: Object.entries(state.defaultReducer.candidatesSelected).reduce((result, item) => item[1] ? result = true: result,false),
  allUnitsSelected: state.defaultReducer.allUnitsSelected,
  qualificationIsCompletable: qualificationCompleteable(getCriteria(state.defaultReducer)),
  showDialog: state.defaultReducer.showDialog,
  visibleCandidates: state.defaultReducer.visibleCandidates,
  term: state.defaultReducer.term,
  reports: state.defaultReducer.reports,
  isUnitCertificate: state.defaultReducer.isUnitCertificate,
  selectedUnitTitles: Object.entries(
    state.defaultReducer.unitsSelected)
    .filter(item => item[1] === true)
    .map(unit => ({
      id: state.defaultReducer.units[unit[0]].id, 
      title: state.defaultReducer.units[unit[0]].title })),
  selectedUnits: state.defaultReducer.unitsSelected,
  someUnitsSelected: Object.entries(
    state.defaultReducer.unitsSelected)
    .filter(item => item[1] === true).length > 0,
  selectedCandidates: Object.entries(
    state.defaultReducer.candidatesSelected)
    .filter(item => item[1] === true)
    .map(candidate => state.defaultReducer.candidates[candidate[0]])
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      ...actions,
    },
    dispatch
  )

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(Container)

export default AppContainer