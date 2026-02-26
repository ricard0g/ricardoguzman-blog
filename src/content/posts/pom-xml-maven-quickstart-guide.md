---
layout: "../../layouts/PostLayout.astro"
slug: "pom-xml-maven-quickstart-guide"
title: "pom.xml: A Maven Quickstart Guide"
pubDateString: "2026, February 26th"
pubDate: 2026-02-26
tags: ["Maven", "Java", "pom.xml", "Build Tools", "Spring Boot"]
author: "Ricardo Guzman"
image: "https://images.pexels.com/photos/3648850/pexels-photo-3648850.jpeg"
description: "If you've ever started a Java project and felt confused by the pom.xml file, this guide is for you. Here's everything you need to understand and use it effectively."
---

If you've ever created a Java project with Maven, you've seen the `pom.xml` file sitting right there at the root.

At first it looks like a wall of XML that you just copy-paste and forget about. I used to do that too.

But once you understand what each piece does, it becomes a powerful tool in your Java workflow.

So let's break it down.

## What is the pom.xml?

> **POM** stands for **Project Object Model**.

It's the core configuration file Maven uses to understand everything about your project, how to build it, what libraries it needs, what plugins to run, and more.

Every Maven project has one.

## The Minimum You Need

Every `pom.xml` has a required base structure:

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.mycompany.app</groupId>
    <artifactId>my-app</artifactId>
    <version>1.0.0</version>
</project>
```

These are called **Maven Coordinates**, think of them as the unique address of your project in the Maven ecosystem.

- **modelVersion**: Always `4.0.0`. Don't touch it.
- **groupId**: Your organization or project group, in reverse domain format (e.g., `com.ricardo.blog`)
- **artifactId**: The actual name of your project. This becomes the name of the JAR/WAR file.
- **version**: The version of your project. Append `-SNAPSHOT` for work-in-progress versions (e.g., `1.0.0-SNAPSHOT`)

There's also **packaging**, which tells Maven what kind of artifact to produce:

```xml
<packaging>war</packaging>
```

Options are `jar` (default), `war` for web apps, or `pom` for parent/aggregator projects.

## Dependencies

This is probably the section you'll interact with the most.

Dependencies are the external libraries your project needs. You define them here and Maven handles downloading them automatically - including their own dependencies (called _transitive dependencies_).

```xml
<dependencies>
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.12</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### Scopes

The `<scope>` tag controls _when_ a dependency is available:

- **compile** (default): Available everywhere. Gets bundled with your project.
- **provided**: Needed to compile, but the runtime environment provides it (e.g., `servlet-api` on a Tomcat server)
- **runtime**: Not needed to compile, but needed to run (e.g., a JDBC driver)
- **test**: Only used during testing. Not included in the final artifact.
- **system**: Like `provided` but you point to a local JAR, avoid this one if you can.

> **Note**: If you add a DB Driver dependency (like a MySQL or PostgreSQL driver) and your service throws errors on startup, check your <scope> tag first. DB drivers are only needed at runtime — not at compile time — so if your scope is set to compile (or omitted entirely), that's likely your culprit. Switch it to runtime and you should be good.
> ```xml
> <dependency>
>     <groupId>com.mysql</groupId>
>     <artifactId>mysql-connector-j</artifactId>
>     <version>8.0.33</version>
>     <scope>runtime</scope>
> </dependency>
> ```

### Optional Dependencies

You can mark a dependency as optional so it doesn't get pulled in when someone else uses your project as a library:

```xml
<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>31.1-jre</version>
    <optional>true</optional>
</dependency>
```

### Exclusions

Sometimes a dependency pulls in something you don't want. You can exclude it:

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-core</artifactId>
    <version>5.3.20</version>
    <exclusions>
        <exclusion>
            <groupId>commons-logging</groupId>
            <artifactId>commons-logging</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

## Properties

Properties are reusable variables you can define once and reference throughout your POM using `${property.name}`. This keeps things DRY and easy to update.

