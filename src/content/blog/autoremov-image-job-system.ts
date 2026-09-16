import type { BlogPost } from "@/lib/blog";

export const autoremovImageJobSystem: BlogPost = {
  slug: "autoremov-image-job-system",
  title: "A background remover is mostly a job system",
  subtitle:
    "AutoRemov needed presigned uploads, credits, durable processing jobs, object storage, a Python engine, refunds, tests, and a careful data migration path.",
  excerpt:
    "The user uploads an image and waits. The backend has to make that wait durable.",
  project: "AutoRemov",
  date: "2026-07-08",
  readTime: "9 min",
  tags: ["Backend", "Operations"],
  sections: [
    {
      heading: "The browser should not carry the job",
      paragraphs: [
        "Background removal can take time. The image can be large. The tab can close. The worker can retry. The result may be downloaded later. So the backend has to treat processing as a durable job, with Postgres holding state and object storage holding files.",
    "The flow was direct-to-storage upload, job creation, credit handling, pg-boss queueing, worker processing, engine call, result upload, status polling, and a clear failure path.",
      ],
      diagram: {
        title: "AutoRemov job flow",
        code: `flowchart LR
  Browser[Browser] --> Presign[Presign upload]
  Presign --> S3[(Object storage)]
  Browser --> Job[Create job]
  Job --> Credit[Debit credit]
  Job --> Queue[pg-boss]
  Queue --> Worker[Worker]
  Worker --> Engine[Python engine]
  Engine --> Result[Processed image]
  Result --> S3
  Worker --> Refund[Refund if final failure]`,
      },
    },
    {
      heading: "The small correctness details",
      paragraphs: [
        "The upload route validates file types and sanitizes names. The job route validates object keys. The worker records state changes in the database, downloads the original, calls the engine, uploads the processed file, and follows a deliberate failure path when retries are exhausted. Result routes check ownership.",
        "A tool like this feels simple when everything works. The backend earns its keep when something fails halfway through.",
      ],
    },
    {
      heading: "Migration was part of the work",
      paragraphs: [
        "The rebuild also needed old MySQL data to land in Postgres. I used deterministic IDs, idempotent upserts, dry runs, opening credit ledger entries, and dependency-ordered steps. Users, plans, orders, payments, images, and enquiries could move without touching the live old database during rehearsal.",
      ],
    },
    {
      heading: "The credit edge case",
      paragraphs: [
        "The job path couples credit handling, queueing, and processing state closely enough that a failure has a clear place to be handled. The credit ledger is the source of truth for that conversation.",
        "A paid image tool cannot leave users guessing whether a timeout cost them a credit. The backend needs explicit state, a visible result, and a recovery path instead of a vague spinner.",
      ],
    },
    {
      heading: "Why direct upload mattered",
      paragraphs: [
        "The browser uploads the original image straight to object storage through a presigned URL. The API validates content type, sanitizes the filename, returns an object key under originals, and stays out of the image-byte path.",
        "That keeps the API focused on state and permission. Storage handles bytes. The worker later downloads from storage, calls the Python engine, uploads the processed result, and updates the database.",
      ],
    },
    {
      heading: "The migration shape",
      paragraphs: [
        "The MySQL-to-Postgres migration used a legacy dump loaded into disposable local MySQL. The live old database did not need to be touched during rehearsal. Transforms normalized emails, dates, amounts, image dimensions, statuses, and IDs. Deterministic UUIDs made repeated dry runs comparable.",
        "The opening credit ledger entries were important. Copying a balance is easy. Explaining where the balance came from is what keeps the new billing model auditable.",
      ],
    },
  ],
};
