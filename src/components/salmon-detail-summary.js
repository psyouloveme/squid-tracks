import React from 'react';
import { Row, Col, ProgressBar, Label } from 'react-bootstrap';
import { FormattedMessage, FormattedDate, FormattedTime } from 'react-intl';
import LobbyColors from './lobby-colors';

const labelStyle = {
  fontSize: 16,
  fontWeight: 'normal',
  marginRight: 5,
  float: 'left',
  marginBottom: 5,
  padding: '.35em .6em .35em'
};




const JobSummary = ({ result }) => {
  // const myScore =
  //   result.my_team_count == null
  //     ? result.my_team_percentage
  //     : result.my_team_count;
  // const otherScore =
  //   result.other_team_count == null
  //     ? result.other_team_percentage
  //     : result.other_team_count;
  // const totalScore = myScore + otherScore;
  // const myNow = myScore * 100 / totalScore;
  // const otherNow = otherScore * 100 / totalScore;
  console.log(result);
  return (
    <div>
      <Row>
        <Col md={12}>
          <h2 style={{ marginTop: 0 }}>
            <FormattedMessage
              id="salmonresultDetails.summary.title"
              defaultMessage="{rule} on {map}"
              values={{
                rule: 'salmon run',
                map: result.schedule.stage.name
              }}
            />
          </h2>
        </Col>
      </Row>
      <Row>
        <Col md={12} style={{ marginTop: -8, marginBottom: 10 }}>
          <FormattedDate
            value={new Date(result.start_time * 1000)}
            year="numeric"
            month="long"
            day="2-digit"
          />{' '}
          <FormattedTime value={new Date(result.start_time * 1000)} />
        </Col>
      </Row>
      {/* <Row>
        <Col md={12}>
          <ProgressBar style={{ height: 30 }}>
            <ProgressBar
              striped
              now={myNow}
              bsStyle="info"
              label={myScore}
              key={1}
              style={{ fontSize: 16, padding: '.35em 0' }}
            />
            <ProgressBar
              striped
              now={otherNow}
              bsStyle="warning"
              label={otherScore}
              key={2}
              style={{ fontSize: 16, padding: '.35em 0' }}
            />
          </ProgressBar>
        </Col>
      </Row> */}
    </div>
  );
};


export default JobSummary;
