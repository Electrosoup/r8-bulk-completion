import App from './App'
import React from 'react'
import * as actions from '../actions/actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getQualification, getQualifications, getCriteria } from '../reducers/reducer'

const Container = (props) =>
    <App {...props}/>

const mapStateToProps = (state, ownProps) => ({
  qualification: getQualification(state.defaultReducer),
  criteria: getCriteria(state.defaultReducer),
  qualifications: getQualifications(state.defaultReducer.qualifications),
  allCandidatesSelected: state.defaultReducer.allCandidatesSelected,
  allUnitsSelected: state.defaultReducer.allUnitsSelected,
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