```xml
<properties>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <spring.version>5.3.20</spring.version>
</properties>
```

Now instead of hardcoding `5.3.20` in every Spring dependency, you just write `${spring.version}`. Update one line, done.

## Build Configuration

The `<build>` section is where you configure how Maven actually builds your project.

```xml
<build>
    <finalName>my-application</finalName>
    <defaultGoal>install</defaultGoal>
    <directory>${project.basedir}/target</directory>

    <plugins>
        <!-- Plugin configurations go here -->
    </plugins>
</build>
```

- **finalName**: The name of the output artifact (without extension). Defaults to `artifactId-version`.
- **plugins**: Extend and configure what Maven does during the build.

### Common Plugins

Two plugins you'll run into constantly:

```xml
<plugins>
    <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.11.0</version>
        <configuration>
            <source>17</source>
            <target>17</target>
        </configuration>
    </plugin>

    <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-surefire-plugin</artifactId>
        <version>3.0.0</version>
        <configuration>
            <skipTests>false</skipTests>
        </configuration>
    </plugin>
</plugins>
```

The **compiler plugin** makes sure you're building against the right Java version. The **surefire plugin** handles running your tests.

## Dependency Management

If you're using a **parent POM** to manage multiple projects, `<dependencyManagement>` is your best friend. It lets you define versions in one place so child projects only need to specify `groupId` and `artifactId`:

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

Child projects inherit the version automatically. No more version mismatches across modules.

## Parent POM & Inheritance

Your project can inherit configuration from a parent POM:

```xml
<parent>
    <groupId>com.mycompany</groupId>
    <artifactId>parent-project</artifactId>
    <version>1.0.0</version>
    <relativePath>../parent/pom.xml</relativePath>
</parent>
```

When your `groupId` and `version` match the parent, you can omit them from your own POM.

> This is exactly what Spring Boot uses - `spring-boot-starter-parent` is a parent POM that configures a ton of defaults for you.

## Multi-Module Projects

For larger projects split into multiple modules, you define them in a root POM with `<packaging>pom</packaging>`:

```xml
<packaging>pom</packaging>

<modules>
    <module>core-module</module>
    <module>web-module</module>
    <module>api-module</module>
</modules>
```

Running `mvn install` from the root will build all modules in the right order.

## Repositories

By default, Maven downloads from **Maven Central**. If you need a dependency that lives elsewhere:

```xml
<repositories>
    <repository>
        <id>spring-milestones</id>
        <name>Spring Milestones</name>
        <url>https://repo.spring.io/milestone</url>
    </repository>
</repositories>
```

## Profiles

Profiles let you swap out configuration depending on the environment:

```xml
<profiles>
    <profile>
        <id>development</id>
        <properties>
            <env>dev</env>
        </properties>
    </profile>

    <profile>
        <id>production</id>
        <properties>
            <env>prod</env>
        </properties>
    </profile>
</profiles>
```

Activate a profile with: `mvn install -P production`

## A Real-World Example

Here's a full `pom.xml` that puts it all together - a Spring Boot web app targeting Java 17:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <groupId>com.mycompany</groupId>
    <artifactId>my-web-app</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>war</packaging>

    <name>My Web Application</name>
    <description>Example web application with Spring Boot</description>

    <properties>
        <java.version>17</java.version>
        <spring.boot.version>3.1.0</spring.boot.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <version>${spring.boot.version}</version>
        </dependency>

        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.2</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <finalName>myapp</finalName>

        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.11.0</version>
                <configuration>
                    <source>${java.version}</source>
                    <target>${java.version}</target>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

## Conclusion

That's the 90% of `pom.xml` you'll use in day-to-day Java development.

Once you stop copy-pasting it blindly and actually understand what each section does, Maven stops being intimidating and starts being genuinely useful.

It's doing a lot of heavy lifting for you under the hood, dependency resolution, build lifecycle, plugin execution - all configured through this one file.

Happy building 🚀.
