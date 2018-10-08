import * as types from '../actions/action-types'

import testData from '../test-data'

export default (state = testData, action) => {
  switch (action.type) {
    case types.SELECT_QUALIFICATION:
        return {
          ...state,
          currentQualification: action.id,
          unitsSelected:{},
          candidatesSelected:{},
          allUnitsSelected: false,
          allCandidatesSelected: false,         
          }

    case types.TOGGLE_ALL_CANDIDATES:
        const toggledCandidate = !state.allCandidatesSelected
        return {
          ...state,
          allCandidatesSelected: toggledCandidate,
          candidatesSelected: toggledCandidate 
          ?
          state.qualifications[state.currentQualification].candidates
          .reduce((result,item) => ({...result, [item]: true}), {})
          :
          {}
        }
    case types.TOGGLE_DIALOG:
        return {
          ...state,
          showDialog: ! state.showDialog,
        }
    case types.TOGGLE_UNIT:
      return {
        ...state,
        allUnitsSelected: false,
        unitsSelected: {
          ...state.unitsSelected,
          [action.id]: ! state.unitsSelected[action.id]}}
    case types.TOGGLE_CANDIDATE:
        return {
          ...state,
          allCandidatesSelected: false,
          candidatesSelected: {
            ...state.candidatesSelected,
            [action.id]: ! state.candidatesSelected[action.id]}}
    default:
      return state
  }
}

export const qualificationCompleteable = (criterias) => !criterias
  .map(criteria => criteriaCompletable(criteria))
  .filter(item => !item)
  .length > 0

export const criteriaCompletable = (criteria) =>
  criteria.type === "MANDATORY"
  ?
  criteriaMadatoryCompletable(criteria)
  :
  criteriaScore(criteria) >= criteria.minimumScore

const criteriaMadatoryCompletable = (criteria) => ! criteria.groups
  .map(group => group.units
    .filter(item => item.selected === false))
  .reduce((result,item) => result + item.length, 0)

const calculateUnitsSelected = (criteria) => criteria.groups
  .map(group => group.units
    .filter(unit => unit.selected))
  .reduce((result, item) => result + item.length, 0)

const calculateCreditScore = (criteria) => criteria.groups
  .map(group => group.units
    .filter(unit => unit.selected)
    .map(unit => unit.credit))
  .map(group => group
  .reduce((result, item) => result + item),0)
  .reduce((result, value) => result + value, 0)

export const getQualifications = (state) => Object.entries(state).map(item => item[1])

export const criteriaScore = (criteria) => {
  switch (criteria.criteria) {
    case 'COMPLETE_ON_CREDITS':
      return calculateCreditScore(criteria)
    case 'COMPLETE_ON_UNITS':
      return calculateUnitsSelected(criteria)
    default:
      return -1
  }
}

export const getCriteria = (state) => {
  const criteria = state.qualCriteria[state.currentQualification].map(
    item => ({
    ...state.criteria[item],
    groups: state.criteria[item].groups.map(
      item => ({...state.groups[item],
    units: state.groups[item].units
      .map(unit => ({...state.units[unit],
        selected: state.unitsSelected[unit] === undefined
        ? 
        false 
        :
        state.unitsSelected[unit]})
        )
      }))}))
      .map(criteria => (
        {
          ...criteria
        }))
      .sort((a, b) => a.type > b.type)
    return criteria.map(
      item => ({...item, completable: criteriaCompletable(item)}))
}

export const getQualification = (state) => {
  const qualification = state.qualifications[state.currentQualification]
   const candidates = qualification.candidates.map(
    item =>
    state.candidates[item])
    .sort((a, b) => a.surname.toLowerCase() >= b.surname.toLowerCase())
    .map(
      item =>
      ({...state.candidates[item.id],
        selected: state.candidatesSelected[item.id] === undefined
        ?
        false 
        :
        state.candidatesSelected[item.id]}))

  return {...qualification, candidates}
}