import * as types from "../actions/action-types";
import FuzzySearch from "fuzzy-search";

const initialData = {
  currentQualification: "xxxxx",
  qualifications: {
    xxxxx: {
      id: "xxxxxx",
      candidates: [],
    },
  },
  units: {},
  candidates: {},
  criteria: {},
  groups: {},
  qualCriteria: { xxxxx: [] },
  unitsSelected: {},
  candidatesSelected: {},
  allUnitsSelected: false,
  allCandidatesSelected: false,
  showDialog: false,
  bulkCompleteProcessing: false,
  isUnitCertificate: false,
  visibleCandidates: {},
  term: "",
  toggleSortSurnames: false,
  reports: [],
};

export default (state = initialData, action) => {
  switch (action.type) {
    case types.SEARCH_CANDIDATES:
      const searcher = new FuzzySearch(
        Object.entries(state.candidates).map((item) => item[1]),
        ["surname", "firstName"],
        {
          caseSensitive: false,
        }
      );
      const searchResult = searcher.search(action.term);
      return {
        ...state,
        term: action.term,
        visibleCandidates: searchResult.reduce(
          (result, item) => ({ ...result, [item.id]: true }),
          {}
        ),
      };

    case types.SELECT_QUALIFICATION:
      return {
        ...state,
        currentQualification: action.id,
        unitsSelected: {},
        candidatesSelected: {},
        allUnitsSelected: false,
        allCandidatesSelected: false,
      };

    case types.TOGGLE_ALL_CANDIDATES:
      const toggledCandidate = !state.allCandidatesSelected;
      return {
        ...state,
        allCandidatesSelected: toggledCandidate,
        candidatesSelected: toggledCandidate
          ? state.qualifications[state.currentQualification].candidates.reduce(
              (result, item) => ({ ...result, [item]: true }),
              {}
            )
          : {},
      };

    case types.TOGGLE_DIALOG:
      return {
        ...state,
        showDialog: !state.showDialog,
      };

    case types.TOGGLE_SORT_SURNAMES:
      return {
        ...state,
        toggleSortSurnames: !state.toggleSortSurnames,
      };

    case types.TOGGLE_UNIT_CERTIFICATE:
      return {
        ...state,
        isUnitCertificate: !state.isUnitCertificate,
      };

    case types.BULK_COMPLETE_PROCESSING:
      return {
        ...state,
        bulkCompleteProcessing: true,
      };

    case types.GET_SERVER_DATA:
      let currentQualification = Object.keys(action.payload.qualifications)
        .length
        ? Object.keys(action.payload.qualifications)[0]
        : undefined;
      let serverState = {
        ...state,
        ...action.payload,
        currentQualification,
        showDialog: false,
        bulkCompleteProcessing: false,
        unitsSelected: {},
        candidatesSelected: {},
        allCandidatesSelected: false,
        allUnitsSelected: false,
        term: "",
        initializing: false,
      };
      return serverState;

    case types.TOGGLE_UNIT:
      return {
        ...state,
        allUnitsSelected: false,
        unitsSelected: {
          ...state.unitsSelected,
          [action.id]: !state.unitsSelected[action.id],
        },
      };

    case types.TOGGLE_CANDIDATE:
      return {
        ...state,
        allCandidatesSelected: false,
        candidatesSelected: {
          ...state.candidatesSelected,
          [action.id]: !state.candidatesSelected[action.id],
        },
      };
    default:
      return state;
  }
};

export const qualificationCompleteable = (criterias) =>
  !criterias
    .map((criteria) => criteriaCompletable(criteria))
    .filter((item) => !item).length > 0;

export const criteriaCompletable = (criteria) =>
  criteria.type === "MANDATORY"
    ? criteriaMadatoryCompletable(criteria)
    : criteriaScore(criteria) >= criteria.minimumScore;

const criteriaMadatoryCompletable = (criteria) =>
  !criteria.groups
    .map((group) => group.units.filter((item) => item.selected === false))
    .reduce((result, item) => result + item.length, 0);

const calculateUnitsSelected = (criteria) =>
  criteria.groups
    .map((group) => group.units.filter((unit) => unit.selected))
    .reduce((result, item) => result + item.length, 0);

const calculateCreditScore = (criteria) =>
  criteria.groups
    .map((group) =>
      group.units
        .filter((unit) => unit.selected)
        .reduce((result, item) => result + item.credit, 0)
    )
    .reduce((result, item) => result + item, 0);

export const getQualifications = (state) =>
  Object.entries(state).map((item) => item[1]);

export const criteriaScore = (criteria) => {
  switch (criteria.criteria) {
    case "COMPLETE_ON_CREDITS":
      return calculateCreditScore(criteria);
    case "COMPLETE_ON_UNITS":
      return calculateUnitsSelected(criteria);
    default:
      return -1;
  }
};

export const getCriteria = (state) => {
  if (
    state.currentQualification &&
    state.qualCriteria.hasOwnProperty(state.currentQualification)
  ) {
    const criteria = state.qualCriteria[state.currentQualification]
      .map((item) => ({
        ...state.criteria[item],
        groups: state.criteria[item].groups.map((item) => ({
          ...state.groups[item],
          units: state.groups[item].units.map((unit) => ({
            ...state.units[unit],
            selected:
              state.unitsSelected[unit] === undefined
                ? false
                : state.unitsSelected[unit],
          })),
        })),
      }))
      .map((criteria) => ({
        ...criteria,
      }))
      .sort((a, b) => (a.type > b.type ? 1 : b.type > a.type ? -1 : 0));
    return criteria.map((item) => ({
      ...item,
      completable: criteriaCompletable(item),
    }));
  }
  return [];
};

export const getQualification = (state) => {
  if (state.currentQualification) {
    const qualification = state.qualifications[state.currentQualification];
    const candidates = qualification.candidates
      .map((item) => state.candidates[item])
      .map((item) => ({
        ...state.candidates[item.id],
        selected:
          state.candidatesSelected[item.id] === undefined
            ? false
            : state.candidatesSelected[item.id],
        visible: true,
      }));
    return {
      ...qualification,
      candidates: candidates.sort((a, b) =>
        !state.toggleSortSurnames
          ? a.surname.toLowerCase() >= b.surname.toLowerCase()
          : a.surname.toLowerCase() <= b.surname.toLowerCase()
      ),
    };
  }
  return {};
};
