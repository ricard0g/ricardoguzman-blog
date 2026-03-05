---
layout: "../../layouts/PostLayout.astro"
slug: "processes-threads-concurrency-mental-model"
title: "Processes, Threads, and Concurrency: The Mental Model That Actually Holds Up"
pubDateString: "2026, March 3rd"
pubDate: 2026-03-03
tags: ["OS", "Concurrency", "Threads", "Systems", "Computer Science"]
author: "Ricardo Guzman"
image: "https://images.pexels.com/photos/30037373/pexels-photo-30037373.jpeg"
description: "Process, thread, task, concurrency, parallelism - these words get thrown around constantly. Here's the clean mental model that makes all of them click."
---

Most developers have a rough idea of what a process or a thread is. Rough enough to get by, at least.

But "getting by" means you'll hit a wall the moment you need to debug a race condition, understand why your server is choking under load, or explain to someone why async doesn't mean parallel.

So let's build the model properly.

## The Hierarchy, Cleanly

These concepts live at different layers. Mixing them up is where the confusion starts.

### Program

A **program** is just code sitting on disk. A `.jar` file, an executable binary, a Python script. It's not doing anything. It's not running. It's a blueprint.

### Process

A **process** is what happens when you actually run that program. The OS loads it, sets up an isolated environment for it, and hands it the resources it needs:

- Its own **virtual address space** (it thinks it owns all the memory)
- Open files, sockets, handles
- Security and execution context
- At least one thread

The key insight: a process is a **container and isolation boundary**. It's not the thing the CPU directly runs. It's the environment where execution happens.

### Thread

A **thread** is the actual unit of execution inside a process. Threads in the same process share the same memory space and code, but each one has its own:

- Instruction pointer (where it is in the code)
- Register state
- Stack

> The CPU executes **threads**, not processes. When we say "a process is running," we mean one or more of its threads are running on a CPU core.

This is the most important distinction in this entire post. Everything else builds on it.

### Task

A **task** is not an OS primitive. It's a unit of work - something you want to get done:

- Handle an incoming HTTP request
- Download a file
- Sort a chunk of an array
- Process a message from a queue

A task might be executed by one thread, split across several, or managed by an async runtime without a dedicated OS thread at all. It's a higher-level concept.

The clean mental model:

- **Process** = container
- **Thread** = execution path
- **Task** = work to be done

## The House Analogy

This clicked for me:

- **Program** = blueprint of a house
- **Process** = the house built from that blueprint
- **Threads** = people moving through the house, doing things
- **Tasks** = the chores those people are doing

The house doesn't "do" anything by itself. The people inside it do. And the chores are what actually needs to get done.

## What the CPU Does vs. What the OS Does

People often blur these two together. They're doing very different things.

### The CPU

The CPU fetches instructions, decodes them, and executes them. That's it. It's the engine.

What it does **not** do is decide which process or thread should run next. It just executes whatever it's been given.

### The OS

The OS is the manager. It:

- Creates and destroys processes and threads
- Tracks their state (running, waiting, blocked, runnable)
- Manages virtual memory and resources
- Performs context switches
- Schedules runnable threads onto CPU cores

> The CPU executes instructions. The OS decides **whose instructions**.

One thing worth clarifying: the OS runs on the CPU too.

When your program makes a system call - opens a file, creates a thread, allocates memory - execution switches from your user-space code into kernel code.

The OS isn't floating above the CPU. The CPU is executing OS kernel code just like it executes your application code.

## What Actually Happens When You Open a Program

1. The OS loads the program from disk and creates a **process**
2. That process gets its own virtual address space, resources, and handles
3. The process starts with at least one **thread** - the initial thread
4. The CPU begins executing that thread
5. The running thread can request more memory, files, network connections, or more threads
6. Any new threads become **runnable**
7. The OS scheduler picks which runnable thread gets CPU time next

Notice step 7.

The program doesn't command the CPU: "run this thread right now".

