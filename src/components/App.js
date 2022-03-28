import React from "react";
import "../App.css";
import * as bs from "react-bootstrap/lib/";
import PropTypes from "prop-types";
import { DebounceInput } from "react-debounce-input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { faSun, faCheck, faSort } from "@fortawesome/free-solid-svg-icons";
import Toggle from "react-bootstrap-toggle";

const REPORT_URL = "/qualification/bulk_complete_report";

library.add(fab, faSun, faCheck, faSort);

class App extends React.Component {
  componentWillMount() {
    this.props.getServerData(this.props.source);
  }

  render() {
    console.log("----");
    console.log(this.props);
    return Object.keys(this.props.qualification).length ? (
      <div>
        <br />
        <bs.Grid>
          <bs.Tabs defaultActiveKey={1} id="uncontrolled-bs.tab-example">
            <bs.Tab eventKey={1} title="Bulk complete">
              <br />
              <BulkComplete {...this.props} />
            </bs.Tab>
            <bs.Tab eventKey={2} title="Previous bulk completes">
              <br />
              <BulkUploadReport {...this.props} />
            </bs.Tab>
          </bs.Tabs>
        </bs.Grid>
        <ModalComplete {...this.props} />
      </div>
    ) : (
      <bs.Col xs={6} mdOffset={3} xsOffset={2}>
        <bs.Alert bsStyle="warning">
          <center>
            <strong>
              <FontAwesomeIcon icon="check" size="lg" color="green" /> All
              qualifications have been completed for candidates.
            </strong>
          </center>
        </bs.Alert>
      </bs.Col>
    );
  }
}

export const BulkComplete = (props) => (
  <div>
    <bs.Row>
      <QualDropdown
        qualifications={props.qualifications}
        onChange={props.selectQualification}
      />
    </bs.Row>
    <br />
    <bs.Row>
      <bs.Col xs={6} md={4}>
        <DebounceInput
          className="form-control"
          placeholder="search candidates"
          minLength={2}
          debounceTimeout={300}
          onChange={(event) => props.searchCandidates(event.target.value)}
        />
        <br />
        <Candidates {...props} />
      </bs.Col>
      <bs.Col xs={12} md={8}>
        <bs.Col xa={12} md={6}>
          <bs.Button
            bsStyle={
              (props.qualificationIsCompletable || props.isUnitCertificate) &&
              props.someCandidatesSelected &&
              (props.someUnitsSelected ||
                props.qualification.completionCriteria === 0)
                ? "primary"
                : undefined
            }
            disabled={
              !(
                (props.qualificationIsCompletable || props.isUnitCertificate) &&
                props.someCandidatesSelected &&
                (props.someUnitsSelected || props.qualification.completionCriteria === 0)
              )
            }
            onClick={(_e) => props.toggleDialog()}
          >
            Bulk Complete
          </bs.Button>
        </bs.Col>
        <bs.Col xa={12} md={6}>
          <div style={{ textAlign: "right" }}>
            <span>Complete as Unit Certificate? </span>
            <Toggle
              onClick={(_) => props.toggleUnitCertificate()}
              on={<div>Yes</div>}
              off={<div>No</div>}
              offstyle="success"
              onstyle="warning"
              active={props.isUnitCertificate}
            />
          </div>
        </bs.Col>
        <br />
        <br />
        <Criterias {...props} />
      </bs.Col>
    </bs.Row>
  </div>
);

const filterVisibleCandidates = (candidates, visibleCandidates, term) =>
  Object.keys(visibleCandidates).length
    ? candidates.filter((candidate) =>
        visibleCandidates[candidate.id] ? true : false
      )
    : term.length
    ? []
    : candidates;

export const QualDropdown = (props) => (
  <div>
    <bs.FormControl
      id="qualification-dropdown"
      componentClass="select"
      onChange={(e) => props.onChange(e.target.value)}
    >
      {props.qualifications.map((item) => (
        <option key={item.id} value={item.id}>
          {item.title}
        </option>
      ))}
    </bs.FormControl>
  </div>
);

export const Candidates = (props) => (
  <div>
    {props.qualification.candidates.length ? (
      <bs.Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>
              <bs.Checkbox
                id="toggleAllCandidates"
                style={{ marginTop: "0px", marginBottom: "0px" }}
                checked={props.allCandidatesSelected}
                onClick={(e) => props.toggleAllCandidates()}
              />
            </th>
            <th>Id</th>
            <th>
              Surname{" "}
              <FontAwesomeIcon
                icon="sort"
                id="sortSurname"
                style={{ cursor: "pointer" }}
                onClick={(e) => props.toggleSortSurnames()}
              />
            </th>
            <th>Firstname</th>
          </tr>
        </thead>
        <tbody className="candidates-list">
          {filterVisibleCandidates(
            props.qualification.candidates,
            props.visibleCandidates,
            props.term
          ).map((candidate) => (
            <tr key={candidate.id}>
              <td>
                <bs.Checkbox
                  className="candidateSelected"
                  style={{ marginTop: "0px", marginBottom: "0px" }}
                  checked={candidate.selected}
                  onClick={(e) => props.toggleCandidate(candidate.id)}
                />
              </td>
              <td>{candidate.id}</td>
              <td>{candidate.surname}</td>
              <td>{candidate.firstName}</td>
            </tr>
          ))}
        </tbody>
      </bs.Table>
    ) : (
      <h5 className="no-candidates">No Candidates</h5>
    )}
  </div>
);

