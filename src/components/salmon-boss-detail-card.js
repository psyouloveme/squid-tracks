import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { cloneDeep } from 'lodash';
import sillyname from 'sillyname';
import { remote } from 'electron';
import lodash from 'lodash';
import SalmonBossStatsTable from './salmon-boss-stats-table';
import { event } from '../analytics';
import PanelWithMenu from './panel-with-menu';


import './result-detail-card.css';

const { openExternal } = remote.shell;

class SalmonBossDetailCard extends React.Component {
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
    const { boss_counts } = results;
    if (lodash.isEmpty(results)) {
      return null;
    }

    const linkInfo = statInk[results.job_id];
    const resultChanged = anonymize ? this.anonymize(results) : results;

    const myTeam = resultChanged.other_results.slice(0);
    myTeam.unshift(resultChanged.my_result);
    console.log(results);
    return (
      <div className={'coop'}>

      <PanelWithMenu header={<h3 className="panel-title">Boss Stats</h3>}>
        <Grid fluid style={{paddingLeft: 0, paddingRight: 0}}>
          <Row>
            <Col sm={12} md={12} key="bosses">
              <SalmonBossStatsTable team={myTeam} boss_counts={boss_counts} />
            </Col>
            {/* <Col sm={6} md={6} key="bossplayers">
              <SalmonBossPlayerStatsTable team={myTeam} boss_counts={boss_counts} />
            </Col> */}
          </Row>
        </Grid>
        </PanelWithMenu>
      </div>
    );
  }
}

export default SalmonBossDetailCard;