It creates a thread, the thread becomes runnable, and then the scheduler decides when it actually gets to run.

That distinction matters a lot when you're debugging scheduling or latency issues.

## Can Only the Main Thread Create More Threads?

In practice, yes - the main thread usually creates the others. But it's not a rule.

Any running thread can request the creation of additional threads. It depends on how the program is designed.

You might have a thread pool manager that spins up workers, or a worker thread that spawns subtasks. The OS doesn't care which thread made the request.

## Context Switching

On a single CPU core, only one thread can run at a time. But the OS can run dozens of threads "at the same time" from the user's perspective - by rapidly switching between them.

When the OS stops one thread and starts another, it performs a **context switch**:

1. Saves the current thread's state: registers, instruction pointer, stack pointer
2. Loads the state of the next thread
3. The CPU resumes the new thread as if it never stopped

This is what makes single-core concurrency possible. The threads aren't actually running simultaneously - they're taking very fast turns.

## Concurrency vs. Parallelism

These two are not the same thing, and conflating them will eventually get you into trouble.

### Concurrency

> Multiple units of work are **making progress during the same period of time**.

This does not require multiple cores. On a single core, threads A and B are concurrent if the OS switches between them - both make progress over time, even though only one is running at any given instant.

### Parallelism

> Multiple things are **literally executing at the same instant**.

This requires multiple hardware execution units - multiple CPU cores, or similar. Only then can thread A and thread B both be running at the exact same moment.

| | Single Core | Multiple Cores |
|---|---|---|
| Concurrency | ✅ (via context switching) | ✅ |
| Parallelism | ❌ | ✅ |

Concurrency is about **structure** - how you organize work. Parallelism is about **execution** - whether things literally happen at the same time.

And concurrency is broader than you might think. It's not just "one process with many threads." It includes:

- Multiple threads in one process
- Multiple separate processes
- Async tasks and event loops
- Coroutines
- Green threads / goroutines

## Async Is Concurrency Without Extra Threads

Thread-based concurrency is the most common mental model, but it's not the only one.

In async/coroutine-based concurrency, a single thread can manage many tasks. The trick is that tasks yield when they're waiting for something:

- Task A starts a network request → yields
- Task B runs
- Task A's data arrives → Task A resumes

No extra OS threads needed. The single thread is doing multiple things *over time* - which is still concurrency, just not the kind that comes from `new Thread()`.

This is why frameworks like Node.js, Python's asyncio, or Kotlin coroutines can handle thousands of concurrent requests without spawning thousands of threads. A task is a higher-level concept than a thread. Not every task needs its own OS thread.

## Process vs. Thread: The Practical Trade-off

| | Process | Thread |
|---|---|---|
| Memory space | Isolated | Shared with other threads |
| Fault isolation | Strong (crash doesn't take others down) | Weak (a crash can kill the whole process) |
| Creation cost | Higher | Lower |
| Communication | IPC (sockets, pipes, shared memory) | Direct shared memory |
| Risk | Safer | Race conditions, deadlocks |

Use processes when isolation matters. Use threads when you need performance and are willing to manage shared state carefully.

## A Concrete Example: Web Server

A web server makes this concrete:

- 1 **program** on disk
- 1 running **process**
- 8 worker **threads**
- 10,000 incoming **requests** (tasks)

On a 4-core machine, 4 threads are literally running in parallel at any instant. The other 4 are waiting for their turn. The 10,000 requests get distributed across threads - some waiting, some being processed, some already done.

- Process = the environment the server lives in
- Threads = the workers handling requests
- Requests = the tasks

## The Model in One Line

> A **process** owns resources, a **thread** executes instructions, a **task** is the work being done, the **OS scheduler** chooses which runnable thread gets CPU time, and the **CPU executes that thread**.

Internalize this and a lot of things that felt vague - concurrency bugs, async behavior, multi-core scaling - will start making a lot more sense.

Now go write something concurrent.
