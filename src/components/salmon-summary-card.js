import React from 'react';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';
import Timeline from './results-timeline';
import './results-summary-card.css';
import {
    Grid,
    Row,
    Col
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
        <PanelWithMenu header={<h3 className="panel-title">Salmon Run Summary</h3>}>
        <Grid fluid style={{paddingLeft: 0, paddingRight: 0}}>
            <Row>
                <Col md={12}>
                    <SummaryCard data={data}/>
                </Col>
            </Row>

        </Grid>
        </PanelWithMenu>
    );
  }
}


const SummaryCard = ({data}) => {
    return (
        <div>
            <Row>
                <Col md={8}>Current points</Col>
                <Col md={2}/>
                <Col md={2}>{data.kuma_point}p</Col>
            </Row>
            <Row>
                <Col md={10}>Shifts worked</Col>
                <Col md={2}>{data.job_num}</Col>
            </Row>
            <Row>
                <Col md={10}>Golden Eggs collected</Col>
                <Col md={2}>{data.golden_ikura_total}</Col>
            </Row>
            <Row>
                <Col md={10}>Power Eggs collected</Col>
                <Col md={2}>{data.ikura_total}</Col>
            </Row>
            <Row>
                <Col md={10}>Crew members rescued</Col>
                <Col md={2}>{data.help_total}</Col>
            </Row>
            <Row>
                <Col md={10}>Total Points</Col>
                <Col md={2}>{data.kuma_point_total}p</Col>
            </Row>
        </div>
    )
}

export default SalmonSummaryCard;