const typeOfBadge = (option, isUnitCertificate) =>
  isUnitCertificate ? (
    <bs.Label bsStyle="warning">-</bs.Label>
  ) : option === "MANDATORY" ? (
    <bs.Label bsStyle="danger">M</bs.Label>
  ) : (
    <bs.Label bsStyle="success">O</bs.Label>
  );

export const Criterias = (props) => (
  <div>
    {props.criteria.map((criteria) => (
      <bs.Panel
        key={criteria.id.toString()}
        bsStyle={
          props.isUnitCertificate
            ? "warning"
            : criteria.completable
            ? "success"
            : undefined
        }
        header={
          props.isUnitCertificate
            ? "Unit certificate, no criteria needed"
            : criteria.text
        }
      >
        {criteria.groups.map((group) => (
          <div key={`${group.qualId}-${criteria.id}`}>
            {props.isUnitCertificate ? null : criteria.type ===
              "MANDATORY" ? null : (
              <h5>Minimum Score: {criteria.minimumScore}</h5>
            )}
            <bs.Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th></th>
                  <th></th>
                  <th>Id</th>
                  <th>Title</th>
                  {criteria.type !== "MANDATORY" &&
                  criteria.criteria === "COMPLETE_ON_CREDITS" ? (
                    <th style={{ width: "10px", textAlign: "center" }}>
                      Credit
                    </th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {group.units.map((unit) => (
                  <tr key={unit.id}>
                    <td style={{ width: "5px" }}>
                      <bs.Checkbox
                        className="unitSelected"
                        checked={unit.selected}
                        /* istanbul ignore next */
                        onChange={(_e) => {
                          props.toggleUnit(unit.id);
                        }}
                      />
                    </td>
                    <td style={{ width: "10px" }}>
                      {typeOfBadge(criteria.type, props.isUnitCertificate)}
                    </td>
                    <td style={{ width: "100px" }}>{unit.id}</td>
                    <td style={{ width: "350px" }}>{unit.title}</td>
                    {criteria.type !== "MANDATORY" &&
                    criteria.criteria === "COMPLETE_ON_CREDITS" ? (
                      <td style={{ width: "10px", textAlign: "center" }}>
                        {unit.credit}
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </bs.Table>
          </div>
        ))}
      </bs.Panel>
    ))}
  </div>
);

export const ModalComplete = (props) => {
  return (
    <bs.Modal show={props.showDialog} onHide={(_e) => props.toggleDialog()}>
      <bs.Modal.Header closeButton>
        <bs.Modal.Title>{props.qualification.title}</bs.Modal.Title>
      </bs.Modal.Header>
      <bs.ModalBody>
        <h5>Units to complete:</h5>
        <ul>
          {props.selectedUnitTitles.map((item) => (
            <li key={item.id}>
              {item.id} - {item.title}
            </li>
          ))}
        </ul>
        <h5>Candidates to complete</h5>
        <ul>
          {props.selectedCandidates.map((item) => (
            <li key={item.id}>
              {item.surname}, {item.firstName}
            </li>
          ))}
        </ul>
      </bs.ModalBody>
      <bs.ModalFooter>
        <bs.Button
          disabled={props.bulkCompleteProcessingStatus}
          onClick={(_e) => {
            /* istanbul ignore next */
            props.bulkCompleteProcessing();
            /* istanbul ignore next */
            props.bulkComplete(props);
          }}
        >
          Confirm bulk completion{" "}
          {props.bulkCompleteProcessingStatus ? (
            <FontAwesomeIcon icon="sun" spin size="lg" color="red" />
          ) : (
            <FontAwesomeIcon icon="sun" size="lg" />
          )}
        </bs.Button>
      </bs.ModalFooter>
    </bs.Modal>
  );
};

const BulkUploadReport = (props) => (
  <bs.Table striped bordered condensed hover>
    <thead>
      <tr>
        <th>User</th>
        <th>Qualification</th>
        <th>Number processed</th>
        <th>Date</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {props.reports.map((item) => (
        <tr key={item.id}>
          <td>{item.user}</td>
          <td>{item.qualification}</td>
          <td>{item.courses}</td>
          <td>{new Date(item.date).toLocaleString("en-gb")}</td>
          <td>
            <bs.Button href={`${REPORT_URL}?id=${item.id}`} bsSize="xsmall">
              download
            </bs.Button>
          </td>
        </tr>
      ))}
    </tbody>
  </bs.Table>
);

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
    candidates: PropTypes.arrayOf(
      PropTypes.exact({
        id: PropTypes.string,
        firstName: PropTypes.string,
        surname: PropTypes.string,
        qualifications: PropTypes.arrayOf(PropTypes.string),
        selected: PropTypes.bool,
        visible: PropTypes.bool,
      })
    ),
  }),
  qualifications: PropTypes.arrayOf(
    PropTypes.exact({
      id: PropTypes.string,
      title: PropTypes.string,
      units: PropTypes.arrayOf(PropTypes.number),
      completionCriteria: PropTypes.number,
      candidates: PropTypes.arrayOf(PropTypes.string),
    })
  ),
};

export default App;
