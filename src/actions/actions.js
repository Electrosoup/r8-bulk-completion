import * as types from './action-types'

export const selectQualification = (id) => ({
  type: types.SELECT_QUALIFICATION,
  id
})

export const toggleCandidate = (id) => ({
  type: types.TOGGLE_CANDIDATE,
  id
})

export const toggleUnit = (id) => ({
  type: types.TOGGLE_UNIT,
  id
})

export const toggleAllCandidates = () => ({
  type: types.TOGGLE_ALL_CANDIDATES,
})

export const toggleAllUnits = () => ({
  type: types.TOGGLE_ALL_UNITS,
})

export const toggleDialog = () => ({
  type: types.TOGGLE_DIALOG
})