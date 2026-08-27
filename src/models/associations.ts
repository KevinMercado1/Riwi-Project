import Coder from './coder.js';
import City from './city.js';
import Identification from './Identification.js';
import Address from './address.js';
import Role from './role.js';
import Clan from './clan.js';
import TeamLeader from './teamLeader.js';
import RouteRiwi from './routeRiwi.js';
import Room from './room.js';

// ==================== CITY ↔ ADDRESS ====================

City.hasMany(Address, {
  foreignKey: 'cityId',
});

Address.belongsTo(City, {
  foreignKey: 'cityId',
});

// ==================== CODER ↔ IDENTIFICATION ====================

Coder.belongsTo(Identification, {
  foreignKey: 'identificationId',
});

Identification.hasOne(Coder, {
  foreignKey: 'identificationId',
});

// ==================== CODER ↔ ADDRESS ====================

Coder.belongsTo(Address, {
  foreignKey: 'addressId',
});

Address.hasMany(Coder, {
  foreignKey: 'addressId',
});

// ==================== CODER ↔ ROLE ====================

Coder.belongsTo(Role, {
  foreignKey: 'roleId',
});

Role.hasMany(Coder, {
  foreignKey: 'roleId',
});

// ==================== CODER ↔ CLAN ====================

Coder.belongsTo(Clan, {
  foreignKey: 'clanId',
});

Clan.hasMany(Coder, {
  foreignKey: 'clanId',
});

// ==================== CODER ↔ ROUTE ====================

Coder.belongsTo(RouteRiwi, {
  foreignKey: 'routeRiwiId',
  as: 'routeRiwi',
});

RouteRiwi.hasMany(Coder, {
  foreignKey: 'routeRiwiId',
  as: 'coders',
});

// ==================== CODER ↔ ROOM ====================

Coder.belongsTo(Room, {
  foreignKey: 'roomId',
  as: 'room',
});

Room.hasMany(Coder, {
  foreignKey: 'roomId',
  as: 'coders',
});

// ==================== TEAM LEADER ↔ ROLE ====================

TeamLeader.belongsTo(Role, {
  foreignKey: 'roleId',
});

Role.hasMany(TeamLeader, {
  foreignKey: 'roleId',
});

// ==================== TEAM LEADER ↔ ROUTE ====================

TeamLeader.belongsTo(RouteRiwi, {
  foreignKey: 'routeRiwiId',
  as: 'routeRiwi',
});

RouteRiwi.hasOne(TeamLeader, {
  foreignKey: 'routeRiwiId',
  as: 'teamLeader',
});

// ==================== TEAM LEADER ↔ CLAN ====================

TeamLeader.belongsTo(Clan, {
  foreignKey: 'clanId',
});

Clan.hasOne(TeamLeader, {
  foreignKey: 'clanId',
});

// ==================== TEAM LEADER ↔ ROOM ====================

TeamLeader.belongsTo(Room, {
  foreignKey: 'roomId',
  as: 'room',
});

Room.hasMany(TeamLeader, {
  foreignKey: 'roomId',
  as: 'teamLeaders',
});
