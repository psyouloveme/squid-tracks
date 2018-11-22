import React from 'react';
import {
  Grid,
  Row,
  Col,
  Glyphicon,
  ButtonToolbar,
  ButtonGroup,
  Button,
  Nav,
  NavDropdown,
  MenuItem,
  Label
} from 'react-bootstrap';
import { cloneDeep } from 'lodash';
import { FormattedMessage } from 'react-intl';
import sillyname from 'sillyname';
import { nativeImage, ipcRenderer, clipboard } from 'electron';
import lodash from 'lodash';

import JobSummary from './salmon-detail-summary';
import SalmonTeamStatsTable from './salmon-team-stats-table';
import SalmonEnemyStatTable from './salmon-enemy-stats-table';
import PanelWithMenu from './panel-with-menu';
import { event } from '../analytics';

import './result-detail-card.css';

class SalmonResultDetailMenu extends React.Component {
  simplify(result) {
    const simple = this.getGeneral(result);

    simple.my_team = [];

    simple.my_team.push(this.getPlayer(result.player_result));
    for (const player of result.my_team_members) {
      simple.my_team.push(this.getPlayer(player));
    }
    simple.other_team = [];
    for (const player of result.other_team_members) {
      simple.other_team.push(this.getPlayer(player));
    }

    return simple;
  }

  copySimplifiedToJson = () => {
    event('export-data', 'battle-simplified-json');
    const { result } = this.props;
    const simplified = this.simplify(result);
    clipboard.writeText(JSON.stringify(simplified));
  };

  copyToJson = () => {
    event('export-data', 'battle-json');
    const { result } = this.props;
    clipboard.writeText(JSON.stringify(result));
  };

  copyPicture = () => {
    event('export-data', 'battle-picture');
    const { result } = this.props;
    clipboard.writeImage(
      nativeImage.createFromBuffer(
        Buffer.from(ipcRenderer.sendSync('getSplatnetImage', result))
      )
    );
  };

  copyPictureURL = () => {
    event('export-data', 'battle-picture-url');
    const { result } = this.props;
    clipboard.writeText(ipcRenderer.sendSync('getSplatnetImageURL', result));
  };

  render() {
    return (
      <Nav className={'navbar-right pull-right'}>
        <NavDropdown
          id={'details-menu'}
          title={<Glyphicon glyph={'option-vertical'} />}
          noCaret
          pullRight
        >
          <MenuItem onClick={this.copySimplifiedToJson}>
            <FormattedMessage
              id="resultDetails.export.copySimpleJson"
              defaultMessage="Copy Simplified Json"
            />
          </MenuItem>
          <MenuItem onClick={this.copyToJson}>
            <FormattedMessage
              id="resultDetails.export.copyRawJson"
              defaultMessage="Copy Raw Json"
            />
          </MenuItem>
          <MenuItem divider />
          <MenuItem onClick={this.copyPicture}>
            <FormattedMessage
              id="resultDetails.export.copyPicture"
              defaultMessage="Copy SplatNet Share picture"
            />
          </MenuItem>
          <MenuItem onClick={this.copyPictureURL}>
            <FormattedMessage
              id="resultDetails.export.copyPictureURL"
              defaultMessage="Copy SplatNet Share picture (URL)"
            />
          </MenuItem>
          <MenuItem divider />
          <MenuItem>
            <strike>
              <FormattedMessage
                id="resultDetails.export.saveToFile"
                defaultMessage="Save to File"
              />
            </strike>
          </MenuItem>
        </NavDropdown>
      </Nav>
    );
  }
}

