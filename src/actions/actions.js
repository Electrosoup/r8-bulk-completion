import * as types from './action-types'
import * as utils from '../utils'
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

export const searchCandidates = (term) => ({
  type: types.SEARCH_CANDIDATES,
  term
})

export const bulkCompleteProcessing = () => ({
  type: types.BULK_COMPLETE_PROCESSING
})

const _getServerData = (payload) => ({
  type: types.GET_SERVER_DATA,
  payload
})

export const bulkComplete = (props) => 
  dispatch => {
    fetch(
      `${props.source}?centre=${utils.getCentre()}`,
      {headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'X-CSRFToken': utils.getCSRFToken()
      },
      credentials: 'same-origin',
      method: 'post',
      body: JSON.stringify({
        candidates: Object.entries(props.selectedCandidates).map(item => item[1].id),
        units: Object.keys(props.selectedUnits),
        qualification: props.qualification.id,
      }),
      }
    ).then(response => response.json()
    ).then(_payload => {
      dispatch(getServerData(props.source))
    }).catch(err => {
      console.log(err);
    })
    return false
  }


export const getServerData = (source) => 
  dispatch => {
    fetch(
      `${source}?centre=${utils.getCentre()}`,
      {headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'X-CSRFToken': utils.getCSRFToken()
      },
      credentials: 'same-origin',
      method: 'get',
      }
    ).then(response => response.json()
    ).then(payload => {
      dispatch(_getServerData(payload))
    }).catch(err => {
      console.log(err);
    })
    return false
  }

export const toggleDialog = () => ({
    type: types.TOGGLE_DIALOG
})
