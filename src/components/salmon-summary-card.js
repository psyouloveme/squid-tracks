import React from 'react';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';
import Timeline from './results-timeline';
import './results-summary-card.css';
import {
    Grid,
    Row,
    Col,
    Table
  } from 'react-bootstrap';
import PanelWithMenu from './panel-with-menu';

const ResultsSummaryValueDisplay = ({ className, onClick, label, value }) => {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <h4>{label}</h4>
      <span>{value}</span>
    </div>
  );
};

const SelectableValue = ({
  className,
  activeValue,
  setActiveValue,
  ...props
}) => {
  return (
    <ResultsSummaryValueDisplay
      className={classnames(className, { active: activeValue === className })}
      onClick={() => {
        setActiveValue(className);
      }}
      {...props}
    />
  );
};

class SalmonSummaryCard extends React.Component {
  state = {
    activeValue: 'power'
  };

  setActiveValue = activeValue => {
    this.setState({ activeValue });
  };

  render() {
    const { summary, averages, salmon, changeResult, data } = this.props;
    const { activeValue } = this.state;

    return (
      <div className={'coop'}>
        <PanelWithMenu header={<h3 className="panel-title">Salmon Run Summary</h3>}>
        <Grid fluid style={{paddingLeft: 0, paddingRight: 0}}>
            <Row>
                <Col md={12}>
                    <SummaryCard data={data}/>
                </Col>
            </Row>

        </Grid>
        </PanelWithMenu>
      </div>
    );
  }
}


const SummaryCard = ({data}) => {
    return (
      <Table striped bordered condensed hover>
        <tbody>
        <tr><th>Current points</th><td>{data.kuma_point + 'p'}</td></tr>
        <tr><th>Shifts worked</th><td>{data.job_num}</td></tr>
        <tr><th>Golden Eggs collected</th><td>{data.golden_ikura_total}</td></tr>
        <tr><th>Power Eggs collected</th><td>{data.ikura_total}</td></tr>
        <tr><th>Crew members rescued</th><td>{data.help_total}</td></tr>
        <tr><th>Total Points</th><td>{data.kuma_point_total + 'p'}</td></tr>
        </tbody>
      </Table>
    )
}

export default SalmonSummaryCard;
