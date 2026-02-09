---
layout: "../../layouts/PostLayout.astro"
slug: "maven-cli-essentials-for-java-developers"
title: "Maven CLI Essentials for Java Developers"
pubDateString: "2026, February 9th"
pubDate: 2026-02-09
tags: ["Maven", "Java", "CLI", "Build Tools"]
author: "Ricardo Guzman"
image: "https://images.pexels.com/photos/30313739/pexels-photo-30313739.jpeg"
description: "A practical guide to Maven CLI commands covering the 90% you'll actually use in day-to-day Java development. No fluff, just the essentials."
---

I've been working with Maven for a while now, and honestly, the official docs can feel overwhelming when you just want to build your project and move on.

This guide covers the Maven commands I use **90% of the time** in real development work. I won't pretend to cover every single Maven feature, but I'll show you what actually matters for daily Java development.

If you're looking for a comprehensive reference, this isn't it. But if you want to get productive with Maven quickly, you're in the right place.

## Understanding Maven's Build Lifecycle

Maven organizes builds into **lifecycles**, and each lifecycle has multiple **phases** that run in sequence.

The key thing to understand: 
> *When you run a phase, Maven executes all preceding phases automatically.*

### Default Lifecycle (The One You'll Use Most)

These phases run in order, each building on the previous one:

- **validate**: Checks your project structure is valid
- **compile**: Compiles source code from `src/main/java`
- **test**: Runs unit tests (JUnit, TestNG, etc.)
- **package**: Creates your JAR or WAR file in the `target` directory
- **verify**: Runs integration tests and quality checks
- **install**: Copies the artifact to your local Maven repo (`~/.m2/repository`) so other local projects can use it
- **deploy**: Pushes the artifact to a remote repository for team sharing

### Clean Lifecycle

- **clean**: Deletes the `target` directory, wiping out all compiled classes and artifacts

This is independent from the default lifecycle, which is why you often see `mvn clean install` as a combined command.

## Essential Commands for Daily Development

These are the commands I run constantly. Master these and you're 90% of the way there.

### Basic Build Commands

```bash
# Delete the target directory
mvn clean

# Compile source code only
mvn compile

# Compile and run tests
mvn test

# Compile, test, and create JAR/WAR
mvn package

# Package and install to local repo
mvn install

# Clean build + install (the classic)
mvn clean install

# Deploy artifact to remote repository
mvn deploy

# Run integration tests
mvn verify
```

Remember: each command runs all previous lifecycle phases. So `mvn package` automatically runs `validate`, `compile`, and `test` first.

## Creating New Maven Projects

Maven uses **archetypes** as project templates. Think of them as scaffolding generators for different types of Java projects.

### Interactive Mode

```bash
# Browse and select from 1000+ archetypes
mvn archetype:generate
```

### Common Project Templates

```bash
# Simple Java project with JUnit
mvn archetype:generate \
  -DgroupId=com.example \
  -DartifactId=my-app \
  -DarchetypeArtifactId=maven-archetype-quickstart \
  -DinteractiveMode=false

# Java web application with WEB-INF structure
mvn archetype:generate \
  -DgroupId=com.example \
  -DartifactId=my-webapp \
  -DarchetypeArtifactId=maven-archetype-webapp \
  -DinteractiveMode=false
```

The most common archetypes you'll use:

- **maven-archetype-quickstart**: Basic Java app with JUnit
- **maven-archetype-webapp**: Web application with servlet structure
- **maven-archetype-j2ee-simple**: Simple J2EE project setup

## Managing Dependencies

These commands help you understand and debug your project's dependencies.

```bash
# Display dependency hierarchy tree
mvn dependency:tree

# Include all transitive dependencies (verbose)
mvn dependency:tree -Dverbose

# Find unused or undeclared dependencies
mvn dependency:analyze

# Print the full runtime classpath
mvn dependency:build-classpath
```

The `dependency:analyze` command is incredibly useful for cleaning up your `pom.xml` and reducing build size. It shows you dependencies you declared but don't use, and dependencies you use but forgot to declare.

## Command-Line Flags You'll Actually Use

### Skip Tests (Because Sometimes You Need Speed)

