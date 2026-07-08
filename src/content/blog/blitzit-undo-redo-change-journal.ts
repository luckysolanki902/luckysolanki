import type { BlogPost } from "@/lib/blog";

export const blitzitUndoRedoChangeJournal: BlogPost = {
  slug: "blitzit-undo-redo-change-journal",
  title: "Undo Is the Real AI Feature: Building a Git for Tasks",
  subtitle:
    "How I gave an AI write access to people's task lists, then built the change journal that made it safe. Commits, reversible diffs, content hashes, a movable HEAD, and the strange question of what undo means when three actors edit the same data.",
  excerpt:
    "Blitzy can move tasks, reorder boards, create follow-ups, and delete stale work. The feature that made that safe was a small Git-like history for tasks.",
  project: "Blitzit",
  date: "2026-07-08",
  readTime: "18 min",
  tags: ["Backend", "Architecture"],
  featured: true,
  sections: [
    {
      heading: "A note on how the app is shaped",
      paragraphs: [
        "Thirty seconds of domain context, because the whole story hangs on it.",
        "In Blitzit you have lists. Work, Personal, Reading, whatever the user creates. Every list has exactly four boards: Backlog, This Week, Today, and Done. A task belongs to a list, sits on one of those four boards, and holds a fractional position that decides its order inside that board. Tasks carry the usual payload too: title, notes, subtasks, schedule, tags, an estimate.",
        "So prioritizing is not some vague assistant action. It means moving tasks between those four boards and reordering them inside a board. Promote the urgent thing to Today. Push the stale thing back to Backlog. Move a blocker to the top. Keep that picture in your head: lists, four boards each, tasks hopping between them.",
      ],
    },
    {
      heading: "The ten seconds that started this",
      paragraphs: [
        "Someone opened Blitzit, looked at a messy list, and typed the most natural request in the world.",
      ],
      quote: "Prioritize my list.",
    },
    {
      heading: "Then the follow-up came",
      paragraphs: [
        "Blitzy did exactly what it was built to do. It promoted urgent tasks to Today, put blocking work near the top, sent stale items back to Backlog, renamed a couple of unclear tasks, and created two follow-ups. The list went from noise to a plan in one turn.",
        "For about ten seconds it felt perfect. Then the user dragged two tasks back to where they had been, sat there for a moment, and asked the question every builder secretly dreads.",
      ],
      quote: "Can I get the old order back?",
    },
    {
      heading: "That sentence changed the feature",
      paragraphs: [
        "That one sentence quietly demolished every easy answer I had. Undo, done properly, is a data model. Once an AI, a public MCP server, API clients, and the human can all mutate the same records, the naive versions of undo do more harm than good.",
        "I stopped thinking about an undo button and started thinking about a tiny Git for tasks: a per-user change journal where every meaningful action is a reversible commit, and undo/redo is basically moving a HEAD along history.",
      ],
    },
    {
      heading: "The obvious answers broke quickly",
      paragraphs: [
        "The first idea was snapshots. Take a picture of the list before a change, restore it when the user asks. It sounds fine until the list keeps moving. Between Blitzy's change and the undo request, the human may have dragged two tasks somewhere else. Restoring the snapshot would silently erase those newer edits. Undo becomes a data-loss button. Snapshotting a 300-task list every time something changes is also ugly.",
        "A per-field stack has the same problem from another angle. Text editors get away with that because there is one actor and usually one document. Blitzit has the human, Blitzy, MCP/API clients, sync workers, and integrations all touching shared task state. A per-field stack has no idea that one AI turn was one intention.",
        "Logging every change and replaying it backward gets closer. Then you hit the real trap. If replay blindly writes old values over current values, it still destroys newer work. Reversal has to be conditional. It has to notice when the world moved on.",
      ],
    },
    {
      heading: "The mental model",
      paragraphs: [
        "The live Task and List documents are the working tree. A separate change journal is the history. Undo and redo move a per-user HEAD through that history and re-materialize the working tree from reversible diffs.",
        "If you have used Git, the shape is familiar. Current documents hold the present. Commits explain how the present got there.",
      ],
      table: {
        headers: ["Git", "Blitzit history"],
        rows: [
          ["Working tree", "Live Task and List documents in MongoDB"],
          ["Commit", "One ChangeCommit, representing one logical action"],
          ["Diff / patch", "One ChangeOp, reversible against one entity"],
          ["HEAD", "Implicit position between active and undone commits"],
          ["Reset backward", "Undo"],
          ["Move forward again", "Redo"],
          ["Branch edge", "parentId on each commit"],
        ],
      },
      diagram: {
        title: "Working tree and history",
        code: `flowchart LR
  subgraph WT["Working tree: live data"]
    T["Task / List documents in MongoDB"]
  end
  subgraph HIST["History: change journal"]
    C1["commit seq:1 active"]
    C2["commit seq:2 active"]
    C3["commit seq:3 active HEAD"]
    C1 --> C2 --> C3
  end
  C3 -->|undo: apply ops in reverse| WT
  T -. "current state came from" .-> HIST`,
      },
    },
    {
      heading: "The data model",
      paragraphs: [
        "Two shapes carry the system. A commit is one logical action by one actor. An op is one reversible change to one entity.",
      ],
      codeBlock: {
        title: "ChangeCommit",
        language: "ts",
        code: `ChangeCommit {
  ownerId
  seq
  parentId
  status      // active | undone
  source      // human:<id> | blitzy_ai | mcp | api:<client>
  origin      // deviceId, requestId, conversationId, messageId
  message
  ops[]
}`,
      },
    },
    {
      heading: "The op shape",
      paragraphs: [
        "A board move and a reorder are update operations. They change a task's board and position fields. The journal does not need a special move concept for that.",
      ],
      codeBlock: {
        title: "ChangeOp",
        language: "ts",
        code: `ChangeOp {
  entity       // task | list
  entityId
  kind         // create | update | delete
  delta        // reversible diff for updates
  fullSnapshot // create/delete side
  beforeHash
  afterHash
}`,
      },
    },
    {
      heading: "The HEAD is implicit",
      paragraphs: [
        "A commit with status active is applied and undoable. A commit with status undone has been reverted and can be redone. Undo takes the newest active commit, applies the inverse of its ops, and flips it to undone. Redo takes the oldest undone commit, applies ops forward, and flips it back to active.",
        "That simple rule does most of the work. The rest of the system exists to make it safe under real product behavior.",
      ],
    },
    {
      heading: "Reversible by construction",
      paragraphs: [
        "For updates, the journal stores a structural reversible delta. I used jsondiffpatch with an object hash so array members like subtasks diff by id. Position changes stop confusing the patch. Redo patches the current snapshot with the delta. Undo unpatches it.",
        "Create and delete carry full snapshots because there is no other side to diff against. Undoing a create soft-deletes the entity. Undoing a delete restores the saved snapshot and clears deletedAt.",
        "Snapshots are captured through pure functions that choose a stable subset of fields: title, board, position, schedule, subtasks, tags, deletedAt, revision, and the fields the product actually cares about. Stable matters because the hash depends on it.",
      ],
    },
    {
      heading: "One action becomes one commit",
      paragraphs: [
        "If Blitzy moves twenty tasks across boards in one turn, the user should undo one action. They should not press undo twenty times.",
        "I used AsyncLocalStorage for that. Entry points wrap work in withCommitSession: one human REST request, one Blitzy turn, one MCP tool call. Inside that scope, every mutation calls journalChange and appends its op to the same in-flight commit. When the scope finishes, the commit is recorded once.",
        "The capture happens down in the service layer. Humans, Blitzy, MCP tools, and API clients all funnel through the same task and list mutations. Nobody gets a private undo path.",
      ],
      diagram: {
        title: "One Blitzy turn as one commit",
        code: `flowchart TD
  subgraph Turn["One Blitzy turn"]
    A["rename task"] --> J["journalChange"]
    B["move 6 tasks to Today"] --> J
    C["bump task to top"] --> J
    D["create follow-up"] --> J
    E["delete stale task"] --> J
  end
  J --> CMT["one ChangeCommit: source blitzy_ai, ops[]"]
  CMT --> U["one undo reverses every op in reverse order"]`,
      },
    },
    {
      heading: "One shared history",
      paragraphs: [
        "Every source writes to the same journal. Undo means undo the last change in the user's history. It does not mean undo only my changes.",
        "The human can undo Blitzy's prioritization. Blitzy can call undo through its own tool. MCP edits sit in the same ordered stream. Each commit still carries source attribution, so the system knows where it came from. The history itself stays shared.",
        "That is the part that made AI write access feel acceptable. The assistant can act directly because the human owns a single history that can move backward.",
      ],
    },
    {
      heading: "The crux was a content hash",
      paragraphs: [
        "Here is the dangerous case. Blitzy renames a task from A to B. Then the human edits or moves the same task. Then the user hits undo. If undo blindly writes A back over the current task, it can erase the human's newer edit.",
        "A revision counter looks tempting as a guard. It caused trouble. Undo and redo legitimately bump revisions as they write. If revision is the guard, undoing one commit can make another valid undo look unsafe. I hit that in cross-source tests.",
        "The guard that worked compares content. Each op stores beforeHash and afterHash. The hash is computed from the stable snapshot with the revision removed. Before undo applies, the engine re-hashes the current entity and checks whether it still matches the state this commit left behind.",
      ],
      diagram: {
        title: "Content guard before replay",
        code: `flowchart TD
  U["Undo op on task T"] --> H["Hash current content, excluding _rev"]
  H --> Q{"current hash matches afterHash?"}
  Q -->|yes| APPLY["apply inverse, bump _rev, save"]
  Q -->|no| SKIP["skip and report conflict"]
  APPLY --> SSE["change stream / SSE updates every device"]`,
      },
    },
    {
      heading: "How the headline scenario resolves",
      paragraphs: [
        "If the human change went through the app, it became a commit on top of Blitzy's commit. The first undo reverts the human move. Now the task content matches Blitzy's afterHash, so the second undo can reverse Blitzy's rename. Newest change unwinds first.",
        "If the human change was out-of-band, there is no commit to unwind first. Undoing Blitzy's commit sees that the current content no longer matches afterHash, skips that op, and keeps the newer value.",
        "The rule is plain: undo reverses in reverse chronological order, and only when the entity still looks like the commit left it.",
      ],
    },
    {
      heading: "The algorithm",
      paragraphs: [
        "Undo finds the newest active commit for the user. It applies ops in reverse order inside a replay-suppression scope so the replay writes are not journaled again. Each applied op bumps the entity revision, saves, and emits the usual domain events. Then the commit flips to undone.",
        "Redo finds the oldest undone commit. It applies ops forward and flips the commit back to active.",
        "The suppression detail matters. Undo writes to the database, and database writes normally journal. Without a withoutJournaling scope, undo would create new commits that would need undoing too.",
      ],
    },
    {
      heading: "The edge cases",
      paragraphs: [
        "A new edit after undo truncates the redo tail. That is the behavior people expect from editors. Undo three actions, make a fresh change, and the old redo path disappears.",
        "In-progress text edits stay local to the input. The journal records saved mutations. If a field is focused, Cmd+Z belongs to the browser input. When the field saves, it becomes a commit.",
        "Partial application is allowed. If five ops can safely replay and two conflict, the five apply and the skipped ops are reported. A partial undo is better than a silent overwrite.",
        "Deleting a list journals the list delete plus delete ops for the tasks it cascaded through. One undo brings the list and those tasks back together.",
      ],
    },
    {
      heading: "Retention",
      paragraphs: [
        "This is an undo buffer, not a permanent audit log. Commits expire after seven days. There is also a cap of 200 commits per user. The cap is per user because undo is a global stack. One Blitzy turn can touch several lists, so a per-list history would tear holes in the sequence.",
      ],
    },
    {
      heading: "Journaling is a passenger",
      paragraphs: [
        "The journal must never be the reason a task edit fails. If journal recording breaks, the product mutation should still succeed. record() can no-op in disconnected test modes. journalChange catches failures. Pruning old commits is best effort.",
        "Undo protects the data. It does not get to put the data at risk to save itself.",
      ],
    },
    {
      heading: "The payoff",
      paragraphs: [
        "Before this, direct AI changes felt scary enough to push every meaningful action through confirmation. Draft, ask, approve, apply. That slows the assistant down and makes it feel weaker than it should.",
        "Once the journal existed, Blitzy could act directly. Move tasks, reorder a board, rename, create, delete. Every turn becomes one reversible commit. The user can press undo or simply ask Blitzy to put it back.",
        "Sometimes the feature that makes AI usable is a small, deeply-engineered button. In Blitzit, trust came from the history layer behind undo.",
      ],
    },
    {
      heading: "Where it stops for now",
      bullets: [
        "The history is bounded: seven days and 200 actions.",
        "Text diffs are currently atomic. Word-level note history can come later.",
        "The model has a parentId edge. Real branching is still future product work.",
        "Undo runs on the server and streams back to clients. Offline-first replay is a future chapter.",
      ],
    },
    {
      heading: "The whole thing on one page",
      diagram: {
        title: "Shared history, guarded replay",
        code: `flowchart TD
  subgraph Sources["One shared history"]
    H["Human request"]
    B["Blitzy turn"]
    M["MCP / API call"]
  end
  H --> S["withCommitSession"]
  B --> S
  M --> S
  S --> J["journalChange per mutation"]
  J --> O1["update: reversible delta"]
  J --> O2["move/reorder: delta"]
  J --> O3["create/delete: snapshot"]
  O1 --> C["ChangeCommit: ops, hashes, seq, parentId, source"]
  O2 --> C
  O3 --> C
  C --> HEAD["active / undone HEAD"]
  HEAD -->|undo| REV["apply ops in reverse"]
  HEAD -->|redo| FWD["apply ops forward"]
  REV --> G{"content hash matches?"}
  FWD --> G
  G -->|yes| APPLY["save + emit events"]
  G -->|no| SKIP["skip conflict, keep newer work"]`,
      },
    },
    {
      heading: "The idea I would keep",
      paragraphs: [
        "When many actors share one dataset, undo is a version-control problem wearing a button's clothes. Model it as commits over reversible diffs with a movable HEAD. Guard replay on content, not revision counters. The scary parts start looking familiar.",
      ],
    },
  ],
};
