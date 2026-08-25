import Coder from './coder.js';
import City from './city.js';
import Identification from './Identification.js';
import Address from './address.js';
import Role from './role.js';
import Clan from './clan.js';
import TeamLeader from './teamLeader.js';
import RouteRiwi from './routeRiwi.js';
import Room from './room.js';

City.hasMany(Address, {
  foreignKey: 'cityId',
});

Address.belongsTo(City, {
  foreignKey: 'cityId',
});

Coder.belongsTo(Identification, {
  foreignKey: 'identificationId',
});

Identification.hasOne(Coder, {
  foreignKey: 'identificationId',
});

Coder.belongsTo(Address, {
  foreignKey: 'addressId',
});

Address.hasMany(Coder, {
  foreignKey: 'addressId',
});

Coder.belongsTo(Role, {
  foreignKey: 'roleId',
});

Role.hasMany(Coder, {
  foreignKey: 'roleId',
});

Coder.belongsTo(Clan, {
  foreignKey: 'clanId',
});

Clan.hasMany(Coder, {
  foreignKey: 'clanId',
});

Coder.belongsTo(RouteRiwi, {
  foreignKey: 'routeRiwiId',
  as: 'routeRiwi',
});

RouteRiwi.hasMany(Coder, {
  foreignKey: 'routeRiwiId',
  as: 'coders',
});

Coder.belongsTo(Room, {
  foreignKey: 'roomId',
  as: 'room',
});

Room.hasMany(Coder, {
  foreignKey: 'roomId',
  as: 'coders',
});

TeamLeader.belongsTo(Role, {
  foreignKey: 'roleId',
});

Role.hasMany(TeamLeader, {
  foreignKey: 'roleId',
});

TeamLeader.belongsTo(RouteRiwi, {
  foreignKey: 'routeRiwiId',
  as: 'routeRiwi',
});

RouteRiwi.hasOne(TeamLeader, {
  foreignKey: 'routeRiwiId',
  as: 'teamLeader',
});

TeamLeader.belongsTo(Clan, {
  foreignKey: 'clanId',
});

Clan.hasOne(TeamLeader, {
  foreignKey: 'clanId',
});

TeamLeader.belongsTo(Room, {
  foreignKey: 'roomId',
  as: 'room',
});

Room.hasMany(TeamLeader, {
  foreignKey: 'roomId',
  as: 'teamLeaders',
});