const SalmonTeamBadges = ({ rate, rank, danger, kuma, grade, score }) => {
  return (
    <React.Fragment>
      {rank != null ? (
        <Label
          bsStyle="default"
          style={{
            fontWeight: 'normal',
            marginLeft: 5,
            marginRight: 5
          }}
        >
          <FormattedMessage
            id="salmonresultDetails.summary.rank"
            defaultMessage="Rank {rank}"
            values={{ rank }}
          />
        </Label>
      ) : null}
      {score != null ? (
        <Label
          bsStyle="default"
          style={{
            fontWeight: 'normal',
            marginLeft: 5,
            marginRight: 5
          }}
        >
          <FormattedMessage
            id="salmonesultDetails.summary.score"
            defaultMessage="Score {score}"
            values={{ score }}
          />
        </Label>
      ) : null}
      {rate != null ? (
        <Label
          bsStyle="default"
          style={{
            fontWeight: 'normal',
            marginLeft: 5,
            marginRight: 5
          }}
        >
          <FormattedMessage
            id="salmonresultDetails.summary.rate"
            defaultMessage="Pay Grade {rate}%"
            values={{ rate }}
          />
        </Label>
      ) : null}
    </React.Fragment>
  );
};

class SalmonResultDetailCard extends React.Component {
  state = {
    show: 1,
    anonymize: false
  };

  anonymize(result) {
    const newResult = cloneDeep(result);
    for (const player of newResult.name) {
      player.player.nickname = sillyname();
    }
    return newResult;
  }

  render() {
    const { results } = this.props;
    const { anonymize } = this.state;
    const { 
      wave_details, 
      job_result,
    } = results;
    if (lodash.isEmpty(results)) {
      return null;
    }

    const resultChanged = anonymize ? this.anonymize(results) : results;

    // add my results to other results
    const myTeam = resultChanged.other_results.slice(0);
    myTeam.unshift(resultChanged.my_result);


    return (
      <div className={'coop'}>
        <PanelWithMenu
          header={
            <h3 className="panel-title">
              <FormattedMessage
                id="salmonresultDetails.title"
                defaultMessage="Job #{job_id} Details"
                values={{ job_id: resultChanged.job_id }}
              />
            </h3>
          }
          menu={<SalmonResultDetailMenu result={resultChanged} />}
        >
          <Grid fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
            <Row>
              <Col md={12}>
                <JobSummary result={resultChanged} />
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <ButtonToolbar style={{ marginBottom: '10px' }}>
                  <ButtonGroup>
                    <Button
                      onClick={this.showStats}
                      active={this.state.show === 1}
                    >
                      <Glyphicon glyph="th" />
                    </Button>
                    <Button
                      onClick={this.showInfo}
                      active={this.state.show === 3}
                    >
                      <Glyphicon glyph="option-horizontal" />
                    </Button>
                  </ButtonGroup>
                  <Button
                    onClick={() => {
                      event(
                        'result-details',
                        'anonymize',
                        !this.state.anonymize
                      );
                      this.setState({ anonymize: !this.state.anonymize });
                    }}
                    active={this.state.anonymize}
                  >
                    <FormattedMessage
                      id={'salmonresultDetails.anonymizeButton.text'}
                      defaultMessage={'Anonymize'}
                    />
                  </Button>
                </ButtonToolbar>
              </Col>
            </Row>
            <Row>
                <Col sm={6} md={6} key="myTeam">
                    <h4>
                      <FormattedMessage
                        id="salmonresultDetails.teamsButton.myTeamTitle"
                        defaultMessage="My Team"
                      />
                      <SalmonTeamBadges
                        rate={results.job_rate}
                        rank={results.rank}
                        danger={results.danger_rate}
                        kuma={results.kuma_point}
                        grade={results.grade.name}
                        score={results.job_score}
                      />
                    </h4>
                    <SalmonTeamStatsTable team={myTeam} result={results} />
                  </Col>
                  <Col sm={6} md={6} key="waveDetail">
                    <h4>
                      <FormattedMessage
                        id="salmonresultDetails.teamsButton.waveDetailTitle"
                        defaultMessage="Wave Detail"
                      />
                    </h4>
                      <SalmonEnemyStatTable wave_details={wave_details} job_result={job_result} />
                  </Col>
            </Row>
          </Grid>
        </PanelWithMenu>
      </div>
    );
  }
}

export default SalmonResultDetailCard;
