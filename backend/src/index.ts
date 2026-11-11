import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // 1. Auto-configure public permissions for storefront API consumption
    try {
      const publicRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'public' } });

      if (publicRole) {
        const permissionsToEnable = [
          'api::garment.garment.find',
          'api::garment.garment.findOne',
          'api::collection.collection.find',
          'api::collection.collection.findOne',
          'api::journal-post.journal-post.find',
          'api::journal-post.journal-post.findOne',
          'api::reservation.reservation.create',
        ];

        for (const action of permissionsToEnable) {
          const existing = await strapi
            .query('plugin::users-permissions.permission')
            .findOne({ where: { role: publicRole.id, action } });

          if (!existing) {
            await strapi
              .query('plugin::users-permissions.permission')
              .create({ data: { role: publicRole.id, action } });
          }
        }
      }
    } catch (err) {
      strapi.log.warn('Could not auto-configure public permissions:', err);
    }

    // 2. Auto-seed garments if empty
    try {
      const count = await strapi.documents('api::garment.garment').count({});
      if (count === 0) {
        strapi.log.info('Seeding Cheq fashion catalog into Strapi...');
        const initialLooks = [
          {
            name: 'The Ivory Suit',
            index: 'I',
            slug: 'the-ivory-suit',
            subtitle: 'Single-breasted, peak lapel',
            fabric: 'Italian virgin wool 110',
            origin: 'Biella, Piedmont',
            edition: '32 garments',
            price: 1850,
            alt: 'Model in a structured ivory tailored suit photographed against a stone wall.',
            story:
              'A softened study in authority: an elongated shoulder, a clean waist, and enough ease through the body to let the cloth move rather than hold a pose.',
          },
          {
            name: 'The Onyx Drape',
            index: 'II',
            slug: 'the-onyx-drape',
            subtitle: 'Bias-cut, hand-finished hem',
            fabric: 'Wool crepe, double face',
            origin: 'Como, Lombardy',
            edition: '18 garments',
            price: 1450,
            alt: 'Close detail of draped black wool garment in dramatic chiaroscuro light.',
            story:
              'Cut to fall away from the body, the Onyx Drape relies on weight, bias and a nearly invisible finish instead of surface decoration.',
          },
          {
            name: 'The Oxblood Column',
            index: 'III',
            slug: 'the-oxblood-column',
            subtitle: 'Floor-length, low cowl back',
            fabric: 'Silk satin, garment-dyed',
            origin: 'Como, Lombardy',
            edition: '12 garments',
            price: 2100,
            alt: 'Model in a floor-length oxblood silk gown in a marble interior with classical columns.',
            story:
              'A single uninterrupted line from shoulder to floor. The color is applied after construction so seams and folds carry their own subtle depth.',
          },
          {
            name: 'The Azure Trench',
            index: 'IV',
            slug: 'the-azure-trench',
            subtitle: 'Structured, oversized silhouette',
            fabric: 'Heavyweight cotton gabardine',
            origin: 'Prato, Tuscany',
            edition: '24 garments',
            price: 1650,
            alt: 'Model wearing a structured, oversized azure blue trench coat photographed against a neutral stone background.',
            story:
              'The familiar trench is enlarged, simplified and stripped of unnecessary hardware. Its volume is intentional; the belt decides the silhouette each time it is worn.',
          },
          {
            name: 'The Emerald Silk',
            index: 'V',
            slug: 'the-emerald-silk',
            subtitle: 'Flowing, bias-cut evening dress',
            fabric: 'Pure silk charmeuse',
            origin: 'Como, Lombardy',
            edition: '10 garments',
            price: 2400,
            alt: 'Model wearing a flowing emerald green silk dress with dramatic chiaroscuro lighting.',
            story:
              'A dress designed around light rather than ornament. Every panel is placed to let the charmeuse shift between shadow and reflection as the wearer moves.',
          },
          {
            name: 'The Charcoal Knit',
            index: 'VI',
            slug: 'the-charcoal-knit',
            subtitle: 'Chunky, oversized proportions',
            fabric: 'Cashmere & alpaca blend',
            origin: 'Perugia, Umbria',
            edition: '20 garments',
            price: 1250,
            alt: 'Model in a chunky charcoal knit sweater.',
            story:
              'A tactile winter essential woven with loose, comforting proportions that drape effortlessly.',
          },
        ];

        for (const look of initialLooks) {
          const entry = await strapi.documents('api::garment.garment').create({
            data: look,
          });
          if (entry && entry.documentId) {
            await strapi.documents('api::garment.garment').publish({
              documentId: entry.documentId,
            });
          }
        }
        strapi.log.info('Seeded and published 6 looks into Strapi successfully!');
      }
    } catch (err) {
      strapi.log.warn('Could not auto-seed garments:', err);
    }

    // 3. Auto-seed demo administrator if none exists
    try {
      const hasAdmin = await strapi.service('admin::user').exists();
      if (!hasAdmin) {
        const superAdminRole = await strapi.service('admin::role').getSuperAdmin();
        await strapi.service('admin::user').create({
          email: 'admin@cheq.atelier',
          firstname: 'Cheq',
          lastname: 'Admin',
          password: 'AdminCheq2026!',
          isActive: true,
          roles: [superAdminRole.id],
        });
        strapi.log.info('Demo admin ready: admin@cheq.atelier / AdminCheq2026!');
      }
    } catch (err) {
      strapi.log.warn('Could not auto-create admin user:', err);
    }
  },
};
