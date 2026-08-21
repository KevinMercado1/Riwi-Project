import Coder from './coder.js';
import City from './city.js';
import Identification from './Identification.js';
import Address from './address.js';
import Role from './role.js';
import Clan from './clan.js';
import TeamLeader from './teamLeader.js';
import RouteRiwi from './routeRiwi.js';

// ====================
// CITY - ADDRESS
// ====================

City.hasMany(Address, {
  foreignKey: 'cityId',
});

Address.belongsTo(City, {
  foreignKey: 'cityId',
});

// ====================
// CODER
// ====================

// Coder - Identification
Coder.belongsTo(Identification, {
  foreignKey: 'identificationId',
});

Identification.hasOne(Coder, {
  foreignKey: 'identificationId',
});

// Coder - Address
Coder.belongsTo(Address, {
  foreignKey: 'addressId',
});

Address.hasMany(Coder, {
  foreignKey: 'addressId',
});

// Coder - Role
Coder.belongsTo(Role, {
  foreignKey: 'roleId',
});

Role.hasMany(Coder, {
  foreignKey: 'roleId',
});

// Coder - Clan
Coder.belongsTo(Clan, {
  foreignKey: 'clanId',
});

Clan.hasMany(Coder, {
  foreignKey: 'clanId',
});

// Coder - RouteRiwi
Coder.belongsTo(RouteRiwi, {
  foreignKey: 'routeRiwiId',
});

RouteRiwi.hasMany(Coder, {
  foreignKey: 'routeRiwiId',
});

// ====================
// TEAM LEADER
// ====================

// TeamLeader - Role
TeamLeader.belongsTo(Role, {
  foreignKey: 'roleId',
});

Role.hasMany(TeamLeader, {
  foreignKey: 'roleId',
});

// TeamLeader - RouteRiwi
TeamLeader.belongsTo(RouteRiwi, {
  foreignKey: 'routeRiwiId',
});

RouteRiwi.hasMany(TeamLeader, {
  foreignKey: 'routeRiwiId',
});

// TeamLeader - Clan
TeamLeader.belongsTo(Clan, {
  foreignKey: 'clanId',
});

Clan.hasOne(TeamLeader, {
  foreignKey: 'clanId',
});
