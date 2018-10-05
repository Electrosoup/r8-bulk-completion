const MANDITORY = 'MANDITORY'
const OPTIONAL = 'OPTIONAL'
const COMPLETE_ON_CREDITS = 'COMPLETE_ON_CREDITS'

const testData = {
  currentQualification: '99999',
  qualifications: {
    '12345': {
      'id': '12345',
      'title': 'A Qualification',
      'units': [4, 1, 2],
      'candidates':[1, 2, 3],
      'completionCriteria': 1,
    },
    '99999': {
      'id': '99999',
      'title': 'Another Qualification',
      'units': [4, 5, 1, 2, 3],
      'candidates':[2, 3],
      'completionCriteria': 2,
    },
    '66666': {
      'id': '66666',
      'title': 'Empty Qualification',
      'units': [4, 5],
      'candidates':[],
      'completionCriteria': 4,
    }
  },
  units: {
    '1': {
      id: '1',
      title: 'Essential Enterprise Know How',
      credit: 2,
    },
    '2': {
      id: '2',
      title: 'Preparing for the Role of a Mentor',
      credit: 4,
    },
    '3': {
      id: '3',
      title: 'Help clients access additional support',
      credit: 2,
    },
    '4': {
      id: '4',
      title: 'Broker the clients to assess learning provider services using specifications and criteria',
      credit: 5,
    },
    '5': {
      id: '5',
      title: 'Deal with Workplace Problems or Disputes',
      credit: 2,
    },
  },

  candidates:{
    1: {
      id:1,
      firstName: 'Simon',
      surname: 'Oram',
      qualifications: ['12345', '99999'],
    },
    2: {
      id:2,
      firstName: 'Fred',
      surname: 'Smith',
      qualifications: ['12345', '99999'],
    },
    3: {
      id: 3,
      firstName: 'Santa',
      surname: 'Claus',
      qualifications: ['12345'],
    }
  },
  criteria: {
    0: {
      id:0,
      criteria: 'COMPLETE_ON_CREDITS',
      groups: [0],
      minimumScore: 0,
      qualId: '12345',
      text: 'Mandatory',
      type: 'MANDATORY'},
    1: {
      id:1,
      criteria: 'COMPLETE_ON_UNITS',
      groups: [1],
      minimumScore: 3,
      qualId: '12345',
      text: 'Optional',
      type: 'OPTIONAL'},
    2: {
      id:2,
      criteria: 'COMPLETE_ON_CREDITS',
      groups: [2],
      minimumScore: 0,
      qualId: '99999',
      text: 'Mandatory',
      type: 'MANDATORY'},
    3: {
      id:3,
      criteria: 'COMPLETE_ON_UNITS',
      groups: [3, 4],
      minimumScore: 1,
      qualId: '99999',
      text: 'Optional',
      type: 'OPTIONAL'},
    4: {
      id: 4,
      criteria: 'COMPLETE_ON_UNITS',
      groups: [5],
      minimumScore: 0,
      qualId: '66666',
      text: 'Optional',
      type: 'OPTIONAL'
    }},
  groups: {
    0: {
      id:0,
      qualId: '12345',
      title: 'Group 0 title...',
      units: ['1']},
    1: {
      id:1,
      qualId: '12345',
      title: 'Group 1 title...',
      units: ['2', '3']},
    2: {
      id:2,
      qualId: '99999',
      title: 'Group 2 title...',
      units: ['3']},
    3: {
      id:3,
      qualId: '99999',
      title: 'Group 3 title...',
      units: ['3']},
    4: {
      id:4,
      qualId: '99999',
      title: 'Group 4 title...',
      units: ['4', '5']},
    5: {
      id:5,
      qualId: '66666',
      title: 'Group 5 title...',
      units: ['4', '5']}},
  qualCriteria: {
    '12345': [0, 1],
    '66666': [4],
    '99999': [2, 3]},
  unitsSelected:{},
  candidatesSelected:{},
  allUnitsSelected: false,
  allCandidatesSelected: false,
}

export default testData
