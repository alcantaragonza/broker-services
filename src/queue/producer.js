const { Queue } = require('bullmq');
const redis = require('../config/redis');

const mutationQueue = new Queue('mutations', { connection: redis });

const enqueue = async (jobData) => {
  const job = await mutationQueue.add('forward', jobData, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: 100,
    removeOnFail: 200
  });
  return job.id;
};

module.exports = { enqueue, mutationQueue };