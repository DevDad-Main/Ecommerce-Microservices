// queues/GenericQueue.ts
import { Queue, Job, JobsOptions, QueueOptions } from "bullmq";
import { connection } from "./client";

export class GenericQueue<
  TData = any,
  TReturn = any,
  TName extends string = string,
> {
  private static instances = new Map<string, GenericQueue<any, any, any>>();

  private constructor(
    private readonly queueName: string,
    private readonly queue: Queue<TData, TReturn, TName>,
  ) {}

  static getQueue<TData = any, TReturn = any, TName extends string = string>(
    queueName: string,
    options: Omit<QueueOptions, "connection"> & {
      defaultJobOptions?: QueueOptions["defaultJobOptions"];
    } = {},
  ): GenericQueue<TData, TReturn, TName> {
    if (!this.instances.has(queueName)) {
      const queue = new Queue<TData, TReturn, TName>(queueName, {
        connection,
        defaultJobOptions: {
          attempts: 3,
          backoff: { type: "exponential", delay: 5000 },
          removeOnComplete: true,
          removeOnFail: false,
          ...options.defaultJobOptions,
        },
        ...options,
      });

      this.instances.set(queueName, new GenericQueue(queueName, queue) as any);
    }

    return this.instances.get(queueName) as GenericQueue<TData, TReturn, TName>;
  }

  async add(
    name: TName,
    data: TData,
    opts?: JobsOptions,
  ): Promise<Job<TData, TReturn, TName>> {
    // This cast fixes the type inference issue while remaining safe
    return (this.queue.add as any)(name, data, {
      jobId:
        "id" in (data as any) && (data as any).id
          ? `${name}:${(data as any).id}`
          : undefined,
      ...opts,
    });
  }

  // Optional helpers
  get rawQueue() {
    return this.queue;
  }

  async close() {
    await this.queue.close();
    GenericQueue.instances.delete(this.queueName);
  }
}

export default GenericQueue;
