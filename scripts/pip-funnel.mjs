// Owner-only aggregate report. No visitor IDs or conversation text are printed.
import env from '@next/env';
import { MongoClient } from 'mongodb';
env.loadEnvConfig(process.cwd());
const client = new MongoClient(process.env.MONGODB_URI);
try {
  await client.connect();
  const db = client.db(process.env.MONGODB_DATABASE || 'luckyportfolio');
  const match = { expiresAt: { $gt: new Date() } };
  const visits = await db.collection('pip_visits').countDocuments(match);
  const [audience] = await db.collection('pip_visits').aggregate([
    { $match: match }, { $group: { _id: '$visitor', visits: { $sum: 1 } } },
    { $group: { _id: null, browsers: { $sum: 1 }, returningBrowsers: { $sum: { $cond: [{ $gt: ['$visits', 1] }, 1, 0] } } } },
  ]).toArray();
  const [activity] = await db.collection('pip_pages').aggregate([
    { $match: match },
    { $group: { _id: '$visitor', activeSeconds: { $sum: '$activeSeconds' }, pages: { $sum: 1 }, events: { $push: '$events.kind' } } },
    { $set: { events: { $reduce: { input: '$events', initialValue: [], in: { $setUnion: ['$$value', '$$this'] } } } } },
    { $group: { _id: null, averageActiveSeconds: { $avg: '$activeSeconds' }, pageViews: { $sum: '$pages' },
      viewedProjects: { $sum: { $cond: [{ $in: ['project', '$events'] }, 1, 0] } },
      openedDetails: { $sum: { $cond: [{ $in: ['project_details', '$events'] }, 1, 0] } },
      askedQuestions: { $sum: { $cond: [{ $in: ['question', '$events'] }, 1, 0] } },
      openedResume: { $sum: { $cond: [{ $in: ['resume', '$events'] }, 1, 0] } },
      clickedContact: { $sum: { $cond: [{ $in: ['contact', '$events'] }, 1, 0] } },
      acceptedSuggestions: { $sum: { $cond: [{ $in: ['nudge_accepted', '$events'] }, 1, 0] } },
    } },
  ]).toArray();
  const counts = { ...audience };
  const steps = { ...activity };
  delete counts._id;
  delete steps._id;
  console.log(JSON.stringify({ retentionDays: 30, visits, ...counts, ...steps, note: 'Unique-browser engagement counts, not identified people or confirmed leads. Steps can happen in any order.' }, null, 2));
} finally { await client.close(); }
