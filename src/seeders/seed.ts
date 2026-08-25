import bcrypt from 'bcrypt';
import db from '../config/db.js';

import City from '../models/city.js';
import Address from '../models/address.js';
import Clan from '../models/clan.js';
import Coder from '../models/coder.js';
import Identification from '../models/Identification.js';
import Role from '../models/role.js';
import Room from '../models/room.js';
import RouteRiwi from '../models/routeRiwi.js';
import TeamLeader from '../models/teamLeader.js';

const seed = async (): Promise<void> => {
  try {
    console.log('========================================');
    console.log('🌱 STARTING SEED');
    console.log('========================================');

    // =========================
    // DATABASE
    // =========================

    await db.authenticate();

    console.log('✅ Database connected');

    await db.sync();

    // =========================
    // PASSWORDS
    // =========================

    const adminPassword = await bcrypt.hash('Admin123', 10);
    const coderPassword = await bcrypt.hash('Coder123', 10);

    // =========================
    // CITY
    // =========================

    console.log('Creating city...');

    const barranquilla = await City.create({
      name: 'Barranquilla',
    });

    // =========================
    // ADDRESSES
    // TODAS EN BARRANQUILLA
    // =========================

    console.log('Creating addresses...');

    const address1 = await Address.create({
      address: 'Carrera 50 #80-90',
      cityId: barranquilla.id,
    });

    const address2 = await Address.create({
      address: 'Calle 72 #45-20',
      cityId: barranquilla.id,
    });

    const address3 = await Address.create({
      address: 'Carrera 46 #70-15',
      cityId: barranquilla.id,
    });

    // =========================
    // IDENTIFICATIONS
    // =========================

    console.log('Creating identifications...');

    const identification3 = await Identification.create({
      type: 'nationa_lID',
      number: '1001001003',
    });

    const identification4 = await Identification.create({
      type: 'nationa_lID',
      number: '1001001004',
    });

    // =========================
    // ROLES
    // =========================

    console.log('Creating roles...');

    const adminRole = await Role.create({
      name: 'admin',
    });

    const teamLeaderRole = await Role.create({
      name: 'team_leader',
    });

    const coderRole = await Role.create({
      name: 'coder',
    });

    void adminRole;

    // =========================
    // CLANS
    // =========================

    console.log('Creating clans...');

    const clanAlpha = await Clan.create({
      name: 'Clan Alpha',
    });

    const clanBeta = await Clan.create({
      name: 'Clan Beta',
    });

    const clanGamma = await Clan.create({
      name: 'Clan Gamma',
    });

    // =========================
    // ROUTES
    // =========================

    console.log('Creating routes...');

    const basicRoute = await RouteRiwi.create({
      name: 'basic',
    });

    const advancedRoute = await RouteRiwi.create({
      name: 'advanced',
    });

    // =========================
    // ROOMS
    // =========================

    console.log('Creating rooms...');

    const roomA = await Room.create({
      name: 'Room A',
      capacity: 30,
    });

    const roomB = await Room.create({
      name: 'Room B',
      capacity: 25,
    });

    const roomC = await Room.create({
      name: 'Room C',
      capacity: 40,
    });

    // =========================
    // TEAM LEADERS
    // =========================

    console.log('Creating team leaders...');

    // CARLOS
    // Clan Alpha
    // Room A
    // Basic

    await TeamLeader.create({
      name: 'Carlos',
      surname: 'Rodriguez',
      numer_telefonu: '3001001001',
      email: 'carlos@riwi.io',
      password: adminPassword,
      roleId: teamLeaderRole.id,
      routeRiwiId: basicRoute.id,
      clanId: clanAlpha.id,
      roomId: roomA.id,
    });

    // LAURA
    // Clan Beta
    // Room B
    // Advanced

    await TeamLeader.create({
      name: 'Laura',
      surname: 'Martinez',
      numer_telefonu: '3001001002',
      email: 'laura@riwi.io',
      password: adminPassword,
      roleId: teamLeaderRole.id,
      routeRiwiId: advancedRoute.id,
      clanId: clanBeta.id,
      roomId: roomB.id,
    });

    // =========================
    // CODERS
    // =========================

    console.log('Creating coders...');

    // JUAN
    // Barranquilla
    // Clan Alpha
    // Room A
    // Basic

    await Coder.create({
      name: 'Juan',
      surname: 'Perez',
      numer_telefonu: '3001001003',
      email: 'juan@riwi.io',
      password: coderPassword,
      roleId: coderRole.id,
      identificationId: identification3.id,
      addressId: address1.id,
      clanId: clanAlpha.id,
      routeRiwiId: basicRoute.id,
      roomId: roomA.id,
    });

    // MARIA
    // Barranquilla
    // Clan Beta
    // Room B
    // Advanced

    await Coder.create({
      name: 'Maria',
      surname: 'Gomez',
      numer_telefonu: '3001001004',
      email: 'maria@riwi.io',
      password: coderPassword,
      roleId: coderRole.id,
      identificationId: identification4.id,
      addressId: address2.id,
      clanId: clanBeta.id,
      routeRiwiId: advancedRoute.id,
      roomId: roomB.id,
    });

    // =========================
    // RESULT
    // =========================

    console.log('');
    console.log('========================================');
    console.log('✅ SEED COMPLETED SUCCESSFULLY');
    console.log('========================================');

    console.log('');
    console.log('CITY');
    console.log('----------------------------------------');
    console.log(`- ${barranquilla.name}`);

    console.log('');
    console.log('CLANS');
    console.log('----------------------------------------');
    console.log(`- ${clanAlpha.name}`);
    console.log(`- ${clanBeta.name}`);
    console.log(`- ${clanGamma.name}`);

    console.log('');
    console.log('ROUTES');
    console.log('----------------------------------------');
    console.log(`- ${basicRoute.name}`);
    console.log(`- ${advancedRoute.name}`);

    console.log('');
    console.log('ROOMS');
    console.log('----------------------------------------');
    console.log(`- ${roomA.name} | Capacity: ${roomA.capacity}`);
    console.log(`- ${roomB.name} | Capacity: ${roomB.capacity}`);
    console.log(`- ${roomC.name} | Capacity: ${roomC.capacity}`);

    console.log('');
    console.log('TEAM LEADERS');
    console.log('----------------------------------------');

    console.log('');
    console.log('Carlos');
    console.log('Email: carlos@riwi.io');
    console.log('Password: Admin123');
    console.log('Clan: Clan Alpha');
    console.log('Route: basic');
    console.log('Room: Room A');
    console.log('City: Barranquilla');

    console.log('');
    console.log('Laura');
    console.log('Email: laura@riwi.io');
    console.log('Password: Admin123');
    console.log('Clan: Clan Beta');
    console.log('Route: advanced');
    console.log('Room: Room B');
    console.log('City: Barranquilla');

    console.log('');
    console.log('CODERS');
    console.log('----------------------------------------');

    console.log('');
    console.log('Juan');
    console.log('Email: juan@riwi.io');
    console.log('Password: Coder123');
    console.log('Clan: Clan Alpha');
    console.log('Route: basic');
    console.log('Room: Room A');
    console.log('City: Barranquilla');
    console.log('Address: Carrera 50 #80-90');

    console.log('');
    console.log('Maria');
    console.log('Email: maria@riwi.io');
    console.log('Password: Coder123');
    console.log('Clan: Clan Beta');
    console.log('Route: advanced');
    console.log('Room: Room B');
    console.log('City: Barranquilla');
    console.log('Address: Calle 72 #45-20');

    console.log('');
    console.log('========================================');
    console.log('🎉 SEED FINISHED');
    console.log('========================================');
  } catch (error) {
    console.error('');
    console.error('========================================');
    console.error('❌ SEED FAILED');
    console.error('========================================');

    if (error instanceof Error) {
      console.error('MESSAGE:', error.message);
      console.error('STACK:', error.stack);

      const sequelizeError = error as any;

      if (sequelizeError.errors) {
        console.error('VALIDATION ERRORS:');

        sequelizeError.errors.forEach((err: any) => {
          console.error({
            message: err.message,
            type: err.type,
            path: err.path,
            value: err.value,
            validatorKey: err.validatorKey,
          });
        });
      }
    } else {
      console.error(error);
    }

    process.exitCode = 1;
  } finally {
    await db.close();
  }
};

seed();