```bash
# Compile tests but don't run them
mvn install -DskipTests

# Skip test compilation and execution entirely
mvn install -Dmaven.test.skip=true
```

> **NOTE**: Use `-DskipTests` during active development when you know tests pass. Use `-Dmaven.test.skip=true` only when you're absolutely certain or troubleshooting.

### Performance and Debugging Flags

```bash
# Offline mode (only use local repository)
mvn -o package

# Quiet mode (errors only)
mvn -q package

# Debug mode (verbose output for troubleshooting)
mvn -X package

# Show version and continue
mvn -V package

# Parallel builds with 4 threads (great for multi-module projects)
mvn -T 4 clean install

# Build from a different directory
mvn -f path/to/pom.xml package

# Force update snapshots and releases
mvn -U clean install

# Batch mode (non-interactive, no color - good for CI/CD)
mvn -B clean install
```

### System Properties with -D

The `-D` flag sets system properties that modify Maven's behavior.

```bash
# Set custom property for your project
mvn package -Dmy.property=value

# Override Java compiler version
mvn compile -Dmaven.compiler.source=17 -Dmaven.compiler.target=17
```

## Plugin Goals vs Lifecycle Phases

Maven has **phases** (part of lifecycles) and **plugin goals** (specific tasks).

You can run plugin goals directly without triggering the full lifecycle:

```bash
# Run compiler plugin directly
mvn compiler:compile

# Compile only test classes
mvn compiler:testCompile

# Run tests using Surefire plugin
mvn surefire:test

# Generate project documentation site
mvn site:site
```

This is useful when you want surgical control over exactly what runs.

## Command Combinations I Use Daily

These are real commands I run multiple times every day:

```bash
# Clean build without running tests (fast iteration)
mvn clean install -DskipTests

# Quick offline build (no network calls)
mvn -o clean package

# Debug a failing build with full output
mvn -X clean install

# Multi-threaded build for big projects
mvn -T 4 clean install

# Force update all dependencies and build
mvn -U clean install

# Production deployment without tests
mvn clean deploy -Dmaven.test.skip=true
```

## Understanding Build Output

When you run `mvn package`, Maven executes phases in this order:

1. **validate** → checks project structure
2. **compile** → compiles source code
3. **test** → runs unit tests
4. **package** → creates JAR/WAR

If any phase fails, the entire build stops. Your final artifact lands in `target/` with the format `{artifactId}-{version}.jar`.

## Running Your Java Application

Here's the section copy you can add to your blog post:

## Running Your Java Application

Once you've built your project, you'll want to actually run it. This is the command I use constantly during development:

```bash
mvn exec:java -Dexec.mainClass=com.yourpackage.YourApp
```

Let's break down what each part does:

- **mvn exec:java**: This calls the `exec-maven-plugin` and runs the `java` goal, which executes a Java class in the same JVM as Maven
- **-Dexec.mainClass**: This is a system property that tells the exec plugin which class contains your `main()` method
- **com.yourpackage.YourApp**: Replace this with the fully qualified name of your main class (package + class name)

### Quick Example

If your project structure looks like this:

```
src/main/java/
└── com/
    └── example/
        └── App.java
```

And your `App.java` has a `main` method, you'd run:

```bash
mvn exec:java -Dexec.mainClass=com.example.App
```

> **NOTE**: You don't need to run `mvn compile` first. The `exec:java` goal will automatically compile your code if needed.

### Passing Arguments to Your Application

You can pass command-line arguments to your application using `-Dexec.args`:

```bash
mvn exec:java -Dexec.mainClass=com.example.App -Dexec.args="arg1 arg2 arg3"
```

This is incredibly useful for testing CLI applications without creating a JAR file every time.

## Practical Tips for Real Development

Here's what I've learned from daily Maven usage:

- Run `mvn clean install` before committing code to catch integration issues early
- Use `-DskipTests` during active development to iterate faster, but don't commit without running tests
- Debug classpath conflicts with `mvn dependency:tree` when you get cryptic errors
- Use `-T 4` (or higher) for multi-module projects to speed up builds significantly
- Don't overuse `clean` during development, it slows you down by deleting everything and recompiling from scratch

That's it. These commands handle almost everything you'll need in daily Java development with Maven.

Now go build something.
