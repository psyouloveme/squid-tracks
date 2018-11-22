import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import lodash from 'lodash';
import SalmonBossStatsTable from './salmon-boss-stats-table';
import PanelWithMenu from './panel-with-menu';
import './result-detail-card.css';

class SalmonBossDetailCard extends React.Component {
  render() {
    const { results } = this.props;
    const { boss_counts } = results;
    if (lodash.isEmpty(results)) {
      return null;
    }

    const myTeam = results.other_results.slice(0);
    myTeam.unshift(results.my_result);
    return (
      <div className={'coop'}>
        <PanelWithMenu header={<h3 className="panel-title">Boss Stats</h3>}>
          <Grid fluid style={{paddingLeft: 0, paddingRight: 0}}>
            <Row>
              <Col sm={12} md={12} key="bosses">
                <SalmonBossStatsTable team={myTeam} boss_counts={boss_counts} />
              </Col>
            </Row>
          </Grid>
        </PanelWithMenu>
      </div>
    );
  }
}

export default SalmonBossDetailCard;
