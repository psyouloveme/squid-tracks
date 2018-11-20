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
import { pick, mapKeys, cloneDeep } from 'lodash';
import flatten from 'flat';
import { FormattedMessage } from 'react-intl';
import sillyname from 'sillyname';
import { nativeImage, ipcRenderer, clipboard, remote } from 'electron';
import lodash from 'lodash';

import JobSummary from './salmon-detail-summary';
import SalmonResultsCard from './salmon-results-card';
import SalmonTeamStatsTable from './salmon-team-stats-table';
import PanelWithMenu from './panel-with-menu';
import TeamRadar from './team-radar';
import { getSalmonRunFields } from './export-detail-helpers';
import { event } from '../analytics';

import './result-detail-card.css';

const { openExternal } = remote.shell;

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

const SalmonTeamBadges = ({ rate, rank, danger, kuma, grade }) => {
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
            values={{ rank: rank }}
          />
        </Label>
      ) : null}
      {grade != null ? (
        <Label
          bsStyle="default"
          style={{
            fontWeight: 'normal',
            marginLeft: 5,
            marginRight: 5
          }}
        >
          <FormattedMessage
            id="salmonresultDetails.summary.grade"
            defaultMessage="Grade {grade}"
            values={{ grade: grade }}
          />
        </Label>
      ) : null}
      {danger != null ? (
        <Label
          bsStyle="default"
          style={{
            fontWeight: 'normal',
            marginLeft: 5,
            marginRight: 5
          }}
        >
          <FormattedMessage
            id="salmonresultDetails.summary.danger"
            defaultMessage="Hazard {danger}"
            values={{ danger: danger }}
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
            defaultMessage="Hazard {rate}"
            values={{ rate: rate }}
          />
        </Label>
      ) : null}
      {kuma != null ? (
        <Label
          bsStyle="default"
          style={{
            fontWeight: 'normal',
            marginLeft: 5,
            marginRight: 5
          }}
        >
          <FormattedMessage
            id="salmonesultDetails.summary.kuma"
            defaultMessage="Kuma {kuma}"
            values={{ kuma: kuma }}
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

  showStats = () => {
    event('result-details', 'show-stats');
    this.setState({ show: 1 });
  };

  showInfo = () => {
    event('result-details', 'show-info');
    this.setState({ show: 3 });
  };

  showRadarTeam = () => {
    event('result-details', 'show-radar-team');
    this.setState({ show: 4 });
  };

  showRadarTotals = () => {
    event('result-details', 'show-radar-game-totals');
    this.setState({ show: 5 });
  };

  calculateMaximums = (myTeam, otherTeam) => {
    const teams = myTeam.concat(otherTeam);
    const k = teams.reduce(
      (max, member) => (member.kill_count > max ? member.kill_count : max),
      0
    );
    const a = teams.reduce(
      (max, member) => (member.assist_count > max ? member.assist_count : max),
      0
    );
    const d = teams.reduce(
      (max, member) => (member.death_count > max ? member.death_count : max),
      0
    );
    const s = teams.reduce(
      (max, member) =>
        member.special_count > max ? member.special_count : max,
      0
    );
    const p = teams.reduce(
      (max, member) =>
        member.game_paint_point > max ? member.game_paint_point : max,
      0
    );

    const kad = [k, a, d].reduce(
      (max, value) => (value > max ? value : max),
      0
    );

    return { k: kad, a: kad, d: kad, s, p };
  };

  anonymize(result) {
    const newResult = cloneDeep(result);
    for (const player of newResult.name) {
      player.player.nickname = sillyname();
    }
    return newResult;
  }

  render() {
    const { results, statInk } = this.props;
    const { anonymize } = this.state;
    if (lodash.isEmpty(results)) {
      return null;
    }

    const linkInfo = statInk[results.job_id];
    const resultChanged = anonymize ? this.anonymize(results) : results;

    const myTeam = resultChanged.other_results.slice(0);
    //myTeam.unshift(resultChanged.player_result);
    myTeam.unshift(resultChanged.my_result);
    //myTeam.sort((a, b) => b.sort_score - a.sort_score);


    // const otherTeam = resultChanged.other_team_members
    //   .slice(0)
    //   .sort((a, b) => b.sort_score - a.sort_score);

    // idk about kad here....?
    //const maximums = this.calculateMaximums(myTeam, otherTeam);

    // const myTeamPower =
    //   resultChanged.my_estimate_league_point != null
    //     ? resultChanged.my_estimate_league_point
    //     : resultChanged.my_estimate_fes_power != null
    //       ? resultChanged.my_estimate_fes_power
    //       : null;
    // const otherTeamPower =
    //   resultChanged.other_estimate_league_point != null
    //     ? resultChanged.other_estimate_league_point
    //     : resultChanged.other_estimate_fes_power != null
    //       ? resultChanged.other_estimate_fes_power
    //       : null;
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
                      rate={results.rate}
                      rank={results.rank}
                      danger={results.danger}
                      kuma={results.kuma}
                      grade={results.grade.name}
                      />
                    </h4>
                    <SalmonTeamStatsTable team={myTeam} result={results} />
                  </Col>
            </Row>
          </Grid>
        </PanelWithMenu>
      </div>
    );
  }
}

export default SalmonResultDetailCard;
