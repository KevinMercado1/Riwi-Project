import bcrypt from 'bcrypt';
import db from '../config/db.js';

import City from '../models/city.js';
import Address from '../models/address.js';
import Clan from '../models/clan.js';
import Coder from '../models/coder.js';
import Identification from '../models/Identification.js';
import Role from '../models/role.js';
import RouteRiwi from '../models/routeRiwi.js';
import TeamLeader from '../models/teamLeader.js';

const seed = async (): Promise<void> => {
  try {
    console.log('========================================');
    console.log('🌱 STARTING SEED');
    console.log('========================================');

    // DATABASE

    console.log('Connecting to database...');

    await db.authenticate();

    console.log('Database connected successfully');

    await db.sync({ alter: true });

    // PASSWORDS

    console.log('Generating password hashes...');

    const adminPassword = await bcrypt.hash('Admin123', 10);
    const coderPassword = await bcrypt.hash('Coder123', 10);

    // CITIES

    console.log('Creating cities...');

    const [barranquilla] = await City.findOrCreate({
      where: {
        name: 'Barranquilla',
      },
      defaults: {
        name: 'Barranquilla',
      },
    });

    const [medellin] = await City.findOrCreate({
      where: {
        name: 'Medellín',
      },
      defaults: {
        name: 'Medellín',
      },
    });

    const [bogota] = await City.findOrCreate({
      where: {
        name: 'Bogotá',
      },
      defaults: {
        name: 'Bogotá',
      },
    });

    const [cali] = await City.findOrCreate({
      where: {
        name: 'Cali',
      },
      defaults: {
        name: 'Cali',
      },
    });

    // ADDRESSES

    console.log('Creating addresses...');

    const [addressBarranquilla] = await Address.findOrCreate({
      where: {
        address: 'Carrera 50 #80-90',
      },
      defaults: {
        address: 'Carrera 50 #80-90',
        cityId: barranquilla.id,
      },
    });

    const [addressMedellin] = await Address.findOrCreate({
      where: {
        address: 'Calle 10 #40-20',
      },
      defaults: {
        address: 'Calle 10 #40-20',
        cityId: medellin.id,
      },
    });

    const [addressBogota] = await Address.findOrCreate({
      where: {
        address: 'Carrera 15 #90-30',
      },
      defaults: {
        address: 'Carrera 15 #90-30',
        cityId: bogota.id,
      },
    });

    const [addressCali] = await Address.findOrCreate({
      where: {
        address: 'Calle 5 #20-10',
      },
      defaults: {
        address: 'Calle 5 #20-10',
        cityId: cali.id,
      },
    });

    // IDENTIFICATIONS

    console.log('Creating identifications...');

    const [identification1] = await Identification.findOrCreate({
      where: {
        number: '1001001001',
      },
      defaults: {
        type: 'nationa_lID',
        number: '1001001001',
      },
    });

    const [identification2] = await Identification.findOrCreate({
      where: {
        number: '1001001002',
      },
      defaults: {
        type: 'nationa_lID',
        number: '1001001002',
      },
    });

    const [identification3] = await Identification.findOrCreate({
      where: {
        number: '1001001003',
      },
      defaults: {
        type: 'nationa_lID',
        number: '1001001003',
      },
    });

    const [identification4] = await Identification.findOrCreate({
      where: {
        number: '1001001004',
      },
      defaults: {
        type: 'nationa_lID',
        number: '1001001004',
      },
    });

    // ROLES

    console.log('Creating roles...');

    const [adminRole] = await Role.findOrCreate({
      where: {
        name: 'admin',
      },
      defaults: {
        name: 'admin',
      },
    });

    const [teamLeaderRole] = await Role.findOrCreate({
      where: {
        name: 'team_leader',
      },
      defaults: {
        name: 'team_leader',
      },
    });

    const [coderRole] = await Role.findOrCreate({
      where: {
        name: 'coder',
      },
      defaults: {
        name: 'coder',
      },
    });

    // CLANS

    console.log('Creating clans...');

    const [clanAlpha] = await Clan.findOrCreate({
      where: {
        name: 'Clan Alpha',
      },
      defaults: {
        name: 'Clan Alpha',
      },
    });

    const [clanBeta] = await Clan.findOrCreate({
      where: {
        name: 'Clan Beta',
      },
      defaults: {
        name: 'Clan Beta',
      },
    });

    const [clanGamma] = await Clan.findOrCreate({
      where: {
        name: 'Clan Gamma',
      },
      defaults: {
        name: 'Clan Gamma',
      },
    });

    // ROUTES

    console.log('Creating Riwi routes...');

    const [basicRoute] = await RouteRiwi.findOrCreate({
      where: {
        name: 'basic',
      },
      defaults: {
        name: 'basic',
      },
    });

    const [advancedRoute] = await RouteRiwi.findOrCreate({
      where: {
        name: 'advanced',
      },
      defaults: {
        name: 'advanced',
      },
    });

    // TEAM LEADERS

    console.log('Creating team leaders...');

    let carlos = await TeamLeader.findOne({
      where: {
        email: 'carlos@riwi.io',
      },
    });

    if (carlos) {
      await carlos.update({
        name: 'Carlos',
        surname: 'Rodriguez',
        numer_telefonu: '3001001001',
        password: adminPassword,
        roleId: teamLeaderRole.id,
        routeRiwiId: basicRoute.id,
        clanId: clanAlpha.id,
      });
    } else {
      carlos = await TeamLeader.create({
        name: 'Carlos',
        surname: 'Rodriguez',
        numer_telefonu: '3001001001',
        email: 'carlos@riwi.io',
        password: adminPassword,
        roleId: teamLeaderRole.id,
        routeRiwiId: basicRoute.id,
        clanId: clanAlpha.id,
      });
    }

    let laura = await TeamLeader.findOne({
      where: {
        email: 'laura@riwi.io',
      },
    });

    if (laura) {
      await laura.update({
        name: 'Laura',
        surname: 'Martinez',
        numer_telefonu: '3001001002',
        password: adminPassword,
        roleId: teamLeaderRole.id,
        routeRiwiId: advancedRoute.id,
        clanId: clanBeta.id,
      });
    } else {
      laura = await TeamLeader.create({
        name: 'Laura',
        surname: 'Martinez',
        numer_telefonu: '3001001002',
        email: 'laura@riwi.io',
        password: adminPassword,
        roleId: teamLeaderRole.id,
        routeRiwiId: advancedRoute.id,
        clanId: clanBeta.id,
      });
    }

    // CODERS

    console.log('Creating coders...');

    let juan = await Coder.findOne({
      where: {
        email: 'juan@riwi.io',
      },
    });

    if (juan) {
      await juan.update({
        name: 'Juan',
        surname: 'Perez',
        numer_telefonu: '3001001003',
        password: coderPassword,
        roleId: coderRole.id,
        identificationId: identification3.id,
        addressId: addressBogota.id,
        clanId: clanAlpha.id,
        routeRiwiId: basicRoute.id,
        teamLeaderId: carlos.id,
      });
    } else {
      juan = await Coder.create({
        name: 'Juan',
        surname: 'Perez',
        numer_telefonu: '3001001003',
        email: 'juan@riwi.io',
        password: coderPassword,
        roleId: coderRole.id,
        identificationId: identification3.id,
        addressId: addressBogota.id,
        clanId: clanAlpha.id,
        routeRiwiId: basicRoute.id,
        teamLeaderId: carlos.id,
      });
    }

    let maria = await Coder.findOne({
      where: {
        email: 'maria@riwi.io',
      },
    });

    if (maria) {
      await maria.update({
        name: 'Maria',
        surname: 'Gomez',
        numer_telefonu: '3001001004',
        password: coderPassword,
        roleId: coderRole.id,
        identificationId: identification4.id,
        addressId: addressCali.id,
        clanId: clanBeta.id,
        routeRiwiId: advancedRoute.id,
        teamLeaderId: laura.id,
      });
    } else {
      maria = await Coder.create({
        name: 'Maria',
        surname: 'Gomez',
        numer_telefonu: '3001001004',
        email: 'maria@riwi.io',
        password: coderPassword,
        roleId: coderRole.id,
        identificationId: identification4.id,
        addressId: addressCali.id,
        clanId: clanBeta.id,
        routeRiwiId: advancedRoute.id,
        teamLeaderId: laura.id,
      });
    }

    // RESULT

    console.log('');
    console.log('========================================');
    console.log('✅ SEED COMPLETED SUCCESSFULLY');
    console.log('========================================');

    console.log('');
    console.log('LOGIN USERS');
    console.log('----------------------------------------');

    console.log('Team Leader:');
    console.log('Email: carlos@riwi.io');
    console.log('Password: Admin123');

    console.log('');

    console.log('Team Leader:');
    console.log('Email: laura@riwi.io');
    console.log('Password: Admin123');

    console.log('');

    console.log('Coder:');
    console.log('Email: juan@riwi.io');
    console.log('Password: Coder123');

    console.log('');

    console.log('Coder:');
    console.log('Email: maria@riwi.io');
    console.log('Password: Coder123');

    console.log('');
    console.log('========================================');
  } catch (error) {
    console.error('');
    console.error('========================================');
    console.error('❌ SEED FAILED');
    console.error('========================================');

    if (error instanceof Error) {
      console.error(error.message);
      console.error(error.stack);
    } else {
      console.error(error);
    }

    process.exitCode = 1;
  } finally {
    await db.close();
  }
};

seed();
