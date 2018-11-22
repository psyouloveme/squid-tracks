import React from 'react';
import { Table } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

const SalmonBossHeader = ({team}) => (
  <thead>
    <tr>
      <th>
        <FormattedMessage
          id="salmonresultDetails.bossStats.header.name"
          defaultMessage="Name"
        />
      </th>
      <th>
        <FormattedMessage
          id="salmonresultDetails.bossStats.header.appearances"
          defaultMessage="Appearances"
        />
      </th>
      <th>
        <FormattedMessage
          id="salmonresultDetails.bossStats.header.kills"
          defaultMessage="Kills"
        />
      </th>
      {team.map((player) => 
        <th key={player.pid}>{player.name}</th>
      )}
    </tr>
  </thead>
);

const SalmonBossRow = ({ team, boss }) => {
  return ( 
    <tr>
      <td>{boss.boss.name}</td>
      <td>{boss.count}</td>
      <td>{boss.kills}</td>
      {team.map((player) => 
        <td key={player.pid}>{player.boss_kill_counts[boss.id].count}</td>
      )}
    </tr>
  );
};

const SalmonBossStatsTable = ({ team, boss_counts }) => {
  // add id and kills to boss count object, convert to array
  const modifiedBossCounts = Object.keys(boss_counts).map((key) => {
    return Object.assign({
      id: parseInt(key, 10),
      kills: team.reduce((sum, player) => sum + player.boss_kill_counts[key].count, 0)
    }, boss_counts[key]);
  });

  const bossKillTotal = modifiedBossCounts.reduce((sum, boss) => sum + boss.kills, 0);
  const bossAppearanceTotal = modifiedBossCounts.reduce((sum, boss) => sum + boss.count, 0);

  return (
    <Table striped bordered condensed hover>
      <SalmonBossHeader team={team}/>
      <tbody>
        {modifiedBossCounts.map((boss) => (
          <SalmonBossRow
            key={boss.id}
            boss={boss}
            team={team}
            thumbBase={'https://app.splatoon2.nintendo.net'}
          />
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th>
            <FormattedMessage
              id="resultDetails.teamStats.header.totals"
              defaultMessage="Totals"
            />
          </th>
          <td>{bossAppearanceTotal}</td>
          <td>{bossKillTotal}</td>
          {team.map((player) => <td key={player.pid}>&nbsp;</td>)}
        </tr>
      </tfoot>
    </Table>
  );
};

export default SalmonBossStatsTable;
