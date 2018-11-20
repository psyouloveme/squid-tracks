import React from 'react';
import { Table, Image, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

const SalmonTeamHeader = ({ player = { player: {} } }) => (
  <thead>
    <tr>
      <th>
        <FormattedMessage
          id="salmonresultDetails.teamStats.header.player"
          defaultMessage="Player"
        />
      </th>
      <th>
        <FormattedMessage
          id="salmonresultDetails.teamStats.header.weapon"
          defaultMessage="Weapon"
        />
      </th>
      <th>
        <FormattedMessage
          id="salmonresultDetails.teamStats.header.bossKills"
          defaultMessage="Boss Kills"
        />
      </th>
      <th>
        <FormattedMessage
          id="salmonresultDetails.teamStats.header.deaths"
          defaultMessage="Deaths"
        />
      </th>
      <th>
        <FormattedMessage
          id="salmonresultDetails.teamStats.header.specials"
          defaultMessage="Special"
        />
      </th>
      <th>
        <FormattedMessage
          id="salmonresultDetails.teamStats.header.goldenEggs"
          defaultMessage="Golden Eggs"
        />
      </th>
      <th>
        <FormattedMessage
          id="salmonresultDetails.teamStats.header.powerEggs"
          defaultMessage="Power Eggs"
        />
      </th>
      <th>
        <FormattedMessage
          id="salmonresultDetails.teamStats.header.revives"
          defaultMessage="Revives"
        />
      </th>
    </tr>
  </thead>
);

const SalmonPlayerRow = ({ player, playerDropped, thumbBase }) => {
  //TODO: figure out how to tell if someone dropped and re-add strikes/styles
  const { boss_kill_counts } = player;
  const bossKillCount = Object.keys(boss_kill_counts).reduce(function(previous, key) {
    return parseInt(previous) + parseInt(boss_kill_counts[key].count);
  });

  return ( 
    <tr style={{ color: playerDropped ? 'lightgrey' : undefined }} >
      <td>
        {
          playerDropped ? 
            (<strike>{player.name}</strike>)
          : 
            (player.name)
        }
      </td>

      <td style={{ textAlign: 'center', background: 'darkgrey' }}>
        {player.weapon_list.map((weapon) => {
          return (
            <OverlayTrigger placement='bottom' overlay={
              <Tooltip id={'weapon-' + weapon.weapon.id + '-' + player.pid}>
                          {weapon.weapon.name}
              </Tooltip>}
            >
            <Image
              src={thumbBase + weapon.weapon.thumbnail}
              style={{ maxHeight: 30 }}
              alt={weapon.name}
              title={weapon.name}
            />
            </OverlayTrigger>
        )})}
      </td>
      <td>
        {bossKillCount}        
      </td>
      <td>
        {player.dead_count}
      </td>
      <td>{player.special.name}</td>
      <td>{player.golden_ikura_num}</td>
      <td>{player.ikura_num}</td>
      <td>{player.help_count}</td>
    </tr>
  );
};

const SalmonTeamStatTable = ({ result, team }) => {
  console.log('stattable player', team[1]);
  return (
    <Table striped bordered condensed hover>
      <SalmonTeamHeader player={team[0]} />
      <tbody>
        {team.map(player => (
          <SalmonPlayerRow
            key={player.pid}
            player={player}
            playerDropped={false}
            thumbBase={'https://app.splatoon2.nintendo.net'}
          />
        ))}
      </tbody>
      {/* <tfoot>
        <tr>
          <th>
            <FormattedMessage
              id="resultDetails.teamStats.header.totals"
              defaultMessage="Totals"
            />
          </th>
          <th />
          {team[0].player.udemae ? <th /> : null}
          <td>
            {team.reduce((sum, player) => sum + player.game_paint_point, 0)}
          </td>
          <td>{`${total_k + total_a} (${total_a})`}</td>
          <td>{`${total_k} / ${total_d}`}</td>
          <td>{`${total_s}`}</td>
        </tr>
      </tfoot> */}
    </Table>
  );
};

export default SalmonTeamStatTable;
