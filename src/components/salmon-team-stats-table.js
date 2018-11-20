import React from 'react';
import { Table, Image } from 'react-bootstrap';
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
      <th />
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
          defaultMessage="Specials"
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
  console.log('SalmonPlayerRow:player', player)
  console.log('SalmonPlayerRow:playerDropped', playerDropped)
  console.log('SalmonPlayerRow:thumbBase', thumbBase)
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
        {player.weapon_list.map((weapon) => {return weapon.weapon.name})}
      </td>
      <td>        
      {/* {
          player.boss_kill_counts.map(weapon =>  {
            <Image
            src={thumbBase + weapon.thumbnail}
            style={{ maxHeight: 30 }}
            alt={weapon.name}
          />
          })
      } */}
      boss_kills
      </td>
      <td>
        {player.dead_count}
      </td>
      <td>{player.golden_ikura_num}</td>
      <td>{player.special.name}</td>
      <td>{player.ikura_num}</td>
      <td>{player.help_count}</td>
    </tr>
  );
};

const SalmonTeamStatTable = ({ result, team }) => {
  return (
    <Table striped bordered condensed hover>
      <SalmonTeamHeader player={team[0]} />
      <tbody>
        {team.map(player => (
          <SalmonPlayerRow
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
